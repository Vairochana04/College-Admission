/* In-app official-website viewer.
   The college site is fetched by the Java backend (/site/<cid>/...) and framed here,
   so the real site opens INSIDE the app. If the framing watchdog trips, the same
   Java proxy still serves the page — we then show the QR / new-tab handoff. */
import { useEffect, useRef, useState } from 'react';
import { qrSVG, pathFromUrl, esc, collegeById, portalProxyId } from '../core.js';

export default function SiteViewer({ open, url, cid, label, onClose }) {
  const [mode, setMode] = useState('loading');   // loading | framed | handoff
  const timer = useRef(null);
  const frame = useRef(null);

  const target = url || '';
  const proxyCid = cid || 'psgcas';
  const src = proxyCid === 'maps' ? '' : '/site/' + proxyCid + '/' + pathFromUrl(target);

  useEffect(() => {
    if (!open) return;
    setMode('loading');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMode((m) => (m === 'loading' ? 'handoff' : m)), 12000);
    const onMsg = (e) => {
      if (e.data === 'cc:close-site') onClose();
    };
    window.addEventListener('message', onMsg);
    return () => {
      window.removeEventListener('message', onMsg);
      clearTimeout(timer.current);
    };
  }, [open, target, proxyCid, onClose]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="siteviewer open" role="dialog" aria-modal="true" aria-label="College official website">
      <div className="siteviewer__back" data-close="1" onClick={onClose}></div>
      <div className="siteviewer__panel">
        <div className="siteviewer__head">
          <span className="siteviewer__ball" aria-hidden="true"></span>
          <span className="siteviewer__meta">
            <b>{label || 'Official website'}</b>
            <em>{target.replace(/^https?:\/\//, '')}</em>
          </span>
          <span className="siteviewer__acts">
            <a className="btn btn--ghost btn--sm" href={target} target="_blank" rel="noopener noreferrer">New tab ↗</a>
            <button className="btn btn--ghost btn--sm" onClick={() => navigator.clipboard?.writeText(target)}>Copy link</button>
            <button className="btn btn--primary btn--sm" onClick={onClose}>Close</button>
          </span>
        </div>

        <div className="siteviewer__body">
          <div className="siteviewer__bar">
            {mode === 'loading' && <><span className="spin"></span><span>Loading the college website inside the app…</span></>}
            {mode === 'framed' && <><span>✓</span><span>You are reading the college's official site inside CampusConnect.</span></>}
            {mode === 'handoff' && <><span>✓</span><span>If the area below shows a “content is blocked” message, use the QR code or <b>Open in new tab</b>.</span></>}
          </div>

          <div className="siteviewer__stack">
            <iframe
              ref={frame}
              id="svFrame"
              title="College official website"
              referrerPolicy="no-referrer"
              hidden={mode === 'handoff'}
              src={mode === 'handoff' ? undefined : src}
              onLoad={() => setMode((m) => (m === 'loading' ? 'framed' : m))}
            ></iframe>

            {mode !== 'handoff' && (
              <div className="handoff" hidden={mode !== 'loading'}>
                <div className="handoff__grid">
                  <div className="handoff__qr" dangerouslySetInnerHTML={{ __html: qrSVG(target, 150) }} />
                  <div className="handoff__steps">
                    <h4>Scan to open on your phone</h4>
                    <p>Point your camera at the QR code — it opens {esc(target.replace(/^https?:\/\//, ''))} directly.</p>
                  </div>
                </div>
              </div>
            )}

            {mode === 'handoff' && (
              <div className="handoff">
                <div className="handoff__grid">
                  <div className="handoff__qr" dangerouslySetInnerHTML={{ __html: qrSVG(target, 150) }} />
                  <div className="handoff__steps">
                    <h4>The quickest ways to the real site</h4>
                    <ol>
                      <li>Scan the QR code with your phone — it opens the site directly.</li>
                      <li>Or tap <b>New tab</b> above and the official site opens in a fresh tab.</li>
                    </ol>
                    <div className="site-btn" style={{ marginTop: 20, justifyContent: 'center' }}>
                      <a className="btn btn--gold" href={target} target="_blank" rel="noopener noreferrer">Open in new tab ↗</a>
                      <button className="btn btn--ghost" onClick={() => navigator.clipboard?.writeText(target)}>Copy link</button>
                      <button className="btn btn--ghost" onClick={() => setMode('loading')}>Try showing it in the app</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
