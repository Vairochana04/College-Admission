/* CampusConnect — React app shell.
   Views: login (front page) -> student workspace / platform admin workspace. */
import { useEffect, useState } from 'react';
import Login from './components/Login.jsx';
import CollegeView from './components/CollegeView.jsx';
import StudentView from './components/StudentView.jsx';
import AdminView from './components/AdminView.jsx';
import { cc, set, useCC, toast, toastListeners } from './store.js';
import { restoreStudentSession } from './core.js';
import { session } from './api.js';

export default function App() {
  useCC();
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    toastListeners.add(setToastMsg);
    /* students stay signed in on their device (storage may be blocked in a sandbox) */
    try { restoreStudentSession(); } catch (e) {}
    /* a platform admin stays signed in too, so a refresh keeps the dashboard */
    const s = session.get();
    if (s && s.role === 'admin') {
      Object.assign(cc, {
        user: { email: s.email, role: 'admin', name: s.name || 'Platform Admin', title: s.title || '' },
        role: 'admin', view: 'admin',
      });
      set({});
    }
    return () => toastListeners.delete(setToastMsg);
  }, []);

  /* the app follows the URL hash so a refresh keeps you where you were */
  useEffect(() => {
    const apply = () => {
      const h = window.location.hash.replace('#', '');
      if (!h) return;
      const [view, id] = h.split('/');
      if (view === 'college' || view === 'login' || view === 'student') set({ view });
      if (id) set({ collegeId: id });
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  function logout() {
    session.clear();
    try { localStorage.removeItem('cc_student_session_v1'); } catch (e) {}
    Object.assign(cc, { user: null, view: 'login', saved: [] });
    set({});
    toast('Signed out');
  }

  return (
    <>
      {cc.view === 'student' && <StudentView onLogout={logout} />}
      {cc.view === 'college' && <CollegeView onLogout={logout} />}
      {cc.view === 'admin' && <AdminView onLogout={logout} />}
      {cc.view !== 'student' && cc.view !== 'college' && cc.view !== 'admin' && <Login />}
      <div id="toast" role="status" aria-live="polite" className={toastMsg ? 'show' : ''}>
        <div className="t">{toastMsg}</div>
      </div>
    </>
  );
}
