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
    <div ref={wrap} onClick={onClick} onInput={onInput}>
      {studentMode && (
        <div className="wrap" style={{ paddingTop: 18 }}>
          <button className="btn btn--ghost btn--sm" onClick={onBack}>← All colleges</button>
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

    </div>
  );
}
