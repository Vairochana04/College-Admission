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
  marks: 88, marks10: 92, stuPhy: 92, stuChem: 95, stuMath: 98, stuTown: 'Tiruppur',
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
import ProfilePage from './src/components/ProfilePage.jsx';
const profileHTML = clean(renderToString(React.createElement(ProfilePage)));
const college = collegeById('psg');
const body = clean(renderToString(React.createElement(CollegeBody, { college, studentMode: true, onBack: () => {} })));
console.log('\ncollege page — the flow the client asked for:');
const order = ['sec-about', 'sec-placements', 'sec-courses', 'sec-admissions', 'sec-fees', 'sec-counsel', 'sec-events', 'sec-location', 'sec-contact', 'sec-website'];
const seen = order.map((id) => ({ id, at: body.indexOf('id="' + id + '"') }));
check('all ten sections present', seen.every((x) => x.at >= 0));
check('sections are in flow order', seen.every((x, i, a) => i === 0 || a[i - 1].at < x.at));
check('About the college', body.includes('About the college'));
check('Placements & recruitment (+ recruiters)', body.includes('Placements &amp; recruitment') && body.includes('Recruiters'));
check('Branches, UG & PG courses', body.includes('Departments &amp; courses') || body.includes('Programmes offered'));
check('Management quota & fees', body.includes('Management quota') && body.includes('Fee structure'));
check('Counselling steps', body.includes('How your seat is decided'));
check('Location & map', body.includes('Where the campus is'));
check('college hero carries the student match score', body.includes('% match for you'));
check('college hero carries the distance from home', body.includes('50 km away from Tiruppur'));
check('Save + Official website controls', body.includes('Save college') || body.includes('Saved') || body.includes('sec-website'));


/* --------------------------------------------- 4. college page neatness pass */
console.log('\ncollege page — bugs that were on screen:');
check('no double-escaped "&amp;amp;" anywhere', !body.includes('&amp;amp;'));
check('travel note reads "city & route buses"', body.includes('city &amp; route buses') || body.includes('city & route buses'));
check('mode of selection matches the admissions block', body.includes('TNEA counselling + management ratio') || body.includes('TNEA counselling + management merit'));
const placementSlice = body.slice(body.indexOf('id="sec-placements"'), body.indexOf('id="sec-courses"'));
check('placements show placement figures, not students/faculty',
  /Placement rate/.test(placementSlice) && !/Faculty members/.test(placementSlice) && !/Students<\/span>/.test(placementSlice));
check('placements no longer repeat the About highlights', (body.match(/Placement-focused/g) || []).length === 1);
check('recruiter heading counts what the strip shows', body.includes('9 listed for PSG Tech'));
const contactSlice = body.slice(body.indexOf('id="sec-contact"'), body.indexOf('id="sec-website"'));
check('contact section uses both columns (FAQ inside the same grid)',
  /Reach the campus/.test(contactSlice) && /Help — quick answers/.test(contactSlice) && /class="contact"/.test(contactSlice));
check('Vision and Mission are split out', body.includes('vm__c') && body.includes('>Vision<') && body.includes('>Mission<'));
check('blue page class is applied by the college page', body.length > 0);


/* ------------------------------------------- 5. admission timeline neatness */
console.log('\nadmission timeline:');
const tlStart = body.indexOf('class="timeline"');
const tlSlice = body.slice(tlStart, body.indexOf('</article>', body.lastIndexOf('class="tl')));
const isoDates = [...body.matchAll(/class="tl__date" datetime="(\d{4}-\d{2}-\d{2})"/g)].map((m) => m[1]);
const sorted = isoDates.slice().sort();
check('renders one row per deadline', isoDates.length >= 5);
check('deadlines are in date order', JSON.stringify(isoDates) === JSON.stringify(sorted));
check('each row has a day/month/year tile', (body.match(/class="tl__date"/g) || []).length === isoDates.length
  && /<b>\d{2}<\/b><span>[A-Z]{3}<\/span><em>\d{4}<\/em>/.test(body));
check('exactly one "Next up" deadline', (body.match(/Next up · /g) || []).length === 1);
check('next row is highlighted', (body.match(/tl--next/g) || []).length === 1);
check('every row repeats the full date', (body.match(/class="tl__full"/g) || []).length === isoDates.length);
check('notes keep their own line', (body.match(/tl__body"><div class="tl__head">|<\/div><p>/g) || []).length >= 5);


/* ------------------------------------------- 6. home page: navy + deadlines */
console.log('\nstudent home — navy surface & deadlines:');
import fs from 'node:fs';
const css = fs.readFileSync('src/styles.css', 'utf8');
const rowCount = (student.match(/class="slide"/g) || []).length;
check('every college row carries a next-deadline pill', rowCount >= 5
  && (student.match(/class="datepill"/g) || []).length === rowCount);
check('rows no longer trail the date as plain text', !/· next \d/.test(student));
check('hero deadline stat is highlighted', student.includes('stu__stat--next'));
check('navy surface covers the home page', css.includes('body.cc-navy .topbar') && css.includes('body.cc-navy .searchbox')
  && css.includes('body.cc-navy .chips--filter .chip') && css.includes('body.cc-navy .sortsel'));
check('topbar + list type nudged up', css.includes('.slide__txt b{font-size:15.2px}') && css.includes('.stu__mail{font-size:13.4px}'));
check('college timeline type nudged up', css.includes('.tl__head b{font-size:15.4px}') && css.includes('.tl__body p{font-size:13.8px}'));


/* ---------------------------------------------- 7. TNEA cutoff calculator */
console.log('\nTNEA cutoff:');
check('home page asks for / shows the cutoff', student.includes('cutcard') && student.includes('Your TNEA cutoff'));
check('cutoff maths is right (98 + 92/2 + 95/2 = 191.5)', student.includes('191.5'));
check('the worked-out sum is shown', student.includes('Maths 98 + Physics 92/2 + Chemistry 95/2'));
check('college branch list gets the cutoff line', body.includes('cutline') && body.includes('191.5 / 200'));
const ugCount = college.departments.reduce((n, d) => n + d.courses.filter((x) => x.level === 'UG').length, 0);
check('every UG branch carries a chance badge (' + ugCount + ' programmes)',
  ugCount >= 5 && (body.match(/class="chance chance--/g) || []).length === ugCount);
check('chances use all three tones', body.includes('chance--high') && body.includes('chance--mid'));
check('badge explains itself on hover', /title="Last year this branch closed around \d/.test(body));
check('profile page carries the cutoff card', profileHTML.includes('Your TNEA cutoff'));

console.log(bad === 0 ? '\nALL CHECKS PASS' : `\n${bad} CHECK(S) FAILED`);
process.exitCode = bad === 0 ? 0 : 1;
