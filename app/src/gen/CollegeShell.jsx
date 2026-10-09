/* CollegeShell - shell markup converted from the single-file build v0.10 */
export default function CollegeShell(){
  return (
    <>
<section id="view-college" className="view">
  <header className="topbar">
    <div className="wrap topbar__in">
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" /></svg>
        </span>
        <span>CampusConnect<small id="brandSub">College workspace</small></span>
      </div>

      <button className="btn btn--ghost btn--sm" id="stuBackBtn" hidden>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H6" /><path d="m11 5-7 7 7 7" /></svg>
        All colleges
      </button>

      <button className="switcher-btn" id="pickerBtn" aria-expanded="false" aria-controls="pickerPanel">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="2" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" /></svg>
        <span id="pickerLabel">
          <b>Choose a college</b>
          <em>Group-wise list</em>
        </span>
        <span className="cnt" id="pickerCount"></span>
        <svg className="caret" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      <div className="topbar__spacer"></div>

      <div className="userchip">
        <span className="avatar" id="userAvatar">CC</span>
        <span>
          <b id="userName">—</b>
          <span id="userRole">—</span>
        </span>
      </div>
      <button className="btn btn--ghost btn--sm" id="logoutBtn">Sign out</button>
    </div>
  </header>

  <div className="notice" id="collegeNotice">
    <div className="wrap notice__in">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>
      <span>This is exactly how students see your profile. Use <b>Browse colleges</b> above to check any college on the platform — the whole PSG group is listed.</span>
    </div>
  </div>

  <div className="wrap">
    <div className="picker" id="pickerPanel" hidden>
      <div className="picker__head">
        <strong>Browse colleges on the platform</strong>
        <div className="field__box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>
          <input id="pickerSearch" type="search" placeholder="Search by college, city or course (e.g. nursing, arts, MBA)" aria-label="Search colleges" />
        </div>
        <button className="btn btn--ghost btn--sm" id="pickerClose">Close</button>
      </div>
      <div className="picker__body" id="pickerBody"></div>
    </div>
  </div>

  <div className="wrap shell">
    <nav className="sidenav" id="sidenav" aria-label="Profile sections">
      <div className="sidenav__t">College profile</div>
      <a href="#sec-profile" className="active"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M4 21V9l8-5 8 5v12" /><path d="M9 21v-6h6v6" /></svg> Profile</a>
      <a href="#sec-courses"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z" /><path d="M8 7.5h8M8 11h6" /></svg> Courses</a>
      <a href="#sec-admissions"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="3" /><path d="M8 3v3M16 3v3M3 10h18" /></svg> Admissions</a>
      <a href="#sec-events"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /><circle cx="12" cy="12" r="3.2" /></svg> Events</a>
      <a href="#sec-contact"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></svg> Contact</a>
      <a href="#sec-website"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3.5 9h17M3.5 15h17M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg> Official website</a>
      <div className="sidenav__foot">
        Profile completeness<br /><b id="completeness" style={{ color: 'var(--ink)' }}>—</b>
      </div>
    </nav>

    <main className="content" id="collegeContent"></main>
  </div>

  <div className="wrap footer">
    CampusConnect demo · Sample data for illustration only · <span id="footCollege"></span>
  </div>
</section>
    </>
  );
}
