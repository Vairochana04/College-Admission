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
    </section>
  );
}
