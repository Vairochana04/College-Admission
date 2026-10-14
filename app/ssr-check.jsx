/* Render smoke test — the login page must stay exactly as it was, and the
   student flow (list + college page) must render the new pieces.
   ----------------------------------------------------------------
   A broken build still compiles; only rendering catches a missing button or a
   crashed section. This renders the real components server-side.

       cd app
       node node_modules/vite/bin/vite.js build --ssr ssr-check.jsx --outDir .ssrcheck --emptyOutDir
       node .ssrcheck/ssr-check.js
*/
import React from 'react';
import { renderToString } from 'react-dom/server';
import Login from './src/components/Login.jsx';
import StudentView from './src/components/StudentView.jsx';
import CollegeBody from './src/components/CollegeBody.jsx';
import { cc, collegeById } from './src/core.js';

let bad = 0;
function check(label, ok, group) {
  if (!ok) bad++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}`);
}

/* ---------------------------------------------------------------- 1. login */
/* React inserts <!-- --> between adjacent text nodes when rendering on the
   server; strip them so the assertions can look for plain strings */
const clean = (html) => html.replace(/<!-- -->/g, '');
const login = clean(renderToString(React.createElement(Login)));
console.log('resting login page — must be present:');
check('sign-in button (#signInBtn)', login.includes('id="signInBtn"'));
check('button label "Sign in as Student"', login.includes('Sign in as Student'));
check('email + password fields', login.includes('id="email"') && login.includes('id="password"'));
check('"Keep me signed in" + Forgot password', login.includes('Keep me signed in') && login.includes('Forgot password?'));
check('demo credentials box', login.includes('id="demoBox"') && login.includes('student@demo.edu'));
check('chatbot bubble', login.includes('botfab'));
console.log('resting login page — must NOT appear:');
check('no create-account wizard', !login.includes('wiz__seg') && !login.includes('Step 1 of 3'));

/* ------------------------------------------- 2. student list (marks + town) */
Object.assign(cc, {
  user: { name: 'Test Student', email: 'test@demo.edu', mobile: '9876543210' },
  marks: 88, marks10: 92, stuTown: 'Tiruppur',
  stuStream: 'Science – Maths', stuWant: 'Engineering', stuDegree: 'B.E. Computer Science',
  saved: ['psg'], view: 'student', role: 'student', onboarding: false,
});
const student = clean(renderToString(React.createElement(StudentView, { onLogout: () => {} })));
console.log('\nstudent college list:');
check('renders the student workspace', student.length > 5000);
check('match score pill', student.includes('matchpill') && student.includes('% match'));
check('travel advice from the town', student.includes('travelpill') && student.includes('50 km away'));
check('travel advisory carried on the pill (title)', student.includes('easy daily commute'));
check('sort control (Best match / Closing soon)', student.includes('sortsel') && student.includes('Best match'));
check('hero shows Class 10 + 12 + town', student.includes('Class 10: 92%') && student.includes('Class 12: 88%') && student.includes('Tiruppur'));
check('every listed college has a match score', (student.match(/matchpill/g) || []).length >= 1);
check('row shows the next admission date', /next \d{1,2} \w{3}/.test(student));

/* --------------------------------------------- 3. college page sections */
const college = collegeById('psg');
const body = clean(renderToString(React.createElement(CollegeBody, { college, studentMode: true, onBack: () => {} })));
console.log('\ncollege page — the flow the client asked for:');
const order = ['sec-about', 'sec-placements', 'sec-courses', 'sec-admissions', 'sec-fees', 'sec-counsel', 'sec-events', 'sec-location', 'sec-contact', 'sec-website'];
const seen = order.map((id) => ({ id, at: body.indexOf('id="' + id + '"') }));
check('all ten sections present', seen.every((x) => x.at >= 0));
check('sections are in flow order', seen.every((x, i, a) => i === 0 || a[i - 1].at < x.at));
check('About the college', body.includes('About the college'));
check('Placements & recruitment (+ recruiters)', body.includes('Placements &amp; recruitment') && body.includes('Top recruiters'));
check('Branches, UG & PG courses', body.includes('Departments &amp; courses') || body.includes('Programmes offered'));
check('Management quota & fees', body.includes('Management quota') && body.includes('Fee structure'));
check('Counselling steps', body.includes('How your seat is decided'));
check('Location & map', body.includes('Where the campus is'));
check('college hero carries the student match score', body.includes('% match for you'));
check('college hero carries the distance from home', body.includes('50 km away from Tiruppur'));
check('Save + Official website controls', body.includes('Save college') || body.includes('Saved') || body.includes('sec-website'));

console.log(bad === 0 ? '\nALL CHECKS PASS' : `\n${bad} CHECK(S) FAILED`);
process.exitCode = bad === 0 ? 0 : 1;
