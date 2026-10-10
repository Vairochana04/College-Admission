/* Student workspace — React owns the structure and state; the rich content of a
   college card / section comes from the shared template module (core.js).
   Colleges are sorted best-fit first for the student's marks, then floated up by
   their course + degree answers, with hostel / bus notes on every card. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { cc, set, toast, useCC } from '../store.js';
import {
  studentColleges, eligFor, fitScore, stuCardHTML, stuPrefsLine, initials,
  nextAdmissionDate, fmtShort, hayMatches, categoryOf, cityOf, esc,
  degreesFor, NOT_SURE, ANY_DEGREE, STREAMS, WANT, STAY, HOSTELTYPE, TRAVEL,
  collegeById, saveStudentDetails, logoOrMono, COLLEGES,
} from '../core.js';
import CollegeBody, { CcFoot } from './CollegeBody.jsx';
import ProfilePage from './ProfilePage.jsx';
import { api, session } from '../api.js';

const Chip = ({ on, children, ...rest }) => (
  <button type="button" className={'chip' + (on ? ' chip--on' : '')} aria-pressed={on} {...rest}>{children}</button>
);

export default function StudentView({ onLogout }) {
  useCC();
  const [editing, setEditing] = useState(false);
  const [marksInput, setMarksInput] = useState('');
  const [townInput, setTownInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [mobileInput, setMobileInput] = useState('');
  const photoRef = useRef(null);
  const [profileId, setProfileId] = useState(null);
  const [page, setPage] = useState('colleges');
  const [drill, setDrill] = useState(null);   /* 'psg-group' or a college id → its branches */
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
    setNameInput(cc.user?.name || '');
    setMobileInput(cc.user?.mobile || '');
    setChips({ stream: cc.stuStream, want: cc.stuWant, degree: cc.stuDegree || ANY_DEGREE,
      stay: cc.stuStay, hostelType: cc.stuHostelType, travel: cc.stuTravel });
    setEditing(true);
  }

  function saveEditor() {
    const v = Number(marksInput);
    if (isNaN(v) || v < 30 || v > 100) return toast('Enter a percentage between 30 and 100');
    if (nameInput.trim().length < 2) return toast('Please tell us your name');
    const mob = mobileInput.replace(/\D/g, '');
    if (mob && mob.length !== 10) return toast('Mobile number should be 10 digits');
    saveStudentDetails(v, chips.stream, {
      want: chips.want, degree: chips.degree, stay: chips.stay,
      hostelType: chips.hostelType, travel: chips.travel, town: townInput.trim(),
    });
    set({ stuWant: chips.want, stuDegree: chips.degree, stuStay: chips.stay,
          stuHostelType: chips.hostelType, stuTravel: chips.travel, stuTown: townInput.trim() });
    Object.assign(cc, { user: { ...cc.user, name: nameInput.trim(), mobile: mob } });
    api.updateStudent({
      name: nameInput.trim(), mobile: mob, marks: v, stream: chips.stream,
      want: chips.want, degree: chips.degree, stay: chips.stay,
      hostelType: chips.hostelType, travel: chips.travel, town: townInput.trim(),
    }).then((d) => {
      if (d && d.student) Object.assign(cc, { user: { ...cc.user, savedServer: true } });
      set({});
    }).catch(() => {});
    setEditing(false);
    toast('Saved — colleges sorted for your ' + v + '%');
  }

  /* a refresh restores the green tick by asking the server for our own record */
  useEffect(() => {
    if (!session.token()) return;
    api.me().then((d) => {
      if (d && d.student) {
        Object.assign(cc, { user: { ...cc.user, savedServer: true, mobile: d.student.mobile || cc.user?.mobile } });
        set({});
      }
    }).catch(() => {});
  }, []);

  /* tap the avatar: upload your own photo (downscaled, saved with your record) */
  function onPickPhoto(e) {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    if (!/^image\//.test(f.type)) return toast('Please choose an image file');
    if (f.size > 4 * 1024 * 1024) return toast('Image should be under 4 MB');
    const rd = new FileReader();
    rd.onload = () => {
      const img = new Image();
      img.onload = () => {
        const side = 160;
        const cv = document.createElement('canvas');
        cv.width = side; cv.height = side;
        const sq = Math.min(img.width, img.height);
        cv.getContext('2d').drawImage(img, (img.width - sq) / 2, (img.height - sq) / 2, sq, sq, 0, 0, side, side);
        const data = cv.toDataURL('image/jpeg', 0.82);
        Object.assign(cc, { user: { ...cc.user, photo: data } });
        set({});
        api.updateStudent({ photo: data }).then((d) => {
          if (d && d.student) Object.assign(cc, { user: { ...cc.user, savedServer: true } });
          set({});
          toast('Photo updated on your profile');
        }).catch(() => toast('Photo set on this device only (server not reachable)'));
      };
      img.src = rd.result;
    };
    rd.readAsDataURL(f);
  }

  function removePhoto() {
    Object.assign(cc, { user: { ...cc.user, photo: '' } });
    set({});
    api.updateStudent({ photo: '' }).catch(() => {});
    toast('Photo removed');
  }

  function toggleSave(id) {
    const i = cc.saved.indexOf(id);
    const next = cc.saved.slice();
    if (i >= 0) next.splice(i, 1); else next.push(id);
    if (cc.user) { try { localStorage.setItem('cc_student_saved_v1:' + cc.user.email, JSON.stringify(next)); } catch (e) {} }
    set({ saved: next });
    api.track(i >= 0 ? 'unsave' : 'save', id);
    toast(i >= 0 ? 'Removed from your saved colleges' : 'Saved — you will find it under "Saved"');
  }

  function onGridClick(e) {
    const open = e.target.closest('[data-stuopen]');
    if (open) {
      const id = open.getAttribute('data-stuopen');
      api.track('profile_view', id);
      setProfileId(id);
      return;
    }
    const save = e.target.closest('[data-stusave]');
    if (save) toggleSave(save.getAttribute('data-stusave'));
  }

  const degrees = degreesFor(chips.want);
  const setChip = (k, v) => setChips((c) => ({ ...c, [k]: v, ...(k === 'want' ? { degree: ANY_DEGREE } : {}) }));

  if (cc.onboarding) {
    return <DetailsOnboarding />;
  }

  const psgGroup = COLLEGES.filter((c) => c.group === 'PSG');
  const deptRow = (c, d) => (
    <button key={c.id + d.name} type="button" className="slide" onClick={() => setProfileId(c.id)}>
      <span className="slide__logo"><span className="mono mono--gold slide__mark">{d.name.split(/\s+/).map((w) => w[0]).join('').slice(0, 3).toUpperCase()}</span></span>
      <span className="slide__txt">
        <b>{d.name}</b>
        <span>{d.courses.length} programmes · {d.courses.filter((x) => x.level === 'UG').length} UG · {d.courses.filter((x) => x.level === 'PG').length} PG</span>
      </span>
      <span className="slide__go">Open ›</span>
    </button>
  );
  const collegeRow = (c) => (
    <button key={c.id} type="button" className="slide" onClick={() => setProfileId(c.id)}>
      <span className="slide__logo" dangerouslySetInnerHTML={{ __html: logoOrMono(c, 'slide__mark', '') }} />
      <span className="slide__txt">
        <b>{c.name}</b>
        <span>{c.city} · {c.type}</span>
      </span>
      <span className="slide__go">Open ›</span>
    </button>
  );

  /* front page shows names only: the search / filter chips narrow this linear list */
  const q = (cc.stuQuery || '').trim().toLowerCase();
  const filtering = q !== '' || cc.stuFilter !== 'all';
  const rowList = filtering
    ? COLLEGES.filter((c) => {
        if (q && (c.name + ' ' + c.shortName + ' ' + c.city).toLowerCase().indexOf(q) < 0) return false;
        if (cc.stuFilter === 'eligible') return eligFor(c).rank === 0;
        if (cc.stuFilter === 'saved') return cc.saved.indexOf(c.id) >= 0;
        return true;
      })
    : null;

  if (profileId) {
    return <div className="viewfade" key={'p' + profileId}><StudentProfile id={profileId} onBack={() => setProfileId(null)} /></div>;
  }

  /* one order for every college: home row → branches → college page */
  if (drill) {
    const isGroup = drill === 'psg-group';
    const dc = isGroup ? null : collegeById(drill);
    return (
      <section id="view-drill" className="view active viewfade" key={'d' + drill}>
        <div className="wrap" style={{ paddingTop: 18, paddingBottom: 46 }}>
          <button className="btn btn--ghost btn--sm" onClick={() => setDrill(null)}>← All colleges</button>
          <div className="crumbs">Colleges › <b>{isGroup ? 'PSG Institutions' : dc.shortName}</b></div>
          <h2 style={{ margin: '16px 0 4px', fontSize: 22 }}>{isGroup ? 'PSG Institutions' : dc.name}</h2>
          <p className="muted" style={{ margin: '0 0 14px', fontSize: 13.4 }}>
            {isGroup
              ? psgGroup.length + ' campuses in Coimbatore — touch a branch to open its full profile (branches & seats, admission, fees, events, location, contact).'
              : dc.departments.length + ' departments / branches — touch one to open the full profile with its courses, UG & PG seats, fees, location and contact.'}
          </p>
          <div className="slidehub"><div className="slidehub__track">
            {isGroup ? psgGroup.map(collegeRow) : dc.departments.map((d) => deptRow(dc, d))}
          </div></div>
        </div>
      </section>
    );
  }

  return (
    <section id="view-student" className="view active viewfade" key="home">
      <header className="topbar">
        <div className="wrap topbar__in">
          <div className="brand">
            <span className="brand__mark" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" /></svg>
            </span>
            <span>CampusConnect<small>Student workspace</small></span>
          </div>
          <nav className="topnav" aria-label="Student sections">
            <button type="button" className={'topnav__i' + (page === 'profile' ? ' on' : '')}
              onClick={() => { setProfileId(null); setPage('profile'); }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.6" /><path d="M5 19.4c1.4-3.4 4-5 7-5s5.6 1.6 7 5" /></svg>
              My Profile
            </button>
            <button type="button" className={'topnav__i' + (page === 'colleges' ? ' on' : '')}
              onClick={() => setPage('colleges')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.6" /><rect x="13" y="4" width="7" height="7" rx="1.6" /><rect x="4" y="13" width="7" height="7" rx="1.6" /><rect x="13" y="13" width="7" height="7" rx="1.6" /></svg>
              Colleges
            </button>
          </nav>
          <div className="topbar__spacer"></div>
          <div className="userchip">
            <span className="avatar">{initials(cc.user?.name || 'SS')}</span>
            <span><b>{cc.user?.name}</b><em>{cc.user?.email}</em></span>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={onLogout}>Sign out</button>
        </div>
      </header>

          {page === 'colleges' ? (
            <>
          {editing && (
            <div className="modal" role="dialog" aria-modal="true" aria-label="Edit your details"
              onClick={(e) => { if (e.target === e.currentTarget) setEditing(false); }}>
              <div className="modal__card pop">
                <div className="modal__head">
                  <h3>Profile photo</h3>
                  <button className="modal__x" type="button" onClick={() => setEditing(false)} aria-label="Close">&times;</button>
                </div>
                <div className="stu__edit stu__edit--modal">
                  <div className="stu__editrow">
                    <label>Photo</label>
                    {cc.user?.photo
                      ? <img className="avatar" src={cc.user.photo} alt="Your profile photo" />
                      : <span className="avatar">{initials(cc.user?.name || 'SS')}</span>}
                    <button className="btn btn--ghost btn--sm" type="button"
                      onClick={() => photoRef.current && photoRef.current.click()}>Upload photo</button>
                    {cc.user?.photo && (
                      <button className="btn btn--ghost btn--sm" type="button" onClick={removePhoto}>Remove photo</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        <div className="stu__head pop">
          <div className="stu__id">
            <div className="stu__pic">
              <button className="stu__pic-btn" type="button" title="Edit your details" aria-label="Edit your details"
                onClick={openEditor}>
                {cc.user?.photo
                  ? <img className="avatar avatar--xl" src={cc.user.photo} alt="Your profile photo" />
                  : <span className="avatar avatar--xl">{initials(cc.user?.name || 'SS')}</span>}
              </button>
              <button className="stu__pic-edit" type="button" onClick={openEditor} title="Edit your details" aria-label="Edit your details">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20l4.5-.9L19.6 8a2.1 2.1 0 0 0-3-3L5.5 16.1Z" /><path d="m14.5 6.5 3 3" /></svg>
              </button>
              {cc.user?.savedServer && (
                <span className="stu__tick" title="All done — profile saved on server" aria-label="All done, profile saved on server">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7" /></svg>
                </span>
              )}
              <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onPickPhoto} />
            </div>
            <div className="stu__hello">
              <h1>Hi {String(cc.user?.name || 'Student').split(/\s+/)[0]} 👋</h1>
              <p className="stu__welcome">CampusConnect welcomes you — choose your college and shine your future.</p>
              <p className="stu__mail">
                {cc.user?.mobile ? cc.user.mobile + ' · ' : ''}Class 12: {cc.marks === null || cc.marks === undefined ? '—' : cc.marks + '%'}
                {cc.user?.savedServer ? ' · all done ✓ saved on server' : ''}
              </p>
            </div>
          </div>

          <div className="stu__stats">
            <div><b>{all.length}</b><span>Colleges for you</span></div>
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
            <Chip on={cc.stuFilter === 'all'} onClick={() => set({ stuFilter: 'all' })}>All colleges <span className="cnt">{all.length}</span></Chip>
            <Chip on={cc.stuFilter === 'eligible'} onClick={() => set({ stuFilter: 'eligible' })}>Eligible for me <span className="cnt">{eligCount}</span></Chip>
            <Chip on={cc.stuFilter === 'saved'} onClick={() => set({ stuFilter: 'saved' })}>Saved <span className="cnt">{cc.saved.length}</span></Chip>
          </div>
        </div>

        <div className="slidehub" aria-label="Colleges — linear list">
          <div className="slidehub__track">
            {filtering ? (
              rowList.length === 0
                ? <div className="empty"><b>No colleges match</b>
                    <p>Try another name, or clear the search / filter.</p>
                    <button className="btn btn--gold btn--sm" type="button" onClick={() => set({ stuQuery: '', stuFilter: 'all' })}>Clear search &amp; filters</button>
                  </div>
                : rowList.map(collegeRow)
            ) : (
              <>
                <button type="button" className="slide slide--group" onClick={() => setDrill('psg-group')}>
                  <span className="slide__logo"><span className="mono mono--gold slide__mark">PSG</span></span>
                  <span className="slide__txt">
                    <b>PSG Institutions</b>
                    <span>{psgGroup.length} campuses in Coimbatore · engineering to medicine</span>
                  </span>
                  <span className="slide__go">Branches ›</span>
                </button>
                {COLLEGES.filter((c) => c.group !== 'PSG').map((c) => (
                  <button key={c.id} type="button" className="slide" onClick={() => setDrill(c.id)}>
                    <span className="slide__logo" dangerouslySetInnerHTML={{ __html: logoOrMono(c, 'slide__mark', '') }} />
                    <span className="slide__txt">
                      <b>{c.name}</b>
                      <span>{c.city} · {c.type}</span>
                    </span>
                    <span className="slide__go">Branches ›</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        <p className="stu__gridline" id="stuGridLine">
          {(cc.marks === null || cc.marks === undefined)
            ? 'All ' + all.length + ' colleges · add your Class 12 % to see your fit'
            : 'Showing ' + visible.length + ' college' + (visible.length === 1 ? '' : 's') +
              ' · sorted for your ' + cc.marks + '% · ' + cc.stuStream +
              (eligCount ? ' · ' + eligCount + ' match your marks' : '') +
              (cc.stuWant && cc.stuWant !== NOT_SURE ? ' · course: ' + cc.stuWant : '') +
              (cc.stuDegree && cc.stuDegree !== ANY_DEGREE ? ' · ' + cc.stuDegree : '')}
        </p>

        <CcFoot />

            </>
          ) : (
            <ProfilePage />
          )}
    </section>
  );
}

/* the student reads the same profile the college workspace publishes — with the
   real website opening inside the app */
export function StudentProfile({ id, onBack }) {
  const c = collegeById(id);
  return <CollegeBody college={c} studentMode onBack={onBack} />;
}


/* First-time details screen. What the student fills here is saved on the server
   (server/data/students.json via POST /api/students/update), and the college
   list below is matched from exactly these details. */
function DetailsOnboarding() {
  useCC();
  const [name, setName] = useState(cc.user?.name || '');
  const [mobile, setMobile] = useState(cc.user?.mobile || '');
  const [marks, setMarks] = useState(cc.marks === null || cc.marks === undefined ? '' : String(cc.marks));
  const [town, setTown] = useState(cc.stuTown || '');
  const [consent, setConsent] = useState(true);
  const [alert, setAlert] = useState('');
  const [busy, setBusy] = useState(false);
  const [chips, setChips] = useState({
    stream: cc.stuStream, want: cc.stuWant, degree: cc.stuDegree || ANY_DEGREE,
    stay: cc.stuStay, hostelType: cc.stuHostelType, travel: cc.stuTravel,
  });
  const degrees = degreesFor(chips.want);
  const setChip = (k, v) => setChips((c) => ({ ...c, [k]: v, ...(k === 'want' ? { degree: ANY_DEGREE } : {}) }));

  async function save() {
    if (name.trim().length < 2) return setAlert('Please tell us your name — it shows on your workspace.');
    if (!/^[0-9]{10}$/.test(mobile)) return setAlert('Mobile number should be 10 digits.');
    const m = Number(marks);
    if (!marks || isNaN(m) || m < 30 || m > 100)
      return setAlert('Please enter your Class 12 percentage (between 30 and 100).');
    setBusy(true);
    try {
      const data = await api.updateStudent({
        name: name.trim(), mobile, marks: m, stream: chips.stream, want: chips.want,
        degree: chips.degree, stay: chips.stay, hostelType: chips.hostelType,
        travel: chips.travel, town: town.trim(), consent,
      });
      const s = data.student || {};
      Object.assign(cc, {
        user: { ...cc.user, name: s.name || name.trim(), mobile: s.mobile || mobile, savedServer: true },
        marks: m, stuStream: chips.stream, stuWant: chips.want, stuDegree: chips.degree,
        stuStay: chips.stay, stuHostelType: chips.hostelType, stuTravel: chips.travel,
        stuTown: town.trim(), onboarding: false,
      });
      set({});
      toast('Saved on the server — here are the colleges that fit your ' + m + '%');
    } catch (e) {
      setAlert(e.message || 'Could not save right now. Try again?');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="view-onboarding" className="view active">
      <div className="wrap" style={{ maxWidth: 760, paddingTop: 34, paddingBottom: 60 }}>
        <div className="card">
          <h2 style={{ margin: '0 0 6px', fontSize: 24, letterSpacing: '-.4px' }}>Your details, once</h2>
          <p style={{ margin: '0 0 18px', color: 'var(--muted)', fontSize: 14.2 }}>
            Saved on the server (not just this browser), so your profile follows you and the
            colleges that fit you pop up straight away.
          </p>

          {alert && (
            <p className="auth__alert" role="alert" style={{ marginBottom: 14 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>
              <span>{alert}</span>
            </p>
          )}

          <div className="field">
            <label htmlFor="obName">Your name</label>
            <div className="field__box">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></svg>
              <input id="obName" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="obMobile">Mobile number</label>
            <div className="field__box">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></svg>
              <input id="obMobile" type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="obMarks">Class 12 percentage</label>
            <div className="field__box">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19h16M7 16V9M12 16V5M17 16v-4" /></svg>
              <input id="obMarks" type="number" min="30" max="100" step="0.1" inputMode="decimal" placeholder="e.g. 78" value={marks} onChange={(e) => setMarks(e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label>Class 12 stream</label>
            <div className="chips" role="radiogroup" aria-label="Class 12 stream">
              {STREAMS.map((s) => <Chip key={s} on={chips.stream === s} onClick={() => setChip('stream', s)}>{s}</Chip>)}
            </div>
          </div>

          <div className="field">
            <label>Which course do you want?</label>
            <div className="chips" role="radiogroup" aria-label="Course you want">
              {WANT.map((s) => <Chip key={s} on={chips.want === s} onClick={() => setChip('want', s)}>{s}</Chip>)}
            </div>
          </div>

          {chips.want !== NOT_SURE && (
            <div className="field">
              <label>Which degree do you want?</label>
              <div className="chips" role="radiogroup" aria-label="Degree you want">
                {degrees.map((d) => <Chip key={d} on={chips.degree === d} onClick={() => setChip('degree', d)}>{d}</Chip>)}
              </div>
            </div>
          )}

          <div className="field">
            <label>Stay &amp; travel</label>
            <div className="sublab">Hostel</div>
            <div className="chips" role="radiogroup" aria-label="Hostel">
              {STAY.map((s) => <Chip key={s} on={chips.stay === s} onClick={() => setChip('stay', s)}>{s}</Chip>)}
            </div>
            {chips.stay === 'Hostel needed' && (
              <div className="chips" style={{ marginTop: 8 }} role="radiogroup" aria-label="Hostel type">
                {HOSTELTYPE.map((s) => <Chip key={s} on={chips.hostelType === s} onClick={() => setChip('hostelType', s)}>{s}</Chip>)}
              </div>
            )}
            <div className="sublab">Daily travel</div>
            <div className="chips" role="radiogroup" aria-label="Daily travel">
              {TRAVEL.map((s) => <Chip key={s} on={chips.travel === s} onClick={() => setChip('travel', s)}>{s}</Chip>)}
            </div>
          </div>

          <div className="field">
            <label htmlFor="obTown">Your town / city <span style={{ fontWeight: 600, color: 'var(--muted)' }}>(optional)</span></label>
            <div className="field__box">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></svg>
              <input id="obTown" type="text" placeholder="e.g. Tiruppur" value={town} onChange={(e) => setTown(e.target.value)} />
            </div>
          </div>

          <label className="check" style={{ alignItems: 'flex-start', gap: 9, marginBottom: 16 }}>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 2 }} />
            <span style={{ fontSize: 13.4, color: 'var(--muted)', lineHeight: 1.5 }}>
              Colleges I show interest in may see these details and contact me about admissions.
            </span>
          </label>

          <button className="btn btn--primary btn--block" disabled={busy} onClick={save}>
            {busy ? 'Saving…' : 'Save my details & show my colleges'}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13" /><path d="m12 5 7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
