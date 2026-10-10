#!/usr/bin/env python3
"""
CampusConnect server
====================
1. Serves the app itself (index.html and friends) from this folder.
2. Runs an in-app website proxy:  /site/<college-id>/<path>
   The proxy fetches the college's *official* website server-side and re-serves it
   from our own origin, so the app can show the real site **inside** itself:
     - no X-Frame-Options block (the page comes from our origin, not theirs)
     - no network restriction (this server has internet, the preview pane may not)
   Links, stylesheets, scripts and images are rewritten to stay inside the proxy.

Run:  python3 server.py         (binds 0.0.0.0:8000)
"""

import http.server
from urllib.parse import urlsplit
import os
import re
import socketserver
import ssl
import threading
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(os.environ.get("PORT", "8000"))

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")
SKIP_HEADERS = {"x-frame-options", "content-security-policy", "content-security-policy-report-only",
                "content-encoding", "content-length", "transfer-encoding", "connection",
                "strict-transport-security", "permissions-policy", "cross-origin-opener-policy",
                "cross-origin-embedder-policy", "cross-origin-resource-policy"}

SITES = {
    "psg":        "https://www.psgtech.edu",
    "psgcas":     "https://www.psgcas.ac.in",
    "psgcas-apply": "https://applications.psgcas.ac.in",
    "psgimsr":    "https://psgimsr.ac.in",
    "psgim":      "https://psgim.ac.in",
    "psgitech":   "https://www.psgitech.ac.in",
    "psgpoly":    "https://www.psgpolytech.ac.in",
    "psgnursing": "https://www.psgnursing.ac.in",
    "psgpharma":  "https://psgpharma.ac.in",
    "psgphysio":  "https://psgphysiotherapy.ac.in",
    "psgias":     "https://www.psgias.ac.in",
    "psgr":       "https://www.psgrkcw.ac.in",
    "gct":        "https://gct.ac.in",
}

CACHE = {}
CACHE_TTL = 600   # normal TTL
HEALTH_TTL = 600  # how long a site's reachability answer is remembered
LOCK = threading.Lock()


def ssl_context():
    """Verify certificates, but accept legacy DH parameters — a few colleges
    (e.g. psgtech.edu) still run small DH keys that modern TLS rejects outright."""
    ctx = ssl.create_default_context()
    try:
        ctx.set_ciphers("DEFAULT@SECLEVEL=1")
    except ssl.SSLError:
        pass
    return ctx


OPENER = urllib.request.build_opener(urllib.request.HTTPSHandler(context=ssl_context()))


def cache_get(key):
    with LOCK:
        hit = CACHE.get(key)
    if not hit:
        return None
    stamp, payload = hit
    if time.time() - stamp > CACHE_TTL:
        with LOCK:
            CACHE.pop(key, None)
        return None
    return payload


def health(cid):
    """can this server actually reach the college site? cached for 10 minutes"""
    key = "health|" + cid
    hit = cache_get(key)
    if hit is not None:
        return hit == b"ok"
    base = SITES.get(cid)
    ok = False
    if base:
        try:
            req = urllib.request.Request(base + "/", headers={
                "User-Agent": UA, "Accept": "text/html,*/*", "Accept-Encoding": "identity"})
            with OPENER.open(req, timeout=15) as r:
                ok = r.getcode() < 400
        except Exception:
            ok = False
    cache_put(key, b"ok" if ok else b"fail")
    return ok


def cache_put(key, payload):
    with LOCK:
        if len(CACHE) > 400:
            CACHE.clear()
        CACHE[key] = (time.time(), payload)


def host_variants(url):
    """all the spellings a site may use for itself in its own HTML"""
    p = urllib.parse.urlsplit(url)
    host = p.netloc
    bare = host[4:] if host.startswith("www.") else host
    return [p.scheme + "://" + host, "//" + host, p.scheme + "://" + bare, "//" + bare]


def rewrite_urls(text, cid, base):
    """point the site's own absolute / root-relative URLs at our proxy path"""
    prefix = "/site/%s/" % cid
    for origin in host_variants(base):
        text = text.replace(origin + "/", prefix)
        text = text.replace(origin + "\\/", prefix)          # inside JS strings
    # root-relative links: href="/x"  src='/y'  action="/z"  url(/w)
    text = re.sub(r'(?i)\b(href|src|action|poster|data-src|data-bg|content)\s*=\s*(["\'])/(?!site/)',
                  lambda m: "%s=%s%s" % (m.group(1), m.group(2), prefix), text)
    text = re.sub(r'(?i)url\(\s*(["\']?)/(?!site/)', lambda m: "url(%s%s" % (m.group(1), prefix), text)
    text = re.sub(r'(?i)srcset\s*=\s*(["\'])([^"\']*)\1',
                  lambda m: 'srcset=%s%s%s' % (m.group(1), re.sub(r'(^|,\s*)/(?!site/)', lambda k: k.group(1) + prefix, m.group(2)), m.group(1)),
                  text)
    return text


