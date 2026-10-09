/* Login view — Student / College (Admin intentionally out of scope).
   The left brand panel is the converted shell markup; the card itself is a real
   React form with chip questions (marks, stream, course, degree, hostel, travel). */
import { useEffect, useMemo, useState } from 'react';
import LoginAside from '../gen/LoginAside.jsx';
import { cc, set, toast } from '../store.js';
import {
  STREAMS, WANT, STAY, HOSTELTYPE, TRAVEL, NOT_SURE, ANY_DEGREE, degreesFor,
  DEMO_CREDENTIALS, USERS, studentLookup, studentAccounts, storeSet, startStudentSession,
  GROUP_MARK, esc,
} from '../core.js';

const Chip = ({ on, children, ...rest }) => (
  <button type="button" className={'chip' + (on ? ' chip--on' : '')} aria-pressed={on} {...rest}>{children}</button>
);

export default function Login() {
  const [role, setRole] = useState('student');
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [marks, setMarks] = useState('');
  const [town, setTown] = useState('');
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

  async function collegeLogin() {
    if (!email || !pw) return setAlert('Please enter both your email and password.');
    /* the Java backend checks the credentials */
    try {
      const res = await fetch('/api/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password: pw }),
      });
      const data = await res.json();
      if (!data.ok) return setAlert(data.error || 'Incorrect email or password.');
      Object.assign(cc, {
        user: { email, role: 'college', name: data.name, title: data.title },
        collegeId: data.collegeId || 'psg', role: 'college', view: 'college',
      });
      set({}); toast('Signed in as ' + data.name);
      return;
    } catch (e) {
      /* server not running? fall back to the bundled demo list so the app still works */
      const u = USERS[email.trim().toLowerCase()];
      if (u && u.password === pw) {
        Object.assign(cc, { user: { email, role: 'college', name: u.name, title: u.title }, collegeId: u.collegeId, role: 'college', view: 'college' });
        set({}); toast('Signed in as ' + u.name);
        return;
      }
      return setAlert('Incorrect email or password. Try the demo credentials below, or tap "Use demo login".');
    }
  }

  function studentAuth() {
    const mail = email.trim().toLowerCase();
    if (create) {
      if (name.trim().length < 2) return setAlert('Please tell us your name — it shows on your workspace.');
      const m = Number(marks);
      if (!marks.trim() || isNaN(m) || m < 30 || m > 100)
        return setAlert('Please enter your Class 12 percentage (between 30 and 100).');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail))
        return setAlert('That email address does not look complete. Try again?');
      if (pw.length < 6) return setAlert('Please use at least 6 characters for your password.');
      if (studentLookup(mail)) {
        setAlert('An account with this email already exists — sign in instead.');
        setMode('signin');
        return;
      }
      const accounts = studentAccounts();
      accounts[mail] = {
        name: name.trim(), password: pw, marks: m, stream: chips.stream,
        want: chips.want, degree: chips.degree, stay: chips.stay,
        hostelType: chips.hostelType, travel: chips.travel, town: town.trim(),
        created: new Date().toISOString(),
      };
      storeSet('cc_students_v1', accounts);
      Object.assign(cc, { stuTown: town.trim(), stuWant: chips.want, stuDegree: chips.degree,
        stuStay: chips.stay, stuHostelType: chips.hostelType, stuTravel: chips.travel, stuStream: chips.stream });
      startStudentSession(mail, name.trim());
      set({ view: 'student' });
      toast('Account created — showing colleges that fit your ' + m + '%'
        + (chips.want !== NOT_SURE ? ' and your course choice.' : '.'));
      return;
    }
    const acc = studentLookup(mail);
    if (!acc || acc.password !== pw) {
      return setAlert(acc
        ? 'That password does not match. Try again, or tap "Forgot password?".'
        : 'No student account with this email yet. Tap "Create an account" to make one in a few seconds.');
    }
    startStudentSession(mail, acc.name, acc);
    set({ view: 'student' });
    toast('Signed in as ' + acc.name);
  }

  function submit(e) {
    e.preventDefault();
    setAlert('');
    if (role === 'student') studentAuth();
    else collegeLogin();
  }

  const hint = create
    ? 'Quick sign up: name, email, password — plus a few taps for your Class 12 marks, the course & degree you want, and whether you need hostel or bus.'
    : role === 'student'
      ? 'Just your name, an email and a password — that is all we ask for.'
      : '';

  return (
    <section id="view-login" className="view active">
      <div className="auth">
        <LoginAside />

        <main className="auth__panel">
          <form className="auth__form pop" id="loginForm" onSubmit={submit}>
            <h2 id="authTitle">{role === 'college' ? 'College sign in' : 'Student sign up / sign in'}</h2>
            <p className="sub" id="authSub">
              {role === 'college'
                ? 'Sign in to your college account to view and manage your public profile.'
                : 'Create your account with your Class 12 marks — the PSG colleges that fit you show up right away.'}
            </p>

            <div className="tabs" role="tablist" aria-label="Choose login role">
              <button type="button" className={'tab' + (role === 'student' ? ' active' : '')} aria-selected={role === 'student'} onClick={() => pickRole('student')}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></svg>
                Student
              </button>
              <button type="button" className={'tab' + (role === 'college' ? ' active' : '')} aria-selected={role === 'college'} onClick={() => pickRole('college')}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M4 21V9l8-5 8 5v12" /><path d="M9 21v-6h6v6" /></svg>
                College
              </button>
              <button type="button" className="tab" disabled>
                <span className="soon">soon</span>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 4v5c0 5-3.4 8.2-8 9-4.6-.8-8-4-8-9V7l8-4Z" /></svg>
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
                <input id="email" type="email" autoComplete="email" placeholder={role === 'college' ? 'you@yourcollege.ac.in' : 'you@example.com'} value={email} onChange={(e) => setEmail(e.target.value)} />
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

            <div className="row-between" style={{ marginTop: 14 }}>
              <label className="check"><input type="checkbox" defaultChecked /> Keep me signed in</label>
              <button type="button" className="link" onClick={() => setAlert('Demo app — use the demo credentials below, or create a new account in a few seconds.')}>Forgot password?</button>
            </div>

            <button type="button" className="btn btn--primary btn--block" id="signInBtn" style={{ marginTop: 16 }} onClick={submit}>
              {create ? 'Create my account' : role === 'college' ? 'Sign in as College' : 'Sign in as Student'}
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
              <div className="demo__head"><strong>Demo credentials</strong><span>or just create your own account</span></div>
              <div className="demo__row">
                <code>{DEMO_CREDENTIALS.student.email}<em>{DEMO_CREDENTIALS.student.password}</em></code>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setRole('student'); setMode('signin'); setEmail(DEMO_CREDENTIALS.student.email); setPw(DEMO_CREDENTIALS.student.password); }}>
                  Use demo login
                </button>
              </div>
              <div className="demo__row">
                <code>{DEMO_CREDENTIALS.college.email}<em>{DEMO_CREDENTIALS.college.password}</em></code>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setRole('college'); setMode('signin'); setEmail(DEMO_CREDENTIALS.college.email); setPw(DEMO_CREDENTIALS.college.password); }}>
                  Use demo login
                </button>
              </div>
            </div>

            <p className="legal">Demo accounts only · Data shown is sample data for illustration. Always confirm details on the college's official website.</p>
            <p className="legal" style={{ marginTop: 6 }}>Demo build v1.0 · React frontend + Java backend · Student accounts with marks, course, degree, hostel &amp; bus matching</p>
          </form>
        </main>
      </div>
    </section>
  );
}
