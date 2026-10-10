/*
 * ============================================================================
 *  CampusConnect - Java backend (JDK only, no Maven / Gradle / Spring needed)
 * ============================================================================
 *  Run:      java Server.java            (from the server/ folder)
 *  Default:  http://localhost:8080
 *
 *  What it does
 *  ------------
 *   1. Serves the React build (../app/dist) - the app itself, and /media files.
 *   2. REST API the React app calls:
 *        GET  /api/colleges          the college dataset (JSON, from data/colleges.json)
 *        POST /api/login             demo college / student sign-in  {email,password}
 *        GET  /api/probe/<cid>       can this server reach that college's site?
 *   3. In-app website proxy - the reason the server exists:
 *        GET  /site/<cid>/<path>     fetches the college's *official* website
 *                                    server-side and re-serves it from our own
 *                                    origin, with links rewritten, so the real
 *                                    site loads INSIDE the app (no X-Frame-Options
 *                                    block, no browser network restriction).
 *
 *  Everything is cached for 10 minutes and served with no-store, exactly like
 *  the original helper server - the browser never keeps a stale build.
 * ============================================================================
 */

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;
import java.util.regex.*;
import javax.net.ssl.*;

public class Server {

    /* ------------------------------------------------------------------ config */

    static final int PORT = Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));
    static final String ROOT = System.getProperty("user.dir");            // server/
    static final Path DIST = Paths.get(ROOT, "..", "app", "dist").normalize();
    static final Path PUBLIC_MEDIA = Paths.get(ROOT, "..", "app", "dist", "media").normalize();
    static final Path DATA = Paths.get(ROOT, "data").normalize();
    static final Path STUDENTS_FILE = DATA.resolve("students.json");
    static final Path EVENTS_FILE   = DATA.resolve("student-events.jsonl");
    static final Map<String, String[]> TOKENS = new ConcurrentHashMap<>();   /* token -> {email, role} */
    static final Object WRITE_LOCK = new Object();
    static final String[] STUDENT_FIELDS = {"name", "email", "mobile", "marks", "stream", "want",
            "degree", "stay", "hostelType", "travel", "town", "consent", "photo"};
    static final String[] EVENT_TYPES = {"register", "login", "profile_view", "save", "unsave",
            "website_click", "apply_click", "update"};
    static final String ERR_AUTH = "{\"ok\":false,\"error\":\"Please sign in again.\"}";
    static final String ERR_ADMIN = "{\"ok\":false,\"error\":\"Admin sign-in required.\"}";

    static final String UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            + "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

    /** the official websites the proxy serves (same list as the dataset) */
    static final Map<String, String> SITES = new LinkedHashMap<>();
    static {
        SITES.put("psg",        "https://www.psgtech.edu");
        SITES.put("psgcas",     "https://www.psgcas.ac.in");
        SITES.put("psgcas-apply","https://applications.psgcas.ac.in");
        SITES.put("psgimsr",    "https://psgimsr.ac.in");
        SITES.put("psgim",      "https://psgim.ac.in");
        SITES.put("psgitech",   "https://www.psgitech.ac.in");
        SITES.put("psgpoly",    "https://www.psgpolytech.ac.in");
        SITES.put("psgnursing", "https://www.psgnursing.ac.in");
        SITES.put("psgpharma",  "https://psgpharma.ac.in");
        SITES.put("psgphysio",  "https://psgphysiotherapy.ac.in");
        SITES.put("psgias",     "https://www.psgias.ac.in");
        SITES.put("psgr",       "https://www.psgrkcw.ac.in");
        SITES.put("gct",        "https://gct.ac.in");
    }

    static final Set<String> SKIP_HEADERS = new HashSet<>(Arrays.asList(
            "x-frame-options", "content-security-policy", "content-security-policy-report-only",
            "content-encoding", "content-length", "transfer-encoding", "connection",
            "strict-transport-security", "permissions-policy", "cross-origin-opener-policy",
            "cross-origin-embedder-policy", "cross-origin-resource-policy"));

    static final long CACHE_TTL = 600;   // seconds

    /* tiny in-memory cache: key -> {stamp, status, ctype, body} */
    static final ConcurrentHashMap<String, Object[]> CACHE = new ConcurrentHashMap<>();
    static final ConcurrentHashMap<String, Boolean> HEALTH = new ConcurrentHashMap<>();

    /* ------------------------------------------------------------------ TLS */

    /**
     * A few colleges still run legacy TLS parameters (small DH keys / older chains)
     * that Java's stricter defaults refuse.  This demo proxy therefore uses a
     * relaxed trust manager *for the proxied college sites only* - HTTPS is still
     * used end-to-end, the certificate is simply not verified.
     * (If you want strict verification, delete RELAXED and use the default context;
     *  rare colleges will then fall back to the "Open in new tab" path in the app.)
     */
    static final TrustManager[] RELAXED = new TrustManager[]{ new X509TrustManager() {
        public void checkClientTrusted(X509Certificate[] c, String a) { }
        public void checkServerTrusted(X509Certificate[] c, String a) { }
        public X509Certificate[] getAcceptedIssuers() { return new X509Certificate[0]; }
    }};

    static SSLSocketFactory sslFactory() {
        try {
            SSLContext ctx = SSLContext.getInstance("TLS");
            ctx.init(null, RELAXED, new java.security.SecureRandom());
            return ctx.getSocketFactory();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    static {
        /* the college sites are ordinary public websites; relax the disabled-algorithm
           list so their older certificates can complete a handshake */
        try {
            java.security.Security.setProperty("jdk.tls.disabledAlgorithms",
                    "SSLv3, RC4, DES, MD5withRSA, DH keySize < 768, EC keySize < 224");
            java.security.Security.setProperty("jdk.certpath.disabledAlgorithms", "MD2, MD5");
        } catch (Exception ignored) { }
    }

    /* ------------------------------------------------------------------ helpers */

    static byte[] readAll(InputStream in) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] buf = new byte[16384];
        int n;
        while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
        return out.toByteArray();
    }

    static String contentTypeFor(String path) {
        String p = path.toLowerCase();
        if (p.endsWith(".html")) return "text/html; charset=utf-8";
        if (p.endsWith(".js"))   return "text/javascript; charset=utf-8";
        if (p.endsWith(".mjs"))  return "text/javascript; charset=utf-8";
        if (p.endsWith(".css"))  return "text/css; charset=utf-8";
        if (p.endsWith(".json")) return "application/json; charset=utf-8";
        if (p.endsWith(".svg"))  return "image/svg+xml";
        if (p.endsWith(".png"))  return "image/png";
        if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
        if (p.endsWith(".webp")) return "image/webp";
        if (p.endsWith(".ico"))  return "image/x-icon";
        if (p.endsWith(".woff2"))return "font/woff2";
        if (p.endsWith(".txt"))  return "text/plain; charset=utf-8";
        return "application/octet-stream";
    }

    static void send(HttpExchange ex, int status, byte[] body, String ctype) {
        try {
            Headers h = ex.getResponseHeaders();
            h.set("Content-Type", ctype);
            h.set("Cache-Control", "no-store, must-revalidate");
            h.set("Pragma", "no-cache");
            ex.sendResponseHeaders(status, body.length == 0 ? -1 : body.length);
            if (body.length > 0) ex.getResponseBody().write(body);
        } catch (IOException ignored) {
        } finally {
            ex.close();
        }
    }

    static void sendText(HttpExchange ex, int status, String text) {
        send(ex, status, text.getBytes(StandardCharsets.UTF_8), "text/plain; charset=utf-8");
    }

    static void sendJson(HttpExchange ex, int status, String json) {
        send(ex, status, json.getBytes(StandardCharsets.UTF_8), "application/json; charset=utf-8");
    }

    /* ------------------------------------------------------------------ cache */

    static Object[] cacheGet(String key) {
        Object[] hit = CACHE.get(key);
        if (hit == null) return null;
        long stamp = (Long) hit[0];
        if (System.currentTimeMillis() / 1000L - stamp > CACHE_TTL) { CACHE.remove(key); return null; }
        return hit;
    }

    static void cachePut(String key, Object[] val) {
        if (CACHE.size() > 400) CACHE.clear();
        CACHE.put(key, val);
    }

    /* ------------------------------------------------------------------ upstream fetch */

    static class Fetched { int status; String ctype; byte[] body; String finalUrl; }

    static Fetched fetch(String url, int timeoutSec) throws IOException {
        URL u = new URL(url);
        HttpURLConnection con = (HttpURLConnection) u.openConnection();
        if (con instanceof HttpsURLConnection) {
            ((HttpsURLConnection) con).setSSLSocketFactory(sslFactory());
            ((HttpsURLConnection) con).setHostnameVerifier((h, s) -> true);
        }
        con.setInstanceFollowRedirects(true);
        con.setConnectTimeout(timeoutSec * 1000);
        con.setReadTimeout(timeoutSec * 1000);
        con.setRequestProperty("User-Agent", UA);
        con.setRequestProperty("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8");
        con.setRequestProperty("Accept-Language", "en-US,en;q=0.9");
        Fetched f = new Fetched();
        f.status = con.getResponseCode();
        f.ctype = Optional.ofNullable(con.getContentType()).orElse("text/html");
        f.finalUrl = con.getURL().toString();
        InputStream in = f.status >= 400 ? con.getErrorStream() : con.getInputStream();
        f.body = in == null ? new byte[0] : readAll(in);
        con.disconnect();
        return f;
    }

    /** can this server actually reach the college site? (cached 10 min) */
    static boolean health(String cid) {
        Boolean cached = HEALTH.get(cid);
        if (cached != null) return cached;
        String base = SITES.get(cid);
        boolean ok = false;
        if (base != null) {
            try {
                ok = fetch(base + "/", 15).status < 400;
            } catch (Exception e) { ok = false; }
        }
        HEALTH.put(cid, ok);
        return ok;
    }

    /* ------------------------------------------------------------------ url rewriting */

    static List<String> hostVariants(String base) {
        try {
            URL u = new URL(base);
            String host = u.getHost();
            String scheme = u.getProtocol();
            String bare = host.startsWith("www.") ? host.substring(4) : host;
            List<String> out = new ArrayList<>();
            out.add(scheme + "://" + host);
            out.add("//" + host);
            out.add(scheme + "://" + bare);
            out.add("//" + bare);
            return out;
        } catch (Exception e) { return Collections.emptyList(); }
    }

    static final Pattern ROOT_ATTR = Pattern.compile(
            "(?i)\\b(href|src|action|poster|data-src|data-bg|content)\\s*=\\s*([\"'])/(?!site/)");
    static final Pattern ROOT_URL  = Pattern.compile("(?i)url\\(\\s*([\"']?)/(?!site/)");
    static final Pattern SRCSET    = Pattern.compile("(?i)srcset\\s*=\\s*([\"'])([^\"']*)\\1");
    static final Pattern BASETAG   = Pattern.compile("(?is)<base\\b[^>]*>");

    /** point the college site's own absolute / root-relative URLs at our proxy path */
    static String rewriteUrls(String text, String cid, String base) {
        String prefix = "/site/" + cid + "/";
        for (String origin : hostVariants(base)) {
            text = text.replace(origin + "/", prefix);
            text = text.replace(origin + "\\/", prefix);
        }
        text = ROOT_ATTR.matcher(text).replaceAll(m -> m.group(1) + "=" + m.group(2) + prefix);
        text = ROOT_URL.matcher(text).replaceAll(m -> "url(" + m.group(1) + prefix);
        text = SRCSET.matcher(text).replaceAll(m ->
                "srcset=" + m.group(1) + m.group(2).replaceAll("(^|,\\s*)/(?!site/)", "$1" + prefix) + m.group(1));
        text = BASETAG.matcher(text).replaceAll("");
        return text;
    }

    static final String BANNER =
        "\n<div id=\"cc-bar\" style=\"position:fixed;left:14px;bottom:14px;z-index:2147483647;" +
        "font:600 12.5px/1.4 Inter,Segoe UI,system-ui,sans-serif\">\n" +
        "  <a href=\"/\" onclick=\"try{parent.postMessage('cc:close-site','*')}catch(e){};return false;\" " +
        "style=\"display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;" +
        "background:#121d38;color:#fff;text-decoration:none;box-shadow:0 12px 28px -12px rgba(13,22,38,.6)\">\n" +
        "    <span style=\"width:20px;height:20px;border-radius:6px;background:linear-gradient(140deg,#f0b64a,#c78f22);" +
        "color:#3a2606;display:grid;place-items:center;font-size:12px\">&#8592;</span>\n" +
        "    Back to CampusConnect\n" +
        "  </a>\n" +
        "  <div style=\"margin-top:6px;padding:5px 11px;border-radius:999px;background:rgba(255,255,255,.92);" +
        "border:1px solid #e5e9f2;color:#42506b;font-weight:500;display:inline-block\">\n" +
        "    Viewing the official site inside CampusConnect\n" +
        "  </div>\n</div>\n";

    static String injectBanner(String html) {
        int idx = html.toLowerCase().lastIndexOf("</body>");
        return idx < 0 ? html + BANNER : html.substring(0, idx) + BANNER + html.substring(idx);
    }

    /* ------------------------------------------------------------------ proxy */

    static void proxy(HttpExchange ex, String cid, String path, String query) throws IOException {
        String base = SITES.get(cid);
        if (base == null) { sendText(ex, 404, "unknown college: " + cid); return; }

        if (path.replace("/", "").equals("__ping")) {
            sendText(ex, 200, health(cid) ? "ok" : "fail");
            return;
        }

        String target = base.replaceAll("/+$", "") + "/" + path.replaceAll("^/+", "");
        if (query != null && !query.isEmpty()) target += "?" + query;
        String key = cid + "|" + path + "|" + (query == null ? "" : query);

        Object[] hit = cacheGet(key);
        if (hit != null) { send(ex, (Integer) hit[1], (byte[]) hit[3], (String) hit[2]); return; }

        Fetched f;
        try {
            f = fetch(target, 25);
        } catch (Exception e) {
            sendText(ex, 502, "The college website could not be reached: " + e.getMessage());
            return;
        }

        String ctype = f.ctype;
        String low = ctype.toLowerCase();
        byte[] body = f.body;
        if (low.contains("text/html")) {
            String text = new String(body, StandardCharsets.UTF_8);
            text = injectBanner(rewriteUrls(text, cid, base));
            body = text.getBytes(StandardCharsets.UTF_8);
        } else if (low.contains("text/css") || low.contains("javascript") || low.contains("json")) {
            String text = new String(body, StandardCharsets.UTF_8);
            body = rewriteUrls(text, cid, base).getBytes(StandardCharsets.UTF_8);
        }
        cachePut(key, new Object[]{ System.currentTimeMillis() / 1000L, f.status, ctype, body });
        send(ex, f.status, body, ctype);
    }

    /* ------------------------------------------------------------------ tiny JSON */

    /** minimal JSON reader - enough for {"email":"...","password":"..."} */
    static Map<String, String> parseFlatJson(String s) {
        Map<String, String> out = new LinkedHashMap<>();
        Matcher m = Pattern.compile("\"([^\"]+)\"\\s*:\\s*(\"((?:\\\\.|[^\"\\\\])*)\"|true|false|null|[-0-9.eE+]+)")
                .matcher(s);
        while (m.find()) {
            String v = m.group(3) != null ? m.group(3).replace("\\\"", "\"").replace("\\\\", "\\")
                                          : m.group(2);
            out.put(m.group(1), v);
        }
        return out;
    }

    /** {"email": {...}} -> email -> flat fields */
    static Map<String, Map<String, String>> parseUsers(String json) {
        Map<String, Map<String, String>> out = new LinkedHashMap<>();
        Matcher m = Pattern.compile("\"([^\"]+)\"\\s*:\\s*\\{([^{}]*)\\}").matcher(json);
        while (m.find()) out.put(m.group(1), parseFlatJson("{" + m.group(2) + "}"));
        return out;
    }

    static String usersJson() throws IOException {
        Path p = DATA.resolve("users.json");
        if (Files.exists(p)) return new String(Files.readAllBytes(p), StandardCharsets.UTF_8);
        return "{}";
    }

    /* ------------------------------------------------------------------ API */

    static void apiLogin(HttpExchange ex) throws IOException {
        Map<String, String> in = readBody(ex);
        String email = Optional.ofNullable(in.get("email")).orElse("").trim().toLowerCase();
        String pw = Optional.ofNullable(in.get("password")).orElse("");
        Map<String, String> rec = readStudents().get(email);
        if (rec != null) {                                   /* student account (hashed password) */
            if (!checkpw(pw, rec.get("password"))) {
                sendJson(ex, 401, "{\"ok\":false,\"error\":\"That password does not match.\"}");
                return;
            }
            String tok = issue(email, "student");
            logEvent(email, "login", "", "");
            sendJson(ex, 200, "{\"ok\":true,\"role\":\"student\",\"token\":\"" + tok
                    + "\",\"email\":\"" + jesc(email) + "\",\"student\":" + studentJson(rec, true) + "}");
            return;
        }
        Map<String, String> u = parseUsers(usersJson()).get(email);        /* admin / college demo users */
        if (u == null || !checkpw(pw, u.get("password"))) {
            sendJson(ex, 401, "{\"ok\":false,\"error\":\"Incorrect email or password. Try the demo credentials below, or tap \\\"Use demo login\\\".\"}");
            return;
        }
        String tok = issue(email, u.getOrDefault("role", "student"));
        StringBuilder sb = new StringBuilder("{\"ok\":true,\"token\":\"" + tok
                + "\",\"email\":\"" + jesc(email) + "\"");
        for (String k : new String[]{"role", "name", "title", "collegeId"}) {
            String v = u.get(k);
            if (v != null) sb.append(",\"").append(k).append("\":\"").append(jesc(v)).append("\"");
        }
        sendJson(ex, 200, sb.append("}").toString());
    }

    static void apiColleges(HttpExchange ex) throws IOException {
        Path p = DATA.resolve("colleges.json");
        if (!Files.exists(p)) { sendJson(ex, 200, "{\"colleges\":[]}"); return; }
        byte[] b = Files.readAllBytes(p);
        send(ex, 200, b, "application/json; charset=utf-8");
    }

    /* ------------------------------------------------------------------ students & admin API */

    static String jesc(String s) {
        if (s == null) return "";
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (c == '"') sb.append("\\\"");
            else if (c == '\\') sb.append("\\\\");
            else if (c == '\n') sb.append("\\n");
            else if (c == '\r') sb.append("\\r");
            else if (c == '\t') sb.append("\\t");
            else if (c < 0x20) sb.append(String.format("\\u%04x", (int) c));
            else sb.append(c);
        }
        return sb.toString();
    }

    static String hex(byte[] b) {
        StringBuilder sb = new StringBuilder();
        for (byte x : b) sb.append(String.format("%02x", x));
        return sb.toString();
    }

    static String sha256hex(String s) {
        try {
            return hex(MessageDigest.getInstance("SHA-256").digest(s.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) { return ""; }
    }

    static String pwhash(String pw) {
        byte[] salt = new byte[8];
        new SecureRandom().nextBytes(salt);
        String saltHex = hex(salt);
        return saltHex + ":" + sha256hex(saltHex + pw);
    }

    static boolean checkpw(String pw, String stored) {
        if (stored == null) return false;
        int i = stored.indexOf(':');
        if (i < 0) return stored.equals(pw);                 /* plain demo credential */
        return sha256hex(stored.substring(0, i) + pw).equals(stored.substring(i + 1));
    }

    static String nowIso() { return Instant.now().toString().split("\\.")[0] + "Z"; }

    static Map<String, String> readBody(HttpExchange ex) throws IOException {
        return parseFlatJson(new String(readAll(ex.getRequestBody()), StandardCharsets.UTF_8));
    }

    static String digits(String s) { return s == null ? "" : s.replaceAll("[^0-9]", ""); }

    static Map<String, Map<String, String>> readStudents() throws IOException {
        if (Files.exists(STUDENTS_FILE)) return parseUsers(new String(Files.readAllBytes(STUDENTS_FILE), StandardCharsets.UTF_8));
        return new LinkedHashMap<>();
    }

    static void writeStudents(Map<String, Map<String, String>> students) throws IOException {
        StringBuilder sb = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<String, Map<String, String>> e : students.entrySet()) {
            if (!first) sb.append(",");
            first = false;
            sb.append("\\"").append(jesc(e.getKey())).append("\\":{");
            boolean f2 = true;
            for (Map.Entry<String, String> kv : e.getValue().entrySet()) {
                if (!f2) sb.append(",");
                f2 = false;
                sb.append("\\"").append(jesc(kv.getKey())).append("\\":\\"").append(jesc(kv.getValue())).append("\\"");
            }
            sb.append("}");
        }
        synchronized (WRITE_LOCK) {
            Files.write(STUDENTS_FILE, sb.append("}").toString().getBytes(StandardCharsets.UTF_8));
        }
    }

    static List<Map<String, String>> readEvents() {
        List<Map<String, String>> out = new ArrayList<>();
        try {
            if (!Files.exists(EVENTS_FILE)) return out;
            for (String line : Files.readAllLines(EVENTS_FILE, StandardCharsets.UTF_8)) {
                line = line.trim();
                if (!line.isEmpty()) out.add(parseFlatJson(line));
            }
        } catch (IOException ignored) { }
        return out;
    }

    static void logEvent(String email, String type, String cid, String label) {
        boolean known = false;
        for (String t : EVENT_TYPES) if (t.equals(type)) known = true;
        if (!known) return;
        String line = "{\"email\":\"" + jesc(email) + "\",\"type\":\"" + jesc(type)
                + "\",\"cid\":\"" + jesc(cid == null ? "" : cid) + "\",\"label\":\""
                + jesc(label == null ? "" : label) + "\",\"at\":\"" + nowIso() + "\"}\n";
        synchronized (WRITE_LOCK) {
            try {
                Files.write(EVENTS_FILE, line.getBytes(StandardCharsets.UTF_8),
                        StandardOpenOption.CREATE, StandardOpenOption.APPEND);
            } catch (IOException ignored) { }
        }
    }

    static String studentJson(Map<String, String> rec, boolean withPhoto) {
        StringBuilder sb = new StringBuilder("{");
        boolean first = true;
        for (String k : STUDENT_FIELDS) {
            if (k.equals("photo") && !withPhoto) continue;
            String v = rec.get(k);
            if (v == null) v = "";
            if (!first) sb.append(",");
            first = false;
            if (k.equals("marks") && v.matches("-?\\d+(\\.\\d+)?")) sb.append("\"marks\":").append(v);
            else sb.append("\"").append(k).append("\":\"").append(jesc(v)).append("\"");
        }
        for (String k : new String[]{"created", "updated"}) {
            String v = rec.get(k);
            if (v == null) continue;
            sb.append(",\"").append(k).append("\":\"").append(jesc(v)).append("\"");
        }
        return sb.append("}").toString();
    }

    static String[] tokenOf(HttpExchange ex) {
        String tok = ex.getRequestHeaders().getFirst("X-CC-Token");
        if (tok == null || tok.isEmpty()) {
            String q = ex.getRequestURI().getRawQuery();
            if (q != null) for (String kv : q.split("&")) {
                if (kv.startsWith("token=")) {
                    try { tok = URLDecoder.decode(kv.substring(6), "UTF-8"); }
                    catch (Exception e) { tok = kv.substring(6); }
                }
            }
        }
        if (tok == null || tok.isEmpty()) return null;
        return TOKENS.get(tok);
    }

    static String issue(String email, String role) {
        byte[] b = new byte[16];
        new SecureRandom().nextBytes(b);
        String tok = hex(b);
        TOKENS.put(tok, new String[]{email, role});
        return tok;
    }

    static String collegeName(String cid) {
        try {
            String json = new String(Files.readAllBytes(DATA.resolve("colleges.json")), StandardCharsets.UTF_8);
            Matcher m = Pattern.compile("\"id\"\\s*:\\s*\"" + Pattern.quote(cid)
                    + "\"[^{}]*?\"name\"\\s*:\\s*\"([^\"]+)\"").matcher(json);
            if (m.find()) return m.group(1);
        } catch (IOException ignored) { }
        return cid;
    }

    /* {views, saves, clicks, applies, colsViewed, last, topJson} */
    static Object[] activityFor(String email) {
        int views = 0, saves = 0, clicks = 0;
        String last = "";
        Map<String, int[]> per = new LinkedHashMap<>();
        for (Map<String, String> e : readEvents()) {
            if (!email.equals(e.get("email"))) continue;
            String t = e.getOrDefault("type", "");
            String cid = e.getOrDefault("cid", "");
            String at = e.getOrDefault("at", "");
            if (at.compareTo(last) > 0) last = at;
            if (t.equals("profile_view")) views++;
            else if (t.equals("save")) saves++;
            else if (t.equals("website_click")) clicks++;
            if (!cid.isEmpty()) {
                int[] slot = per.get(cid);
                if (slot == null) { slot = new int[2]; per.put(cid, slot); }
                if (t.equals("profile_view")) slot[0]++;
                else if (t.equals("save")) slot[1]++;
            }
        }
        List<Map.Entry<String, int[]>> top = new ArrayList<>(per.entrySet());
        top.sort((x, y) -> y.getValue()[0] != x.getValue()[0]
                ? y.getValue()[0] - x.getValue()[0] : y.getValue()[1] - x.getValue()[1]);
        StringBuilder tj = new StringBuilder("[");
        int n = 0;
        for (Map.Entry<String, int[]> e : top) {
            if (n == 3) break;
            if (n > 0) tj.append(",");
            n++;
            tj.append("{\"id\":\"").append(jesc(e.getKey())).append("\",\"name\":\"")
              .append(jesc(collegeName(e.getKey()))).append("\",\"views\":").append(e.getValue()[0]).append("}");
        }
        return new Object[]{views, saves, clicks, 0, per.size(), last, tj.append("]").toString()};
    }

    static void apiMe(HttpExchange ex) throws IOException {
        String[] auth = tokenOf(ex);
        if (auth == null || !"student".equals(auth[1])) { sendJson(ex, 401, ERR_AUTH); return; }
        Map<String, String> rec = readStudents().get(auth[0]);
        if (rec == null) { sendJson(ex, 404, "{\"ok\":false,\"error\":\"No profile yet.\"}"); return; }
        sendJson(ex, 200, "{\"ok\":true,\"student\":" + studentJson(rec, true) + "}");
    }

    static void apiRegister(HttpExchange ex) throws IOException {
        Map<String, String> in = readBody(ex);
        String email = Optional.ofNullable(in.get("email")).orElse("").trim().toLowerCase();
        String pw = Optional.ofNullable(in.get("password")).orElse("");
        if (!email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) { sendJson(ex, 400, "{\"ok\":false,\"error\":\"Please enter a valid email id.\"}"); return; }
        if (pw.length() < 6) { sendJson(ex, 400, "{\"ok\":false,\"error\":\"Password should be at least 6 characters.\"}"); return; }
        String mobile = digits(in.get("mobile"));
        if (mobile.length() != 10) { sendJson(ex, 400, "{\"ok\":false,\"error\":\"Mobile number should be 10 digits.\"}"); return; }
        double marks;
        try {
            marks = Double.parseDouble(Optional.ofNullable(in.get("marks")).orElse(""));
            if (marks < 30 || marks > 100) throw new NumberFormatException();
        } catch (NumberFormatException e) {
            sendJson(ex, 400, "{\"ok\":false,\"error\":\"Class 12 percentage should be between 30 and 100.\"}"); return;
        }
        synchronized (WRITE_LOCK) {
            Map<String, Map<String, String>> students = readStudents();
            if (students.containsKey(email)) { sendJson(ex, 400, "{\"ok\":false,\"error\":\"An account with this email already exists.\"}"); return; }
            Map<String, String> rec = new LinkedHashMap<>();
            rec.put("email", email);
            rec.put("password", pwhash(pw));
            String name = Optional.ofNullable(in.get("name")).orElse("").trim();
            rec.put("name", name.isEmpty() ? email.split("@")[0] : name);
            rec.put("mobile", mobile);
            rec.put("marks", marks == Math.floor(marks) ? String.valueOf((long) marks) : String.valueOf(marks));
            for (String f : new String[]{"stream", "want", "degree", "stay", "hostelType", "travel", "town"})
                rec.put(f, Optional.ofNullable(in.get(f)).orElse("").trim());
            String c = Optional.ofNullable(in.get("consent")).orElse("");
            rec.put("consent", c.equals("true") || c.equals("1") || c.equals("yes") ? "true" : "false");
            rec.put("created", nowIso());
            rec.put("updated", nowIso());
            students.put(email, rec);
            writeStudents(students);
            String tok = issue(email, "student");
            logEvent(email, "register", "", "");
            sendJson(ex, 200, "{\"ok\":true,\"token\":\"" + tok + "\",\"student\":" + studentJson(rec, true) + "}");
        }
    }

    static void apiUpdate(HttpExchange ex) throws IOException {
        String[] auth = tokenOf(ex);
        if (auth == null || !"student".equals(auth[1])) { sendJson(ex, 401, ERR_AUTH); return; }
        Map<String, String> in = readBody(ex);
        String email = auth[0];
        String error = null;
        Map<String, String> rec;
        synchronized (WRITE_LOCK) {
            Map<String, Map<String, String>> students = readStudents();
            rec = students.get(email);
            if (rec == null) {
                rec = new LinkedHashMap<>();
                rec.put("email", email);
                rec.put("name", email.split("@")[0]);
                rec.put("created", nowIso());
            }
            if (in.containsKey("mobile")) {
                String mobile = digits(in.get("mobile"));
                if (mobile.length() != 10) error = "Mobile number should be 10 digits.";
                else rec.put("mobile", mobile);
            }
            if (error == null && in.containsKey("marks")) {
                try {
                    double m = Double.parseDouble(Optional.ofNullable(in.get("marks")).orElse(""));
                    if (m < 30 || m > 100) error = "Class 12 percentage should be between 30 and 100.";
                    else rec.put("marks", m == Math.floor(m) ? String.valueOf((long) m) : String.valueOf(m));
                } catch (NumberFormatException e) { error = "Class 12 percentage should be a number."; }
            }
            if (error == null) {
                for (String f : new String[]{"name", "stream", "want", "degree", "stay",
                                             "hostelType", "travel", "town", "photo"})
                    if (in.containsKey(f)) rec.put(f, Optional.ofNullable(in.get(f)).orElse("").trim());
                if (in.containsKey("consent")) {
                    String c = in.get("consent");
                    rec.put("consent", c.equals("true") || c.equals("1") || c.equals("yes") ? "true" : "false");
                }
                rec.put("updated", nowIso());
                students.put(email, rec);
                writeStudents(students);
            }
        }
        if (error != null) { sendJson(ex, 400, "{\"ok\":false,\"error\":\"" + jesc(error) + "\"}"); return; }
        logEvent(email, "update", "", "");
        sendJson(ex, 200, "{\"ok\":true,\"student\":" + studentJson(rec, true) + "}");
    }

    static void apiTrack(HttpExchange ex) throws IOException {
        String[] auth = tokenOf(ex);
        if (auth == null) { sendJson(ex, 401, ERR_AUTH); return; }
        Map<String, String> in = readBody(ex);
        logEvent(auth[0], in.getOrDefault("type", ""), in.getOrDefault("cid", ""), in.getOrDefault("label", ""));
        sendJson(ex, 200, "{\"ok\":true}");
    }

    static void apiAdminSummary(HttpExchange ex) throws IOException {
        String[] auth = tokenOf(ex);
        if (auth == null || !"admin".equals(auth[1])) { sendJson(ex, 401, ERR_ADMIN); return; }
        Map<String, Map<String, String>> students = readStudents();
        List<Map<String, String>> events = readEvents();
        Map<String, int[]> cagg = new LinkedHashMap<>();
        Map<String, Set<String>> cwho = new LinkedHashMap<>();
        for (Map<String, String> e : events) {
            String cid = e.getOrDefault("cid", "");
            if (cid.isEmpty()) continue;
            int[] slot = cagg.get(cid);
            if (slot == null) { slot = new int[3]; cagg.put(cid, slot); cwho.put(cid, new HashSet<>()); }
            String t = e.getOrDefault("type", "");
            if (t.equals("profile_view")) slot[0]++;
            else if (t.equals("save")) slot[1]++;
            else slot[2]++;
            String em = e.getOrDefault("email", "");
            if (!em.isEmpty()) cwho.get(cid).add(em);
        }
        StringBuilder rows = new StringBuilder();
        boolean first = true;
        int tViews = 0, tSaves = 0, tClicks = 0;
        List<String[]> rowList = new ArrayList<>();
        for (Map.Entry<String, Map<String, String>> e : students.entrySet()) {
            Object[] a = activityFor(e.getKey());
            int views = (Integer) a[0], saves = (Integer) a[1], clicks = (Integer) a[2];
            tViews += views; tSaves += saves; tClicks += clicks;
            String base = studentJson(e.getValue(), false);
            String row = base.substring(0, base.length() - 1)
                    + ",\"profileViews\":" + views
                    + ",\"saves\":" + saves
                    + ",\"websiteClicks\":" + clicks
                    + ",\"collegesViewed\":" + a[4]
                    + ",\"lastActivity\":\"" + jesc((String) a[5]) + "\""
                    + ",\"topColleges\":" + a[6] + "}";
            rowList.add(new String[]{(String) a[5], row});
        }
        rowList.sort((x, y) -> y[0].compareTo(x[0]));
        for (String[] r : rowList) { if (!first) rows.append(","); first = false; rows.append(r[1]); }
        List<Map.Entry<String, int[]>> cl = new ArrayList<>(cagg.entrySet());
        cl.sort((x, y) -> cwho.get(y.getKey()).size() != cwho.get(x.getKey()).size()
                ? cwho.get(y.getKey()).size() - cwho.get(x.getKey()).size()
                : y.getValue()[0] - x.getValue()[0]);
        StringBuilder crows = new StringBuilder();
        boolean cf = true;
        int withInterest = 0;
        for (Map.Entry<String, int[]> e : cl) {
            if (!cf) crows.append(",");
            cf = false;
            int who = cwho.get(e.getKey()).size();
            if (who > 0) withInterest++;
            crows.append("{\"id\":\"").append(jesc(e.getKey())).append("\",\"name\":\"")
                 .append(jesc(collegeName(e.getKey()))).append("\",\"views\":").append(e.getValue()[0])
                 .append(",\"saves\":").append(e.getValue()[1])
                 .append(",\"clicks\":").append(e.getValue()[2])
                 .append(",\"students\":").append(who).append("}");
        }
        sendJson(ex, 200, "{\"ok\":true,\"totals\":{\"students\":" + students.size()
                + ",\"events\":" + events.size()
                + ",\"profileViews\":" + tViews
                + ",\"saves\":" + tSaves
                + ",\"websiteClicks\":" + tClicks
                + ",\"collegesWithInterest\":" + withInterest + "}"
                + ",\"students\":[" + rows + "],\"colleges\":[" + crows + "]}");
    }

    static String csvCell(String v) {
        v = v == null ? "" : v;
        return v.matches("(?s).*[\",\\n].*") ? "\"" + v.replace("\"", "\"\"") + "\"" : v;
    }

    static void sendCsv(HttpExchange ex, String text, String filename) {
        byte[] b = text.getBytes(StandardCharsets.UTF_8);
        try {
            ex.getResponseHeaders().set("Content-Type", "text/csv; charset=utf-8");
            ex.getResponseHeaders().set("Content-Disposition", "attachment; filename=\"" + filename + "\"");
            ex.getResponseHeaders().set("Cache-Control", "no-store, must-revalidate");
            ex.sendResponseHeaders(200, b.length);
            ex.getResponseBody().write(b);
        } catch (IOException ignored) { } finally { ex.close(); }
    }

    static void apiStudentsCsv(HttpExchange ex) throws IOException {
        String[] auth = tokenOf(ex);
        if (auth == null || !"admin".equals(auth[1])) { sendJson(ex, 401, ERR_ADMIN); return; }
        String[] cols = {"email", "name", "mobile", "marks", "stream", "want", "degree",
                         "stay", "hostelType", "travel", "town", "consent", "created", "updated"};
        StringBuilder sb = new StringBuilder(String.join(",", cols)).append("\n");
        for (Map<String, String> r : readStudents().values()) {
            List<String> cells = new ArrayList<>();
            for (String c : cols) cells.add(csvCell(r.get(c)));
            sb.append(String.join(",", cells)).append("\n");
        }
        sendCsv(ex, sb.toString(), "students.csv");
    }

    static void apiLeadsCsv(HttpExchange ex) throws IOException {
        String[] auth = tokenOf(ex);
        if (auth == null || !"admin".equals(auth[1])) { sendJson(ex, 401, ERR_ADMIN); return; }
        String cid = "";
        String q = ex.getRequestURI().getRawQuery();
        if (q != null) for (String kv : q.split("&")) if (kv.startsWith("cid=")) cid = kv.substring(4);
        Map<String, String> names = new HashMap<>();
        for (Map.Entry<String, Map<String, String>> e : readStudents().entrySet())
            names.put(e.getKey(), e.getValue().getOrDefault("name", ""));
        StringBuilder sb = new StringBuilder("at,email,name,type,college,label\n");
        for (Map<String, String> e : readEvents()) {
            String t = e.getOrDefault("type", "");
            String ecid = e.getOrDefault("cid", "");
            if (!cid.isEmpty() && !cid.equals(ecid)) continue;
            if (!(t.equals("profile_view") || t.equals("save") || t.equals("website_click") || t.equals("apply_click"))) continue;
            sb.append(csvCell(e.getOrDefault("at", ""))).append(",")
              .append(csvCell(e.getOrDefault("email", ""))).append(",")
              .append(csvCell(names.getOrDefault(e.getOrDefault("email", ""), ""))).append(",")
              .append(csvCell(t)).append(",")
              .append(csvCell(collegeName(ecid))).append(",")
              .append(csvCell(e.getOrDefault("label", ""))).append("\n");
        }
        sendCsv(ex, sb.toString(), "leads.csv");
    }

    static void seedDemoStudent() {
        try {
            if (Files.exists(STUDENTS_FILE)) return;
            Map<String, Map<String, String>> students = new LinkedHashMap<>();
            Map<String, String> rec = new LinkedHashMap<>();
            rec.put("email", "student@demo.edu");
            rec.put("name", "Aarav S.");
            rec.put("mobile", "9876543210");
            rec.put("marks", "98");
            rec.put("stream", "Science \u2013 Maths");
            rec.put("want", "Engineering");
            rec.put("degree", "B.E. Electronics & Communication");
            rec.put("stay", "Hostel needed");
            rec.put("hostelType", "Boys hostel");
            rec.put("travel", "College bus");
            rec.put("town", "Coimbatore");
            rec.put("consent", "true");
            rec.put("password", pwhash("student123"));
            rec.put("created", nowIso());
            rec.put("updated", nowIso());
            students.put(rec.get("email"), rec);
            writeStudents(students);
        } catch (IOException ignored) { }
    }

    /* ------------------------------------------------------------------ static */

    static void staticFile(HttpExchange ex, String path) throws IOException {
        String rel = path.equals("/") || path.isEmpty() ? "index.html" : path.substring(1);
        Path file = DIST.resolve(rel).normalize();
        if (!file.startsWith(DIST) || !Files.isRegularFile(file)) {
            /* SPA fallback: unknown path -> index.html (the React app routes itself) */
            file = DIST.resolve("index.html");
            if (!Files.isRegularFile(file)) {
                sendText(ex, 503, "React build not found.  Run:  cd app && npm install && npm run build");
                return;
            }
        }
        byte[] body = Files.readAllBytes(file);
        send(ex, 200, body, contentTypeFor(file.getFileName().toString()));
    }

    /* ------------------------------------------------------------------ main */

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", PORT), 0);
        ExecutorService pool = Executors.newFixedThreadPool(16);
        server.setExecutor(pool);

        server.createContext("/", ex -> {
            String path = ex.getRequestURI().getPath();
            String query = ex.getRequestURI().getRawQuery();
            final boolean isPost = ex.getRequestMethod().equalsIgnoreCase("POST");
            try {
                if (path.startsWith("/site/")) {
                    String rest = path.substring("/site/".length());
                    int slash = rest.indexOf('/');
                    String cid = slash < 0 ? rest : rest.substring(0, slash);
                    String sub = slash < 0 ? "" : rest.substring(slash + 1);
                    proxy(ex, cid, sub, query);
                    return;
                }
                if (path.equals("/api/colleges")) { apiColleges(ex); return; }
                if (path.equals("/api/login") && ex.getRequestMethod().equalsIgnoreCase("POST")) { apiLogin(ex); return; }
                if (path.equals("/api/students/register") && isPost) { apiRegister(ex); return; }
                if (path.equals("/api/students/update") && isPost) { apiUpdate(ex); return; }
                if (path.equals("/api/track") && isPost) { apiTrack(ex); return; }
                if (path.equals("/api/students/me")) { apiMe(ex); return; }
                if (path.equals("/api/admin/summary")) { apiAdminSummary(ex); return; }
                if (path.equals("/api/admin/students.csv")) { apiStudentsCsv(ex); return; }
                if (path.equals("/api/admin/leads.csv")) { apiLeadsCsv(ex); return; }
                if (path.startsWith("/api/probe/")) {
                    String cid = path.substring("/api/probe/".length());
                    sendJson(ex, 200, "{\"cid\":\"" + cid + "\",\"ok\":" + health(cid) + "}");
                    return;
                }
                staticFile(ex, path);
            } catch (Exception e) {
                sendText(ex, 500, "server error: " + e);
            }
        });

        seedDemoStudent();
        server.start();
        System.out.println("CampusConnect (Java) on http://0.0.0.0:" + PORT);
        System.out.println("  app    :  /                    (React build from " + DIST + ")");
        System.out.println("  api    :  /api/colleges  /api/login  /api/probe/<cid>");
        System.out.println("  proxy  :  /site/<college-id>/  e.g. /site/psgcas/");
    }
}
