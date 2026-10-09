/* Student workspace — React owns the structure and state; the rich content of a
   college card / section comes from the shared template module (core.js).
   Colleges are sorted best-fit first for the student's marks, then floated up by
   their course + degree answers, with hostel / bus notes on every card. */
import { useEffect, useMemo, useState } from 'react';
import { cc, set, toast, useCC } from '../store.js';
import {
  studentColleges, eligFor, fitScore, stuCardHTML, stuPrefsLine, initials,
  nextAdmissionDate, fmtShort, hayMatches, categoryOf, cityOf, esc,
  degreesFor, NOT_SURE, ANY_DEGREE, STREAMS, WANT, STAY, HOSTELTYPE, TRAVEL,
  collegeById, saveStudentDetails,
} from '../core.js';
import CollegeBody from './CollegeBody.jsx';

const Chip = ({ on, children, ...rest }) => (
  <button type="button" className={'chip' + (on ? ' chip--on' : '')} aria-pressed={on} {...rest}>{children}</button>
);

export default function StudentView({ onLogout }) {
  useCC();
  const [editing, setEditing] = useState(false);
  const [marksInput, setMarksInput] = useState('');
  const [townInput, setTownInput] = useState('');
  const [profileId, setProfileId] = useState(null);
  const [chips, setChips] = useState({
    stream: cc.stuStream, want: cc.stuWant, degree: cc.stuDegree || ANY_DEGREE,
    stay: cc.stuStay, hostelType: cc.stuHostelType, travel: cc.stuTravel,
  });

  const all = studentColleges();
  const nextAll = useMemo(() => {
    let best = null;
    all.forEach((c) => {
      const n = nextAdmissionDate(c.admission);
      if (n && (!best || String(n.date) < String(best.date))) best = n;
    });
    return best;
  }, [all]);

  const visible = useMemo(() => {
    let list = all;
    if (cc.stuFilter === 'saved') list = list.filter((c) => cc.saved.includes(c.id));
    if (cc.stuFilter === 'eligible') list = list.filter((c) => eligFor(c, cc.marks, cc.stuStream).rank === 0);
    const q = String(cc.stuQuery || '').trim().toLowerCase();
    if (q) {
      list = list.filter((c) => {
        const hay = (c.name + ' ' + c.shortName + ' ' + cityOf(c) + ' ' + categoryOf(c) + ' ' +
          c.departments.map((d) => d.name + ' ' + d.courses.map((x) => x.name + ' ' + x.level).join(' ')).join(' ')).toLowerCase();
        return hayMatches(hay.replace(/\./g, ''), q.replace(/\./g, ''));
      });
    }
    if (cc.stuFilter === 'all' && cc.marks !== null && cc.marks !== undefined) {
      list = list.slice().sort((a, b) => fitScore(a) - fitScore(b));
    }
    return list;
  }, [all, cc.stuFilter, cc.stuQuery, cc.marks, cc.stuStream, cc.stuWant, cc.stuDegree, cc.saved]);

  const eligCount = all.filter((c) => eligFor(c, cc.marks, cc.stuStream).rank === 0).length;

  function openEditor() {
    setMarksInput(cc.marks === null || cc.marks === undefined ? '' : String(cc.marks));
    setTownInput(cc.stuTown || '');
    setChips({ stream: cc.stuStream, want: cc.stuWant, degree: cc.stuDegree || ANY_DEGREE,
      stay: cc.stuStay, hostelType: cc.stuHostelType, travel: cc.stuTravel });
    setEditing(true);
  }

  function saveEditor() {
    const v = Number(marksInput);
    if (isNaN(v) || v < 30 || v > 100) return toast('Enter a percentage between 30 and 100');
    saveStudentDetails(v, chips.stream, {
      want: chips.want, degree: chips.degree, stay: chips.stay,
      hostelType: chips.hostelType, travel: chips.travel, town: townInput.trim(),
    });
    set({ stuWant: chips.want, stuDegree: chips.degree, stuStay: chips.stay,
          stuHostelType: chips.hostelType, stuTravel: chips.travel, stuTown: townInput.trim() });
    setEditing(false);
    toast('Saved — colleges sorted for your ' + v + '%');
  }

  function toggleSave(id) {
    const i = cc.saved.indexOf(id);
    const next = cc.saved.slice();
    if (i >= 0) next.splice(i, 1); else next.push(id);
    if (cc.user) { try { localStorage.setItem('cc_student_saved_v1:' + cc.user.email, JSON.stringify(next)); } catch (e) {} }
    set({ saved: next });
    toast(i >= 0 ? 'Removed from your saved colleges' : 'Saved — you will find it under "Saved"');
  }

  function onGridClick(e) {
    const open = e.target.closest('[data-stuopen]');
    if (open) { setProfileId(open.getAttribute('data-stuopen')); return; }
    const save = e.target.closest('[data-stusave]');
    if (save) toggleSave(save.getAttribute('data-stusave'));
  }

  const degrees = degreesFor(chips.want);
  const setChip = (k, v) => setChips((c) => ({ ...c, [k]: v, ...(k === 'want' ? { degree: ANY_DEGREE } : {}) }));

  if (profileId) {
    return <StudentProfile id={profileId} onBack={() => setProfileId(null)} />;
  }

  return (
    <section id="view-student" className="view active">
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
            <span className="avatar">{initials(cc.user?.name || 'SS')}</span>
            <span><b>{cc.user?.name}</b><em>{cc.user?.email}</em></span>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={onLogout}>Sign out</button>
        </div>
      </header>

      <div className="stu">
        <div className="stu__hero pop">
          <span className="pill pill--gold">Student</span>
          <div className="stu__hi">
            <h1>Hi {String(cc.user?.name || 'Student').split(/\s+/)[0]} 👋</h1>
            <p>Pick a college to see its courses, admission dates, campus events and official website — everything is in one place. For now the whole <b>PSG group in Coimbatore</b> is listed.</p>
          </div>

          <div className="stu__marks">
            {(cc.marks === null || cc.marks === undefined)
              ? <><b>Your Class 12 marks</b><span>Add your percentage — we will show the colleges that fit.</span>
                  <button className="btn btn--onDark btn--sm" onClick={openEditor}>Add my %</button></>
              : <><b>Your Class 12: {cc.marks}%</b>
                  <span>{cc.stuStream} · sorted for your marks{cc.stuWant && cc.stuWant !== NOT_SURE ? ' · ' + cc.stuWant : ''}</span>
                  <button className="btn btn--onDark btn--sm" onClick={openEditor}>Change</button></>}
          </div>

          <div className="stu__marks">
            <b>Your details</b><span>{stuPrefsLine()}</span>
          </div>

          {editing && (
            <div className="stu__edit">
              <div className="stu__editrow">
                <label htmlFor="stuMarksInput">Class 12 %</label>
                <input id="stuMarksInput" type="number" min="30" max="100" step="0.1" value={marksInput} onChange={(e) => setMarksInput(e.target.value)} />
                <span className="chips">{STREAMS.map((s) => <Chip key={s} on={chips.stream === s} onClick={() => setChip('stream', s)}>{s}</Chip>)}</span>
              </div>
              <div className="stu__editrow">
                <label>Course</label>
                <span className="chips">{WANT.map((s) => <Chip key={s} on={chips.want === s} onClick={() => setChip('want', s)}>{s}</Chip>)}</span>
              </div>
              {chips.want !== NOT_SURE && (
                <div className="stu__editrow">
                  <label>Degree</label>
                  <span className="chips">{degrees.map((d) => <Chip key={d} on={chips.degree === d} onClick={() => setChip('degree', d)}>{d}</Chip>)}</span>
                </div>
              )}
              <div className="stu__editrow">
                <label>Stay</label>
                <span className="chips">{STAY.map((s) => <Chip key={s} on={chips.stay === s} onClick={() => setChip('stay', s)}>{s}</Chip>)}
                  {chips.stay === 'Hostel needed' && HOSTELTYPE.map((s) => <Chip key={s} on={chips.hostelType === s} onClick={() => setChip('hostelType', s)}>{s}</Chip>)}
                </span>
                <label>Travel</label>
                <span className="chips">{TRAVEL.map((s) => <Chip key={s} on={chips.travel === s} onClick={() => setChip('travel', s)}>{s}</Chip>)}</span>
              </div>
              <div className="stu__editrow">
                <label htmlFor="stuTown">Town</label>
                <input id="stuTown" type="text" style={{ width: 150 }} placeholder="e.g. Tiruppur" value={townInput} onChange={(e) => setTownInput(e.target.value)} />
                <button className="btn btn--gold btn--sm" onClick={saveEditor}>Save</button>
                <button className="btn btn--ghost btn--sm" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="stu__stats">
            <div><b>{all.length}</b><span>PSG colleges</span></div>
            <div><b>{cc.saved.length}</b><span>Saved</span></div>
            <div><b>{nextAll ? fmtShort(nextAll.date) : '—'}</b><span>{nextAll ? nextAll.label : 'next date'}</span></div>
          </div>
        </div>

        <div className="stu__tools">
          <div className="searchbox">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></svg>
            <input id="stuSearch" type="search" placeholder="Search a college or course (e.g. arts, MBA, nursing)" value={cc.stuQuery}
              onChange={(e) => set({ stuQuery: e.target.value })} />
          </div>
          <div className="chips chips--filter">
            <Chip on={cc.stuFilter === 'all'} onClick={() => set({ stuFilter: 'all' })}>All PSG colleges <span className="cnt">{all.length}</span></Chip>
            <Chip on={cc.stuFilter === 'eligible'} onClick={() => set({ stuFilter: 'eligible' })}>Eligible for me <span className="cnt">{eligCount}</span></Chip>
            <Chip on={cc.stuFilter === 'saved'} onClick={() => set({ stuFilter: 'saved' })}>Saved <span className="cnt">{cc.saved.length}</span></Chip>
          </div>
        </div>

        <p className="stu__gridline" id="stuGridLine">
          {(cc.marks === null || cc.marks === undefined)
            ? 'All ' + all.length + ' PSG colleges · add your Class 12 % to see your fit'
            : 'Showing ' + visible.length + ' PSG college' + (visible.length === 1 ? '' : 's') +
              ' · sorted for your ' + cc.marks + '% · ' + cc.stuStream +
              (eligCount ? ' · ' + eligCount + ' match your marks' : '') +
              (cc.stuWant && cc.stuWant !== NOT_SURE ? ' · course: ' + cc.stuWant : '') +
              (cc.stuDegree && cc.stuDegree !== ANY_DEGREE ? ' · ' + cc.stuDegree : '')}
        </p>

        <div className="stu__grid" id="stuGrid" onClick={onGridClick}>
          {visible.length === 0 && (
            <div className="stu__empty">
              {cc.stuFilter === 'saved' && !cc.stuQuery
                ? <>Nothing saved yet — tap <b>Save</b> on a college to keep it here.</>
                : cc.stuFilter === 'eligible'
                  ? <>With {esc(cc.marks)}% no PSG college matches yet — tell us your marks again, or browse <b>All PSG colleges</b>.</>
                  : <>No college matches “{cc.stuQuery}”. Try another course or college name.</>}
            </div>
          )}
          {visible.map((c) => (
            <div key={c.id} dangerouslySetInnerHTML={{ __html: stuCardHTML(c) }} />
          ))}
        </div>

        <p className="stu__note">College suggestions are based on the marks you enter, sorted best-fit first. Cut-offs shown are <b>indicative sample values</b> for this demo — always confirm on the college's official site. PSGR Krishnammal and GCT join this student list next.</p>
      </div>
    </section>
  );
}

/* the student reads the same profile the college workspace publishes — with the
   real website opening inside the app */
export function StudentProfile({ id, onBack }) {
  const c = collegeById(id);
  return <CollegeBody college={c} studentMode onBack={onBack} />;
}
