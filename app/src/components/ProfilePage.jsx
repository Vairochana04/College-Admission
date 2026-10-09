/* My Profile — the page the student's own saved details build.
   Everything here is read back from the server record (api.me), so what was
   filled once at register/onboarding shows up neatly; no other student's
   data is ever read. */
import { useEffect, useState } from 'react';
import { cc, set, toast, useCC } from '../store.js';
import {
  studentColleges, eligFor, fitScore, initials, fmtLong, nextAdmissionDate, collegeById,
  STREAMS, WANT, STAY, HOSTELTYPE, TRAVEL, degreesFor, ANY_DEGREE, NOT_SURE,
} from '../core.js';
import { api } from '../api.js';

const pctOf = (s) => Math.max(35, Math.min(98, Math.round(96 - s * 18)));

const Chip = ({ on, children, ...rest }) => (
  <button type="button" className={'chip' + (on ? ' chip--on' : '')} aria-pressed={on} {...rest}>{children}</button>
);

export default function ProfilePage() {
  useCC();
  const [rec, setRec] = useState(null);
  const [editing, setEditing] = useState(false);
  const [f, setF] = useState(null);
  useEffect(() => {
    api.me().then((d) => { if (d && d.student) setRec(d.student); }).catch(() => {});
  }, []);

  const u = cc.user || {};
  const all = studentColleges();
  const eligCount = all.filter((c) => eligFor(c).rank === 0).length;
  const top = all.map((c) => ({ c, s: fitScore(c) })).sort((a, b) => a.s - b.s).slice(0, 3);
  const savedNames = cc.saved.map((id) => (collegeById(id) || {}).shortName).filter(Boolean);
  let next = null;
  all.forEach((c) => {
    const n = nextAdmissionDate(c.admission);
    if (n && (!next || String(n.date) < String(next.date))) next = n;
  });

  function openEdit() {
    setF({
      name: cc.user?.name || '', mobile: cc.user?.mobile || '',
      marks: cc.marks === null || cc.marks === undefined ? '' : String(cc.marks),
      stream: cc.stuStream, want: cc.stuWant, degree: cc.stuDegree || ANY_DEGREE,
      stay: cc.stuStay, hostelType: cc.stuHostelType, travel: cc.stuTravel, town: cc.stuTown || '',
    });
    setEditing(true);
  }
  const setChip = (k, val) => setF((o) => ({ ...o, [k]: val, ...(k === 'want' ? { degree: ANY_DEGREE } : {}) }));
  function saveEdit() {
    if (f.name.trim().length < 2) return toast('Please tell us your name');
    const mob = f.mobile.replace(/\D/g, '');
    if (mob.length !== 10) return toast('Mobile number should be 10 digits');
    const m = Number(f.marks);
    if (!f.marks || isNaN(m) || m < 30 || m > 100) return toast('Class 12 % should be between 30 and 100');
    api.updateStudent({
      name: f.name.trim(), mobile: mob, marks: m, stream: f.stream, want: f.want,
      degree: f.degree, stay: f.stay, hostelType: f.hostelType, travel: f.travel, town: f.town.trim(),
    }).then(() => {
      Object.assign(cc, {
        user: { ...cc.user, name: f.name.trim(), mobile: mob, savedServer: true },
        marks: m, stuStream: f.stream, stuWant: f.want, stuDegree: f.degree,
        stuStay: f.stay, stuHostelType: f.hostelType, stuTravel: f.travel, stuTown: f.town.trim(),
      });
      set({});
      setEditing(false);
      toast('Saved — your profile is updated');
    }).catch(() => toast('Could not save right now. Try again?'));
  }

  const v = (x, d) => (x === null || x === undefined || x === '' ? (d || '—') : x);
  const rows = [
    ['Email id (login)', v(u.email)],
    ['Mobile', v(u.mobile)],
    ['Class 12 %', cc.marks === null || cc.marks === undefined ? '—' : cc.marks + '%'],
    ['Stream', v(cc.stuStream)],
    ['Course wanted', v(cc.stuWant)],
    ['Degree', v(cc.stuDegree)],
    ['Stay', (cc.stuStay || '—') + (cc.stuStay === 'Hostel needed' && cc.stuHostelType ? ' · ' + cc.stuHostelType : '')],
    ['Travel', v(cc.stuTravel)],
    ['Town', v(cc.stuTown)],
    ['Consent', rec ? (rec.consent === 'true' ? 'Given (DPDP) ✓' : 'Not given') : '…'],
  ];

  return (
    <div className="wrap prof" style={{ paddingTop: 20, paddingBottom: 46 }}>
      <section className="prof__head">
        <span className="prof__pic">
          {u.photo
            ? <img className="avatar avatar--xl" src={u.photo} alt="Your profile" />
            : <span className="avatar avatar--xl">{initials(u.name || 'SS')}</span>}
          {u.savedServer && (
            <span className="stu__tick" title="All done — profile saved on server">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg>
            </span>
          )}
        </span>
        <div className="prof__hello">
          <h1>Hi {String(u.name || 'Student').split(/\s+/)[0]} 👋</h1>
          <p>CampusConnect welcomes you — choose your college and shine your future.
            {' '}This profile was created from the details you filled.</p>
        </div>
        <div className="prof__meta">
          <b>{rec && rec.created ? 'Member since ' + fmtLong(String(rec.created).slice(0, 10)) : 'Your profile'}</b>
          <span>{u.savedServer ? 'Profile saved on the server ✓' : 'Saved on this device'}</span>
        </div>
      </section>

      <div className="prof__grid">
        <section className="card prof__card">
          <h3><span className="dot" />Your details
            <button className="card__edit" type="button" onClick={openEdit} title="Edit your details" aria-label="Edit your details">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20l4.5-.9L19.6 8a2.1 2.1 0 0 0-3-3L5.5 16.1Z" /><path d="m14.5 6.5 3 3" /></svg>
            </button>
          </h3>
          <dl className="prof__kv">
            {rows.map(([k, val]) => (
              <div key={k}><dt>{k}</dt><dd>{val}</dd></div>
            ))}
          </dl>
        </section>

        <div className="prof__side">
          <section className="card prof__card">
            <h3><span className="dot" />Your match</h3>
            <div className="prof__stat">
              <div><b>{all.length}</b><span>Colleges for you</span></div>
              <div><b>{eligCount}</b><span>Eligible</span></div>
              <div><b>{cc.saved.length}</b><span>Saved</span></div>
            </div>
            <div className="prof__fits">
              {top.map(({ c, s }) => (
                <div className="prof__fit" key={c.id}>
                  <b>{c.name}</b>
                  <span className="prof__bar"><i style={{ width: pctOf(s) + '%' }} /></span>
                  <em>{pctOf(s)}%</em>
                </div>
              ))}
            </div>
          </section>

          <section className="card prof__card">
            <h3><span className="dot" />Right now</h3>
            <div className="prof__tags">
              {savedNames.length
                ? <span className="tag tag--gold">Saved: {savedNames.join(' · ')}</span>
                : <span className="tag">No saved colleges yet</span>}
              {next && <span className="tag">Next: {next.label}</span>}
              <span className="tag">Filled once · edit with the pencil on your photo</span>
            </div>
          </section>
        </div>
      </div>

      {editing && f && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Edit your details"
          onClick={(e) => { if (e.target === e.currentTarget) setEditing(false); }}>
          <div className="modal__card pop">
            <div className="modal__head">
              <h3>Edit your details</h3>
              <button className="modal__x" type="button" onClick={() => setEditing(false)} aria-label="Close">&times;</button>
            </div>
            <div className="stu__edit stu__edit--modal">
              <div className="stu__editrow">
                <label htmlFor="peName">Name</label>
                <input id="peName" type="text" style={{ width: 190 }} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
                <label htmlFor="peMob">Mobile</label>
                <input id="peMob" type="tel" inputMode="numeric" maxLength={10} style={{ width: 130 }} value={f.mobile} onChange={(e) => setF({ ...f, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
                <label htmlFor="peMarks">Class 12 %</label>
                <input id="peMarks" type="number" min="30" max="100" step="0.1" style={{ width: 90 }} value={f.marks} onChange={(e) => setF({ ...f, marks: e.target.value })} />
              </div>
              <div className="stu__editrow">
                <label>Stream</label>
                <span className="chips">{STREAMS.map((x) => <Chip key={x} on={f.stream === x} onClick={() => setChip('stream', x)}>{x}</Chip>)}</span>
              </div>
              <div className="stu__editrow">
                <label>Course</label>
                <span className="chips">{WANT.map((x) => <Chip key={x} on={f.want === x} onClick={() => setChip('want', x)}>{x}</Chip>)}</span>
              </div>
              {f.want !== NOT_SURE && (
                <div className="stu__editrow">
                  <label>Degree</label>
                  <span className="chips">{degreesFor(f.want).map((x) => <Chip key={x} on={f.degree === x} onClick={() => setChip('degree', x)}>{x}</Chip>)}</span>
                </div>
              )}
              <div className="stu__editrow">
                <label>Stay</label>
                <span className="chips">{STAY.map((x) => <Chip key={x} on={f.stay === x} onClick={() => setChip('stay', x)}>{x}</Chip>)}
                  {f.stay === 'Hostel needed' && HOSTELTYPE.map((x) => <Chip key={x} on={f.hostelType === x} onClick={() => setChip('hostelType', x)}>{x}</Chip>)}
                </span>
                <label>Travel</label>
                <span className="chips">{TRAVEL.map((x) => <Chip key={x} on={f.travel === x} onClick={() => setChip('travel', x)}>{x}</Chip>)}</span>
              </div>
              <div className="stu__editrow">
                <label htmlFor="peTown">Town</label>
                <input id="peTown" type="text" style={{ width: 150 }} placeholder="e.g. Tiruppur" value={f.town} onChange={(e) => setF({ ...f, town: e.target.value })} />
                <button className="btn btn--gold btn--sm" onClick={saveEdit}>Save</button>
                <button className="btn btn--ghost btn--sm" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
