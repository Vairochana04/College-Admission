/* LoginAside - shell markup converted from the single-file build v0.10 */
export default function LoginAside(){
  return (
    <>
<aside className="auth__aside">
      <div className="auth__inner">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" />
            </svg>
          </span>
          <span>CampusConnect<small>College admissions, simplified</small></span>
        </div>

        <div className="auth__copy">
          <h1>Find the right college. <em>Know it well before you apply.</em></h1>
          <p>One clean place for students to explore colleges, courses, admission dates and campus events — and for colleges to present everything students actually need. Now covering the <b style={{ color: '#fff' }}>entire PSG group in Coimbatore</b>, plus more colleges.</p>
          <ul className="auth__list">
            <li><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg><span>Complete college profiles — departments, courses, fees & eligibility</span></li>
            <li><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg><span>Admission timelines with every important date in one view</span></li>
            <li><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg><span>Upcoming campus events, open houses and fests with dates</span></li>
            <li><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg><span>Direct link to each college's official website & admission portal</span></li>
            <li><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg><span>Admin dashboard — student leads, college-wise interest & CSV exports</span></li>
          </ul>
          <div className="auth__psg">
            <img id="psgGroupLogo" alt="PSG &amp; Sons' Charities logo" />
            <span><b>PSG & Sons' Charities</b><em>The trust behind the PSG institutions</em></span>
          </div>
          <div className="auth__stat">
            <div><b>12</b><span>Demo colleges</span></div>
            <div><b>2</b><span>Login roles</span></div>
            <div><b>1</b><span>Simple profile view</span></div>
          </div>
        </div>

        <div className="auth__foot">Demo build v1.1 · Student accounts (name, email, mobile, marks, course, hostel & bus) stored on the server · Admin dashboard with college-wise leads · Sample data for illustration</div>
      </div>
    </aside>
    </>
  );
}
