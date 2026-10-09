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
        String body = new String(readAll(ex.getRequestBody()), StandardCharsets.UTF_8);
        Map<String, String> in = parseFlatJson(body);
        String email = Optional.ofNullable(in.get("email")).orElse("").trim().toLowerCase();
        String pw = Optional.ofNullable(in.get("password")).orElse("");
        Map<String, Map<String, String>> users = parseUsers(usersJson());
        Map<String, String> u = users.get(email);
        if (u == null || !pw.equals(u.get("password"))) {
            sendJson(ex, 401, "{\"ok\":false,\"error\":\"Incorrect email or password. Try the demo credentials below, or tap \\\"Use demo login\\\".\"}");
            return;
        }
        StringBuilder sb = new StringBuilder("{\"ok\":true");
        for (String k : new String[]{"role", "name", "title", "collegeId"}) {
            if (u.get(k) != null) sb.append(",\"").append(k).append("\":\"").append(u.get(k)).append("\"");
        }
        sb.append("}");
        sendJson(ex, 200, sb.toString());
    }

    static void apiColleges(HttpExchange ex) throws IOException {
        Path p = DATA.resolve("colleges.json");
        if (!Files.exists(p)) { sendJson(ex, 200, "{\"colleges\":[]}"); return; }
        byte[] b = Files.readAllBytes(p);
        send(ex, 200, b, "application/json; charset=utf-8");
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

        server.start();
        System.out.println("CampusConnect (Java) on http://0.0.0.0:" + PORT);
        System.out.println("  app    :  /                    (React build from " + DIST + ")");
        System.out.println("  api    :  /api/colleges  /api/login  /api/probe/<cid>");
        System.out.println("  proxy  :  /site/<college-id>/  e.g. /site/psgcas/");
    }
}
