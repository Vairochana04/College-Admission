/* The college profile — the same seven sections the single-file build published,
   in the order the student asked for: profile → departments & courses →
   admissions & dates → campus events → contact → official website (LAST), which
   opens the real site INSIDE the app through the Java proxy. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { cc, set, toast, useCC } from '../store.js';
import {
  heroHTML, aboutHTML, coursesHTML, admissionsHTML, eventsHTML, contactHTML,
  websiteHTML, deptListHTML, counselHTML, feesHTML, mapHTML, faqHTML,
  esc, portalProxyId, collegeById,
} from '../core.js';
import { api } from '../api.js';

export default function CollegeBody({ college, studentMode, onBack }) {
  useCC();
  const c = college;
  const [level, setLevel] = useState('All');
  const [query, setQuery] = useState('');
  const [eventTag, setEventTag] = useState('All');
  const saved = cc.saved.includes(c.id);

  function saveToggle() {
    const i = cc.saved.indexOf(c.id);
    const next = cc.saved.slice();
    if (i >= 0) next.splice(i, 1); else next.push(c.id);
    if (cc.user) { try { localStorage.setItem('cc_student_saved_v1:' + cc.user.email, JSON.stringify(next)); } catch (e) {} }
    set({ saved: next });
    api.track(i >= 0 ? 'unsave' : 'save', c.id);
    toast(i >= 0 ? 'Removed from your saved colleges' : 'Saved — you will find it under "Saved"');
  }

  function openSite() {
    window.open(c.website, '_blank', 'noopener,noreferrer');
    api.track('website_click', c.id);
  }
  const wrap = useRef(null);
  const ids = ['sec-about', 'sec-courses', 'sec-admissions', 'sec-fees', 'sec-events', 'sec-location', 'sec-contact', 'sec-website'];
  const labels = {
    'sec-about': 'Overview', 'sec-courses': 'Branches & seats', 'sec-admissions': 'Admission & counselling',
    'sec-fees': 'Quota & fees', 'sec-events': 'Events', 'sec-location': 'Location & map',
    'sec-contact': 'Help & contact', 'sec-website': 'Official website',
  };

  useEffect(() => { set({ courseLevel: level, courseQuery: query, eventTag }); }, [level, query, eventTag]);
  useEffect(() => { set({ collegeId: c.id }); }, [c.id]);

  const sections = useMemo(() => ({
    hero: heroHTML(c),
    about: aboutHTML(c),
    courses: coursesHTML(c),
    admissions: admissionsHTML(c) + counselHTML(c),
    fees: feesHTML(c),
    events: eventsHTML(c),
    location: mapHTML(c),
    contact: contactHTML(c) + faqHTML(c),
    website: websiteHTML(c),
  }), [c, level, query, eventTag]);

  /* one delegated click handler for everything inside the rendered sections */
  function onClick(e) {
    const evm = e.target.closest('[data-evmore]');
    if (evm) {
      const box = wrap.current && wrap.current.querySelector('.evmore');
      if (box) {
        if (!evm.dataset.orig) evm.dataset.orig = evm.textContent;
        box.hidden = !box.hidden;
        evm.textContent = box.hidden ? evm.dataset.orig : 'Show fewer events';
      }
      return;
    }
    const site = e.target.closest('[data-site]');
    if (site) {
      /* official website: open live in a new tab — works from any browser */
      e.preventDefault();
      const href = site.getAttribute('href') || '';
      const cid = site.getAttribute('data-cid') || c.id;
      const label = site.getAttribute('data-label') || (c.shortName + ' official website');
      if (href) window.open(href, '_blank', 'noopener,noreferrer');
      api.track('website_click', cid, label);
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
    if (lv) {
      /* store first (the memo reads cc), then state so the sections rebuild */
      const v = lv.getAttribute('data-level');
      set({ courseLevel: v });
      setLevel(v);
      return;
    }
    const et = e.target.closest('[data-tag]');
    if (et) {
      const v = et.getAttribute('data-tag');
      set({ eventTag: v });
      setEventTag(v);
      return;
    }
  }

  /* the course search box lives inside rendered HTML — listen by delegation */
  function onInput(e) {
    if (e.target && e.target.id === 'courseSearch') {
      const v = e.target.value;
      set({ courseQuery: v });
      setQuery(v);
    }
  }

  /* scroll-spy for the side navigation */
  useEffect(() => {
    const root = wrap.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const ids = ['sec-about', 'sec-courses', 'sec-admissions', 'sec-fees', 'sec-events', 'sec-location', 'sec-contact', 'sec-website'];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        root.querySelectorAll('.sidenav a, .secnav a').forEach((a) =>
          a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [c.id, sections]);

  return (
    <div ref={wrap} onClick={onClick} onInput={onInput} className={studentMode ? 'hasbar' : ''}>
      {studentMode && (
        <div className="wrap" style={{ paddingTop: 18 }}>
          <button className="btn btn--ghost btn--sm" onClick={onBack}>← All colleges</button>
          <div className="crumbs">Colleges › <b>{c.shortName || c.name}</b></div>
        </div>
      )}

      <div className="wrap col" id="collegeContent">
        <div dangerouslySetInnerHTML={{ __html: sections.hero }} />
        <div className={"secnav" + (studentMode ? "" : " secnav--app")} role="navigation" aria-label="Profile sections">
          {ids.map((id) => (
            <a key={id} href={'#' + id}>{labels[id]}</a>
          ))}
        </div>
        <div id="sec-about" dangerouslySetInnerHTML={{ __html: sections.about }} />
        <div dangerouslySetInnerHTML={{ __html: sections.courses }} />
        <div dangerouslySetInnerHTML={{ __html: sections.admissions }} />
        <div dangerouslySetInnerHTML={{ __html: sections.fees }} />
        <div dangerouslySetInnerHTML={{ __html: sections.events }} />
        <div dangerouslySetInnerHTML={{ __html: sections.location }} />
        <div dangerouslySetInnerHTML={{ __html: sections.contact }} />
        <div dangerouslySetInnerHTML={{ __html: sections.website }} />
      </div>

      <CcFoot />
      {studentMode && (
        <div className="actionbar">
          <button type="button" className={"btn btn--sm " + (saved ? 'btn--gold' : 'btn--primary')} onClick={saveToggle}>
            {saved ? '✓ Saved' : '♥ Save college'}
          </button>
          <button type="button" className="btn btn--sm btn--ghost" onClick={openSite}>🌐 Official site</button>
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑ Top</button>
        </div>
      )}
    </div>
  );
}

/* small shared footer — keeps every page ending the same neat way */
export function CcFoot() {
  return (
    <footer className="ccfoot">
      <span>CampusConnect · a demo admission guide for Tamil Nadu students · values are indicative — confirm with the college</span>
      <span>© 2026 CampusConnect · Coimbatore</span>
    </footer>
  );
}
