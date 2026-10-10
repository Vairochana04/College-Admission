/* Login view — the front page. Two ways in: Student and Platform admin.
   (College sign-in was removed from the front page on purpose; the college
   workspace code stays in the repo for the later leads / subscription work.)
   The student sign-up form keeps every college-matching question it always had
   (marks, stream, course, degree, hostel, travel, town) and adds a mobile
   number + a consent checkbox, because the platform admin's lead reports are
   built from exactly these details. Accounts are stored on the backend
   (server/data/students.json); without a server the app falls back to the
   device, so the demo never dead-ends. */
import { useEffect, useMemo, useState } from 'react';
import ChatBot from './ChatBot.jsx';
import LoginAside from '../gen/LoginAside.jsx';
import { cc, set, toast } from '../store.js';
import { api, session } from '../api.js';
import {
  STREAMS, WANT, STAY, HOSTELTYPE, TRAVEL, NOT_SURE, ANY_DEGREE, degreesFor,
  DEMO_CREDENTIALS, studentLookup, studentAccounts, storeSet, startStudentSession,
  GROUP_MARK,
} from '../core.js';

const Chip = ({ on, children, ...rest }) => (
  <button type="button" className={'chip' + (on ? ' chip--on' : '')} aria-pressed={on} {...rest}>{children}</button>
);

