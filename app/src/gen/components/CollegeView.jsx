/* College workspace — the college's own public profile, exactly what a student
   sees. Pick another college from the switcher; the profile's LAST section is the
   official website, which opens the real site inside the app. */
import { useEffect, useMemo, useState } from 'react';
import { cc, set, useCC } from '../store.js';
import {
  COLLEGES, GROUP_ORDER, categoryOf, groupLabelOfCategory, cityOf, subLineOf,
  ITEM_NOTE, esc, logoOrMono, hayMatches, initials, cityOf as city, isPSG,
} from '../core.js';
import CollegeBody from './CollegeBody.jsx';

export default function CollegeView({ onLogout }) {
  useCC();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [q, setQ] = useState('');
  const current = useMemo(() => COLLEGES.find((c) => c.id === cc.collegeId) || COLLEGES[0], [cc.collegeId]);

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return GROUP_ORDER.map((cat) => {
      const list = COLLEGES.filter((c) => categoryOf(c) === cat).filter((c) => {
        if (!needle) return true;
        const hay = (c.name + ' ' + c.shortName + ' ' + c.city + ' ' + c.state + ' ' + categoryOf(c) + ' ' +
          (isPSG(c) ? 'psg group ' : '') + (ITEM_NOTE[c.id] || '') + ' ' +
          c.departments.map((d) => d.name + ' ' + d.courses.map((x) => x.name + ' ' + x.level).join(' ')).join(' ')).toLowerCase();
        return hayMatches(hay.replace(/\./g, ''), needle.replace(/\./g, ''));
      });
      return { cat, list };
    }).filter((g) => g.list.length);
  }, [q]);

  const shown = groups.reduce((n, g) => n + g.list.length, 0);

  useEffect(() => {
    const foot = document.getElementById('footCollege');
    if (foot) foot.textContent = current.name + ' · ' + current.website;
    const count = document.getElementById('pickerCount');
    if (count) count.textContent = COLLEGES.length + ' colleges';
  }, [current]);

  const report = current.stats?.[0];

  return (
    <section id="view-college" className="view active">
      <header className="topbar">
        <div className="wrap topbar__in">
          <div className="brand">
            <span className="brand__mark" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" /></svg>
            </span>
            <span>CampusConnect<small id="brandSub">College workspace</small></span>
          </div>

          <div className="switcher">
            <button className="switcher-btn" id="pickerBtn" aria-expanded={pickerOpen} onClick={() => setPickerOpen((o) => !o)}>
              <span className="switcher-btn__txt">
                <b id="pickerLabel">{current.shortName}</b>
                <em>{cityOf(current)} · {isPSG(current) ? 'PSG group' : categoryOf(current)}</em>
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </button>
            <span className="cnt" id="pickerCount">{COLLEGES.length} colleges</span>
          </div>

          <div className="topbar__spacer"></div>
          <div className="userchip">
            <span className="avatar">{initials(cc.user?.name || 'AD')}</span>
            <span><b>{cc.user?.name || 'College admin'}</b><em>{cc.user?.title || 'Admissions'}</em></span>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={onLogout}>Sign out</button>
        </div>
      </header>

      {pickerOpen && (
        <div className="picker open" id="pickerPanel">
          <div className="picker__head">
            <div className="searchbox">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></svg>
              <input id="pickerSearch" type="search" placeholder="Search by college, city or course (e.g. nursing, arts, MBA)" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <button className="btn btn--ghost btn--sm" id="pickerClose" onClick={() => setPickerOpen(false)}>Close</button>
          </div>
          <div className="picker__body" id="pickerBody">
            {groups.length === 0 && (
              <div className="picker__empty" style={{ gridColumn: '1/-1' }}>No college matches “{q}”. Try a city, a branch like “nursing” or “arts”, or clear the search.</div>
            )}
            {groups.map((g) => (
              <div className="picker__group" key={g.cat}>
                <div className="picker__gt">{groupLabelOfCategory(g.cat)}<span>{g.list.length}</span></div>
                {g.list.map((c) => (
                  <button className="pitem" key={c.id} aria-current={c.id === current.id}
                    onClick={() => { set({ collegeId: c.id }); setPickerOpen(false); }}>
                    <span className="pitem__logo" dangerouslySetInnerHTML={{ __html: logoOrMono(c, 'pitem__logo', '') }} />
                    <span><b>{c.name}</b><span>{subLineOf(c)}{ITEM_NOTE[c.id] ? ' · ' + ITEM_NOTE[c.id] : ''}</span></span>
                    <span className="pitem__cat">{g.cat}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="wrap shell">
        <nav className="sidenav" id="sidenav" aria-label="Profile sections">
          <div className="sidenav__t">College profile</div>
          <a href="#sec-profile" className="active">Profile</a>
          <a href="#sec-courses">Courses</a>
          <a href="#sec-admissions">Admissions</a>
          <a href="#sec-events">Events</a>
          <a href="#sec-contact">Contact</a>
          <a href="#sec-website">Official website</a>
          <div className="sidenav__foot">
            Profile completeness<br /><b id="completeness" style={{ color: 'var(--ink)' }}>{report ? report.v : '90%'}</b>
          </div>
        </nav>
        <main className="content">
          <CollegeBody college={current} />
        </main>
      </div>

      <div className="wrap footer">
        CampusConnect demo · Sample data for illustration only · <span id="footCollege">{current.name} · {current.website}</span>
        <div style={{ marginTop: 8, fontSize: 12 }}>Demo build v1.0 · React frontend + Java backend · PSG group colleges</div>
      </div>
    </section>
  );
}