BANNER = """
<div id="cc-bar" style="position:fixed;left:14px;bottom:14px;z-index:2147483647;font:600 12.5px/1.4 Inter,Segoe UI,system-ui,sans-serif">
  <a href="/" onclick="try{parent.postMessage('cc:close-site','*')}catch(e){};return false;" style="display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;
     background:#121d38;color:#fff;text-decoration:none;box-shadow:0 12px 28px -12px rgba(13,22,38,.6)">
    <span style="width:20px;height:20px;border-radius:6px;background:linear-gradient(140deg,#f0b64a,#c78f22);
      color:#3a2606;display:grid;place-items:center;font-size:12px">&#8592;</span>
    Back to CampusConnect
  </a>
  <div style="margin-top:6px;padding:5px 11px;border-radius:999px;background:rgba(255,255,255,.92);
     border:1px solid #e5e9f2;color:#42506b;font-weight:500;display:inline-block">
    Viewing the official site inside CampusConnect
  </div>
</div>
"""


def inject_banner(html):
    if "</body>" in html.lower():
        idx = html.lower().rfind("</body>")
        return html[:idx] + BANNER + html[idx:]
    return html + BANNER


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def log_message(self, fmt, *args):
        pass

    def end_headers(self):
        if not getattr(self, "_cc_cache_set", False):
            self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    # ------------------------------------------------------------------ helpers
    def send_payload(self, status, body, ctype, extra=None):
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        _p = urlsplit(self.path).path if getattr(self, "path", "") else ""
        if "text/html" in ctype:
            self.send_header("Cache-Control", "no-store, max-age=0, must-revalidate")
        elif "/assets/" in _p:
            self.send_header("Cache-Control", "public, max-age=31536000, immutable")
        for k, v in (extra or {}).items():
            self.send_header(k, v)
        self.end_headers()
        try:
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError):
            pass

    # ------------------------------------------------------------------ proxy
    def proxy(self, cid, path, query):
        base = SITES.get(cid)
        if not base:
            self.send_payload(404, b"unknown college", "text/plain; charset=utf-8")
            return
        if path.strip("/") == "__ping":
            ok = health(cid)
            self.send_payload(200, b"ok" if ok else b"fail", "text/plain; charset=utf-8")
            return

        target = base.rstrip("/") + "/" + path.lstrip("/")
        if query:
            target += "?" + query
        key = cid + "|" + path + "|" + query

        hit = cache_get(key)
        if hit:
            status, ctype, body = hit
            self.send_payload(status, body, ctype)
            return

        req = urllib.request.Request(target, headers={
            "User-Agent": UA,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "identity",
        })
        try:
            resp = OPENER.open(req, timeout=25)
            status = resp.getcode()
            raw = resp.read()
            ctype = resp.headers.get("Content-Type", "text/html")
            final_url = resp.geturl()
        except urllib.error.HTTPError as e:
            status = e.code
            raw = e.read() or b""
            ctype = e.headers.get("Content-Type", "text/plain")
            final_url = target
        except Exception as e:
            self.send_payload(502, ("The college website could not be reached: %s" % e).encode(),
                              "text/plain; charset=utf-8")
            return

        text = raw.decode("utf-8", errors="replace")
        low = ctype.lower()
        if "text/html" in low:
            text = rewrite_urls(text, cid, base)
            text = re.sub(r'(?is)<base\b[^>]*>', '', text)          # drop their <base>
            text = inject_banner(text)
        elif "text/css" in low or "javascript" in low or "json" in low:
            text = rewrite_urls(text, cid, base)
        body = text.encode("utf-8", errors="replace")

        cache_put(key, (status, ctype, body))
        self.send_payload(status, body, ctype)

    # ------------------------------------------------------------------ routing
    def do_GET(self):
        parsed = urllib.parse.urlsplit(self.path)
        parts = parsed.path.split("/")
        if len(parts) >= 3 and parts[1] == "site":
            self.proxy(parts[2], "/".join(parts[3:]), parsed.query)
            return
        if parsed.path in ("/", ""):
            self.path = "/index.html"
        # self-heal stale tabs: hashed bundle files are replaced on every build,
        # so an old cached index.html would 404 its script/css and show a blank
        # page - serve the CURRENT bundle instead of missing hashed assets.
        if parsed.path.startswith("/assets/index-"):
            _dir = getattr(self, "directory", None) or os.getcwd()
            _full = os.path.join(_dir, parsed.path.lstrip("/"))
            if not os.path.isfile(_full):
                import glob as _glob
                _ext = ".css" if parsed.path.endswith(".css") else ".js"
                _cur = _glob.glob(os.path.join(_dir, "assets", "index-*" + _ext))
                if _cur:
                    self.path = "/" + os.path.relpath(_cur[0], _dir).replace(os.sep, "/")
        super().do_GET()

    def do_HEAD(self):
        parsed = urllib.parse.urlsplit(self.path)
        parts = parsed.path.split("/")
        if len(parts) >= 3 and parts[1] == "site":
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            return
        super().do_HEAD()


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    with Server(("0.0.0.0", PORT), Handler) as httpd:
        print("CampusConnect running on http://0.0.0.0:%d" % PORT)
        print("  app:   /")
        print("  proxy: /site/<college-id>/   e.g. /site/psgcas/")
        httpd.serve_forever()
