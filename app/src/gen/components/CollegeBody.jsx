/* The college profile — the same seven sections the single-file build published,
   in the order the student asked for: profile → departments & courses →
   admissions & dates → campus events → contact → official website (LAST), which
   opens the real site INSIDE the app through the Java proxy. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { cc, set, toast, useCC } from '../store.js';
import {
  heroHTML, aboutHTML, coursesHTML, admissionsHTML, eventsHTML, contactHTML,
  websiteHTML, deptListHTML, esc, portalProxyId, collegeById,
} from '../core.js';
import SiteViewer from './SiteViewer.jsx';

export default function CollegeBody({ college, studentMode, onBack }) {
  useCC();
  const c = college;
  const [viewer, setViewer] = useState({ open: false, url: '', cid: '', label: '' });
  const [level, setLevel] = useState('All');
  const [query, setQuery] = useState('');
  const [eventTag, setEventTag] = useState('All');
  const wrap = useRef(null);

  useEffect(() => { set({ courseLevel: level, courseQuery: query, eventTag }); }, [level, query, eventTag]);
  useEffect(() => { set({ collegeId: c.id }); }, [c.id]);

  const sections = useMemo(() => ({
    hero: heroHTML(c),
    about: aboutHTML(c),
    courses: coursesHTML(c),
    admissions: admissionsHTML(c),
    events: eventsHTML(c),
    contact: contactHTML(c),
    website: websiteHTML(c),
  }), [c, level, query, eventTag]);

  /* one delegated click handler for everything inside the rendered sections */
  function onClick(e) {
    const site = e.target.closest('[data-site]');
    if (site) {
      e.preventDefault();
      const href = site.getAttribute('href') || '';
      const cid = site.getAttribute('data-cid') || c.id;
      const label = site.getAttribute('data-label') || (c.shortName + ' official website');
      if (/google\.[a-z.]+\/maps/i.test(href)) { window.open(href, '_blank', 'noopener'); return; }
      setViewer({ open: true, url: href, cid, label });
      set({ proxyOk: { ...cc.proxyOk, [cid]: true } });
      return;
    }
    const copy = e.target.closest('[data-copy]');
    if (copy) {
      const text = copy.getAttribute('data-copy');
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
        .then(() => toast('Link copied — paste it anywhere'))
        .catch(() => toast(text));
      return;
    }
    const lv = e.target.closest('[data-level]');
    if (lv) { setLevel(lv.getAttribute('data-level')); return; }
  }

  /* scroll-spy for the side navigation */
  useEffect(() => {
    const root = wrap.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const ids = ['sec-about', 'sec-courses', 'sec-admissions', 'sec-events', 'sec-contact', 'sec-website'];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        root.querySelectorAll('.sidenav a').forEach((a) =>
          a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [c.id, sections]);

  return (
    <div ref={wrap} onClick={onClick}>
      {studentMode && (
        <div className="wrap" style={{ paddingTop: 18 }}>
          <button className="btn btn--ghost btn--sm" onClick={onBack}>← All colleges</button>
        </div>
      )}

      <div className="wrap col" id="collegeContent">
        <div dangerouslySetInnerHTML={{ __html: sections.hero }} />
        <div id="sec-about" dangerouslySetInnerHTML={{ __html: sections.about }} />
        <div dangerouslySetInnerHTML={{ __html: sections.courses }} />
        <div dangerouslySetInnerHTML={{ __html: sections.admissions }} />
        <div dangerouslySetInnerHTML={{ __html: sections.events }} />
        <div dangerouslySetInnerHTML={{ __html: sections.contact }} />
        <div dangerouslySetInnerHTML={{ __html: sections.website }} />
      </div>

      <SiteViewer
        open={viewer.open} url={viewer.url} cid={viewer.cid} label={viewer.label}
        onClose={() => setViewer({ open: false, url: '', cid: '', label: '' })}
      />
    </div>
  );
}