const MOBILE_RE = /^[0-9]{10}$/;
const MAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [role, setRole] = useState('student');
  const [mode, setMode] = useState('signin');
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [marks, setMarks] = useState('');
  const [town, setTown] = useState('');
  const [consent, setConsent] = useState(true);
  const [alert, setAlert] = useState('');
  const [chips, setChips] = useState({
    stream: 'Science – Maths', want: NOT_SURE, degree: ANY_DEGREE,
    stay: 'Hostel needed', hostelType: 'Any hostel', travel: 'College bus',
  });

  const create = mode === 'create' && role === 'student';
  const setChip = (k, v) => setChips((c) => {
    const next = { ...c, [k]: v };
    if (k === 'want') next.degree = ANY_DEGREE;
    return next;
  });
  const degrees = useMemo(() => degreesFor(chips.want), [chips.want]);

  useEffect(() => {
    const gl = document.getElementById('psgGroupLogo');
    if (gl && GROUP_MARK) gl.src = GROUP_MARK;
  }, []);

  function pickRole(r) {
    setRole(r); setMode('signin'); setAlert('');
  }

  /* ------------------------------------------------ student: create account */
  function validateCreate(mail) {
    if (name.trim().length < 2) return 'Please tell us your name — it shows on your workspace.';
    if (!MAIL_RE.test(mail)) return 'That email address does not look complete. Try again?';
    if (!MOBILE_RE.test(mobile.replace(/\D/g, '')))
      return 'Mobile number should be 10 digits — admission teams use it to reach you.';
    const m = Number(marks);
    if (!marks.trim() || isNaN(m) || m < 30 || m > 100)
      return 'Please enter your Class 12 percentage (between 30 and 100).';
    if (pw.length < 6) return 'Please use at least 6 characters for your password.';
    if (!consent) return 'Please tick the consent box so colleges can see your interest.';
    return null;
  }

  function enterStudent(account, accountEmail, fromServer) {
    Object.assign(cc, {
      user: { email: accountEmail, role: 'student', name: account.name, mobile: account.mobile || '', savedServer: !!fromServer },
      marks: Number(account.marks), stuStream: account.stream, stuWant: account.want,
      stuDegree: account.degree, stuStay: account.stay, stuHostelType: account.hostelType,
      stuTravel: account.travel, stuTown: account.town || '', role: 'student', view: 'student',
    });
    startStudentSession(accountEmail, account.name, account);
    set({});
  }

  async function createStudent() {
    const mail = email.trim().toLowerCase();
    const bad = validateCreate(mail);
    if (bad) return setAlert(bad);
    if (studentLookup(mail)) {
      setAlert('An account with this email already exists — sign in instead.');
      setMode('signin');
      return;
    }
    const payload = {
      name: name.trim(), email: mail, password: pw,
      mobile: mobile.replace(/\D/g, ''), marks: Number(marks),
      stream: chips.stream, want: chips.want, degree: chips.degree,
      stay: chips.stay, hostelType: chips.hostelType, travel: chips.travel,
      town: town.trim(), consent: consent,
    };
    setBusy(true);
    try {
      const data = await api.registerStudent(payload);
      session.set(data.token, { role: 'student', email: mail });
      enterStudent(data.student, mail, true);
      toast('Account created — showing colleges that fit your ' + Number(marks) + '%'
        + (chips.want !== NOT_SURE ? ' and your course choice.' : '.'));
    } catch (err) {
      if (err && err.status) {                       /* server answered: show why */
        setAlert(err.message);
      } else {                                       /* no server: keep the demo usable */
        const accounts = studentAccounts();
        accounts[mail] = { ...payload, password: pw, created: new Date().toISOString() };
        storeSet('cc_students_v1', accounts);
        enterStudent(payload, mail);
        toast('Account saved on this device — the server is not reachable right now.');
      }
    } finally {
      setBusy(false);
    }
  }

  /* ------------------------------------------------- student: sign in */
  async function studentSignIn() {
    const mail = email.trim().toLowerCase();
    if (!mail || !pw) return setAlert('Please enter both your email and password.');
    setBusy(true);
    try {
      const data = await api.login(mail, pw);
      if (data.role !== 'student') {
        setAlert('That account is not a student account. Use the Admin tab for admin sign-in.');
        return;
      }
      session.set(data.token, { role: 'student', email: mail });
      const acc = data.student || {};
      const complete = acc && acc.mobile && (acc.marks !== undefined && acc.marks !== null && acc.marks !== '');
      if (!complete) {
        /* first time here: ask for the details once, then save them on the server */
        Object.assign(cc, {
          user: { email: mail, role: 'student', name: acc.name || data.name || 'Student', mobile: acc.mobile || '' },
          marks: acc.marks ?? null, stuStream: acc.stream || cc.stuStream, stuWant: acc.want || cc.stuWant,
          stuDegree: acc.degree || null, stuStay: acc.stay || cc.stuStay,
          stuHostelType: acc.hostelType || cc.stuHostelType, stuTravel: acc.travel || cc.stuTravel,
          stuTown: acc.town || '', role: 'student', view: 'student', onboarding: true,
        });
        set({});
        toast('Welcome — fill your details once; we keep them on the server.');
        return;
      }
      enterStudent(acc, mail, true);
      toast('Signed in as ' + acc.name);
    } catch (err) {
      if (err && err.status) { setAlert(err.message); return; }
      /* server down → device accounts */
      const acc = studentLookup(mail);
      if (!acc || acc.password !== pw) {
        setAlert(acc
          ? 'That password does not match. Try again, or tap "Forgot password?".'
          : 'No student account with this email yet. Tap "Create an account" to make one in a few seconds.');
        return;
      }
      session.clear();
      enterStudent(acc, mail);
      toast('Signed in as ' + acc.name);
    } finally {
      setBusy(false);
    }
  }

  /* ------------------------------------------------- platform admin: sign in */
  async function adminSignIn() {
    const mail = email.trim().toLowerCase();
    if (!mail || !pw) return setAlert('Please enter both your email and password.');
    setBusy(true);
    try {
      const data = await api.login(mail, pw);
      if (data.role !== 'admin') {
        setAlert('That account is not an admin account.');
        return;
      }
      session.set(data.token, { role: 'admin', email: mail });
      Object.assign(cc, { user: { email: mail, role: 'admin', name: data.name, title: data.title }, role: 'admin', view: 'admin' });
      set({});
      toast('Signed in as ' + data.name);
    } catch (err) {
      if (err && err.status) { setAlert(err.message); return; }
      const d = DEMO_CREDENTIALS.admin;
      if (mail === d.email && pw === d.password) {
        session.clear();
        Object.assign(cc, { user: { email: mail, role: 'admin', name: 'Platform Admin', title: 'CampusConnect operations' }, role: 'admin', view: 'admin' });
        set({});
        toast('Signed in as Admin (server offline — showing what the dashboard reads).');
      } else {
        setAlert('Incorrect admin email or password. Use the demo credentials below.');
      }
    } finally {
      setBusy(false);
    }
  }

  function submit(e) {
    if (e && e.preventDefault) e.preventDefault();
    setAlert('');
    if (role === 'admin') return adminSignIn();
    if (create) return createStudent();
    return studentSignIn();
  }

  const hint = create
    ? 'Sign up with your name, email, mobile and Class 12 marks — plus a few taps for the course & degree you want, and whether you need hostel or bus. Colleges that fit you show up right away.'
    : role === 'student'
      ? 'Your email and password. New here? Create an account in a few seconds.'
      : 'Admin sign-in — the dashboard shows every student, their details and the colleges they explored.';

  return (
    <section id="view-login" className="view active">
      <div className="auth">
        <LoginAside />

        <main className="auth__panel">
          <form className="auth__form pop" id="loginForm" onSubmit={submit}>
            <h2 id="authTitle">{role === 'admin' ? 'Admin sign in' : 'Student sign up / sign in'}</h2>
            <p className="sub" id="authSub">
              {role === 'admin'
                ? 'Every student, their details, and the colleges they visited — in one dashboard.'
                : 'Create your account with your Class 12 marks — the PSG colleges that fit you show up right away.'}
            </p>

            <div className="tabs" role="tablist" aria-label="Choose login role">
              <button type="button" className={'tab' + (role === 'student' ? ' active' : '')} aria-selected={role === 'student'} onClick={() => pickRole('student')}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></svg>
                Student
              </button>
              <button type="button" className={'tab' + (role === 'admin' ? ' active' : '')} aria-selected={role === 'admin'} onClick={() => pickRole('admin')}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 4v5c0 5-3.4 8.2-8 9-4.6-.8-8-4-8-9V7l8-4Z" /><path d="m9 12 2 2 4-4" /></svg>
                Admin
              </button>
            </div>

            {hint && (
              <p className="auth__alert auth__alert--info" role="status" style={{ marginTop: 14 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
                <span>{hint}</span>
              </p>
            )}

            {alert && (
              <p className="auth__alert" id="authAlert" role="alert" style={{ marginTop: 14 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>
                <span>{alert}</span>
              </p>
            )}

            <div className="field" style={{ marginTop: 16 }}>
              <label htmlFor="email">Email address</label>
              <div className="field__box">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></svg>
                <input id="email" type="email" autoComplete="email" placeholder={role === 'admin' ? 'admin@yourplatform.com' : 'you@example.com'} value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            {create && (
              <>
                <div className="field" style={{ marginTop: 14 }}>
                  <label htmlFor="fullName">Your name</label>
                  <div className="field__box">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></svg>
                    <input id="fullName" type="text" autoComplete="name" placeholder="e.g. Aarav S." value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                </div>

                <div className="field" style={{ marginTop: 14 }}>
                  <label htmlFor="mobile">Mobile number</label>
                  <div className="field__box">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></svg>
                    <input id="mobile" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} placeholder="10-digit mobile, e.g. 9876543210" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} />
                  </div>
                  <span className="field__hint">Admission teams call this number about seats — only shared with colleges you show interest in, and only with your consent below.</span>
                </div>

                <div className="field" style={{ marginTop: 14 }} id="marksField">
                  <label htmlFor="marks">Class 12 percentage</label>
                  <div className="field__box">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19h16M7 16V9M12 16V5M17 16v-4" /></svg>
                    <input id="marks" type="number" min="30" max="100" step="0.1" inputMode="decimal" placeholder="e.g. 78" value={marks} onChange={(e) => setMarks(e.target.value)} />
                  </div>
                  <span className="field__hint">We use this only to show colleges that match your marks.</span>
                </div>

                <div className="field" style={{ marginTop: 14 }} id="streamField">
                  <label>Class 12 stream</label>
                  <div className="chips" role="radiogroup" aria-label="Class 12 stream">
                    {STREAMS.map((s) => <Chip key={s} on={chips.stream === s} onClick={() => setChip('stream', s)}>{s}</Chip>)}
                  </div>
                </div>

                <div className="field" style={{ marginTop: 14 }} id="wantField">
                  <label>Which course do you want?</label>
                  <div className="chips" role="radiogroup" aria-label="Course you want">
                    {WANT.map((s) => <Chip key={s} on={chips.want === s} onClick={() => setChip('want', s)}>{s}</Chip>)}
                  </div>
                </div>

                {chips.want !== NOT_SURE && (
                  <div className="field" style={{ marginTop: 14 }} id="degreeField">
                    <label>Which degree do you want?</label>
                    <div className="chips" role="radiogroup" aria-label="Degree you want">
                      {degrees.map((d) => <Chip key={d} on={chips.degree === d} onClick={() => setChip('degree', d)}>{d}</Chip>)}
                    </div>
                    <span className="field__hint">We tick the colleges that actually run this degree.</span>
                  </div>
                )}

                <div className="field" style={{ marginTop: 14 }} id="stayField">
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

                <div className="field" style={{ marginTop: 14 }} id="townField">
                  <label htmlFor="town">Your town / city <span style={{ fontWeight: 600, color: 'var(--muted)' }}>(optional)</span></label>
                  <div className="field__box">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></svg>
                    <input id="town" type="text" placeholder="e.g. Tiruppur — we use it for hostel &amp; bus tips" value={town} onChange={(e) => setTown(e.target.value)} />
                  </div>
                </div>
              </>
            )}

            <div className="field" style={{ marginTop: 14 }}>
              <label htmlFor="password">Password</label>
              <div className="field__box">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="10" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
                <input id="password" type="password" autoComplete={create ? 'new-password' : 'current-password'} placeholder={create ? 'Choose a password (6+ characters)' : 'Your password'} value={pw} onChange={(e) => setPw(e.target.value)} />
              </div>
            </div>

            {create && (
              <div className="field" style={{ marginTop: 14 }}>
                <label className="check" style={{ alignItems: 'flex-start', gap: 9 }}>
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 2 }} />
                  <span style={{ fontSize: 13.4, color: 'var(--muted)', lineHeight: 1.5 }}>
                    I agree that CampusConnect may store these details and show my interest
                    (colleges I view, save or apply to) to those colleges, so their admission
                    team can contact me. I can withdraw this any time from my workspace.
                  </span>
                </label>
              </div>
            )}

            <div className="row-between" style={{ marginTop: 14 }}>
              <label className="check"><input type="checkbox" defaultChecked /> Keep me signed in</label>
              <button type="button" className="link" onClick={() => setAlert('Demo app — use the demo credentials below, or create a new account in a few seconds.')}>Forgot password?</button>
            </div>

            <button type="button" className="btn btn--primary btn--block" id="signInBtn" style={{ marginTop: 16 }} disabled={busy} onClick={submit}>
              {busy ? 'One moment…' : create ? 'Create my account' : role === 'admin' ? 'Sign in as Admin' : 'Sign in as Student'}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13" /><path d="m12 5 7 7-7 7" /></svg>
            </button>

            {role === 'student' && (
              <p className="authswitch">
                <span>{create ? 'Already have an account?' : 'New student?'}</span>
                <button type="button" className="link" onClick={() => { setMode(create ? 'signin' : 'create'); setAlert(''); }}>
                  {create ? 'Sign in instead' : 'Create an account'}
                </button>
              </p>
            )}

            <div className="demo" id="demoBox">
              <div className="demo__head"><strong>Demo credentials</strong><span>{role === 'admin' ? 'admin access' : 'or just create your own account'}</span></div>
              <div className="demo__row">
                <code>{DEMO_CREDENTIALS.student.email}<em>{DEMO_CREDENTIALS.student.password}</em></code>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => { pickRole('student'); setEmail(DEMO_CREDENTIALS.student.email); setPw(DEMO_CREDENTIALS.student.password); }}>
                  Use demo login
                </button>
              </div>
              <div className="demo__row">
                <code>{DEMO_CREDENTIALS.admin.email}<em>{DEMO_CREDENTIALS.admin.password}</em></code>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => { pickRole('admin'); setEmail(DEMO_CREDENTIALS.admin.email); setPw(DEMO_CREDENTIALS.admin.password); }}>
                  Use demo login
                </button>
              </div>
            </div>

            <p className="legal">Demo accounts only · Data shown is sample data for illustration. Always confirm details on the college's official website.</p>
            <p className="legal" style={{ marginTop: 6 }}>Demo build v1.1 · Student accounts (name, email, mobile, marks, course, hostel &amp; bus) stored on the server · Admin dashboard with college-wise leads</p>
          </form>
        </main>
      </div>
    <ChatBot />
    </section>  );
}