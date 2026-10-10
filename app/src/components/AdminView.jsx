/* Platform admin workspace — the business view the client asked for.
   Reads /api/admin/summary: every registered student with their details
   (name, email, mobile, marks, course, degree, hostel, travel, town, consent),
   how many colleges each of them explored / saved / clicked, and a per-college
   lead count ("45 students are interested in PSG Pharmacy") that is the thing
   colleges subscribe to. Exports are plain CSV. */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { cc, set, toast, useCC } from '../store.js';
import { api } from '../api.js';
import { initials, esc } from '../core.js';

const fmtWhen = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};


/* company footer — the reference layout the client shared (logo+address | map | glance) */
const IX_MAP_EMBED = 'https://www.google.com/maps?q=' + encodeURIComponent(
  'Infolexus Solutions, 63/54-55, Dhamu Nagar, Puliyakulam Road, Ramanathapuram, Coimbatore, Tamil Nadu 641045, India') + '&output=embed';
const IX_MAP_LINK = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(
  'Infolexus Solutions, 63/54-55, Dhamu Nagar, Puliyakulam Road, Ramanathapuram, Coimbatore, Tamil Nadu 641045, India');

function InfolexusFooter() {
  return (
    <div className="ixfoot">
      <div className="wrap ixfoot__in">
        <div>
          <div className="ixfoot__brand">
            <span className="ixfoot__mark">iX</span>
            <div><b>Infolexus Solutions</b><small>Software &amp; IT services · Coimbatore</small></div>
          </div>
          <div className="ixfoot__line">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
            <span>63/54-55, Dhamu Nagar, Puliyakulam Road,<br />Ramanathapuram, Coimbatore,<br />Tamil Nadu – 641045, India</span>
          </div>
          <div className="ixfoot__line">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>
            <a href={IX_MAP_LINK} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
          </div>
        </div>
        <div className="ixfoot__map">
          <iframe title="Infolexus Solutions — Google Map" src={IX_MAP_EMBED} loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" allowFullScreen></iframe>
          <a className="ixfoot__larger" href={IX_MAP_LINK} target="_blank" rel="noopener noreferrer">View larger map ↗</a>
        </div>
        <div>
          <h4>Platform credit</h4>
          <p>CampusConnect — college admission portal for Tamil Nadu students.
            Designed &amp; developed by <b>Infolexus Solutions</b>, Coimbatore.</p>
          <p className="ixfoot__note">Addresses &amp; map © Google · college data is indicative
            demo content; confirm details with each institution.</p>
        </div>
      </div>
    </div>
  );
}


