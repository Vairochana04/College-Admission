/* StudentShell - shell markup converted from the single-file build v0.10 */
export default function StudentShell(){
  return (
    <>
<section id="view-student" className="view">
  <header className="topbar">
    <div className="wrap topbar__in">
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" /></svg>
        </span>
        <span>CampusConnect<small>Student workspace</small></span>
      </div>
      <div className="topbar__spacer"></div>
      <div className="userchip">
        <span className="avatar" id="stuAvatar">SS</span>
        <span><b id="stuName">—</b><span id="stuSub">Student</span></span>
      </div>
      <button className="btn btn--ghost btn--sm" id="stuLogout">Sign out</button>
    </div>
  </header>

  <main className="stu">
    <section className="stu__hero">
      <div className="stu__hi">
        <span className="pill pill--gold">Student</span>
        <h1 id="stuHello">Hi there 👋</h1>
        <p>Pick a college to see its courses, admission dates, campus events and official website — everything is in one place. For now the whole <b style={{ color: '#fff' }}>PSG group in Coimbatore</b> is listed.</p>
      </div>
      <div className="stu__marks" id="stuMarksRow"></div>
      <div className="stu__marks" id="stuPrefsRow"></div>
      <div className="stu__edit" id="stuEditBox" hidden>
        <div className="stu__editrow">
          <label>Class 12 %</label>
          <input id="stuMarksInput" type="number" min="30" max="100" step="0.1" inputmode="decimal" />
          <span className="chips" id="stuEditChips"></span>
        </div>
        <div className="stu__editrow">
          <label>Course</label><span className="chips" id="stuEditWant"></span>
        </div>
        <div className="stu__editrow" id="stuEditDegreeRow">
          <label>Degree</label><span className="chips" id="stuEditDegree"></span>
        </div>
        <div className="stu__editrow">
          <label>Stay</label><span className="chips" id="stuEditStay"></span>
          <span className="chips" id="stuEditHostelType"></span>
          <label>Travel</label><span className="chips" id="stuEditTravel"></span>
        </div>
        <div className="stu__editrow">
          <label>Town</label>
          <input id="stuTown" type="text" style={{ width: '150px' }} placeholder="e.g. Tiruppur" />
          <button className="btn btn--gold btn--sm" id="stuMarksSave">Save</button>
          <button className="btn btn--ghost btn--sm" id="stuMarksCancel">Cancel</button>
        </div>
      </div>
      <div className="stu__stats">
        <div><b id="stuStatColleges">10</b><span>PSG colleges</span></div>
        <div><b id="stuStatSaved">0</b><span>Saved</span></div>
        <div><b id="stuStatNext">—</b><span id="stuStatNextLabel">Next application opens</span></div>
      </div>
    </section>

    <section className="stu__bar">
      <div className="field__box stu__search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>
        <input id="stuSearch" type="search" placeholder="Search a college or course (e.g. arts, MBA, nursing)" aria-label="Search colleges" />
      </div>
      <div className="stu__chips" id="stuChips">
        <button className="chip chip--on" data-stufilter="all" aria-pressed="true">All PSG colleges <em id="stuChipAll">10</em></button>
        <button className="chip" data-stufilter="eligible" aria-pressed="false">Eligible for me <em id="stuChipEligible">0</em></button>
        <button className="chip" data-stufilter="saved" aria-pressed="false">Saved <em id="stuChipSaved">0</em></button>
      </div>
    </section>

    <p className="stu__line" id="stuGridLine"></p>
    <div className="stu__grid" id="stuGrid"></div>
    <p className="stu__note" id="stuNote"></p>
  </main>
</section>
    </>
  );
}
