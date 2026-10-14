/* Render smoke test for the login view.
   ----------------------------------------------------------------
   The v2.34 wizard touched the biggest JSX file in the app, and a broken build
   can still compile happily - a missing button only shows up when the page is
   opened. This renders the real component (server-side) and asserts that the
   resting login page still has its pieces, and that the wizard only appears in
   create mode.

   Run it after a build:
       cd app
       node node_modules/vite/bin/vite.js build --ssr ssr-check.jsx --outDir .ssrcheck --emptyOutDir
       node .ssrcheck/ssr-check.js
   (vite externalises react, so the output runs straight from node)
*/
import React from 'react';
import { renderToString } from 'react-dom/server';
import Login from './src/components/Login.jsx';

const html = renderToString(React.createElement(Login));

const must = {
  'title "Student sign up / sign in"': html.includes('Student sign up / sign in'),
  'email field': html.includes('id="email"'),
  'password field': html.includes('id="password"'),
  '"Keep me signed in" row': html.includes('Keep me signed in'),
  '"Forgot password?" link': html.includes('Forgot password?'),
  'SIGN-IN BUTTON (#signInBtn)': html.includes('id="signInBtn"'),
  'button label "Sign in as Student"': html.includes('Sign in as Student'),
  'new-student switch': html.includes('Create an account'),
  'demo credentials box': html.includes('id="demoBox"'),
  'demo student row': html.includes('student@demo.edu'),
  'demo admin row': html.includes('admin@demo.edu'),
  'build tag': html.includes('build '),
  'chatbot bubble': html.includes('botfab'),
};

const must_not = {
  'wizard progress bar at rest': html.includes('wiz__seg'),
  'wizard step 1 visible at rest': html.includes('Step 1 of 3'),
  'step-1 field (name) visible at rest': html.includes('id="fullName"'),
  'step-2 field (marks) visible at rest': html.includes('id="marks"'),
};

let bad = 0;
console.log('resting login page — must be present:');
for (const [label, ok] of Object.entries(must)) {
  if (!ok) bad++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}`);
}
console.log('resting login page — must NOT be present:');
for (const [label, present] of Object.entries(must_not)) {
  if (present) bad++;
  console.log(`  ${present ? 'FAIL' : 'PASS'}  ${label}`);
}

console.log(`\nrendered html: ${html.length} chars`);
console.log(bad === 0 ? '\nALL CHECKS PASS' : `\n${bad} CHECK(S) FAILED`);
process.exitCode = bad === 0 ? 0 : 1;