/* Help & Support band — sits right above the company footer */
function HelpSupport() {
  const cards = [
    {
      icon: <><path d="M4 19.5V6a2 2 0 0 1 2-2h13v14H6.5a2.5 2.5 0 0 0 0 5H19" /></>,
      t: 'Quick guide (students)',
      b: <>1 · Profile details fill pannunga (one time) → 2 · Colleges list-la ungal
        marks-ku fit-aana colleges → 3 · ♥ save panni compare → 4 · college page-la
        counselling steps & official site.</>,
    },
    {
      icon: <><path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" /><path d="M9 11h6M9 14h4" /></>,
      t: 'Guide bot',
      b: <>Bottom-left 💬 bubble — colleges, cutoff, hostel, fees, apply steps pathi
        kelunga; college data-va irundhu instant answers (server-ku data pogadhu).</>,
    },
    {
      icon: <><path d="M3 11 12 3l9 8" /><path d="M5 10v10h14V10" /><path d="M12 21v-6" /></>,
      t: 'College help desks',
      b: <>Every college page → “Help & contact” section: admissions phone, email,
        office hours + Google map. Official website link-um athileye.</>,
    },
    {
      icon: <><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></>,
      t: 'Technical support',
      b: <>Platform issues-ku <b>Infolexus Solutions</b>, Coimbatore — full address
        & map kile (“Platform credit” block). Institution admin via-va report pannalam.</>,
    },
  ];
  return (
    <div className="helpband">
      <div className="wrap">
        <div className="helpband__head">
          <h3>Help &amp; Support</h3>
          <p>Quick answers first — reach a human only if you still need one.</p>
        </div>
        <div className="helpband__grid">
          {cards.map((c) => (
            <section className="helpcard" key={c.t}>
              <span className="helpcard__ic">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{c.icon}</svg>
              </span>
              <b>{c.t}</b>
              <p>{c.b}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminView({ onLogout }) {
  useCC();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [onlyConsent, setOnlyConsent] = useState(false);
  const [openEmail, setOpenEmail] = useState(null);

  const load = useCallback(async (quiet) => {
    try {
      const d = await api.adminSummary();
      setData(d);
      setErr('');
      if (!quiet) toast('Dashboard refreshed');
    } catch (e) {
      setErr(e.message || 'Could not load the dashboard.');
    }
  }, []);

  useEffect(() => { load(true); }, [load]);

  const students = useMemo(() => {
    let list = (data && data.students) || [];
    if (onlyConsent) list = list.filter((s) => s.consent === 'true');
    const query = q.trim().toLowerCase();
    if (query) {
      list = list.filter((s) =>
        (s.name + ' ' + s.email + ' ' + s.mobile + ' ' + s.town + ' ' + s.want + ' ' + s.degree + ' ' + s.stream)
          .toLowerCase().indexOf(query) >= 0);
    }
    return list;
  }, [data, q, onlyConsent]);

  const open = useMemo(() => {
    if (!data || !openEmail) return null;
    return data.students.find((s) => s.email === openEmail) || null;
  }, [data, openEmail]);

  const t = (data && data.totals) || {};

  return (
    <section id="view-admin" className="view active">
      <header className="topbar">
        <div className="wrap topbar__in">
          <div className="brand">
            <span className="brand__mark" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 4v5c0 5-3.4 8.2-8 9-4.6-.8-8-4-8-9V7l8-4Z" /><path d="m9 12 2 2 4-4" /></svg>
            </span>
            <span>CampusConnect<small>Admin</small></span>
          </div>
          <div className="topbar__spacer"></div>
          <div className="userchip">
            <span className="avatar">{initials(cc.user?.name || 'PA')}</span>
            <span><b>{cc.user?.name}</b><em>{cc.user?.email}</em></span>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={() => { load(); }}>Refresh</button>
          <button className="btn btn--ghost btn--sm" onClick={onLogout}>Sign out</button>
        </div>
      </header>

      <div className="wrap adm2">
        <div className="adm2__head">
          <div>
            <h1>Leads &amp; students dashboard</h1>
            <p>Every student who registered, the colleges they explored, and what each college
              can be told — this is the report colleges subscribe to.</p>
          </div>
          <div className="row">
            <a className="btn btn--sm" href={api.studentsCsvUrl()} target="_blank" rel="noopener noreferrer">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>
              Students CSV
            </a>
          </div>
        </div>

        <div className="adm2__stats">
          <div className="stat"><b>{t.students ?? 0}</b><span>Students registered</span></div>
          <div className="stat"><b>{t.profileViews ?? 0}</b><span>College profiles viewed</span></div>
          <div className="stat"><b>{t.saves ?? 0}</b><span>Colleges saved</span></div>
          <div className="stat"><b>{t.websiteClicks ?? 0}</b><span>Official-site clicks</span></div>
          <div className="stat"><b>{t.collegesWithInterest ?? 0}</b><span>Colleges with interest</span></div>
        </div>

        {err && (
          <div className="auth__alert" role="alert" style={{ margin: '16px 0' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>
            <span>{err} Sign in again from the front page as admin.</span>
          </div>
        )}

        <div className="adm2__controls">
          <label className="field__box" style={{ flex: '1 1 240px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></svg>
            <input type="search" placeholder="Search name, email, mobile, town, course…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search students" />
          </label>
          <label className="check"><input type="checkbox" checked={onlyConsent} onChange={(e) => setOnlyConsent(e.target.checked)} /> Consent to share only</label>
          <span className="muted">{students.length} of {((data && data.students) || []).length} students</span>
        </div>

        <div className="adm2__grid">
          <div className="card">
            <h3 className="sec-title">Students</h3>
            {students.length === 0 ? (
              <div className="empty">
                <b>No students yet</b>
                When a student creates an account on the front page they appear here with
                everything they told us, and every college they look at is counted.
              </div>
            ) : (
              <table className="adm2__table">
                <thead>
                  <tr>
                    <th>Student</th><th>Mobile</th><th>Marks</th><th>Wants</th><th>Town</th>
                    <th>Colleges seen</th><th>Consent</th><th>Last activity</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.email} className={openEmail === s.email ? 'is-open' : ''} onClick={() => setOpenEmail(openEmail === s.email ? null : s.email)}>
                      <td>
                        <b>{s.name}</b>
                        <span>{s.email}</span>
                      </td>
                      <td>{s.mobile || '—'}</td>
                      <td>{s.marks ?? '—'}</td>
                      <td>{s.want}{s.degree && s.degree !== 'Any degree' ? ' · ' + s.degree : ''}</td>
                      <td>{s.town || '—'}</td>
                      <td>
                        <b>{s.collegesViewed ?? 0}</b>
                        <span>{s.profileViews ?? 0} views · {s.saves ?? 0} saved</span>
                      </td>
                      <td>{s.consent === 'true' ? <span className="badge badge--ok">yes</span> : <span className="badge badge--info">no</span>}</td>
                      <td>{fmtWhen(s.lastActivity || s.created)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {open && (
              <div className="adm2__detail">
                <div className="adm2__detailhead">
                  <div>
                    <b>{open.name}</b>
                    <span>{open.email} · {open.mobile || 'no mobile'} · {open.stream} · hostel: {open.stay}{open.stay === 'Hostel needed' ? ' (' + open.hostelType + ')' : ''} · travel: {open.travel}</span>
                  </div>
                  <button className="btn btn--ghost btn--sm" onClick={() => setOpenEmail(null)}>Close</button>
                </div>
                {open.topColleges && open.topColleges.length > 0 ? (
                  <table className="adm2__table adm2__table--sub">
                    <thead><tr><th>College explored</th><th>Profile views</th><th>Saved</th><th>Site / apply clicks</th></tr></thead>
                    <tbody>
                      {open.topColleges.map((c) => (
                        <tr key={c.id}>
                          <td><b>{c.name}</b></td>
                          <td>{c.views}</td>
                          <td>{c.saves}</td>
                          <td>{c.clicks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="muted" style={{ margin: '10px 2px' }}>Has not opened any college profile yet.</p>
                )}
                <p className="muted" style={{ margin: '10px 2px 0', fontSize: 12.6 }}>
                  Registered {fmtWhen(open.created)} · last seen {fmtWhen(open.lastActivity)} ·
                  consent to share: {open.consent === 'true' ? 'yes' : 'no'}
                </p>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="sec-title">Interest per college <span className="muted" style={{ fontWeight: 500 }}>(the subscription report)</span></h3>
            {(!data || !data.colleges || data.colleges.length === 0) ? (
              <div className="empty">
                <b>No interest recorded yet</b>
                As students open college profiles, save colleges or click official websites,
                each college's numbers grow here.
              </div>
            ) : (
              <table className="adm2__table">
                <thead>
                  <tr><th>College</th><th>Students</th><th>Views</th><th>Saves</th><th>Clicks</th><th></th></tr>
                </thead>
                <tbody>
                  {data.colleges.map((c) => (
                    <tr key={c.id}>
                      <td><b>{c.name}</b></td>
                      <td>{c.students}</td>
                      <td>{c.views}</td>
                      <td>{c.saves}</td>
                      <td>{c.clicks}</td>
                      <td style={{ textAlign: 'right' }}>
                        <a className="link" href={api.studentsCsvUrl(c.id)} target="_blank" rel="noopener noreferrer">CSV</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="notice" style={{ marginTop: 14 }}>
              <div className="notice__in">
                <p><b>How this becomes revenue:</b> a college is told “N students explored your
                  college this season, M saved it” — and the per-college CSV above is exactly the
                  lead list a subscription unlocks. The numbers here come from the demo dataset
                  plus the activity recorded on this server.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HelpSupport />
      <InfolexusFooter />
    </section>
  );
}
