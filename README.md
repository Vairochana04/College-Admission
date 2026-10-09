# CampusConnect — **Java backend + React frontend**

Iniki (05-10-2026) varaikkum panna full work — Python thookki, **Java (JDK only) + React (Vite)**
la thirumba kattirukken. MERN developer-ku theriyra maari structure, aana backend **Java** la.

```
CampusConnect_JavaReact_v1.0/
├── START-WINDOWS.bat        ← double-click: Java server start + browser varum
├── START-MAC-LINUX.sh       ← same, mac/linux
├── app/                     ← React frontend (Vite)
│   ├── index.html
│   ├── package.json               ("dev": vite, "build": vite build)
│   ├── vite.config.js             (/api + /site → Java server-ku proxy)
│   ├── public/media/              campus photos + college logos (12 colleges + PSG group mark)
│   ├── src/
│   │   ├── main.jsx · App.jsx     app shell, views: login → college / student
│   │   ├── store.js               chinna state store (React-ku)
│   │   ├── core.js                COLLEGES dataset + matching rules + section templates
│   │   ├── styles.css             original stylesheet
│   │   ├── components/            Login · CollegeView · CollegeBody · StudentView · SiteViewer
│   │   └── gen/                   brand panel / shell markup (converted from the single-file build)
│   └── dist/                      ← **ready-made production build** (Java idha serve pannum)
├── server/
│   ├── Server.java          ← the whole backend, single file, JDK only (no Maven, no Spring)
│   └── data/                colleges.json · users.json · demo-credentials.json
└── legacy/                  single-file build v0.10 + its python server (reference only)
```

---

## 1. Run panna (2 way)

### Way A — Java mattum (recommended) — React build ready-a irukku
```bash
# Windows
START-WINDOWS.bat          # illa:  cd server && java Server.java

# Mac / Linux
./START-MAC-LINUX.sh       # illa:  cd server && java Server.java
```
Browser → **http://localhost:8080**

Venndiyathu: **JDK 17+** mattum (`winget install Microsoft.OpenJDK.21`, illa adoptium.net).
Node / npm **theva illa** — dist/ la build already irukku.

### Way B — React-a edit panna (dev mode)
```bash
cd server && java Server.java        # terminal 1  (port 8080)
cd app && npm install && npm run dev # terminal 2  → http://localhost:5173
```
Vite, `/api/*` + `/site/*` requests-a Java server-ku (8080) proxy pannum — so hot reload work aagum.

Build pannanum-na: `cd app && npm run build` → `app/dist/` la pudhu build varum, Java adha serve pannum.

---

## 2. Java backend enna pannuthu (`server/Server.java`)

| Endpoint | Enna |
|---|---|
| `GET /` , `/assets/*`, `/media/*` | React build + media serve (SPA fallback: theriyadha path → index.html) |
| `GET /api/colleges` | College dataset JSON (`data/colleges.json`) |
| `POST /api/login` | Demo college / student sign-in → `{ok, role, name, title, collegeId}` |
| `GET /api/probe/<cid>` | Server-a andha college site reach pannuma? `{ok:true/false}` |
| `GET /site/<cid>/<path>` | **In-app website proxy** — college-oda *official* website-a naama server-la fetch panni, adhe origin-la serve panrom: links/styles/scripts rewrite + banner inject. So X-Frame-Options block / browser network restriction illaama, real site **app-ku ulla** load aagum. |

- 13 sites proxy la (PSG Tech, CAS, IMSR, IM, iTech, Polytechnic, Nursing, Pharmacy, Physiotherapy, IAS, PSGR, GCT + PSG CAS application portal).
- Cache 10 nimisham · `Cache-Control: no-store` (stale build illa).
- TLS: chinna legacy colleges (ex: psgtech.edu) old certificates use panranga — adhanaala proxy-ku relaxed trust manager (comment-la clear-a note pannirukken; strict venum-na andha 4 lines maathunga).
- Java-oda `HttpServer` + `HttpsURLConnection` mattum — **zero dependency**, Maven/Gradle illa.

---

## 3. React frontend enna pannuthu

- **`Login.jsx`** — Student / College tabs (Admin out of scope). Student create-account form la
  chips: Class 12 %, stream, **course**, **degree** (B.E. CSE, B.Pharm, B.Sc. Nursing…),
  **hostel** (boys/girls/any), **travel** (college bus / city bus / own / not needed), town.
  College login Java `/api/login` pokuthu (server illaama bundled demo list-a fallback).
- **`StudentView.jsx`** — hero (marks + details), inline editor, search + filters
  (All / Eligible for me / Saved), college grid **best-fit first**: marks rank → course → degree,
  hostel needed-na hostels first. Ovvoru card-um `Hostel: available · Bus: city & route buses`,
  `Runs B.E. Computer Science` tick, honest heads-ups ("check with the college", "own transport").
- **`CollegeBody.jsx`** — profile sections order: profile → departments & courses → admissions &
  dates → campus events → contact → **official website (LAST)**. Website button → `SiteViewer`.
- **`SiteViewer.jsx`** — official site-a iframe la (`/site/<cid>/…`), 12s watchdog → QR / new-tab handoff.
- **`core.js`** — college data + matching rules (indicative cut-offs) + section HTML builders,
  original single-file build-la irundhu extract pannadhu (same design, same content).

---

## 4. Test panna pannen (real Chromium, headless)

| Check | Result |
|---|---|
| Student create → dashboard (72% Biology + Pharmacy + B.Pharm) | 10 cards, best-fit sorted, `Runs B.Pharm` tick ✓ |
| Profile open → 6 sections | `sec-profile · sec-courses · sec-admissions · sec-events · sec-contact · sec-website` ✓ |
| Official website button | in-app viewer open, iframe `/site/psgpharma/` ✓ |
| College login (Java `/api/login`) → switcher → PSG Nursing | ✓ 12 colleges picker la |
| Java proxy: 13/13 sites | 200 + rewrite (PSG CAS 346 KB, GCT 245 KB, …) ✓ |
| Browser console errors | 0 ✓ |

Screenshots: `screenshots/r1_dashboard.png`, `r2_profile.png`, `r3_siteviewer.png`,
`r4_college.png`, `r5_switched.png`.

---

## 5. Constraints (neenga sonna padi — ellame innum follow aaguthu)

- Student + College login mattum; Admin out of scope.
- Official website **LAST section**, one tap, **app-ku ulla** (Java proxy).
- Campus picture + college logo every profile la; PSG group mark login + PSG profiles la.
- Events-ku dates irukku.
- PSG-branded institutions ellame cover (10 PSG group colleges student list la).
- "Other" nu edhuvum illa; Christ / Amrita removed; PSGR-ku PSG group chip illa (GRG Trust).
- Cut-offs "indicative sample values" — honest note UI la.

## 6. Aduthu panna (sollunga)

- React-la **TypeScript** version / oru `pom.xml` (Maven) venum-na add panren.
- "Only colleges that run my degree" filter button.
- Hostel + town base panni **bus route / hostel list**.
- College login-ku profile **edit** (iPpo read-only demo).

— Build marker: **v1.0 · React frontend + Java backend** (footer la theriyum)
