/* =============================================================================
   CampusConnect — core domain module (generated from the single-file build v0.10)
   -----------------------------------------------------------------------------
   Holds:  the college dataset, the marks / course / degree matching rules,
           student-account storage helpers, date helpers and the content
           template functions that render each profile section.
   The React components import from here; `cc` is the live state mirror that the
   components write to before the templates are rendered.
   ============================================================================= */

export const MEDIA = {
  "psg": {
    "photo": "media/psg-photo.jpg",
    "logo": "media/psg-logo.jpg",
    "gallery": [
      "media/psg-admission-2026.png",
      "media/psg-kriya-2026.png",
      "media/psg-ai-workshop.png",
      "media/psg-alumni-meet.png",
      "media/psg-trophy-ball-badminton.png",
      "media/psg-ball-badminton-girls.png"
    ],
    "eventGallery": [
      "media/psg-event-gallery-1.jpg",
      "media/psg-event-gallery-2.jpg"
    ]
  },
  "psgcas": {
    "photo": "media/psgcas-photo.jpg",
    "logo": "media/psgcas-logo.jpg"
  },
  "psgimsr": {
    "photo": "media/psgimsr-photo.jpg",
    "logo": "media/psgimsr-logo.jpg"
  },
  "psgim": {
    "photo": "media/psgim-photo.jpg",
    "logo": "media/psgim-logo.jpg"
  },
  "psgitech": {
    "photo": "media/psgitech-photo.jpg",
    "logo": "media/psgitech-logo.jpg"
  },
  "psgpoly": {
    "photo": "media/psgpoly-photo.jpg",
    "logo": "media/psgpoly-logo.png"
  },
  "psgnursing": {
    "photo": "media/psgnursing-photo.jpg",
    "logo": "media/psgnursing-logo.jpg"
  },
  "psgpharma": {
    "photo": "media/psgpharma-photo.jpg",
    "logo": "media/psgpharma-logo.jpg"
  },
  "psgphysio": {
    "photo": "media/psgphysio-photo.jpg",
    "logo": "media/psgphysio-logo.jpg"
  },
  "psgias": {
    "photo": "media/psgias-photo.jpg",
    "logo": "media/psgias-logo.jpg"
  },
  "psgr": {
    "photo": "media/psgr-photo.jpg",
    "logo": "media/psgr-logo.jpg"
  },
  "gct": {
    "photo": "media/gct-photo.jpg",
    "logo": "media/gct-logo.jpg"
  }
};
export const GROUP_MARK = "media/psg-group.png";

export const cc = {
  role: 'college', view: 'login', collegeId: 'psg', authMode: 'signin',
  user: null, marks: null, stuStream: 'Science – Maths', stuWant: 'Not sure yet',
  stuDegree: null, stuStay: 'Hostel needed', stuHostelType: 'Any hostel',
  stuTravel: 'College bus', stuTown: '', saved: [], stuQuery: '', stuFilter: 'all',
  courseLevel: 'All', courseQuery: '', eventTag: 'All', proxyOk: {}
};


/* ---- data: ICONS ---- */
var ICONS = {
  check:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>',
  pin:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>',
  clock:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></svg>',
  cal:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="3"/><path d="M8 3v3M16 3v3M3 10h18"/></svg>',
  globe:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3.5 9h17M3.5 15h17M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>',
  link:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/></svg>',
  phone:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"/></svg>',
  mail:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="m3 7 9 6 9-6"/></svg>',
  users:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.4 3-5.2 6.5-5.2s6.5 1.8 6.5 5.2"/><path d="M17 5.5a3 3 0 0 1 0 6M18.5 20c0-2.2-.7-3.8-2-4.8 3 .2 5 1.9 5 4.8"/></svg>',
  brief:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7.5" width="18" height="12" rx="3"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3 12.5h18"/></svg>',
  lab:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v6.5L4.6 17A2.4 2.4 0 0 0 6.8 20.5h10.4A2.4 2.4 0 0 0 19.4 17L15 9.5V3"/><path d="M8 3h8M7.5 14h9"/></svg>',
  award:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5.2"/><path d="m8.5 13.5-1 8 4.5-2.4 4.5 2.4-1-8"/></svg>',
  book:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z"/><path d="M8 7.5h8M8 11h6"/></svg>',
  leaf:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4c-9 0-14 4-14 10a6 6 0 0 0 6 6c6 0 8-6 8-16Z"/><path d="M6 20c2-5 5-8 10-10"/></svg>',
  star:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3.5 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 10l6.1-.9Z"/></svg>',
  home:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/></svg>'
}


/* ---- data: COLLEGES ---- */
var COLLEGES = [
  /* ===================================================================
     PSG GROUP — PSG & Sons' Charities, Coimbatore
     (institutions and official websites as listed by the trust)
     =================================================================== */
  {
    id:'psg', group:'PSG',
    name:'PSG College of Technology',
    shortName:'PSG Tech',
    mono:'PSG',
    tagline:'Government-aided, autonomous engineering college in Peelamedu — the flagship institution of PSG & Sons\u2019 Charities.',
    type:'Government-aided · Autonomous',
    affiliation:'Affiliated to Anna University',
    estd:1951,
    naac:'NAAC A',
    nirfBadge:'NIRF-ranked (Engineering)',
    city:'Coimbatore', state:'Tamil Nadu',
    address:'Post Box No. 1611, Avinashi Road, Peelamedu, Coimbatore \u2013 641 004',
    website:'https://www.psgtech.edu',
        admissionsUrl:'https://www.psgtech.edu',
    phone:'+91 422 257 2177',
    email:'admissions@psgtech.ac.in',
    officeHours:'Mon \u2013 Fri · 9:00 AM \u2013 5:00 PM',
    about:[
      'PSG College of Technology was started in 1951 by PSG & Sons\u2019 Charities, the same trust that began the PSG Industrial Institute in 1926. It is a government-aided, autonomous engineering college affiliated to Anna University, and it has grown into one of the best-known technical institutions in Tamil Nadu.',
      'Teaching is built around industry-institute interaction: centres of excellence set up with industry partners, mandatory internship and project semesters, and the PSG Science & Technology Entrepreneurial Park (STEP, 1998) inside the campus to support student start-ups.'
    ],
    stats:[
      {v:'8,500+', k:'Students'},
      {v:'450+', k:'Faculty members'},
      {v:'96%', k:'Placement rate'},
      {v:'45 acres', k:'Campus'}
    ],
    highlights:[
      {icon:'brief', title:'Placement-focused', text:'A dedicated placement cell with recruiters visiting across UG and PG programmes.'},
      {icon:'lab', title:'Industry-linked labs', text:'Centres of excellence created with industry partners, plus a full workshop complex.'},
      {icon:'star', title:'STEP incubator', text:'PSG-STEP inside campus supports technology start-ups and student entrepreneurs.'},
      {icon:'users', title:'Strong alumni network', text:'An active alumni body mentoring students and opening internship doors.'}
    ],
    recruiters:['Bosch','Caterpillar','TCS','Zoho','Deloitte','L&T','Qualcomm','Infosys','Hyundai'],
    facilities:['Central library','Boys & girls hostels','Sports complex','Medical centre','PSG-STEP incubation centre','Wi-Fi campus'],
    departments:[
      {name:'Computer Science & Engineering', icon:'lab', blurb:'Core computing with specialisations in data science, cyber security and AI/ML.',
        courses:[
          {name:'B.E. Computer Science & Engineering', level:'UG', duration:'4 years', seats:'180 seats', eligibility:'10+2 with Physics, Chemistry & Mathematics · TNEA counselling'},
          {name:'B.Tech Information Technology', level:'UG', duration:'4 years', seats:'120 seats', eligibility:'10+2 with PCM · TNEA counselling'},
          {name:'M.E. Computer Science & Engineering', level:'PG', duration:'2 years', seats:'18 seats', eligibility:'B.E./B.Tech in CSE/IT or equivalent'},
          {name:'M.Tech Data Science & Analytics', level:'PG', duration:'2 years', seats:'18 seats', eligibility:'B.E./B.Tech any branch with maths background'}
        ]},
      {name:'Electronics & Communication Engineering', icon:'lab', blurb:'VLSI, embedded systems and communication research with sponsored labs.',
        courses:[
          {name:'B.E. Electronics & Communication Engineering', level:'UG', duration:'4 years', seats:'180 seats', eligibility:'10+2 with PCM · TNEA counselling'},
          {name:'M.E. VLSI Design', level:'PG', duration:'2 years', seats:'18 seats', eligibility:'B.E./B.Tech in ECE/EEE or related branch'},
          {name:'M.Tech Communication Systems', level:'PG', duration:'2 years', seats:'18 seats', eligibility:'B.E./B.Tech in ECE or equivalent'}
        ]},
      {name:'Mechanical Engineering', icon:'brief', blurb:'The founding department \u2014 manufacturing, CAD/CAM, thermal and industrial engineering.',
        courses:[
          {name:'B.E. Mechanical Engineering', level:'UG', duration:'4 years', seats:'180 seats', eligibility:'10+2 with PCM · TNEA counselling'},
          {name:'B.E. Robotics & Automation', level:'UG', duration:'4 years', seats:'60 seats', eligibility:'10+2 with PCM · TNEA counselling'},
          {name:'M.E. CAD / CAM', level:'PG', duration:'2 years', seats:'18 seats', eligibility:'B.E./B.Tech in Mechanical or Production'},
          {name:'M.E. Industrial Engineering', level:'PG', duration:'2 years', seats:'18 seats', eligibility:'B.E./B.Tech in any engineering branch'}
        ]},
      {name:'Electrical & Electronics Engineering', icon:'lab', blurb:'Power systems, drives and control with machines and simulation laboratories.',
        courses:[
          {name:'B.E. Electrical & Electronics Engineering', level:'UG', duration:'4 years', seats:'120 seats', eligibility:'10+2 with PCM · TNEA counselling'},
          {name:'M.E. Power Electronics & Drives', level:'PG', duration:'2 years', seats:'18 seats', eligibility:'B.E./B.Tech in EEE or equivalent'},
          {name:'M.E. Control & Instrumentation', level:'PG', duration:'2 years', seats:'18 seats', eligibility:'B.E./B.Tech in EEE/ECE/Instrumentation'}
        ]},
      {name:'Civil Engineering', icon:'home', blurb:'Structural, environmental and construction management streams with field training.',
        courses:[
          {name:'B.E. Civil Engineering', level:'UG', duration:'4 years', seats:'120 seats', eligibility:'10+2 with PCM · TNEA counselling'},
          {name:'M.E. Structural Engineering', level:'PG', duration:'2 years', seats:'18 seats', eligibility:'B.E./B.Tech in Civil Engineering'},
          {name:'M.Tech Environmental Engineering', level:'PG', duration:'2 years', seats:'18 seats', eligibility:'B.E./B.Tech Civil / Chemical / Environmental'}
        ]},
      {name:'Biotechnology & Textile Technology', icon:'leaf', blurb:'Two of the oldest specialised departments, with pilot plants and testing facilities.',
        courses:[
          {name:'B.Tech Biotechnology', level:'UG', duration:'4 years', seats:'60 seats', eligibility:'10+2 with Physics, Chemistry, Biology / Maths'},
          {name:'B.Tech Textile Technology', level:'UG', duration:'4 years', seats:'60 seats', eligibility:'10+2 with PCM · TNEA counselling'},
          {name:'M.Tech Bioprocess Engineering', level:'PG', duration:'2 years', seats:'18 seats', eligibility:'B.E./B.Tech Biotechnology or allied branch'}
        ]},
      {name:'Management Studies', icon:'star', blurb:'MBA with analytics, operations and entrepreneurship electives, taught by industry practitioners.',
        courses:[
          {name:'Master of Business Administration (MBA)', level:'PG', duration:'2 years', seats:'120 seats', eligibility:'Any bachelor\u2019s degree · min. 50% · valid CAT/MAT/TANCET score'},
          {name:'M.Sc. Applied Mathematics', level:'PG', duration:'2 years', seats:'30 seats', eligibility:'B.Sc. Mathematics or equivalent'}
        ]}
    ],
    admission:{
      cycle:'2027 \u2013 28', status:'Applications open on 05 Jan 2027', tone:'soon',
      mode:'TNEA counselling + management merit',
      fee:'Govt-quota \u2248 \u20B960,000/yr · Management-quota \u2248 \u20B91.5 L/yr',
      eligibility:'Passed 10+2 with Physics, Chemistry and Mathematics. Government-quota seats are allotted through TNEA counselling conducted by Anna University; management-quota seats are filled on merit through the college\u2019s own process.',
      dates:[
        {label:'Application portal opens', date:'2027-01-05', note:'Online applications begin on the official admission portal.'},
        {label:'TNEA registration opens', date:'2027-05-10', note:'Register on the TNEA portal for government-quota counselling.'},
        {label:'Last date to apply', date:'2027-04-15', note:'Management-quota applications close on this date.'},
        {label:'Entrance test / aptitude assessment', date:'2027-05-08', note:'Held at the Coimbatore campus for management-quota applicants.'},
        {label:'Counselling & seat allotment', date:'2027-06-20', note:'Bring original documents for verification.'},
        {label:'Classes begin', date:'2027-08-02', note:'Orientation week starts three days earlier.'}
      ],
      steps:[
        'Register on the TNEA portal (government quota) and/or the college admission portal (management quota).',
        'Fill the application form and upload your Class 10 & 12 marksheets and photograph.',
        'Attend TNEA counselling or the college-level merit process as applicable.',
        'Pay the first-semester fee and report to the college with original certificates.'
      ],
      docs:['Class 10 & 12 marksheets and passing certificates','Transfer certificate','Community / nativity certificate (if applicable)','Entrance test scorecard (if applicable)','4 passport-size photographs'],
      note:'Merit scholarships are available for top-ranked entrants, and fee concessions exist for first-generation learners.',
      contactPhone:'+91 422 257 2177', contactEmail:'admissions@psgtech.ac.in'
    },
    events:[
      {date:'2026-10-24', title:'Campus Open House & Admission Info Session', time:'9:30 AM \u2013 4:00 PM', venue:'Main Auditorium, PSG Tech', tag:'Admissions',
       desc:'Walk through the campus, meet faculty from every department and get your admission questions answered in person.'},
      {date:'2026-11-12', end:'2026-11-14', title:'Kriya \u201926 \u2014 International Technical Symposium', time:'3 days · 9:00 AM \u2013 8:00 PM', venue:'Campus-wide', tag:'Technical',
       desc:'Paper presentations, a 24-hour hackathon, robotics arena and keynote talks from industry and academia.'},
      {date:'2026-12-05', title:'Industry Connect: Robotics & Automation Workshop', time:'10:00 AM \u2013 3:00 PM', venue:'Centre for Robotics & Automation', tag:'Workshop',
       desc:'Hands-on session with industrial robot cells, guided by practising engineers. Open to Class 11 & 12 students too.'},
      {date:'2027-01-20', title:'AlumNexus \u2014 Annual Alumni & Career Meet', time:'5:00 PM onwards', venue:'Open Air Theatre', tag:'Career',
       desc:'Alumni mentors share career paths across India and abroad, with internship meet-ups for the incoming batch.'},
      {date:'2027-02-14', title:'PSG Premier League \u2014 Inter-College Sports Meet', time:'8:00 AM \u2013 6:00 PM', venue:'PSG Sports Complex', tag:'Sports',
       desc:'Cricket, football, basketball and athletics, open to students from colleges across Coimbatore.'}
    ]
  },

  {
    id:'psgcas', group:'PSG',
    name:'PSG College of Arts & Science',
    shortName:'PSG CAS',
    mono:'CAS',
    tagline:'A 1947 arts, science and commerce college in Peelamedu — one of the largest autonomous colleges in Coimbatore.',
    type:'Private · Autonomous',
    affiliation:'Autonomous · Bharathiar University',
    estd:1947,
    naac:'NAAC accredited',
    nirfBadge:'NIRF #10 among colleges in India (2025)',
    city:'Coimbatore', state:'Tamil Nadu',
    address:'Civil Aerodrome Post, Avinashi Road, Peelamedu, Coimbatore \u2013 641 014',
    website:'https://www.psgcas.ac.in',
        admissionsUrl:'https://applications.psgcas.ac.in/',
    links:[{t:'Admissions', u:'https://www.psgcas.ac.in/admissions/'}, {t:'Apply online', u:'https://applications.psgcas.ac.in/'}, {t:'Departments', u:'https://www.psgcas.ac.in/departments/'}, {t:'Placements', u:'https://www.psgcas.ac.in/placements/'}, {t:'Events', u:'https://www.psgcas.ac.in/events/'}, {t:'NIRF & NAAC', u:'https://www.psgcas.ac.in/nirf/'}, {t:'Our story', u:'https://www.psgcas.ac.in/the-story-of-psgcas/'}, {t:'Magazine', u:'https://www.psgcas.ac.in/psylens/'}],
    phone:'+91 422 430 3300',
    email:'principal@psgcas.ac.in',
    officeHours:'Mon \u2013 Sat · 9:00 AM \u2013 4:30 PM',
    about:[
      'PSG College of Arts & Science was founded in 1947, before independence, by PSG & Sons\u2019 Charities with the motto Knowledge, Love and Service. It was Coimbatore\u2019s first college to come under private management and it has been an autonomous college since 1978.',
      'Today it offers around 22 undergraduate, 17 postgraduate and several diploma programmes across arts, science, commerce and computer applications, taught to roughly 4,000 students by about 220 faculty members \u2014 making it the largest arts & science college in the PSG group.'
    ],
    stats:[
      {v:'4,000+', k:'Students'},
      {v:'220+', k:'Faculty members'},
      {v:'75+', k:'UG & PG programmes'},
      {v:'#10', k:'NIRF 2025 (colleges)'}
    ],
    highlights:[
      {icon:'book', title:'Wide programme choice', text:'Arts, science, commerce, management and computer applications under one campus.'},
      {icon:'award', title:'Autonomous since 1978', text:'One of the earliest colleges in the country to receive academic autonomy.'},
      {icon:'users', title:'Placement & training cell', text:'Active campus recruitment in IT, banking, audit, BPO and analytics roles.'},
      {icon:'star', title:'Vibrant campus life', text:'Departments, clubs, NSS, NCC and an active cultural and sports calendar.'}
    ],
    recruiters:['TCS','Infosys','Wipro','Cognizant','HDFC Bank','Deloitte','Zoho','Ford Business Services'],
    facilities:['Central library','Computer labs','Auditorium','Canteen & food court','Sports grounds','Boys & girls hostels'],
    departments:[
      {name:'Science', icon:'lab', blurb:'Physics, chemistry, mathematics, computer science and biotechnology laboratories with project work.',
        courses:[
          {name:'B.Sc. Computer Science', level:'UG', duration:'3 years', seats:'120 seats', eligibility:'10+2 with Mathematics / Computer Science · merit-based'},
          {name:'B.Sc. Mathematics', level:'UG', duration:'3 years', seats:'60 seats', eligibility:'10+2 with Mathematics'},
          {name:'B.Sc. Biotechnology', level:'UG', duration:'3 years', seats:'60 seats', eligibility:'10+2 with Biology / Biotechnology'},
          {name:'M.Sc. Computer Science', level:'PG', duration:'2 years', seats:'40 seats', eligibility:'B.Sc. Computer Science / BCA or equivalent'},
          {name:'M.Sc. Chemistry', level:'PG', duration:'2 years', seats:'40 seats', eligibility:'B.Sc. Chemistry'}
        ]},
      {name:'Commerce & Management', icon:'brief', blurb:'Commerce, accounting, business administration and corporate secretaryship streams.',
        courses:[
          {name:'B.Com (General / Computer Applications)', level:'UG', duration:'3 years', seats:'180 seats', eligibility:'10+2 in any stream with commerce preferred'},
          {name:'B.Com (Professional Accounting)', level:'UG', duration:'3 years', seats:'60 seats', eligibility:'10+2 in any stream'},
          {name:'B.B.A.', level:'UG', duration:'3 years', seats:'120 seats', eligibility:'10+2 in any stream'},
          {name:'M.Com (Finance & Accounting)', level:'PG', duration:'2 years', seats:'40 seats', eligibility:'B.Com / B.B.A. or equivalent'}
        ]},
      {name:'Arts & Languages', icon:'book', blurb:'English, Tamil, history, economics and psychology departments with research guides.',
        courses:[
          {name:'B.A. English Literature', level:'UG', duration:'3 years', seats:'120 seats', eligibility:'10+2 in any stream'},
          {name:'B.A. Economics', level:'UG', duration:'3 years', seats:'60 seats', eligibility:'10+2 in any stream'},
          {name:'M.A. English', level:'PG', duration:'2 years', seats:'40 seats', eligibility:'B.A. English or equivalent'}
        ]},
      {name:'Computer Applications', icon:'lab', blurb:'Application-oriented computing programmes with lab-intensive semesters.',
        courses:[
          {name:'B.C.A.', level:'UG', duration:'3 years', seats:'120 seats', eligibility:'10+2 with Mathematics'},
          {name:'M.C.A.', level:'PG', duration:'2 years', seats:'40 seats', eligibility:'Bachelor\u2019s degree with mathematics · TANCET / merit'}
        ]}
    ],
    admission:{
      cycle:'2026 \u2013 27', status:'Applications open \u00b7 online portal live', tone:'open',
      mode:'Merit-based on Class 12 marks',
      fee:'\u20B925,000 \u2013 \u20B990,000 per year',
      eligibility:'Passed 10+2 (or equivalent) from a recognised board. Admission to UG programmes is merit-based on Class 12 marks; PG admissions are merit-based and, for M.C.A./M.B.A., through TANCET.',
      dates:[
        {label:'Online application portal opens (UG & PG)', date:'2027-03-25', note:'Portal opens at 11:00 AM on the official admission site.'},
        {label:'Last date to apply', date:'2027-05-31', note:'Applications after this date depend on seat availability.'},
        {label:'Rank list / merit list published', date:'2027-06-10', note:'Published on the college website and notice boards.'},
        {label:'Counselling & admission confirmation', date:'2027-06-18', note:'Attend with original certificates.'},
        {label:'Classes begin', date:'2027-07-01', note:'Induction and orientation in the first week.'}
      ],
      steps:[
        'Check the eligibility for your programme on the official admission portal.',
        'Fill the online application and upload your Class 10 & 12 marksheets.',
        'Wait for the merit list and attend counselling on the given date.',
        'Pay the fee and complete document verification to confirm your seat.'
      ],
      docs:['Class 10 & 12 marksheets','Transfer certificate','Community certificate (if applicable)','Aadhaar / ID proof','Passport-size photographs'],
      note:'Sports-quota selection trials are announced separately on the official admissions page. Government scholarships, first-graduate concessions and merit scholarships are available for eligible students.',
      contactPhone:'+91 422 430 3300', contactEmail:'principal@psgcas.ac.in'
    },
    events:[
      {date:'2026-10-27', title:'PSG CAS Open Day & Programme Fair', time:'9:30 AM \u2013 3:30 PM', venue:'CAS Main Campus, Peelamedu', tag:'Admissions',
       desc:'Department-wise stalls, campus tours and a session on UG & PG programme choices and fee structures.'},
      {date:'2026-11-20', end:'2026-11-21', title:'Sangamam \u2014 Inter-College Cultural Festival', time:'2 days · 9:00 AM \u2013 9:00 PM', venue:'Open Air Auditorium', tag:'Cultural',
       desc:'Music, dance, drama, photography and literary events with teams from colleges across Coimbatore.'},
      {date:'2026-12-12', title:'Science & Commerce Expo 2026', time:'10:00 AM \u2013 4:00 PM', venue:'Science Block', tag:'Academic',
       desc:'Student projects in physics, chemistry, biotech and commerce analytics, judged by industry guests.'},
      {date:'2027-01-23', title:'Career Connect \u2014 Placement & Internship Fair', time:'9:00 AM \u2013 5:00 PM', venue:'Placement Cell Hall', tag:'Career',
       desc:'Recruiters from IT, banking, audit and BPO firms meet final-year students for internships and jobs.'},
      {date:'2027-02-19', title:'Annual Sports & Athletic Meet', time:'8:00 AM \u2013 5:00 PM', venue:'CAS Sports Ground', tag:'Sports',
       desc:'Track and field events, cricket, volleyball and basketball across departments.'}
    ]
  },

  {
    id:'psgimsr', group:'PSG',
    name:'PSG Institute of Medical Sciences & Research',
    shortName:'PSG IMSR',
    mono:'IMSR',
    tagline:'PSG\u2019s medical college and teaching hospital in Peelamedu — MBBS, postgraduate and super-speciality medical education.',
    type:'Private · Medical college & hospital',
    affiliation:'The Tamil Nadu Dr. M.G.R. Medical University',
    estd:1985,
    naac:'',
    nirfBadge:'NMC-approved teaching hospital',
    city:'Coimbatore', state:'Tamil Nadu',
    address:'Post Box No. 1674, Off Avanashi Road, Peelamedu, Coimbatore \u2013 641 004',
    website:'https://psgimsr.ac.in',
        admissionsUrl:'https://psgimsr.ac.in/admission/',
    links:[{t:'Admission', u:'https://psgimsr.ac.in/admission/'}, {t:'Departments', u:'https://psgimsr.ac.in/departments/'}, {t:'Contact', u:'https://psgimsr.ac.in/contact/'}],
    phone:'+91 422 257 0170',
    email:'deanoffice@psgimsr.ac.in',
    officeHours:'Mon \u2013 Sat · 8:30 AM \u2013 5:00 PM',
    about:[
      'PSG Institute of Medical Sciences & Research (PSG IMSR) was established in 1985 by PSG & Sons\u2019 Charities and is attached to PSG Hospitals, the multi-speciality teaching hospital on the same Peelamedu campus. It is affiliated to The Tamil Nadu Dr. M.G.R. Medical University and approved by the National Medical Commission.',
      'Students train inside a busy hospital environment, which means live clinical exposure from the early years across general medicine, surgery, paediatrics, orthopaedics, cardiology, neurology, dermatology, radiology and more. Around 20 postgraduate and 5 super-speciality programmes run alongside the MBBS course.'
    ],
    stats:[
      {v:'250', k:'MBBS seats'},
      {v:'20+', k:'PG & super-speciality courses'},
      {v:'700+', k:'Medical students'},
      {v:'1985', k:'Established'}
    ],
    highlights:[
      {icon:'home', title:'PSG Hospitals on campus', text:'A large multi-speciality teaching hospital gives students live clinical exposure every day.'},
      {icon:'award', title:'Wide PG & super-speciality', text:'MD, MS, DM and M.Ch programmes across medicine, surgery and allied specialities.'},
      {icon:'lab', title:'Research & CME culture', text:'Clinical meetings, continuing medical education events and funded research projects.'},
      {icon:'users', title:'Allied health courses', text:'B.Sc. allied health science programmes run on the same health campus.'}
    ],
    recruiters:['PSG Hospitals','Apollo Hospitals','Kauvery Hospital','Fortis Healthcare','Govt. Medical Colleges','Manipal Health'],
    facilities:['PSG Hospitals (teaching hospital)','Medical college library','Clinical skill lab','Hostels','Canteen','Rural health centres at Vedapatti & Karadivavi'],
    departments:[
      {name:'Pre-clinical', icon:'lab', blurb:'Anatomy, physiology, biochemistry and microbiology — the foundation years with dissection, lab and simulation work.',
        courses:[
          {name:'M.B.B.S. (Phase I: Anatomy, Physiology, Biochemistry)', level:'UG', duration:'1 year', seats:'Included in MBBS intake', eligibility:'NEET-UG qualified · 10+2 with Physics, Chemistry, Biology'}
        ]},
      {name:'Clinical \u2014 Medicine & Surgery', icon:'award', blurb:'General medicine, general surgery and the allied medical and surgical specialities.',
        courses:[
          {name:'M.B.B.S. (Bachelor of Medicine & Surgery)', level:'UG', duration:'5.5 years (incl. internship)', seats:'250 seats', eligibility:'10+2 with PCB · NEET-UG qualified · TN counselling'},
          {name:'M.D. General Medicine', level:'PG', duration:'3 years', seats:'As per NMC norms', eligibility:'MBBS + NEET-PG qualified'},
          {name:'M.S. General Surgery', level:'PG', duration:'3 years', seats:'As per NMC norms', eligibility:'MBBS + NEET-PG qualified'},
          {name:'M.D. Paediatrics / M.S. Orthopaedics', level:'PG', duration:'3 years', seats:'As per NMC norms', eligibility:'MBBS + NEET-PG qualified'}
        ]},
      {name:'Super-speciality', icon:'star', blurb:'Higher speciality training in cardiology and paediatric surgery.',
        courses:[
          {name:'D.M. Cardiology', level:'PG', duration:'3 years', seats:'3 seats', eligibility:'MBBS + MD in Medicine · NEET-SS'},
          {name:'M.Ch. Paediatric Surgery', level:'PG', duration:'3 years', seats:'1 seat', eligibility:'MBBS + MS in Surgery · NEET-SS'}
        ]},
      {name:'Allied Health Sciences', icon:'check', blurb:'Paramedical and allied health degree programmes taught with the hospital.',
        courses:[
          {name:'B.Sc. Allied Health Sciences (various specialities)', level:'UG', duration:'3 \u2013 4 years', seats:'Varies by speciality', eligibility:'10+2 with PCB · merit-based selection'}
        ]}
    ],
    admission:{
      cycle:'2027 \u2013 28', status:'NEET-UG 2027 \u00b7 state counselling from Jun 2027', tone:'soon',
      mode:'NEET-UG / NEET-PG + TN state counselling',
      fee:'Government-quota seats as per TN norms · Management-quota seats higher (indicative)',
      eligibility:'MBBS requires a pass in 10+2 with Physics, Chemistry, Biology and English, with the minimum aggregate prescribed by NMC, and a valid NEET-UG score. Seats are allotted through Tamil Nadu state counselling and the management quota. PG (MD/MS) requires MBBS and a valid NEET-PG score.',
      dates:[
        {label:'NEET-UG 2027 registration (NTA)', date:'2027-02-10', note:'Register on the NTA website; check the official information bulletin.'},
        {label:'NEET-UG 2027 examination', date:'2027-05-03', note:'Centres allotted across the cc.'},
        {label:'TN medical counselling registration', date:'2027-06-20', note:'Apply on the TN Directorate of Medical Education portal.'},
        {label:'Choice filling & seat allotment', date:'2027-07-05', note:'Government-quota allotment basis NEET rank.'},
        {label:'Reporting & classes begin', date:'2027-08-01', note:'Report with all original documents.'}
      ],
      steps:[
        'Write NEET-UG and secure a valid All India Rank.',
        'Register for Tamil Nadu state medical counselling through the DME portal.',
        'Fill your choices with PSG IMSR and attend the allotment rounds.',
        'Report to the college with original documents and pay the prescribed fee.'
      ],
      docs:['Class 10 & 12 marksheets','NEET-UG admit card and scorecard','Transfer certificate','Community / nativity certificate (if applicable)','Medical fitness certificate','Passport-size photographs'],
      note:'Government-quota fees are fixed by the state; PSG Hospitals also runs free and subsidised treatment programmes on campus.',
      contactPhone:'+91 422 257 0170', contactEmail:'deanoffice@psgimsr.ac.in'
    },
    events:[
      {date:'2026-10-28', title:'NEET & Medical Admission Guidance Session', time:'10:00 AM \u2013 1:00 PM', venue:'PSG IMSR Lecture Hall', tag:'Admissions',
       desc:'How TN medical counselling works, how to fill choices, and what documents you need \u2014 for students and parents.'},
      {date:'2026-11-14', title:'World Diabetes Day \u2014 Free Screening Camp', time:'8:00 AM \u2013 2:00 PM', venue:'PSG Hospitals OPD Block', tag:'Community',
       desc:'Blood sugar testing, diet counselling and specialist consultations, open to the public at no cost.'},
      {date:'2026-12-19', title:'CME: Advances in Clinical Medicine', time:'9:00 AM \u2013 4:00 PM', venue:'PSG IMSR Auditorium', tag:'Academic',
       desc:'Continuing medical education sessions for practitioners, PG residents and interns, with national faculty.'},
      {date:'2027-01-31', title:'White Coat Ceremony & Graduation Day', time:'10:00 AM onwards', venue:'PSG IMSR Auditorium', tag:'Academic',
       desc:'Welcome ceremony for the incoming MBBS batch and graduation of the outgoing batch, with families present.'},
      {date:'2027-02-22', title:'Health Campus Open Day for Schools', time:'9:30 AM \u2013 3:00 PM', venue:'PSG Health Campus, Peelamedu', tag:'Admissions',
       desc:'Guided tours of the hospital, simulation labs and allied health departments for Class 11 & 12 students.'}
    ]
  },

  {
    id:'psgim', group:'PSG',
    name:'PSG Institute of Management',
    shortName:'PSG IM',
    mono:'IM',
    tagline:'The PSG group\u2019s business school in Peelamedu — MBA and management development programmes with industry-backed projects.',
    type:'Private · Business school',
    affiliation:'Affiliated to Anna University · AICTE approved',
    estd:1994,
    naac:'',
    nirfBadge:'Management education at PSG since 1965',
    city:'Coimbatore', state:'Tamil Nadu',
    address:'PSG Institute of Management, PB No. 1668, Avinashi Road, Peelamedu, Coimbatore \u2013 641 004',
    website:'https://psgim.ac.in',
        admissionsUrl:'https://psgim.ac.in/admissions/',
    links:[{t:'Admissions', u:'https://psgim.ac.in/admissions/'}, {t:'Placements', u:'https://psgim.ac.in/placements/'}, {t:'Contact', u:'https://psgim.ac.in/contact/'}],
    phone:'+91 422 430 4400',
    email:'admissions@psgim.ac.in',
    officeHours:'Mon \u2013 Sat · 9:00 AM \u2013 5:00 PM',
    about:[
      'PSG Institute of Management grew out of the PSG group\u2019s department of management studies and became a full institute in 1994, as India opened up its economy. It sits inside the PSG campus at Peelamedu and is approved by AICTE, with the MBA affiliated to Anna University.',
      'The programme is practice-heavy: live industry projects, a business analytics lab, internships with Coimbatore\u2019s manufacturing and textile clusters, and constant interaction with practising managers and entrepreneurs.'
    ],
    stats:[
      {v:'400+', k:'Students'},
      {v:'26+', k:'Core faculty'},
      {v:'50+', k:'Visiting professors'},
      {v:'1994', k:'Established'}
    ],
    highlights:[
      {icon:'brief', title:'Industry-linked curriculum', text:'Live projects and internships with Coimbatore\u2019s engineering, textile and services industries.'},
      {icon:'star', title:'Analytics & operations', text:'Business analytics, operations and family-business electives alongside finance, marketing and HR.'},
      {icon:'users', title:'Visiting practitioner faculty', text:'Senior managers and entrepreneurs teach alongside full-time faculty.'},
      {icon:'globe', title:'Institutional tie-ups', text:'Collaborations with other institutions for faculty exchange and management development programmes.'}
    ],
    recruiters:['Deloitte','ICICI Bank','HDFC Bank','Lakshmi Machine Works','Pricol','TVS','Cognizant','KPMG'],
    facilities:['Case-study library','Analytics & computing lab','Seminar halls','Placement cell','Hostel access','Campus canteen'],
    departments:[
      {name:'MBA \u2014 Core & Specialisations', icon:'brief', blurb:'Two-year full-time MBA with electives in marketing, finance, HR, analytics and operations.',
        courses:[
          {name:'Master of Business Administration (MBA)', level:'PG', duration:'2 years', seats:'120 seats', eligibility:'Any bachelor\u2019s degree · min. 50% · CAT / MAT / CMAT / TANCET score + GD & interview'},
          {name:'MBA with Business Analytics specialisation', level:'PG', duration:'2 years', seats:'40 seats', eligibility:'Bachelor\u2019s degree with quantitative aptitude · entrance score'}
        ]},
      {name:'Working Professionals & Research', icon:'book', blurb:'Part-time and doctoral routes for working managers.',
        courses:[
          {name:'MBA (Part-time / Executive)', level:'PG', duration:'3 years', seats:'60 seats', eligibility:'Bachelor\u2019s degree + minimum work experience'},
          {name:'Ph.D. in Management', level:'Doctorate', duration:'3 \u2013 5 years', seats:'As per university norms', eligibility:'Master\u2019s degree in management or allied field · entrance test & interview'}
        ]},
      {name:'Executive Education', icon:'award', blurb:'Short-term management development programmes for companies and institutions.',
        courses:[
          {name:'Management Development Programmes (MDP)', level:'Certificate', duration:'2 \u2013 5 days', seats:'Open / company batches', eligibility:'Working professionals sponsored by their organisation'}
        ]}
    ],
    admission:{
      cycle:'2027 \u2013 28', status:'Applications open from 01 Dec 2026', tone:'open',
      mode:'CAT / MAT / CMAT / TANCET + GD & interview',
      fee:'\u20B93.0 L \u2013 \u20B94.5 L for the full programme (indicative)',
      eligibility:'A bachelor\u2019s degree in any discipline with a minimum of 50% aggregate, plus a valid CAT, MAT, CMAT or TANCET score. Shortlisted candidates attend a group discussion and a personal interview.',
      dates:[
        {label:'Application portal opens', date:'2026-12-01', note:'Apply online with your degree details and entrance score.'},
        {label:'Last date to apply', date:'2027-03-15', note:'Late applications considered only if seats remain.'},
        {label:'Group discussion & personal interview', date:'2027-03-28', note:'Conducted at the Peelamedu campus.'},
        {label:'Results & offer letters', date:'2027-04-10', note:'Merit list published after interviews.'},
        {label:'Programme begins', date:'2027-07-10', note:'Induction and industry orientation in the first week.'}
      ],
      steps:[
        'Appear for CAT / MAT / CMAT / TANCET and note your score.',
        'Apply online on the official institute portal with your academic details.',
        'Attend the group discussion and personal interview if shortlisted.',
        'Accept the offer and pay the first instalment to confirm your seat.'
      ],
      docs:['Degree marksheets & provisional certificate','Entrance exam scorecard','Class 10 & 12 marksheets','Work experience letters (if any)','Passport-size photographs'],
      note:'Merit scholarships and education-loan support are offered to eligible candidates; early applications get preference in the merit list.',
      contactPhone:'+91 422 430 4400', contactEmail:'admissions@psgim.ac.in'
    },
    events:[
      {date:'2026-11-08', title:'MBA Admission Info Session (Weekend)', time:'10:00 AM \u2013 1:00 PM', venue:'PSG IM Seminar Hall', tag:'Admissions',
       desc:'Programme structure, placement record, fee and scholarship details, followed by a campus walk-through.'},
      {date:'2026-12-03', title:'Analytics for Managers \u2014 Hands-on Workshop', time:'9:30 AM \u2013 4:30 PM', venue:'Analytics Lab, PSG IM', tag:'Workshop',
       desc:'Excel-to-dashboard workflow for working professionals and final-year students, taught on live data sets.'},
      {date:'2027-01-17', title:'PSGIM Management Conclave 2027', time:'9:00 AM \u2013 5:30 PM', venue:'PSG IM Auditorium', tag:'Academic',
       desc:'Industry leaders and entrepreneurs discuss manufacturing, exports and the future of work in Tamil Nadu.'},
      {date:'2027-02-07', title:'Case Fest \u2014 Inter-College Case Study Challenge', time:'9:00 AM \u2013 6:00 PM', venue:'PSG IM Campus', tag:'Academic',
       desc:'Teams from business schools across South India solve live business cases judged by practising managers.'},
      {date:'2027-03-06', title:'Corporate Connect & Internship Fair', time:'9:30 AM \u2013 5:00 PM', venue:'PSG Campus Placement Hall', tag:'Career',
       desc:'Summer internship and final placement interviews with recruiters from banking, consulting and manufacturing.'}
    ]
  },

  {
    id:'psgitech', group:'PSG',
    name:'PSG Institute of Technology and Applied Research',
    shortName:'PSG iTech',
    mono:'iT',
    tagline:'The PSG group\u2019s newer engineering campus at Neelambur — NBA-accredited B.E. and M.E. programmes on NH-544.',
    type:'Private · Engineering college',
    affiliation:'Affiliated to Anna University · AICTE approved',
    estd:2014,
    naac:'NAAC A+',
    nirfBadge:'NBA accredited programmes',
    city:'Coimbatore', state:'Tamil Nadu',
    address:'Salem \u2013 Coimbatore Highway (NH-544), Avinashi Road, Neelambur, Coimbatore \u2013 641 062',
    website:'https://www.psgitech.ac.in',
        admissionsUrl:'https://www.psgitech.ac.in/admissions/',
    links:[{t:'Admissions', u:'https://www.psgitech.ac.in/admissions/'}, {t:'Courses', u:'https://www.psgitech.ac.in/courses/'}, {t:'Departments', u:'https://www.psgitech.ac.in/departments/'}, {t:'Placements', u:'https://www.psgitech.ac.in/placements/'}, {t:'Events', u:'https://www.psgitech.ac.in/events/'}, {t:'Contact', u:'https://www.psgitech.ac.in/contact/'}],
    phone:'+91 422 393 3666',
    email:'admissions@psgitech.ac.in',
    officeHours:'Mon \u2013 Sat · 9:00 AM \u2013 5:00 PM',
    about:[
      'PSG Institute of Technology and Applied Research (PSG iTech) was started in 2014 as the PSG group\u2019s second engineering college, on a 40-acre campus beside the Salem\u2013Coimbatore highway at Neelambur.',
      'It offers five core B.E. branches plus M.E. programmes, with NBA accreditation and a research wing that includes an instrumentation centre set up with National Instruments. Being younger and smaller, batches stay compact and faculty access is easier \u2014 a common reason students pick iTech over larger campuses.'
    ],
    stats:[
      {v:'5', k:'B.E. branches'},
      {v:'40 acres', k:'Campus'},
      {v:'2014', k:'Established'},
      {v:'3,600+', k:'Students'}
    ],
    highlights:[
      {icon:'lab', title:'Instrumentation centre', text:'Hands-on training in virtual instrumentation with industry-grade lab equipment.'},
      {icon:'award', title:'NBA accredited', text:'Accredited programmes and a NAAC A+ grade for the institution.'},
      {icon:'brief', title:'Compact batches', text:'Smaller intake means better faculty access and more lab time per student.'},
      {icon:'home', title:'Highway campus', text:'Purpose-built campus at Neelambur with hostels and transport on major bus routes.'}
    ],
    recruiters:['TCS','HCL','Oracle','FIAT','Tata Motors','Bajaj Auto','Zoho','Musigma'],
    facilities:['Central library','Computer & CAD labs','Workshop','Hostels','Transport to the city','Sports facilities'],
    departments:[
      {name:'Computer Science & Engineering', icon:'lab', blurb:'Programming, data structures, networks and AI fundamentals with a project-heavy final year.',
        courses:[
          {name:'B.E. Computer Science & Engineering', level:'UG', duration:'4 years', seats:'120 seats', eligibility:'10+2 with PCM · TNEA counselling'},
          {name:'M.E. Computer Science & Engineering', level:'PG', duration:'2 years', seats:'18 seats', eligibility:'B.E./B.Tech in CSE/IT or equivalent'}
        ]},
      {name:'Electronics & Communication Engineering', icon:'lab', blurb:'Electronics, embedded systems and instrumentation with the NI centre.',
        courses:[
          {name:'B.E. Electronics & Communication Engineering', level:'UG', duration:'4 years', seats:'60 seats', eligibility:'10+2 with PCM · TNEA counselling'}
        ]},
      {name:'Electrical & Electronics Engineering', icon:'star', blurb:'Power systems, machines and drives with well-equipped laboratories.',
        courses:[
          {name:'B.E. Electrical & Electronics Engineering', level:'UG', duration:'4 years', seats:'60 seats', eligibility:'10+2 with PCM · TNEA counselling'}
        ]},
      {name:'Mechanical & Civil Engineering', icon:'brief', blurb:'Core engineering departments with workshop, CAD/CAM and materials testing facilities.',
        courses:[
          {name:'B.E. Mechanical Engineering', level:'UG', duration:'4 years', seats:'60 seats', eligibility:'10+2 with PCM · TNEA counselling'},
          {name:'B.E. Civil Engineering', level:'UG', duration:'4 years', seats:'60 seats', eligibility:'10+2 with PCM · TNEA counselling'},
          {name:'M.E. Structural Engineering', level:'PG', duration:'2 years', seats:'18 seats', eligibility:'B.E./B.Tech in Civil Engineering'}
        ]}
    ],
    admission:{
      cycle:'2027 \u2013 28', status:'TNEA registration opens May 2027', tone:'soon',
      mode:'TNEA counselling + management quota',
      fee:'\u20B91.1 L \u2013 \u20B91.6 L per year (indicative)',
      eligibility:'Passed 10+2 with Physics, Chemistry and Mathematics. Government-quota seats are filled through TNEA single-window counselling based on Class 12 marks; management-quota seats are filled on merit.',
      dates:[
        {label:'College application opens', date:'2027-04-01', note:'Apply online for the management quota or register for TNEA.'},
        {label:'TNEA registration opens', date:'2027-05-10', note:'Government-quota counselling through Anna University.'},
        {label:'Last date to apply', date:'2027-06-10', note:'Management-quota applications close.'},
        {label:'Counselling & seat allotment', date:'2027-06-28', note:'Check the college website for the branch-wise schedule.'},
        {label:'Classes begin', date:'2027-08-02', note:'Induction programme a week earlier.'}
      ],
      steps:[
        'Register on the TNEA portal for government-quota counselling, or apply directly to the college for the management quota.',
        'Upload your Class 10 & 12 marksheets and photograph.',
        'Attend counselling or the college merit process and choose your branch.',
        'Pay the fee and report to the Neelambur campus with original documents.'
      ],
      docs:['Class 10 & 12 marksheets','Transfer certificate','Community / nativity certificate (if applicable)','TNEA allotment order (if applicable)','Passport-size photographs'],
      note:'Merit scholarships are offered to top rank holders, and transport is available on major city and highway routes.',
      contactPhone:'+91 422 393 3666', contactEmail:'admissions@psgitech.ac.in'
    },
    events:[
      {date:'2026-10-25', title:'PSG iTech Open Day & Lab Tour', time:'10:00 AM \u2013 3:00 PM', venue:'PSG iTech, Neelambur', tag:'Admissions',
       desc:'Tour the labs, workshop and instrumentation centre, and meet faculty from all five branches.'},
      {date:'2026-11-26', end:'2026-11-27', title:'Yantra \u2014 Technical Fest & Hackathon', time:'2 days · 9:00 AM \u2013 8:00 PM', venue:'PSG iTech Campus', tag:'Technical',
       desc:'Coding contests, CAD challenges, line-follower robotics and a 24-hour hackathon with cash prizes.'},
      {date:'2027-01-09', title:'Internship & Placement Connect', time:'9:30 AM \u2013 4:00 PM', venue:'Placement Hall', tag:'Career',
       desc:'Core and IT companies meet third and final-year students for internships and placements.'},
      {date:'2027-02-13', title:'Sports & Cultural Meet 2027', time:'8:00 AM \u2013 8:00 PM', venue:'PSG iTech Grounds', tag:'Sports',
       desc:'Inter-department track events, cricket, football and an evening cultural programme.'},
      {date:'2027-04-18', title:'TNEA Guidance & Branch Selection Workshop', time:'10:00 AM \u2013 1:00 PM', venue:'Seminar Hall', tag:'Admissions',
       desc:'Practical session on TNEA choice filling, branch comparison and career paths for each branch.'}
    ]
  },

  {
    id:'psgpoly', group:'PSG',
    name:'PSG Polytechnic College',
    shortName:'PSG Polytechnic',
    mono:'POLY',
    tagline:'Coimbatore\u2019s oldest polytechnic college (1939) — three-year diplomas after Class 10, on the Peelamedu campus.',
    type:'Government-aided · Polytechnic',
    affiliation:'Directorate of Technical Education (DOTE), Tamil Nadu',
    estd:1939,
    naac:'',
    nirfBadge:'Oldest polytechnic in Coimbatore',
    city:'Coimbatore', state:'Tamil Nadu',
    address:'Avinashi Road, Peelamedu, Coimbatore \u2013 641 004',
    website:'https://www.psgpolytech.ac.in',
        admissionsUrl:'https://www.psgpolytech.ac.in/admission/',
    links:[{t:'Admission', u:'https://www.psgpolytech.ac.in/admission/'}],
    phone:'+91 422 257 2177',
    email:'principal@psgpolytech.ac.in',
    officeHours:'Mon \u2013 Sat · 9:00 AM \u2013 4:30 PM',
    about:[
      'PSG Polytechnic College is Coimbatore\u2019s oldest polytechnic and one of the largest in Tamil Nadu. It began as a two-year certificate programme at the PSG Industrial Institute in 1934 and became a full polytechnic in 1939 as part of PSG & Sons\u2019 Charities.',
      'Students study a three-year AICTE-approved diploma after Class 10 in government-aided and self-financing streams, with access to the same workshops, industry facilities and placement network as the PSG degree colleges next door.'
    ],
    stats:[
      {v:'15+', k:'Diploma branches'},
      {v:'3 years', k:'Diploma duration'},
      {v:'Class 10', k:'Entry qualification'},
      {v:'1939', k:'Established'}
    ],
    highlights:[
      {icon:'brief', title:'Workshop-first learning', text:'Heavy hands-on training in machine shops, foundry, textile and electrical labs.'},
      {icon:'award', title:'Government-aided fees', text:'Aided-stream fees are low, with scholarships for eligible students.'},
      {icon:'star', title:'Lateral entry to B.E.', text:'Diploma holders can join the second year of B.E./B.Tech through lateral entry.'},
      {icon:'users', title:'Industry demand', text:'Diploma engineers are recruited by manufacturing and textile units across Tamil Nadu.'}
    ],
    recruiters:['Lakshmi Machine Works','Pricol','TVS','Roots Industries','SITRA','Ashok Leyland','Elgi','Kirloskar'],
    facilities:['Machine shop & foundry','Electrical & electronics labs','Textile pilot plant','CAD centre','Library','Hostel & canteen'],
    departments:[
      {name:'Mechanical & Production', icon:'brief', blurb:'Machines, manufacturing, foundry and mechatronics trades with heavy workshop practice.',
        courses:[
          {name:'Diploma in Mechanical Engineering', level:'Diploma', duration:'3 years', seats:'Aided & self-financing streams', eligibility:'Pass in Class 10 (SSLC) with Maths & Science'},
          {name:'Diploma in Mechatronics Engineering', level:'Diploma', duration:'3 years', seats:'Self-financing', eligibility:'Pass in Class 10 with Maths & Science'},
          {name:'Diploma in Automobile Engineering', level:'Diploma', duration:'3 years', seats:'Self-financing', eligibility:'Pass in Class 10 with Maths & Science'},
          {name:'Diploma in Foundry Technology', level:'Diploma', duration:'3 years', seats:'Self-financing', eligibility:'Pass in Class 10 with Maths & Science'}
        ]},
      {name:'Civil Engineering', icon:'home', blurb:'Surveying, estimating, construction practice and CAD drafting.',
        courses:[
          {name:'Diploma in Civil Engineering', level:'Diploma', duration:'3 years', seats:'Aided stream', eligibility:'Pass in Class 10 with Maths & Science'}
        ]},
      {name:'Electrical, Electronics & Computing', icon:'lab', blurb:'Power, electronics, computer engineering, networking and IT trades.',
        courses:[
          {name:'Diploma in Electrical & Electronics Engineering', level:'Diploma', duration:'3 years', seats:'Aided & self-financing', eligibility:'Pass in Class 10 with Maths & Science'},
          {name:'Diploma in Electronics & Communication Engineering', level:'Diploma', duration:'3 years', seats:'Aided & self-financing', eligibility:'Pass in Class 10 with Maths & Science'},
          {name:'Diploma in Computer Engineering', level:'Diploma', duration:'3 years', seats:'Self-financing', eligibility:'Pass in Class 10 with Maths & Science'},
          {name:'Diploma in Information Technology', level:'Diploma', duration:'3 years', seats:'Self-financing', eligibility:'Pass in Class 10 with Maths & Science'},
          {name:'Diploma in Computer Networking', level:'Diploma', duration:'3 years', seats:'Self-financing', eligibility:'Pass in Class 10 with Maths & Science'}
        ]},
      {name:'Textile & Apparel', icon:'leaf', blurb:'Spinning, weaving, processing and apparel technology with a pilot plant on campus.',
        courses:[
          {name:'Diploma in Textile Technology', level:'Diploma', duration:'3 years', seats:'Aided & self-financing', eligibility:'Pass in Class 10 with Maths & Science'},
          {name:'Diploma in Apparel Technology', level:'Diploma', duration:'3 years', seats:'Self-financing', eligibility:'Pass in Class 10 with Maths & Science'}
        ]}
    ],
    admission:{
      cycle:'2027 \u2013 28', status:'TN DOTE polytechnic counselling · from May 2027', tone:'soon',
      mode:'TN DOTE single-window counselling (Class 10 marks)',
      fee:'Govt-aided stream \u2248 \u20B94,000 \u2013 \u20B98,000/yr · Self-financing higher (indicative)',
      eligibility:'A pass in Class 10 (SSLC) or an equivalent examination with mathematics and science. Seats are allotted through the Tamil Nadu DOTE single-window polytechnic counselling based on Class 10 marks; a small share is filled directly by the college under the management quota.',
      dates:[
        {label:'TN polytechnic application opens', date:'2027-05-05', note:'Register online on the DOTE admission portal.'},
        {label:'Last date to register', date:'2027-06-05', note:'Late applications are not accepted for counselling.'},
        {label:'Rank list published', date:'2027-06-18', note:'Based on Class 10 marks and the reservation roster.'},
        {label:'Counselling & seat allotment', date:'2027-06-26', note:'Choose PSG Polytechnic and your branch preference.'},
        {label:'Reporting & classes begin', date:'2027-07-15', note:'Report with original certificates; classes begin after orientation.'}
      ],
      steps:[
        'Register on the Tamil Nadu DOTE polytechnic admission portal.',
        'Pay the application fee and upload your Class 10 marksheet.',
        'Attend the online counselling and choose your branch preference.',
        'Report to the college with original documents and pay the fee.'
      ],
      docs:['Class 10 marksheet','Transfer certificate','Community certificate (if applicable)','Nativity certificate (if applicable)','Passport-size photographs'],
      note:'Diploma holders can later join the second year of B.E./B.Tech through lateral entry; scholarship schemes for SC/ST and first-graduate students apply.',
      contactPhone:'+91 422 257 2177', contactEmail:'principal@psgpolytech.ac.in'
    },
    events:[
      {date:'2026-10-22', title:'Diploma Admission Guidance for Class 10 Students', time:'10:00 AM \u2013 1:00 PM', venue:'PSG Polytechnic Auditorium', tag:'Admissions',
       desc:'How DOTE counselling works, which branches are in demand and how lateral entry to B.E. works after the diploma.'},
      {date:'2026-11-19', title:'Workshop Open Day \u2014 Machine Shop & Textile Pilot Plant', time:'9:30 AM \u2013 3:30 PM', venue:'PSG Polytechnic Workshops', tag:'Workshop',
       desc:'Live demonstrations in machining, foundry, electrical wiring, robotics and textile spinning for school students.'},
      {date:'2026-12-17', title:'Technical Exhibition & Project Display', time:'10:00 AM \u2013 4:00 PM', venue:'Central Workshop', tag:'Technical',
       desc:'Final-year diploma projects displayed and judged, with industry guests and alumni as evaluators.'},
      {date:'2027-02-05', title:'Apprenticeship & Placement Fair', time:'9:00 AM \u2013 4:00 PM', venue:'PSG Campus Placement Hall', tag:'Career',
       desc:'Manufacturing, textile and service companies recruit diploma holders and offer apprenticeships.'},
      {date:'2027-03-20', title:'Annual Sports & NSS Camp Day', time:'8:00 AM \u2013 5:00 PM', venue:'PSG Polytechnic Ground', tag:'Sports',
       desc:'Inter-department sports finals along with the NSS community-service camp showcase.'}
    ]
  },

  {
    id:'psgnursing', group:'PSG',
    name:'PSG College of Nursing',
    shortName:'PSG Nursing',
    mono:'NUR',
    tagline:'Nursing education on the PSG health campus since 1994 — B.Sc., Post Basic B.Sc. and M.Sc. Nursing with hospital training.',
    type:'Private · Nursing college',
    affiliation:'The Tamil Nadu Dr. M.G.R. Medical University',
    estd:1994,
    naac:'',
    nirfBadge:'Recognised by Indian Nursing Council',
    city:'Coimbatore', state:'Tamil Nadu',
    address:'Post Box No. 1674, Peelamedu, Coimbatore \u2013 641 004',
    website:'https://www.psgnursing.ac.in',
        admissionsUrl:'https://www.psgnursing.ac.in/admission/',
    links:[{t:'Admission', u:'https://www.psgnursing.ac.in/admission/'}, {t:'Events', u:'https://www.psgnursing.ac.in/events/'}, {t:'Contact', u:'https://www.psgnursing.ac.in/contact/'}],
    phone:'+91 422 434 5862',
    email:'principal@psgnursing.ac.in',
    officeHours:'Mon \u2013 Sat · 9:00 AM \u2013 4:30 PM',
    about:[
      'PSG College of Nursing was established in 1994 on the PSG health campus at Peelamedu. It is affiliated to The Tamil Nadu Dr. M.G.R. Medical University and recognised by the Indian Nursing Council, Delhi and the Tamil Nadu Nurses and Midwives Council.',
      'Clinical training happens inside PSG Hospitals, whose specialty departments \u2014 medicine, surgery, paediatrics, obstetrics, psychiatry and critical care \u2014 give students supervised practice. The best-performing graduates are regularly absorbed into PSG Hospitals, and many go on to work abroad.'
    ],
    stats:[
      {v:'1994', k:'Established'},
      {v:'PSG Hospitals', k:'Clinical training base'},
      {v:'B.Sc. \u2013 Ph.D.', k:'Programmes offered'},
      {v:'100%', k:'Clinical placement support'}
    ],
    highlights:[
      {icon:'home', title:'Training in a teaching hospital', text:'Clinical postings across all major departments of PSG Hospitals from the second year.'},
      {icon:'award', title:'Recognised programmes', text:'INC-recognised B.Sc., Post Basic B.Sc. and M.Sc. Nursing with university affiliation.'},
      {icon:'globe', title:'Career mobility', text:'Graduates work in India and abroad; hospital-based recruitment follows every batch.'},
      {icon:'users', title:'Simulation & skill labs', text:'Practice on mannequins and simulation models before touching a patient.'}
    ],
    recruiters:['PSG Hospitals','Kauvery Hospital','Apollo Hospitals','KMCH','Manipal Health','Overseas hospitals'],
    facilities:['Clinical skill & simulation lab','Nursing library','Hostel','PSG Hospitals training','Canteen','Transport'],
    departments:[
      {name:'Undergraduate Nursing', icon:'users', blurb:'Four-year degree nursing programmes with hospital rotations.',
        courses:[
          {name:'B.Sc. Nursing', level:'UG', duration:'4 years', seats:'60 seats', eligibility:'10+2 with Physics, Chemistry, Biology & English · min. 45% · NEET / merit + TN counselling'},
          {name:'Post Basic B.Sc. Nursing', level:'UG', duration:'2 years', seats:'30 seats', eligibility:'Diploma in General Nursing & Midwifery with registration as R.N., R.M.'}
        ]},
      {name:'Postgraduate Nursing', icon:'award', blurb:'M.Sc. Nursing specialities with research dissertations.',
        courses:[
          {name:'M.Sc. Nursing \u2014 Medical Surgical Nursing', level:'PG', duration:'2 years', seats:'10 seats', eligibility:'B.Sc. Nursing with minimum prescribed marks + entrance interviews'},
          {name:'M.Sc. Nursing \u2014 Obstetrics & Gynaecological Nursing', level:'PG', duration:'2 years', seats:'8 seats', eligibility:'B.Sc. Nursing with minimum prescribed marks'},
          {name:'M.Sc. Nursing \u2014 Paediatric / Psychiatric / Community Health', level:'PG', duration:'2 years', seats:'8 seats each', eligibility:'B.Sc. Nursing with minimum prescribed marks'}
        ]},
      {name:'Research', icon:'book', blurb:'Doctoral research in nursing practice and education.',
        courses:[
          {name:'Ph.D. in Nursing', level:'Doctorate', duration:'3 \u2013 5 years', seats:'As per university norms', eligibility:'M.Sc. Nursing with the prescribed minimum marks · university entrance'}
        ]}
    ],
    admission:{
      cycle:'2027 \u2013 28', status:'Applications open from 01 Apr 2027', tone:'soon',
      mode:'NEET / Class 12 marks + TN counselling',
      fee:'\u20B945,000 \u2013 \u20B91.2 L per year (indicative)',
      eligibility:'B.Sc. Nursing requires a pass in 10+2 with Physics, Chemistry, Biology and English with the minimum aggregate prescribed by the Indian Nursing Council, and selection through NEET-based or merit counselling as notified by the government. M.Sc. Nursing requires B.Sc. Nursing plus an entrance interview. Sports-quota admissions are also offered.',
      dates:[
        {label:'Application portal opens', date:'2027-04-01', note:'Apply online; watch the college website for the notification.'},
        {label:'Last date to apply', date:'2027-05-31', note:'Admission usually begins after plus-two results, around May.'},
        {label:'Merit list & counselling', date:'2027-06-20', note:'Selection follows Medical University and DME directions.'},
        {label:'Fee payment & confirmation', date:'2027-07-05', note:'Pay the prescribed fee to confirm the seat.'},
        {label:'Classes begin', date:'2027-08-01', note:'Orientation and uniform fitting in the first week.'}
      ],
      steps:[
        'Check the notification on the official college website after plus-two results.',
        'Submit the online application with your Class 10 & 12 marksheets.',
        'Attend counselling as per the Medical University / DME schedule.',
        'Pay the fee and join the orientation programme at the health campus.'
      ],
      docs:['Class 10 & 12 marksheets','NEET scorecard (if applicable)','Transfer certificate','Community certificate (if applicable)','Medical fitness certificate','Passport-size photographs'],
      note:'Sports quota admissions are available for state, national and international level players. Government scholarships apply for eligible candidates.',
      contactPhone:'+91 422 434 5862', contactEmail:'principal@psgnursing.ac.in'
    },
    events:[
      {date:'2026-11-04', title:'Nursing Admission Guidance Session', time:'10:00 AM \u2013 1:00 PM', venue:'PSG College of Nursing, Peelamedu', tag:'Admissions',
       desc:'Eligibility, NEET requirements, fee structure and career paths in India and abroad explained by faculty.'},
      {date:'2026-11-25', title:'Free Health Screening Camp (Public)', time:'8:00 AM \u2013 2:00 PM', venue:'PSG Hospitals OPD', tag:'Community',
       desc:'Blood pressure, sugar and BMI screening with health education, run by nursing students and faculty.'},
      {date:'2026-12-14', title:'Basic Life Support & First Aid Workshop', time:'9:30 AM \u2013 4:00 PM', venue:'Clinical Skill Lab', tag:'Workshop',
       desc:'CPR, wound care and emergency response training, open to school students, teachers and the public.'},
      {date:'2027-01-29', title:'Clinical Excellence Day & Poster Presentation', time:'9:00 AM \u2013 4:00 PM', venue:'Nursing Auditorium', tag:'Academic',
       desc:'Students present clinical case studies and evidence-based practice reviews before a faculty and hospital panel.'},
      {date:'2027-02-26', title:'Alumni Career Guidance & Overseas Nursing Meet', time:'10:00 AM \u2013 4:00 PM', venue:'PSG Nursing Auditorium', tag:'Career',
       desc:'Alumni working in India and abroad explain licensing exams, registration and career pathways in nursing.'}
    ]
  },

  {
    id:'psgpharma', group:'PSG',
    name:'PSG College of Pharmacy',
    shortName:'PSG Pharmacy',
    mono:'PHR',
    tagline:'PCI-approved pharmacy college on the PSG health campus (2001) — B.Pharm, M.Pharm and Pharm.D programmes.',
    type:'Private · Pharmacy college',
    affiliation:'The Tamil Nadu Dr. M.G.R. Medical University · PCI & AICTE approved',
    estd:2001,
    naac:'',
    nirfBadge:'NIRF-ranked (Pharmacy category)',
    city:'Coimbatore', state:'Tamil Nadu',
    address:'Peelamedu, Coimbatore \u2013 641 004',
    website:'https://psgpharma.ac.in',
        admissionsUrl:'https://psgpharma.ac.in/admission/',
    links:[{t:'Admission', u:'https://psgpharma.ac.in/admission/'}, {t:'Departments', u:'https://psgpharma.ac.in/departments/'}, {t:'Events', u:'https://psgpharma.ac.in/events/'}, {t:'Contact', u:'https://psgpharma.ac.in/contact/'}],
    phone:'+91 422 434 5841',
    email:'principal@psgpharma.ac.in',
    officeHours:'Mon \u2013 Sat · 9:00 AM \u2013 4:30 PM',
    about:[
      'PSG College of Pharmacy was established in 2001 inside the PSG health campus at Peelamedu. It is approved by the Pharmacy Council of India and AICTE, affiliated to The Tamil Nadu Dr. M.G.R. Medical University, and recognised as a Scientific and Industrial Research Organisation (DSIR).',
      'The college runs a four-year B.Pharm, a six-year Pharm.D and two-year M.Pharm specialisations in pharmaceutics, pharmacology, pharmaceutical analysis and pharmaceutical chemistry, with laboratory work, hospital pharmacy postings and industry projects.'
    ],
    stats:[
      {v:'2001', k:'Established'},
      {v:'UG \u2013 Ph.D.', k:'Programmes'},
      {v:'NIRF', k:'Ranked in Pharmacy'},
      {v:'PCI', k:'Approved'},
      {v:'76+', k:'Faculty & staff'}
    ],
    highlights:[
      {icon:'lab', title:'Strong laboratory base', text:'Pharmaceutics, analysis, pharmacology and microbiology labs with instrument facilities.'},
      {icon:'home', title:'Hospital pharmacy training', text:'Clinical postings at PSG Hospitals for Pharm.D and B.Pharm students.'},
      {icon:'brief', title:'Industry projects', text:'Formulation and analysis projects guided with pharma industry inputs.'},
      {icon:'award', title:'Research recognition', text:'Recognised as a DSIR Scientific & Industrial Research Organisation.'}
    ],
    recruiters:['Sun Pharma','Aurobindo Pharma','Dr. Reddy\u2019s','Syngene','Biocon','Apollo Pharmacy','MedPlus','Alembic'],
    facilities:['Pharmaceutics labs','Instrumentation room','Pharmacology lab','Machine room','Library','Hostel & canteen'],
    departments:[
      {name:'Pharmacy \u2014 Undergraduate', icon:'lab', blurb:'Core pharmacy education with formulations, analysis and clinical pharmacy practice.',
        courses:[
          {name:'B.Pharm (Bachelor of Pharmacy)', level:'UG', duration:'4 years', seats:'100 seats', eligibility:'10+2 with Physics, Chemistry, Biology / Maths · TN DME counselling or merit'},
          {name:'Pharm.D (Doctor of Pharmacy)', level:'UG', duration:'6 years (incl. internship)', seats:'30 seats', eligibility:'10+2 with PCB / PCM · as per PCI norms'}
        ]},
      {name:'Pharmacy \u2014 Postgraduate', icon:'award', blurb:'M.Pharm specialisations with a full-year research dissertation.',
        courses:[
          {name:'M.Pharm \u2014 Pharmaceutics', level:'PG', duration:'2 years', seats:'15 seats', eligibility:'B.Pharm with prescribed minimum marks · GPAT / merit'},
          {name:'M.Pharm \u2014 Pharmacology', level:'PG', duration:'2 years', seats:'15 seats', eligibility:'B.Pharm with prescribed minimum marks'},
          {name:'M.Pharm \u2014 Pharmaceutical Analysis', level:'PG', duration:'2 years', seats:'10 seats', eligibility:'B.Pharm with prescribed minimum marks'},
          {name:'M.Pharm \u2014 Pharmaceutical Chemistry', level:'PG', duration:'2 years', seats:'10 seats', eligibility:'B.Pharm with prescribed minimum marks'}
        ]},
      {name:'Research', icon:'book', blurb:'Doctoral research in pharmaceutical sciences.',
        courses:[
          {name:'Ph.D. in Pharmacy', level:'Doctorate', duration:'3 \u2013 5 years', seats:'As per university norms', eligibility:'M.Pharm with prescribed minimum marks · university entrance'}
        ]}
    ],
    admission:{
      cycle:'2027 \u2013 28', status:'TN DME counselling · application from May 2027', tone:'soon',
      mode:'TN DME single-window counselling + management quota',
      fee:'\u20B91.0 L \u2013 \u20B91.6 L per year (indicative)',
      eligibility:'B.Pharm requires a pass in 10+2 with Physics, Chemistry and Biology or Mathematics. Government-quota seats are allotted through Tamil Nadu DME single-window counselling; management-quota seats are filled on merit. M.Pharm requires a B.Pharm degree, with GPAT scores preferred.',
      dates:[
        {label:'Application portal opens', date:'2027-05-08', note:'Apply online after plus-two results are published.'},
        {label:'Last date to apply', date:'2027-06-15', note:'Late applications depend on seat availability.'},
        {label:'Counselling & seat allotment', date:'2027-06-30', note:'As per DME / university notification.'},
        {label:'Fee payment & confirmation', date:'2027-07-12', note:'Pay the prescribed fee to confirm your seat.'},
        {label:'Classes begin', date:'2027-08-01', note:'Orientation and lab safety induction in the first week.'}
      ],
      steps:[
        'Check the admission notification on the official college website.',
        'Register for DME counselling (government quota) or apply to the college (management quota).',
        'Submit your Class 10 & 12 marksheets and community certificate, if applicable.',
        'Complete document verification, pay the fee and join the induction programme.'
      ],
      docs:['Class 10 & 12 marksheets','Transfer certificate','Community certificate (if applicable)','GPAT scorecard (for M.Pharm)','Passport-size photographs'],
      note:'Scholarships and fee concessions are available for eligible students; GPAT-qualified M.Pharm candidates may receive stipends as per AICTE norms.',
      contactPhone:'+91 422 434 5841', contactEmail:'principal@psgpharma.ac.in'
    },
    events:[
      {date:'2026-11-06', title:'Pharmacy Admission Guidance (after Class 12)', time:'10:00 AM \u2013 1:00 PM', venue:'PSG College of Pharmacy, Peelamedu', tag:'Admissions',
       desc:'B.Pharm vs Pharm.D, counselling procedure, fee structure and career options in industry, hospital and research.'},
      {date:'2026-11-28', title:'Medication Safety & Pharmacovigilance Camp', time:'9:00 AM \u2013 2:00 PM', venue:'PSG Hospitals OPD', tag:'Community',
       desc:'Public awareness on drug interactions, safe storage and reporting of adverse drug reactions.'},
      {date:'2027-01-12', title:'Pharma Industry Connect & Research Day', time:'9:30 AM \u2013 5:00 PM', venue:'PSG Pharmacy Auditorium', tag:'Career',
       desc:'Industry speakers from formulation and analytical companies discuss hiring, internships and current research.'},
      {date:'2027-02-18', title:'Workshop on Instrumental Analysis Techniques', time:'9:30 AM \u2013 4:30 PM', venue:'Instrumentation Lab', tag:'Workshop',
       desc:'Hands-on HPLC, UV and dissolution testing workshop for B.Pharm, M.Pharm students and industry participants.'},
      {date:'2027-03-27', title:'Annual Day & Scientific Poster Competition', time:'9:00 AM \u2013 5:00 PM', venue:'PSG Health Campus', tag:'Academic',
       desc:'Research posters, quiz finals and the annual prize distribution for academic and sports achievements.'}
    ]
  },

  {
    id:'psgphysio', group:'PSG',
    name:'PSG College of Physiotherapy',
    shortName:'PSG Physiotherapy',
    mono:'PT',
    tagline:'Physiotherapy education on the PSG health campus since 1999 — BPT and MPT with clinical practice in PSG Hospitals.',
    type:'Private · Physiotherapy college',
    affiliation:'The Tamil Nadu Dr. M.G.R. Medical University',
    estd:1999,
    naac:'',
    nirfBadge:'Clinical training at PSG Hospitals',
    city:'Coimbatore', state:'Tamil Nadu',
    address:'Post Box No. 1674, Peelamedu, Coimbatore \u2013 641 004',
    website:'https://psgphysiotherapy.ac.in',
        admissionsUrl:'https://psgphysiotherapy.ac.in/admissions/',
    links:[{t:'Admissions', u:'https://psgphysiotherapy.ac.in/admissions/'}, {t:'Contact', u:'https://psgphysiotherapy.ac.in/contact/'}],
    phone:'+91 422 434 5871',
    email:'psgphysio@yahoo.co.in',
    officeHours:'Mon \u2013 Sat · 9:00 AM \u2013 4:30 PM',
    about:[
      'PSG College of Physiotherapy was established in 1999 under the PSG trust and is affiliated to The Tamil Nadu Dr. M.G.R. Medical University. It sits inside the 100-acre PSG health campus at Peelamedu.',
      'Students train with real patients in PSG Hospitals, which has dedicated specialty areas including orthopaedics, neurology, cardiothoracic, paediatrics and intensive care \u2014 giving students supervised clinical practice through the programme and a full internship in the final year.'
    ],
    stats:[
      {v:'4.5 years', k:'BPT duration'},
      {v:'2 years', k:'MPT duration'},
      {v:'100 acres', k:'PSG health campus'},
      {v:'1999', k:'Established'}
    ],
    highlights:[
      {icon:'home', title:'Hospital-based training', text:'Clinical postings across orthopaedics, neurology, cardiothoracic, ICU and paediatrics.'},
      {icon:'award', title:'MPT specialities', text:'Postgraduate specialisations with dissertations in clinical physiotherapy.'},
      {icon:'users', title:'Rehabilitation focus', text:'Exposure to post-surgical rehabilitation, sports injury and community-based therapy.'},
      {icon:'brief', title:'Growing demand', text:'Physiotherapists are hired by hospitals, sports academies, clinics and home-care providers.'}
    ],
    recruiters:['PSG Hospitals','Kauvery Hospital','Ortho One','Apollo Hospitals','Sports academies','Home-care providers'],
    facilities:['Physiotherapy outpatient department','Exercise therapy lab','Electrotherapy lab','Anatomy & physiology labs','Library','Hostel access'],
    departments:[
      {name:'Undergraduate', icon:'users', blurb:'Bachelor of Physiotherapy with four years of study and six months of internship.',
        courses:[
          {name:'B.P.T. (Bachelor of Physiotherapy)', level:'UG', duration:'4.5 years (incl. internship)', seats:'60 seats', eligibility:'10+2 with Physics, Chemistry, Biology / Botany & Zoology and English · DME combined online counselling'}
        ]},
      {name:'Postgraduate', icon:'award', blurb:'Master of Physiotherapy specialisations with clinical and research work.',
        courses:[
          {name:'M.P.T. \u2014 Orthopaedics', level:'PG', duration:'2 years', seats:'As per university norms', eligibility:'BPT degree · DME combined counselling'},
          {name:'M.P.T. \u2014 Neurology', level:'PG', duration:'2 years', seats:'As per university norms', eligibility:'BPT degree · DME combined counselling'},
          {name:'M.P.T. \u2014 Cardio-Respiratory', level:'PG', duration:'2 years', seats:'As per university norms', eligibility:'BPT degree · DME combined counselling'},
          {name:'M.P.T. \u2014 Paediatrics / Sports', level:'PG', duration:'2 years', seats:'As per university norms', eligibility:'BPT degree · DME combined counselling'}
        ]}
    ],
    admission:{
      cycle:'2027 \u2013 28', status:'BPT admission begins after +2 results (May 2027)', tone:'soon',
      mode:'DME combined online counselling',
      fee:'\u2248 \u20B933,000 \u2013 \u20B975,000 per year (self-financing, indicative)',
      eligibility:'BPT requires a pass in 10+2 with English and Physics, Chemistry, Biology (or Botany & Zoology) with the minimum marks prescribed. Admissions are made through the combined online counselling conducted by the Directorate of Medical Education (DME), Chennai. MPT admission begins in March\u2013April and requires a BPT degree.',
      dates:[
        {label:'BPT application & counselling notification', date:'2027-05-20', note:'Announced by DME after plus-two results; college admission starts in May.'},
        {label:'Last date to apply', date:'2027-06-25', note:'Apply as per the DME notification.'},
        {label:'Merit list & counselling', date:'2027-07-01', note:'Combined online counselling by the Directorate of Medical Education.'},
        {label:'MPT admission window', date:'2027-03-15', note:'MPT admissions typically begin in March\u2013April each year.'},
        {label:'Classes begin', date:'2027-08-01', note:'Orientation and clinical posting briefing in the first week.'}
      ],
      steps:[
        'Watch the official college website and the DME portal for the BPT admission notification.',
        'Register and upload your Class 10 & 12 marksheets as required.',
        'Attend the combined online counselling and choose PSG College of Physiotherapy.',
        'Report to the college, complete verification and pay the prescribed fee.'
      ],
      docs:['Class 10 & 12 marksheets','Transfer certificate','Community certificate (if applicable)','Medical fitness certificate','Passport-size photographs'],
      note:'All admissions follow the directions of the Medical University and DME, Chennai. Fee concessions and scholarships apply for eligible students.',
      contactPhone:'+91 422 434 5871', contactEmail:'psgphysio@yahoo.co.in'
    },
    events:[
      {date:'2026-11-03', title:'BPT & MPT Admission Guidance Session', time:'10:00 AM \u2013 1:00 PM', venue:'PSG College of Physiotherapy', tag:'Admissions',
       desc:'Counselling procedure, eligibility, fees and career options in sports, hospital and home-care physiotherapy.'},
      {date:'2026-12-09', title:'Free Physiotherapy Screening Camp', time:'9:00 AM \u2013 3:00 PM', venue:'Physiotherapy OPD, PSG Hospitals', tag:'Community',
       desc:'Free assessment for back pain, knee pain, post-fracture stiffness and posture problems, with exercise advice.'},
      {date:'2027-01-14', title:'Sports Injury Prevention & Taping Workshop', time:'9:30 AM \u2013 4:00 PM', venue:'Exercise Therapy Lab', tag:'Workshop',
       desc:'Hands-on taping, return-to-play testing and injury prevention for school and college athletes and coaches.'},
      {date:'2027-02-11', title:'Neuro Rehabilitation CME', time:'9:00 AM \u2013 4:00 PM', venue:'PSG Health Campus Auditorium', tag:'Academic',
       desc:'Case-based sessions on stroke, spinal cord injury and paediatric neuro rehabilitation for clinicians and students.'},
      {date:'2027-03-19', title:'Alumni & Career Pathways Meet', time:'10:00 AM \u2013 3:00 PM', venue:'Physiotherapy Seminar Hall', tag:'Career',
       desc:'Alumni working in India and abroad explain clinical specialisation, higher studies and overseas licensing.'}
    ]
  },

  {
    id:'psgias', group:'PSG',
    name:'PSG Institute of Advanced Studies',
    shortName:'PSG IAS',
    mono:'IAS',
    tagline:'The PSG group\u2019s research and advanced-studies institute (2006) — interdisciplinary projects and doctoral research.',
    type:'Private · Research institute',
    affiliation:'PSG & Sons\u2019 Charities \u00b7 research centre',
    estd:2006,
    naac:'',
    nirfBadge:'Interdisciplinary research across PSG institutions',
    city:'Coimbatore', state:'Tamil Nadu',
    address:'Peelamedu, Coimbatore \u2013 641 004 (PSG campus)',
    website:'https://www.psgias.ac.in',
        admissionsUrl:'https://www.psgias.ac.in/admissions/',
    links:[{t:'Admissions', u:'https://www.psgias.ac.in/admissions/'}, {t:'Events', u:'https://www.psgias.ac.in/events/'}, {t:'Contact', u:'https://www.psgias.ac.in/contact/'}],
    phone:'+91 422 257 2177',
    email:'info@psgias.ac.in',
    officeHours:'Mon \u2013 Fri · 9:30 AM \u2013 5:00 PM',
    about:[
      'PSG Institute of Advanced Studies (PSGIAS) was set up in 2006 by PSG & Sons\u2019 Charities to coordinate interdisciplinary research and development across the PSG institutions, and to design industry-specific manpower training programmes.',
      'The institute is building laboratories in emerging areas of science and technology to support postgraduate education, academic research and sponsored projects. Because programmes here change with ongoing research projects, the current course list, eligibility and research vacancies are published on the official website \u2014 use the link at the bottom of this page to check them.'
    ],
    stats:[
      {v:'2006', k:'Established'},
      {v:'Ph.D.', k:'Research programmes'},
      {v:'Sponsored', k:'Research projects'},
      {v:'PSG', k:'Group-wide labs'}
    ],
    highlights:[
      {icon:'lab', title:'Emerging-area labs', text:'State-of-the-art laboratories in new areas of science and technology.'},
      {icon:'book', title:'Interdisciplinary research', text:'Coordinates R&D projects that run across multiple PSG institutions.'},
      {icon:'brief', title:'Sponsored projects', text:'Academic and industry-sponsored research with scholar positions.'},
      {icon:'globe', title:'Industry training', text:'Need-based short and long-term training programmes for industry.'}
    ],
    recruiters:['PSG institutions','Sponsored research programmes','Industry R&D partners'],
    facilities:['Research laboratories','Computing facilities','Seminar & conference rooms','Library access','Researcher workspace'],
    departments:[
      {name:'Advanced Studies & Research', icon:'lab', blurb:'Research programmes in emerging areas of science, engineering and technology.',
        courses:[
          {name:'Ph.D. / Research programmes', level:'Doctorate', duration:'As per project & university norms', seats:'Subject to project vacancies', eligibility:'Master\u2019s degree in a relevant discipline · research entrance & interview'},
          {name:'Postgraduate research projects', level:'PG', duration:'Project-based', seats:'Subject to project vacancies', eligibility:'Students of PSG institutions and partner universities'}
        ]},
      {name:'Industry Training Programmes', icon:'brief', blurb:'Short and long-term training designed with industry requirements in mind.',
        courses:[
          {name:'Industry-specific training programmes', level:'Certificate', duration:'1 week \u2013 6 months', seats:'Batch-wise', eligibility:'Graduates / working professionals · requirements vary by programme'}
        ]}
    ],
    admission:{
      cycle:'2027', status:'Rolling \u00b7 project vacancies notified on the official website', tone:'open',
      mode:'Research entrance & interview',
      fee:'As notified for each programme (varies by project)',
      eligibility:'For doctoral and postgraduate research programmes, a master\u2019s degree in a relevant discipline with the prescribed minimum marks, plus the university research entrance test and an interview. Programme and vacancy details are published on the official website \u2014 please confirm specifics there.',
      dates:[
        {label:'Research admission notifications', date:'2027-01-15', note:'Notifications are issued whenever projects are sanctioned.'},
        {label:'Application review', date:'2027-03-15', note:'Rolling review of applications received.'},
        {label:'Entrance test & interview', date:'2027-04-10', note:'Conducted at the institute for shortlisted candidates.'},
        {label:'Results & joining', date:'2027-05-05', note:'Selected scholars join as per project timelines.'},
        {label:'New academic session', date:'2027-07-01', note:'Research scholars align with the host institution\u2019s calendar.'}
      ],
      steps:[
        'Check the current programme or project list on the official website.',
        'Write to the institute with your academic details and area of interest.',
        'Appear for the research entrance test and interview if shortlisted.',
        'Complete the joining formalities with the project guide and the institute office.'
      ],
      docs:['Master\u2019s degree marksheets & certificate','Research proposal / statement of purpose','Publication list (if any)','Identity proof','Passport-size photographs'],
      note:'Vacancies and eligibility are project-dependent. Always confirm the current position on the official website before applying.',
      contactPhone:'+91 422 257 2177', contactEmail:'info@psgias.ac.in'
    },
    events:[
      {date:'2026-11-15', title:'Research Open Day \u2014 Emerging Technologies', time:'10:00 AM \u2013 4:00 PM', venue:'PSGIAS Labs, PSG Campus', tag:'Academic',
       desc:'Open visit to the institute\u2019s laboratories and an overview of ongoing sponsored research projects.'},
      {date:'2026-12-18', title:'Interdisciplinary Research Symposium', time:'9:00 AM \u2013 5:00 PM', venue:'PSG Campus Auditorium', tag:'Technical',
       desc:'Research scholars from all PSG institutions present work in materials, electronics, AI and sustainability.'},
      {date:'2027-01-21', title:'Ph.D. Admission Information Session', time:'10:00 AM \u2013 1:00 PM', venue:'PSGIAS Seminar Hall', tag:'Admissions',
       desc:'How research admissions work, what funding exists, and how to approach a guide with your proposal.'},
      {date:'2027-02-25', title:'Industry R&D Collaboration Meet', time:'9:30 AM \u2013 3:30 PM', venue:'PSG Campus', tag:'Career',
       desc:'Companies discuss joint projects, testing requirements and research collaborations with PSG faculty.'},
      {date:'2027-03-30', title:'IP & Research Commercialisation Workshop', time:'9:30 AM \u2013 4:30 PM', venue:'PSGIAS Seminar Hall', tag:'Workshop',
       desc:'Patents, technology transfer and start-up routes for research outcomes, with experts from industry and DSIR.'}
    ]
  },

  /* ===================================================================
     COIMBATORE COLLEGES ON THE PLATFORM
     =================================================================== */
  {
    id:'psgr', group:'More', noFrame:true,
    name:'PSGR Krishnammal College for Women',
    shortName:'PSGR KCW',
    mono:'KCW',
    tagline:'A women\u2019s autonomous arts & science college in Peelamedu, ranked among the top colleges in India by NIRF.',
    type:'Private · Autonomous · Women only',
    affiliation:'Autonomous · Bharathiar University (run by the GRG Trust)',
    estd:1963,
    naac:'NAAC A++',
    nirfBadge:'NIRF top-10 (College category)',
    city:'Coimbatore', state:'Tamil Nadu',
    address:'Peelamedu, Coimbatore \u2013 641 004',
    website:'https://www.psgrkcw.ac.in',
        admissionsUrl:'https://www.psgrkcw.ac.in/admission/',
    links:[{t:'Admission', u:'https://www.psgrkcw.ac.in/admission/'}, {t:'Departments', u:'https://www.psgrkcw.ac.in/departments/'}, {t:'Events', u:'https://www.psgrkcw.ac.in/events/'}, {t:'Contact', u:'https://www.psgrkcw.ac.in/contact/'}],
    phone:'+91 422 429 5959',
    email:'principal@psgrkcw.ac.in',
    officeHours:'Mon \u2013 Sat · 9:00 AM \u2013 4:30 PM',
    about:[
      'PSGR Krishnammal College for Women was founded in 1963 to meet the higher education needs of women in Coimbatore. It is an autonomous college under Bharathiar University, holds a NAAC A++ grade, and is consistently ranked among the top ten colleges in India in the NIRF college category.',
      'Note: the college belongs to the GRG Trust, a separate group from PSG & Sons\u2019 Charities \u2014 it appears here because students searching for \u201cPSG arts college\u201d often mean this campus, or PSG College of Arts & Science. Only women students are admitted. Programmes span arts, science, commerce, management and computer applications, with more than 70 UG and PG offerings.'
    ],
    stats:[
      {v:'8,500+', k:'Students'},
      {v:'400+', k:'Faculty members'},
      {v:'70+', k:'Programmes'},
      {v:'1963', k:'Established'}
    ],
    highlights:[
      {icon:'award', title:'NIRF top-10 college', text:'Ranked among the best colleges in India and accredited NAAC A++.'},
      {icon:'book', title:'70+ programmes', text:'Arts, science, commerce, management, computer applications and emerging areas like data science.'},
      {icon:'users', title:'Women\u2019s leadership', text:'Focus on women\u2019s empowerment, entrepreneurship and industry internships.'},
      {icon:'brief', title:'Placement record', text:'Recruiters from IT, banking, audit, analytics and consulting visit every year.'}
    ],
    recruiters:['Deloitte','TCS','Zoho','EY','ICICI Bank','Cognizant','Wipro','HDFC Bank'],
    facilities:['Digital library','Computer & analytics labs','Auditorium & open-air theatre','Hostel','Sports complex','Counselling cell'],
    departments:[
      {name:'Science & Computing', icon:'lab', blurb:'Chemistry, mathematics, computer science, IT, data science and biotechnology programmes.',
        courses:[
          {name:'B.Sc. Computer Science', level:'UG', duration:'3 years', seats:'120 seats', eligibility:'10+2 with Mathematics / Computer Science · merit-based'},
          {name:'B.Sc. Data Science & Analytics', level:'UG', duration:'3 years', seats:'60 seats', eligibility:'10+2 with Mathematics'},
          {name:'B.Sc. Biotechnology / Genomics', level:'UG', duration:'3 years', seats:'60 seats', eligibility:'10+2 with Biology / Biotechnology'},
          {name:'M.Sc. Computer Science', level:'PG', duration:'2 years', seats:'40 seats', eligibility:'B.Sc. CS / BCA or equivalent'},
          {name:'M.Sc. Chemistry', level:'PG', duration:'2 years', seats:'30 seats', eligibility:'B.Sc. Chemistry'}
        ]},
      {name:'Commerce & Management', icon:'brief', blurb:'Commerce, accounting, business analytics and management programmes.',
        courses:[
          {name:'B.Com (Accounting & Finance)', level:'UG', duration:'3 years', seats:'120 seats', eligibility:'10+2 in any stream'},
          {name:'B.Com (Business Analytics)', level:'UG', duration:'3 years', seats:'60 seats', eligibility:'10+2 in any stream with maths preferred'},
          {name:'B.B.A. / B.B.A. International Business', level:'UG', duration:'3 years', seats:'120 seats', eligibility:'10+2 in any stream'},
          {name:'M.B.A.', level:'PG', duration:'2 years', seats:'60 seats', eligibility:'Bachelor\u2019s degree · TANCET / merit'},
          {name:'M.Com', level:'PG', duration:'2 years', seats:'40 seats', eligibility:'B.Com / B.B.A. or equivalent'}
        ]},
      {name:'Arts, Media & Computer Applications', icon:'book', blurb:'Languages, economics, media studies and application-oriented computing.',
        courses:[
          {name:'B.A. English Literature', level:'UG', duration:'3 years', seats:'60 seats', eligibility:'10+2 in any stream'},
          {name:'B.A. Economics', level:'UG', duration:'3 years', seats:'60 seats', eligibility:'10+2 in any stream'},
          {name:'B.C.A.', level:'UG', duration:'3 years', seats:'60 seats', eligibility:'10+2 with Mathematics'},
          {name:'M.C.A.', level:'PG', duration:'2 years', seats:'40 seats', eligibility:'Bachelor\u2019s degree with mathematics · TANCET'}
        ]}
    ],
    admission:{
      cycle:'2027 \u2013 28', status:'Applications open from 01 May 2027', tone:'soon',
      mode:'Merit-based (UG) · TANCET for MBA / MCA',
      fee:'\u20B920,000 \u2013 \u20B91.2 L per year (indicative)',
      eligibility:'Only women candidates are admitted. UG programmes are merit-based on Class 12 marks; PG programmes in management and computer applications consider TANCET scores along with academic merit.',
      dates:[
        {label:'Application portal opens', date:'2027-05-01', note:'Apply online on the college admission portal.'},
        {label:'Last date to apply', date:'2027-06-10', note:'Late applications depend on seat availability.'},
        {label:'Merit list published', date:'2027-06-20', note:'Published on the college website and notice board.'},
        {label:'Counselling & admission', date:'2027-06-28', note:'Attend with original certificates and a parent/guardian.'},
        {label:'Classes begin', date:'2027-07-12', note:'Orientation and induction in the first week.'}
      ],
      steps:[
        'Check the programme-wise eligibility on the official admission portal.',
        'Submit the online application with your Class 10 & 12 marksheets.',
        'Check the merit list and attend counselling on the scheduled date.',
        'Pay the fee and complete document verification to confirm admission.'
      ],
      docs:['Class 10 & 12 marksheets','Transfer certificate','Community certificate (if applicable)','TANCET scorecard (for MBA / MCA)','Passport-size photographs'],
      note:'Government scholarships, first-graduate concessions and merit scholarships are available for eligible students.',
      contactPhone:'+91 422 429 5959', contactEmail:'principal@psgrkcw.ac.in'
    },
    events:[
      {date:'2026-10-30', title:'Open Day for Women Students & Parents', time:'9:30 AM \u2013 3:30 PM', venue:'PSGR KCW Campus, Peelamedu', tag:'Admissions',
       desc:'Programme-wise counselling desks, campus tours and sessions on scholarships and hostel facilities.'},
      {date:'2026-11-24', end:'2026-11-25', title:'Kalai Vizha \u2014 Cultural Festival', time:'2 days · 9:00 AM \u2013 8:00 PM', venue:'Open Air Theatre', tag:'Cultural',
       desc:'Dance, music, mime, fashion and literary contests with participation from women\u2019s colleges across the cc.'},
      {date:'2026-12-16', title:'Women in STEM & Analytics Workshop', time:'10:00 AM \u2013 4:00 PM', venue:'Analytics Lab', tag:'Workshop',
       desc:'Hands-on data analytics and coding workshop for school and college women students, led by industry mentors.'},
      {date:'2027-01-19', title:'TANCET & PG Admission Guidance', time:'10:00 AM \u2013 1:00 PM', venue:'Seminar Hall', tag:'Admissions',
       desc:'How TANCET works for MBA and MCA, preparation strategy and the PG admission calendar.'},
      {date:'2027-02-16', title:'Annual Sports Meet & Athletics Championship', time:'8:00 AM \u2013 5:00 PM', venue:'College Sports Complex', tag:'Sports',
       desc:'Track and field finals with inter-department and inter-college events.'}
    ]
  },

  {
    id:'gct', group:'More', noFrame:true,
    name:'Government College of Technology',
    shortName:'GCT Coimbatore',
    mono:'GCT',
    tagline:'A government engineering college in Coimbatore with very low fees, TNEA-counselling admission and a strong core-engineering reputation.',
    type:'Government · Autonomous',
    affiliation:'Affiliated to Anna University',
    estd:1945,
    naac:'NAAC A',
    nirfBadge:'Oldest government engineering college in TN',
    city:'Coimbatore', state:'Tamil Nadu',
    address:'Thadagam Road, Coimbatore \u2013 641 013',
    website:'https://www.gct.ac.in',
        admissionsUrl:'https://www.gct.ac.in',
    phone:'+91 422 243 2221',
    email:'principal@gct.ac.in',
    officeHours:'Mon \u2013 Fri · 9:30 AM \u2013 5:00 PM',
    about:[
      'Government College of Technology, established in 1945, is among the oldest engineering institutions in Tamil Nadu. It is a government college, so admissions are highly transparent and tuition fees are among the lowest for a programme of this quality.',
      'Around 80% of seats are filled through TNEA single-window counselling conducted by Anna University. Teaching is oriented towards core engineering, with strong civil, mechanical, electrical and textile departments and an active Training & Placement cell.'
    ],
    stats:[
      {v:'3,000+', k:'Students'},
      {v:'200+', k:'Faculty members'},
      {v:'90%', k:'Placement (CSE / IT)'},
      {v:'1945', k:'Established'}
    ],
    highlights:[
      {icon:'award', title:'Very low fee structure', text:'Government fees, plus scholarships and fee waiver schemes for eligible students.'},
      {icon:'check', title:'Transparent admission', text:'Seats allotted through TNEA counselling based on Class 12 marks.'},
      {icon:'brief', title:'Core engineering strength', text:'Long-established departments with well-equipped laboratories and workshops.'},
      {icon:'home', title:'Central location', text:'On Thadagam Road, minutes from Coimbatore city and major bus routes.'}
    ],
    recruiters:['TCS','Cognizant','Infosys','L&T','Ashok Leyland','TVS','Bosch','Zoho'],
    facilities:['Department libraries','Boys & girls hostels','Workshop complex','Sports ground','NSS & NCC units','Health centre'],
    departments:[
      {name:'Civil Engineering', icon:'home', blurb:'Surveying, structural, geotechnical and transportation labs with field-oriented training.',
        courses:[
          {name:'B.E. Civil Engineering', level:'UG', duration:'4 years', seats:'120 seats', eligibility:'10+2 with PCM · TNEA counselling (Class 12 marks)'},
          {name:'M.E. Structural Engineering', level:'PG', duration:'2 years', seats:'18 seats', eligibility:'B.E./B.Tech Civil · TANCA / CEETA-PG counselling'}
        ]},
      {name:'Mechanical Engineering', icon:'brief', blurb:'Thermal, manufacturing and design streams with a full workshop and CAD centre.',
        courses:[
          {name:'B.E. Mechanical Engineering', level:'UG', duration:'4 years', seats:'120 seats', eligibility:'10+2 with PCM · TNEA counselling'},
          {name:'B.E. Production Engineering', level:'UG', duration:'4 years', seats:'60 seats', eligibility:'10+2 with PCM · TNEA counselling'},
          {name:'M.E. Manufacturing Engineering', level:'PG', duration:'2 years', seats:'18 seats', eligibility:'B.E./B.Tech Mechanical / Production'}
        ]},
      {name:'Electrical & Electronics Engineering', icon:'lab', blurb:'Power systems, machines and control labs supported by government-funded upgrades.',
        courses:[
          {name:'B.E. Electrical & Electronics Engineering', level:'UG', duration:'4 years', seats:'120 seats', eligibility:'10+2 with PCM · TNEA counselling'},
          {name:'M.E. Power Systems Engineering', level:'PG', duration:'2 years', seats:'18 seats', eligibility:'B.E./B.Tech EEE or equivalent'}
        ]},
      {name:'Electronics & Communication / CSE / IT', icon:'lab', blurb:'Circuit design, embedded systems, networking and software development labs.',
        courses:[
          {name:'B.E. Electronics & Communication Engineering', level:'UG', duration:'4 years', seats:'120 seats', eligibility:'10+2 with PCM · TNEA counselling'},
          {name:'B.E. Computer Science & Engineering', level:'UG', duration:'4 years', seats:'120 seats', eligibility:'10+2 with PCM · TNEA counselling'},
          {name:'B.Tech Information Technology', level:'UG', duration:'4 years', seats:'60 seats', eligibility:'10+2 with PCM · TNEA counselling'}
        ]},
      {name:'Industrial Biotechnology & Textile Technology', icon:'leaf', blurb:'Specialised departments unique to GCT, with pilot-scale and testing facilities.',
        courses:[
          {name:'B.Tech Industrial Biotechnology', level:'UG', duration:'4 years', seats:'60 seats', eligibility:'10+2 with Physics, Chemistry, Biology / Maths'},
          {name:'B.Tech Textile Technology', level:'UG', duration:'4 years', seats:'60 seats', eligibility:'10+2 with PCM · TNEA counselling'}
        ]}
    ],
    admission:{
      cycle:'2027 \u2013 28', status:'TNEA counselling · registration opens May 2027', tone:'soon',
      mode:'TNEA counselling (Class 12 marks)',
      fee:'\u20B915,000 \u2013 \u20B960,000 per year (government fee)',
      eligibility:'Passed 10+2 with Physics, Chemistry and Mathematics. UG seats are allotted through TNEA single-window counselling conducted by Anna University, purely on the basis of Class 12 marks. PG admissions are through TANCA / CEETA-PG.',
      dates:[
        {label:'TNEA online registration opens', date:'2027-05-10', note:'Register, pay the fee and upload your marksheet on the TNEA portal.'},
        {label:'Last date for TNEA registration', date:'2027-06-05', note:'Applications after this date are not considered for counselling.'},
        {label:'Rank list published', date:'2027-06-20', note:'Random number and rank list released on the TNEA website.'},
        {label:'Counselling & seat allotment', date:'2027-06-28', note:'Choose GCT as your preference; allotment is rank-based.'},
        {label:'Reporting & fee payment', date:'2027-07-10', note:'Report to the college with original certificates.'}
      ],
      steps:[
        'Register on the TNEA portal with your Class 12 marks and personal details.',
        'Pay the counselling fee and upload scanned certificates.',
        'Check the published rank list and attend the counselling rounds online.',
        'If GCT is allotted, report to the college with original documents and pay the fee.'
      ],
      docs:['Class 10 & 12 marksheets','Transfer certificate','Nativity certificate','Community certificate (if applicable)','First-graduate certificate (if applicable)','Passport-size photographs'],
      note:'Government scholarships, first-graduate fee waivers and hostel concessions apply for eligible students.',
      contactPhone:'+91 422 243 2221', contactEmail:'principal@gct.ac.in'
    },
    events:[
      {date:'2026-10-31', title:'GCT Open Day & Campus Tour', time:'10:00 AM \u2013 3:00 PM', venue:'Administrative Block, GCT', tag:'Admissions',
       desc:'Guided campus and lab tours for school students and parents, with a TNEA admission briefing for Class 12 students.'},
      {date:'2026-11-27', end:'2026-11-28', title:'TECHNOFEST \u201926 \u2014 Technical Symposium', time:'2 days · 9:00 AM \u2013 6:00 PM', venue:'Department blocks & central workshop', tag:'Technical',
       desc:'Technical quizzes, CAD modelling contests, bridge-building and a robotics challenge for school and college teams.'},
      {date:'2027-01-08', title:'Industrial Connect & Internship Fair', time:'9:30 AM \u2013 4:00 PM', venue:'Placement Cell Hall', tag:'Career',
       desc:'Core-engineering companies from Coimbatore and Chennai meet students for internships and final placements.'},
      {date:'2027-02-27', title:'GCT Sports Meet & Inter-College Tournament', time:'8:00 AM \u2013 6:00 PM', venue:'GCT Sports Ground', tag:'Sports',
       desc:'Track events, cricket, volleyball and basketball, with invited teams from engineering colleges across the district.'},
      {date:'2027-05-16', title:'TNEA Guidance Session for Class 12 Students', time:'10:00 AM \u2013 1:00 PM', venue:'Main Auditorium', tag:'Admissions',
       desc:'Free counselling walkthrough: how TNEA works, how to fill preferences and how to choose the right branch.'}
    ]
  },

];


/* ---- data: USERS ---- */
var USERS = {
  'college@demo.edu': {password:'college123', role:'college', name:'Dr. R. Meenakshi', title:'Admissions Officer', collegeId:'psg'},
  'student@demo.edu': {password:'student123', role:'student', name:'Aarav S.'}
}


/* ---- data: DEMO_CREDENTIALS ---- */
var DEMO_CREDENTIALS = {
  student:{email:'student@demo.edu', password:'student123', note:'Student — sign in, or create your own account'},
  college:{email:'college@demo.edu', password:'college123',  note:'College profile — fully working'},
  admin:{email:'admin@demo.edu', password:'admin123', note:'Admin console — not built yet'}
}


/* ---- data: STUDENT_ACCOUNTS ---- */
var STUDENT_ACCOUNTS = 'cc_students_v1';


/* ---- data: STUDENT_SESSION ---- */
var STUDENT_SESSION  = 'cc_student_session_v1';


/* ---- data: STUDENT_SAVED ---- */
var STUDENT_SAVED    = 'cc_student_saved_v1';


/* ---- data: SEED_STUDENTS ---- */
var SEED_STUDENTS = {
  'student@demo.edu': {name:'Aarav S.', password:'student123', marks:78, stream:'Science – Maths',
    want:'Engineering', degree:'B.E. Computer Science', stay:'Hostel needed', hostelType:'Boys hostel',
    travel:'College bus', town:'Coimbatore'}
}


/* ---- data: memKeys ---- */
var memKeys = [];


/* the four chip questions + the degree lists (single-line data from the app) */
var NOT_SURE = 'Not sure yet';
var ANY_DEGREE = 'Any degree in this course';
var STREAMS = ['Science – Maths', 'Science – Biology', 'Commerce', 'Arts & others'];
var WANT = ['Engineering', 'Arts & Science', 'Medical & health', 'Pharmacy', 'Management', NOT_SURE];
var STAY = ['Hostel needed', 'Day scholar'];
var HOSTELTYPE = ['Boys hostel', 'Girls hostel', 'Any hostel'];
var TRAVEL = ['College bus', 'City / route bus', 'Own vehicle / walk', 'Not needed'];

var DEGREES = {
  'Engineering': [
    {label:'B.E. Computer Science',           re:/^(B\.E\.|M\.E\.|B\.Tech|M\.Tech)[^:]*?(computer science|information technology)/i},
    {label:'B.E. Electronics & Communication', re:/^(B\.E\.|M\.E\.|B\.Tech|M\.Tech).*?electronics ?(&|and) ?communication/i},
    {label:'B.E. Electrical & Electronics',    re:/^(B\.E\.|M\.E\.|B\.Tech|M\.Tech).*?electrical/i},
    {label:'B.E. Mechanical',                  re:/^(B\.E\.|M\.E\.|B\.Tech|M\.Tech).*?(mechanical|robotics|production|mechatronics|automobile|foundry)/i},
    {label:'B.E. Civil',                       re:/^(B\.E\.|M\.E\.|B\.Tech|M\.Tech).*?civil/i},
    {label:'B.Tech Biotechnology / Textile',   re:/^(B\.Tech|M\.Tech|B\.E\.).*?(biotechnology|textile|apparel|bioprocess)/i},
    {label:'Diploma (after Class 10)',         re:/^Diploma/i}
  ],
  'Arts & Science': [
    {label:'B.Sc. (Science)',         re:/^B\.Sc\.(?!\s*Nursing|\s*Allied)/i},
    {label:'B.Com',                   re:/^B\.Com/i},
    {label:'B.B.A.',                  re:/^B\.B\.A/i},
    {label:'B.C.A.',                  re:/^B\.C\.A/i},
    {label:'B.A. (Arts & Languages)', re:/^B\.A\.\s/i}
  ],
  'Medical & health': [
    {label:'M.B.B.S.',                    re:/^M\.B\.B\.S/i},
    {label:'B.Sc. Nursing',                re:/^(Post Basic )?B\.Sc\. Nursing|^M\.Sc\. Nursing/i},
    {label:'B.P.T. Physiotherapy',         re:/physiotherap|^(B|M)\.P\.T\./i},
    {label:'B.Sc. Allied Health Sciences', re:/allied health/i}
  ],
  'Pharmacy': [
    {label:'B.Pharm',  re:/^B\.Pharm/i},
    {label:'Pharm.D',  re:/^Pharm\.D/i},
    {label:'M.Pharm',  re:/^M\.Pharm/i}
  ],
  'Management': [
    {label:'M.B.A.', re:/m\.b\.a|master of business administration/i},
    {label:'B.B.A.', re:/^B\.B\.A/i},
    {label:'B.Com',  re:/^B\.Com/i}
  ]
}

var FACIL = {
  psg:       {hostel:true,  bus:true,  busNote:'city &amp; route buses'},
  psgitech:  {hostel:true,  bus:true,  busNote:'city &amp; route buses'},
  psgcas:    {hostel:true,  bus:true,  busNote:'city &amp; route buses'},
  psgimsr:   {hostel:true,  bus:true,  busNote:'city &amp; route buses'},
  psgim:     {hostel:true,  bus:true,  busNote:'city &amp; route buses'},
  psgnursing:{hostel:true,  bus:true,  busNote:'college transport'},
  psgpharma: {hostel:true,  bus:false, busNote:''},
  psgphysio: {hostel:true,  bus:false, busNote:''},
  psgpoly:   {hostel:true,  bus:true,  busNote:'city &amp; route buses'},
  psgias:    {hostel:false, bus:false, busNote:''}
}

var MATCH = {
  psg:       {min:92, basis:'engineering', needsStream:['Science – Maths'], streamLabel:'Science · Maths'},
  psgitech:  {min:85, basis:'engineering', needsStream:['Science – Maths'], streamLabel:'Science · Maths'},
  gct:       {min:93, basis:'engineering', needsStream:['Science – Maths'], streamLabel:'Science · Maths'},
  psgcas:    {min:65, basis:'merit'},
  psgr:      {min:70, basis:'merit'},
  psgimsr:   {min:75, basis:'exam', exam:'NEET', needsStream:['Science – Biology'], streamLabel:'Science · Biology (NEET)'},
  psgnursing:{min:60, basis:'merit', needsStream:['Science – Biology'], streamLabel:'Science · Biology'},
  psgpharma: {min:60, basis:'merit', needsStream:['Science – Biology','Science – Maths'], streamLabel:'the Science stream'},
  psgphysio: {min:60, basis:'merit', needsStream:['Science – Biology'], streamLabel:'Science · Biology'},
  psgim:     {basis:'after-degree', note:'MBA — any degree plus CAT / TANCET'},
  psgpoly:   {basis:'class10', note:'Polytechnic — Class 10 marks'},
  psgias:    {basis:'after-degree', note:'PG & research — after your degree'}
}

var CATEGORY_OF = {
  psg:'Engineering', psgitech:'Engineering', gct:'Engineering',
  psgcas:'Arts & Science', psgr:'Arts & Science',
  psgimsr:'Medical & Health', psgnursing:'Medical & Health', psgpharma:'Medical & Health', psgphysio:'Medical & Health',
  psgim:'Management', psgpoly:'Polytechnic', psgias:'Research'
}

var ITEM_NOTE = {
  psgr:'Women only', psgpoly:'After Class 10', psgias:'Ph.D. & research',
  psgimsr:'MBBS, PG & super-speciality', psgnursing:'B.Sc. & M.Sc. Nursing',
  psgpharma:'B.Pharm, M.Pharm, Pharm.D', psgphysio:'BPT & MPT'
}

var GROUP_ORDER = [
  'Engineering', 'Arts & Science', 'Medical & Health', 'Management',
  'Polytechnic', 'Research'
];

var PROXY_ID = { psgcas:['psgcas','psgcas-apply'] };

var ROLE_COPY = {
  student:{title:'Student sign up / sign in', sub:'Create your account with your Class 12 marks — the PSG colleges that fit you show up right away.', cta:'Sign in as Student'},
  college:{title:'College sign in', sub:'Sign in to your college account to view and manage your public profile.', cta:'Sign in as College'},
  admin:{title:'Admin sign in', sub:'Platform administration.', cta:'Sign in as Admin'}
}


function degreesFor(cat){ return (DEGREES[cat] || []).map(function(d){ return d.label; }).concat([ANY_DEGREE]); }
function degreeRe(cat, label){
  var list = DEGREES[cat] || [];
  for (var i = 0; i < list.length; i++){ if (list[i].label === label) return list[i].re; }
  return null;
}





function degreeMatches(c, deg){
  deg = (deg === undefined ? cc.stuDegree : deg);
  if (!deg || deg === ANY_DEGREE) return false;
  var re = degreeRe(cc.stuWant, deg);
  if (!re) return false;
  for (var i = 0; i < c.departments.length; i++){
    var cs = c.departments[i].courses;
    for (var j = 0; j < cs.length; j++){
      if (re.test(cs[j].name + ' ' + cs[j].level)) return true;
    }
  }
  return false;
}


function courseMatches(c, want){
  if (!want || want === NOT_SURE) return false;
  var cat = categoryOf(c).toLowerCase();
  var depts = c.departments.map(function(d){ return d.name; }).join(' ').toLowerCase();
  var courses = c.departments.map(function(d){
    return d.courses.map(function(x){ return x.name + ' ' + x.level; }).join(' ');
  }).join(' ').toLowerCase();
  /* careful: "Biotechnology" contains "technolog", so Engineering is judged on degree prefixes + dept names */
  var hay = cat + ' ' + depts + ' ' + courses;
  if (want === 'Engineering')      return /^(B\.E\.|M\.E\.|B\.Tech|M\.Tech|Diploma)/i.test(courses) || /engineer/i.test(depts + ' ' + cat);
  if (want === 'Arts & Science')   return /arts ?(&|and) ?science/i.test(cat) || /^(B\.Sc\.(?!\s*(Nursing|Allied))|B\.Com|B\.A\.|B\.B\.A|B\.C\.A|M\.Sc\.|M\.Com|M\.A\.)/i.test(courses);
  if (want === 'Medical & health') return /nursing|physiotherap|medical|medicine|health|hospital|pharmac|allied|m\.b\.b\.s/i.test(hay);
  if (want === 'Pharmacy')         return /pharmac/i.test(hay);
  if (want === 'Management')       return /management|business|mba|commerce|b\.com/i.test(hay);
  return false;
}


function fitScore(c){
  var s = eligFor(c, cc.marks, cc.stuStream).rank;
  if (courseMatches(c, cc.stuWant)) s -= 0.5;
  if (degreeMatches(c)) s -= 0.25;
  return s;
}


function eligFor(c, marks, stream){
  var m = MATCH[c.id] || {};
  if (marks === null || marks === undefined || isNaN(marks) || marks === '')
    return {rank:1, cls:'info', text:'Add your Class 12 % to check your fit'};
  marks = Number(marks);
  if (m.basis === 'after-degree') return {rank:3, cls:'info', text:'After your degree · ' + m.note};
  if (m.basis === 'class10')      return {rank:3, cls:'info', text:'After Class 10 · ' + m.note};
  if (m.needsStream && stream && m.needsStream.indexOf(stream) < 0)
    return {rank:2, cls:'info', text:'Needs ' + m.streamLabel + ' in Class 12'};
  if (m.basis === 'exam') return {rank:2, cls:'info', text:m.exam + ' score decides admission'};
  var need = m.min;
  if (marks >= need)        return {rank:0, cls:'ok',    text:'Eligible · indicative cut-off ' + need + '%'};
  if (marks >= need - 5)    return {rank:1, cls:'close', text:'Close · indicative cut-off ' + need + '%'};
  return {rank:3, cls:'high', text:'Cut-off ' + need + '% · higher than your ' + marks + '%'};
}


var MEM_STORE = {};


function storeGet(key, fallback){
  if (memKeys.indexOf(key) >= 0) return MEM_STORE[key];
  try {
    var raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e){ return fallback; }
}


function storeSet(key, value){
  if (memKeys.indexOf(key) < 0) memKeys.push(key);
  MEM_STORE[key] = value;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e){}
}


function storeDel(key){
  var i = memKeys.indexOf(key);
  if (i >= 0) memKeys.splice(i, 1);
  delete MEM_STORE[key];
  try { localStorage.removeItem(key); } catch (e){}
}


function studentAccounts(){
  var saved = storeGet(STUDENT_ACCOUNTS, {});
  var all = {};
  for (var k in SEED_STUDENTS) all[k] = SEED_STUDENTS[k];
  for (var e in saved) all[e] = saved[e];
  return all;
}


function studentLookup(email){
  email = String(email || '').trim().toLowerCase();
  var saved = storeGet(STUDENT_ACCOUNTS, {});
  return saved[email] || SEED_STUDENTS[email] || null;
}


function isSeeded(email){ return !!SEED_STUDENTS[String(email||'').trim().toLowerCase()]; }

function startStudentSession(email, name, acc){
  email = String(email).trim().toLowerCase();
  acc = acc || studentLookup(email) || {};
  cc.user = {email:email, role:'student', name:name};
  cc.marks = (acc.marks === undefined || acc.marks === null) ? null : Number(acc.marks);
  cc.stuStream = acc.stream || cc.stuStream;
  cc.stuWant   = acc.want   || cc.stuWant;
  cc.stuDegree = acc.degree || cc.stuDegree;
  cc.stuStay   = acc.stay   || cc.stuStay;
  cc.stuHostelType = acc.hostelType || cc.stuHostelType;
  cc.stuTravel = acc.travel || cc.stuTravel;
  cc.stuTown   = acc.town   || cc.stuTown;
  cc.saved = storeGet(STUDENT_SAVED + ':' + email, []);
  storeSet(STUDENT_SESSION, {email:email, name:name, marks:cc.marks, stream:cc.stuStream,
    want:cc.stuWant, degree:cc.stuDegree, stay:cc.stuStay, hostelType:cc.stuHostelType,
    travel:cc.stuTravel, town:cc.stuTown});
}


function saveStudentDetails(marks, stream, prefs){
  if (!cc.user) return;
  var saved = storeGet(STUDENT_ACCOUNTS, {});
  var email = cc.user.email;
  var acc = saved[email] || (isSeeded(email) ? {name:cc.user.name, password:SEED_STUDENTS[email].password} : {name:cc.user.name});
  acc.marks = marks;
  acc.stream = stream;
  prefs = prefs || {};
  if (prefs.want)   acc.want   = prefs.want;
  if (prefs.degree) acc.degree = prefs.degree;
  if (prefs.stay)   acc.stay   = prefs.stay;
  if (prefs.hostelType) acc.hostelType = prefs.hostelType;
  if (prefs.travel) acc.travel = prefs.travel;
  if (prefs.town !== undefined) acc.town = prefs.town;
  if (!isSeeded(email)){ saved[email] = acc; storeSet(STUDENT_ACCOUNTS, saved); }
  cc.marks = marks;
  cc.stuStream = stream;
  cc.stuWant   = acc.want   || cc.stuWant;
  cc.stuDegree = acc.degree || cc.stuDegree;
  cc.stuStay   = acc.stay   || cc.stuStay;
  cc.stuHostelType = acc.hostelType || cc.stuHostelType;
  cc.stuTravel = acc.travel || cc.stuTravel;
  cc.stuTown   = acc.town   || cc.stuTown;
  storeSet(STUDENT_SESSION, {email:email, name:cc.user.name, marks:marks, stream:stream,
    want:cc.stuWant, degree:cc.stuDegree, stay:cc.stuStay, hostelType:cc.stuHostelType,
    travel:cc.stuTravel, town:cc.stuTown});
}


function restoreStudentSession(){
  var sess = storeGet(STUDENT_SESSION, null);
  if (!sess || !sess.email) return false;
  var acc = studentLookup(sess.email);
  if (!acc) { storeDel(STUDENT_SESSION); return false; }
  cc.user = {email:sess.email, role:'student', name:acc.name || sess.name || 'Student'};
  cc.marks = (acc.marks === undefined || acc.marks === null) ? (sess.marks === undefined ? null : sess.marks) : Number(acc.marks);
  cc.stuStream = acc.stream || sess.stream || cc.stuStream;
  cc.stuWant   = acc.want   || sess.want   || cc.stuWant;
  cc.stuDegree = acc.degree || sess.degree || cc.stuDegree;
  cc.stuStay   = acc.stay   || sess.stay   || cc.stuStay;
  cc.stuHostelType = acc.hostelType || sess.hostelType || cc.stuHostelType;
  cc.stuTravel = acc.travel || sess.travel || cc.stuTravel;
  cc.stuTown   = acc.town   || sess.town   || cc.stuTown;
  cc.saved = storeGet(STUDENT_SAVED + ':' + sess.email, []);
  cc.role = 'student';
  selectRole('student');
  return true;
}


function saveStudentList(){ if (cc.user) storeSet(STUDENT_SAVED + ':' + cc.user.email, cc.saved); }

/* ---------------- student dashboard ---------------- */
function studentColleges(){ return COLLEGES.filter(isPSG); }   /* for now: the PSG group */

function studentVisible(){
  var q = String(cc.stuQuery || '').trim().toLowerCase();
  var list = studentColleges();
  if (cc.stuFilter === 'saved') list = list.filter(function(c){ return cc.saved.indexOf(c.id) >= 0; });
  if (cc.stuFilter === 'eligible') list = list.filter(function(c){ return eligFor(c, cc.marks, cc.stuStream).rank === 0; });
  if (!q) return list;
  return list.filter(function(c){
    var hay = (c.name + ' ' + c.shortName + ' ' + cityOf(c) + ' ' + categoryOf(c) + ' ' +
      c.departments.map(function(d){
        return d.name + ' ' + d.courses.map(function(x){ return x.name + ' ' + x.level; }).join(' ');
      }).join(' ')).toLowerCase();
    return hayMatches(hay.replace(/\./g,''), q.replace(/\./g,''));
  });
}











function stuPrefsLine(){
  var bits = [];
  if (cc.stuWant && cc.stuWant !== NOT_SURE){
    bits.push('Wants ' + (cc.stuDegree && cc.stuDegree !== ANY_DEGREE ? cc.stuDegree : cc.stuWant));
  } else if (cc.stuWant) bits.push('Course: still deciding');
  if (cc.stuStay === 'Hostel needed') bits.push(cc.stuHostelType || 'Hostel needed');
  else bits.push('Day scholar');
  if (cc.stuTravel) bits.push(cc.stuTravel);
  if (cc.stuTown)   bits.push('from ' + cc.stuTown);
  return bits.join(' · ');
}


function faciNote(c){
  var f = FACIL[c.id] || {hostel:false, bus:false, busNote:''};
  var hostel = f.hostel
    ? '<b>Hostel:</b> <span class="yes">available</span>'
    : '<b>Hostel:</b> <span class="no">none on campus</span>';
  var bus = f.bus
    ? '<b>Bus:</b> <span class="yes">' + (f.busNote || 'available') + '</span>'
    : '<b>Bus:</b> <span class="no">own transport</span>';
  var personal = '';
  if (cc.user && cc.stuStay === 'Hostel needed' && !f.hostel)
    personal = '<span class="no">you asked for a hostel — check with the college</span>';
  else if (cc.user && cc.stuTravel === 'College bus' && !f.bus)
    personal = '<span class="no">no college bus listed — own transport</span>';
  return '<div class="fac">' + hostel + bus + personal + '</div>';
}


function subLineOf(c){
  return (isPSG(c) ? 'PSG group · ' : '') + cityOf(c) + ' · Estd. ' + c.estd;
}


function hayMatches(hay, query){
  var words = String(query).toLowerCase().split(/\s+/).filter(Boolean);
  return words.every(function(word){
    var safe = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('(^|[^a-z0-9])' + safe).test(hay);
  });
}


function collegesInGroup(gid){
  return COLLEGES.filter(function(c){ return c.group === gid; });
}


function categoryOf(c){ return CATEGORY_OF[c.id] || c.type; }
function isPSG(c){ return c.group === 'PSG'; }






function proxyIdFor(cid){ return PROXY_ID[cid] || [cid]; }
/* colleges that also run a separate application portal get a second proxy id */
function portalProxyId(c){ var ids = PROXY_ID[c.id] || []; return ids.length > 1 ? ids[1] : c.id; }

var state = {
  role:'student',   /* the app is for students first; the College workspace is one tap away */
  user:null,
  collegeId:'psg',
  courseLevel:'All',
  courseQuery:'',
  eventTag:'All',
  proxyOk:{},      /* college id -> can the app show its site in-app? */
  inAppPath:'',    /* proxy path currently open in the in-app browser */
  authMode:'signin',  /* student card: 'signin' | 'create' */
  marks:null,         /* student's Class 12 percentage */
  stuStream:'Science – Maths',
  stuWant:NOT_SURE,         /* course the student is looking for */
  stuDegree:ANY_DEGREE,     /* the degree inside that course */
  stuStay:'Hostel needed',  /* hostel or day scholar */
  stuHostelType:'Any hostel',/* boys / girls / any */
  stuTravel:'College bus',  /* how they plan to travel daily */
  stuTown:'',               /* home town — used for hostel/bus tips */
  stuQuery:'',
  stuFilter:'all',
  saved:[]
}





var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];


var WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];


function parseDay(iso){
  var p = String(iso).split('-');
  return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
}


function fmtLong(iso){
  var d = parseDay(iso);
  return WEEKDAYS[d.getDay()] + ', ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}


function fmtShort(iso){
  var d = parseDay(iso);
  return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}


function dayParts(iso){
  var d = parseDay(iso);
  return {day:(d.getDate() < 10 ? '0' : '') + d.getDate(), mon:MONTHS[d.getMonth()].toUpperCase(), yr:d.getFullYear()};
}


function startOfToday(){ var d = new Date(); d.setHours(0,0,0,0); return d; }
function daysUntil(iso){
  return Math.round((parseDay(iso) - startOfToday()) / 86400000);
}





function countdownText(iso){
  var n = daysUntil(iso);
  if (n === 0) return 'Today';
  if (n === 1) return 'Tomorrow';
  if (n > 1) return 'In ' + n + ' days';
  return 'Completed';
}


function initials(name){
  var parts = String(name).replace(/[^A-Za-z ]/g,'').trim().split(/\s+/).filter(Boolean);
  return ((parts[0] || 'C').charAt(0) + (parts[1] ? parts[1].charAt(0) : '')).toUpperCase();
}


function collegeById(id){
  for (var i = 0; i < COLLEGES.length; i++) if (COLLEGES[i].id === id) return COLLEGES[i];
  return COLLEGES[0];
}


function groupLabelOf(c){ return isPSG(c) ? 'PSG group' : categoryOf(c); }
/* a few colleges ask browsers not to show their site inside another page */
function frameFlag(c){ return c && c.noFrame ? 'no' : 'ok'; }
function cityOf(c){ return c.city + (c.state && c.state !== 'Tamil Nadu' ? ', ' + c.state : ''); }
function nextAdmissionDate(adm){
  var today = startOfToday(), best = null;
  for (var i = 0; i < adm.dates.length; i++){
    if (parseDay(adm.dates[i].date) >= today){ if (!best || adm.dates[i].date < best.date) best = adm.dates[i]; }
  }
  return best || adm.dates[adm.dates.length - 1];
}








function upcomingEvents(college){
  var today = startOfToday();
  return college.events.slice().sort(function(a,b){ return String(a.date).localeCompare(String(b.date)); })
    .filter(function(e){ var last = e.end || e.date; return parseDay(last) >= today; });
}


function esc(s){
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}


function countCourses(c){
  var n = 0;
  c.departments.forEach(function(d){ n += d.courses.length; });
  return n;
}


function selectionMode(c){
  if (c.id === 'gct') return 'TNEA counselling (Class 12 marks)';
  if (c.id === 'christ') return 'Entrance test + interview + marks';
  if (c.id === 'amrita') return 'AEEE / JEE Main score + counselling';
  return 'Entrance test + merit';
}


function qrSVG(text, px){
  var m = qrMatrix(text, {ecc: 'M'});
  var quiet = 3, n = m.size + quiet * 2, path = '';
  for (var y = 0; y < m.size; y++){
    for (var x = 0; x < m.size; x++){
      if (m.dark[y][x]) path += 'M' + (x + quiet) + ' ' + (y + quiet) + 'h1v1h-1z';
    }
  }
  return '<svg viewBox="0 0 ' + n + ' ' + n + '" width="' + (px || 112) + '" height="' + (px || 112) +
    '" role="img" aria-label="QR code linking to ' + esc(text) + '" shape-rendering="crispEdges">' +
    '<rect width="' + n + '" height="' + n + '" fill="#ffffff"/>' +
    '<path d="' + path + '" fill="#0d1626"/></svg>';
}


function pathFromUrl(url){ return String(url).replace(/^https?:\/\/[^/]+\/?/, '').replace(/^\//, ''); }

function openInside(url, cid, label){
  var src = '/site/' + cid + '/' + pathFromUrl(url);
  if (typeof fetch !== 'function'){ openSite(url, label, false); return; }
  fetch(src, { cache:'no-store' }).then(function(r){
    if (!r.ok) throw new Error('proxy ' + r.status);
    cc.inAppPath = src;
    showSiteViewerInside(url, label, src, cid);
  }).catch(function(){
    cc.proxyOk[cid] = false;
    applySiteUI();
    openSite(url, label, false);        /* graceful: QR + new-tab handoff */
  });
}


function logoOrMono(c, cls, style){
  var m = mediaOf(c);
  if (m && m.logo){
    return '<span class="' + cls + '"><img src="' + m.logo + '" alt="' + esc(c.shortName) + ' logo"></span>';
  }
  return '<span class="mono mono--gold" style="' + (style || '') + '">' + esc(c.mono) + '</span>';
}


function groupMarkHTML(c){
  if (!c || !GROUP_MARK || !isPSG(c)) return '';
  return '<span class="hero__group" role="img" aria-label="PSG group logo">' +
    '<img src="' + GROUP_MARK + '" alt="PSG group logo">' +
    '<span>PSG group</span></span>';
}


function mediaOf(c){ return MEDIA[c && c.id] || null; }
/* PSG-group colleges all fly the same umbrella mark */



function stuCardHTML(c){
  var m = mediaOf(c);
  var el = eligFor(c, cc.marks, cc.stuStream);
  var next = nextAdmissionDate(c.admission);
  var prog = '';
  c.stats.forEach(function(st){ if (!prog && /programme|course|program/i.test(st.k)) prog = st.v; });
  var saved = cc.saved.indexOf(c.id) >= 0;
  return '<article class="scard" data-id="' + esc(c.id) + '">' +
    '<div class="scard__ph">' +
      (m && m.photo ? '<img src="' + m.photo + '" alt="' + esc(c.name) + ' campus" loading="lazy" decoding="async">' : '') +
      groupMarkHTML(c) +
    '</div>' +
    '<div class="scard__bd">' +
      '<div class="scard__top">' +
        logoOrMono(c, 'scard__logo', '') +
        '<div><h3>' + esc(c.name) + '</h3>' +
          '<span>' + esc(cityOf(c)) + ' · Estd. ' + esc(c.estd) + ' · ' + esc(categoryOf(c)) + '</span></div>' +
      '</div>' +
      '<span class="badge badge--' + el.cls + '">' + (el.cls === 'ok' ? ICONS.check : '') + esc(el.text) + '</span>' +
      faciNote(c) +
      (degreeMatches(c) ? '<div class="fac"><span class="yes">Runs ' + esc(cc.stuDegree) + '</span></div>'
        : courseMatches(c, cc.stuWant) ? '<div class="fac"><span class="yes">Teaches ' + esc(cc.stuWant) + '</span></div>' : '') +
      '<div class="scard__facts">' +
        '<span>Next: <b>' + esc(next.label) + '</b> · ' + esc(fmtShort(next.date)) + ' <em>(' + esc(countdownText(next.date)) + ')</em></span>' +
        (prog ? '<span>Programmes: <b>' + esc(prog) + '</b> · ' + esc(c.naac) + '</span>' : '<span>' + esc(c.naac) + '</span>') +
      '</div>' +
      '<div class="scard__acts">' +
        '<button class="btn btn--primary btn--sm" data-stuopen="' + esc(c.id) + '">Open profile</button>' +
        '<button class="btn btn--ghost btn--sm scard__save" data-stusave="' + esc(c.id) + '" aria-pressed="' + saved + '">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17.3 6.2 20l1.1-6.4L2.5 9l6.4-.9L12 2.3l3.1 5.8 6.4.9-4.8 4.6 1.1 6.4Z"/></svg>' +
          (saved ? 'Saved' : 'Save') +
        '</button>' +
      '</div>' +
    '</div>' +
  '</article>';
}


function heroHTML(c){
  var next = nextAdmissionDate(c.admission);
  var evts = upcomingEvents(c);
  var nextEv = evts.length ? evts[0] : null;
  var badges = [
    '<span class="pill pill--ghost">' + esc(c.type) + '</span>',
    '<span class="pill pill--ghost">' + esc(c.naac) + '</span>',
    '<span class="pill pill--ghost">Estd. ' + esc(c.estd) + '</span>'
  ];
  if (c.nirfBadge) badges.push('<span class="pill pill--ghost">' + esc(c.nirfBadge) + '</span>');

  var statHTML = c.stats.map(function(s){
    return '<div><b>' + esc(s.v) + '</b><span>' + esc(s.k) + '</span></div>';
  }).join('');

  var mm = mediaOf(c);
  var photoBand = '';
  if (mm && mm.gallery && mm.gallery.length){
    var slides = mm.gallery.map(function(src, i){
      return '<div class="hero__slide"><img src="' + src + '" alt="' + esc(c.name) + ' event ' + (i + 1) + '" loading="' + (i === 0 ? 'eager' : 'lazy') + '" decoding="async"></div>';
    }).join('') + '<div class="hero__slide"><img src="' + mm.gallery[0] + '" alt="' + esc(c.name) + ' event 1" loading="lazy" decoding="async"></div>';
    photoBand = '<div class="hero__photo hero__photo--carousel" aria-label="PSG College event gallery">' +
      '<div class="hero__track">' + slides + '</div>' +
      '<div class="hero__dots" aria-hidden="true">' + mm.gallery.map(function(){ return '<span></span>'; }).join('') + '</div>' +
      groupMarkHTML(c) +
    '</div>';
  } else if (mm && mm.photo){
    photoBand = '<div class="hero__photo">' +
      '<img src="' + mm.photo + '" alt="' + esc(c.name) + ' — campus" loading="eager" decoding="async">' +
      '<span class="hero__credit">Photo: ' + esc(mm.photoCredit || 'official website') + '</span>' +
      groupMarkHTML(c) +
    '</div>';
  }
  return '' +
  '<section class="sec" id="sec-profile">' +
    '<div class="hero pop' + (photoBand ? ' hero--photo' : '') + '">' +
      photoBand +
      '<div class="hero__in">' +
        '<div class="hero__top">' +
          logoOrMono(c, 'hero__logo', 'width:62px;height:62px;border-radius:18px;font-size:19px') +
          '<div>' +
            '<span class="pill pill--gold">' + esc(c.city) + ', ' + esc(c.state) + '</span>' +
            '<h1>' + esc(c.name) + '</h1>' +
            '<div class="hero__meta">' + badges.join('') + '</div>' +
          '</div>' +
        '</div>' +

        '<p class="hero__tag">' + esc(c.tagline) + '</p>' +

        '<div class="hero__cta">' +
          '<a class="btn btn--gold" href="#sec-website">' +
            ICONS.globe + 'Official website ↓' +
          '</a>' +
          '<a class="btn btn--onDark" href="#sec-admissions">' +
            ICONS.cal + 'Admissions ' + esc(c.admission.cycle) +
          '</a>' +
          (nextEv ? '<a class="btn btn--onDark" href="#sec-events">' + ICONS.star + 'Next event: ' + esc(fmtShort(nextEv.date)) + '</a>' : '') +
          '<button class="btn btn--onDark" data-copy="' + esc(c.website) + '">' + ICONS.link + 'Copy website link</button>' +
        '</div>' +

        '<div class="hero__stats">' + statHTML + '</div>' +
        '<div class="hero__note">Next admission milestone: <b style="color:#fff">' + esc(next.label) + '</b> · ' +
          esc(fmtLong(next.date)) + ' (' + esc(countdownText(next.date)) + ')</div>' +
      '</div>' +
    '</div>' +
  '</section>';
}


function aboutHTML(c){
  var hl = c.highlights.map(function(h){
    return '<div class="hl__item">' +
      '<span class="hl__ico">' + (ICONS[h.icon] || ICONS.check) + '</span>' +
      '<div><h4>' + esc(h.title) + '</h4><p>' + esc(h.text) + '</p></div>' +
    '</div>';
  }).join('');

  var recruiters = c.recruiters.map(function(r){ return '<span class="chip">' + esc(r) + '</span>'; }).join('');
  var facilities = c.facilities.map(function(r){ return '<span class="chip">' + esc(r) + '</span>'; }).join('');

  return '' +
  '<div class="about pop">' +
    '<div>' +
      '<div class="sec-title" style="margin-bottom:16px"><span class="kicker">About the college</span>' +
      '<h2 style="margin-top:8px">What ' + esc(c.shortName) + ' is known for</h2></div>' +
      c.about.map(function(p){ return '<p>' + esc(p) + '</p>'; }).join('') +
      '<div class="block"><h4>Campus &amp; facilities</h4><div class="chips">' + facilities + '</div></div>' +
      '<div class="block"><h4>Top recruiters</h4><div class="chips">' + recruiters + '</div></div>' +
    '</div>' +
    '<div class="hl">' + hl + '</div>' +
  '</div>';
}


function coursesHTML(c){
  var levels = [];
  c.departments.forEach(function(d){
    d.courses.forEach(function(cr){ if (levels.indexOf(cr.level) === -1) levels.push(cr.level); });
  });
  var chips = ['All'].concat(levels).map(function(l){
    return '<button class="chip chip--tag" data-level="' + esc(l) + '" aria-pressed="' + (cc.courseLevel === l) + '">' + esc(l) + '</button>';
  }).join('');

  return '' +
  '<section class="sec" id="sec-courses">' +
    '<div class="sec-head">' +
      '<div class="sec-title"><span class="kicker">Departments &amp; courses</span>' +
        '<h2>Programmes offered</h2>' +
        '<p>' + c.departments.length + ' departments · ' + countCourses(c) + ' programmes. Tap a department to see its courses, duration, seats and eligibility.</p>' +
      '</div>' +
      '<div class="filters" id="courseLevels">' + chips + '</div>' +
    '</div>' +

    '<div class="field" style="max-width:420px; margin-bottom:18px">' +
      '<div class="field__box">' +
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>' +
        '<input id="courseSearch" type="search" placeholder="Search a course or department (e.g. civil, data, MBA)" value="' + esc(cc.courseQuery) + '" aria-label="Search courses" />' +
      '</div>' +
    '</div>' +

    '<div id="deptList">' + deptListHTML(c) + '</div>' +
  '</section>';
}


function admissionsHTML(c){
  var a = c.admission;
  var today = startOfToday();
  var nextIdx = -1;
  for (var i = 0; i < a.dates.length; i++){
    if (parseDay(a.dates[i].date) >= today){ nextIdx = i; break; }
  }
  var tone = a.tone === 'open' ? 'green' : (a.tone === 'closed' ? '' : 'amber');

  var timeline = a.dates.map(function(d, i){
    var isNext = (i === nextIdx);
    return '<div class="tl' + (isNext ? ' tl--next' : '') + '">' +
      '<div class="tl__date">' + esc(fmtLong(d.date)) + (isNext ? ' · ' + esc(countdownText(d.date)) : '') + '</div>' +
      '<b>' + esc(d.label) + '</b>' +
      '<span>' + esc(d.note || '') + '</span>' +
    '</div>';
  }).join('');

  var steps = a.steps.map(function(s){ return '<div class="step"><p>' + esc(s) + '</p></div>'; }).join('');
  var docs = a.docs.map(function(d){ return '<li>' + ICONS.check + '<span>' + esc(d) + '</span></li>'; }).join('');

  return '' +
  '<section class="sec" id="sec-admissions">' +
    '<div class="sec-head">' +
      '<div class="sec-title"><span class="kicker">Admissions ' + esc(a.cycle) + '</span>' +
        '<h2>Admission details &amp; important dates</h2>' +
        '<p>Everything you need before you apply — eligibility, fees, the full date list and the documents to keep ready.</p>' +
      '</div>' +
      '<a class="btn btn--primary" href="' + esc(c.admissionsUrl) + '" target="_blank" rel="noopener noreferrer" data-site="1" data-cid="' + esc(portalProxyId(c)) + '" data-frame="' + frameFlag(c) + '" data-label="' + esc(c.shortName) + ' admission portal">' +
        ICONS.globe + 'Apply on official portal' + ICONS.link + '</a>' +
    '</div>' +

    '<div class="adm">' +
      '<div>' +
        '<div class="adm__status" style="' + (tone === 'amber' ? 'background:var(--amber-soft);border-color:#f3dfc6' : tone === 'green' ? '' : 'background:var(--line-2);border-color:var(--line)') + '">' +
          '<span class="pill pill--' + (tone || 'ghost') + '"><span class="dot"></span>Status</span>' +
          '<div><b>' + esc(a.status) + '</b><span style="color:var(--muted)">Admission cycle ' + esc(a.cycle) + '</span></div>' +
        '</div>' +

        '<div class="facts">' +
          '<div class="fact"><span>Application fee</span><b>As per official portal</b></div>' +
          '<div class="fact"><span>Annual tuition</span><b>' + esc(a.fee) + '</b></div>' +
          '<div class="fact"><span>Mode of selection</span><b>' + esc(selectionMode(c)) + '</b></div>' +
          '<div class="fact"><span>Admissions office</span><b>' + esc(a.contactPhone) + '</b></div>' +
        '</div>' +

        '<div class="block"><h4>Eligibility</h4><p style="font-size:14.6px">' + esc(a.eligibility) + '</p></div>' +

        '<div class="block"><h4>How to apply — step by step</h4><div class="steps">' + steps + '</div></div>' +

        '<div class="block"><h4>Documents to keep ready</h4><ul class="docs">' + docs + '</ul></div>' +

        (a.note ? '<div class="alert alert--info show" style="margin-top:20px">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="flex:0 0 auto;margin-top:2px"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>' +
          '<span>' + esc(a.note) + '</span></div>' : '') +
      '</div>' +

      '<div class="card" style="padding:22px 22px 24px">' +
        '<span class="kicker">Key dates</span>' +
        '<h3 style="font-size:19px; margin-top:8px">Admission timeline ' + esc(a.cycle) + '</h3>' +
        '<div class="timeline">' + timeline + '</div>' +
        '<div style="margin-top:20px; padding-top:18px; border-top:1px solid var(--line)">' +
          '<div style="display:flex; gap:10px; flex-wrap:wrap">' +
            '<a class="btn btn--ghost btn--sm" href="tel:' + esc(a.contactPhone.replace(/\s/g,'')) + '">' + ICONS.phone + 'Call admissions</a>' +
            '<a class="btn btn--ghost btn--sm" href="mailto:' + esc(a.contactEmail) + '">' + ICONS.mail + 'Email admissions</a>' +
          '</div>' +
          '<p style="font-size:12.4px; color:var(--muted); margin-top:12px">Dates are sample data for this demo — always confirm on the official website before applying.</p>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</section>';
}


function eventsHTML(c){
  var tags = ['All'];
  c.events.forEach(function(e){ if (tags.indexOf(e.tag) === -1) tags.push(e.tag); });
  var chips = tags.map(function(t){
    return '<button class="chip chip--tag" data-tag="' + esc(t) + '" aria-pressed="' + (cc.eventTag === t) + '">' + esc(t) + '</button>';
  }).join('');

  var list = upcomingEvents(c).filter(function(e){ return cc.eventTag === 'All' || e.tag === cc.eventTag; });

  var cards = list.map(function(e, idx){
    var p = dayParts(e.date);
    var d = daysUntil(e.date);
    var soon = idx === 0 || (d >= 0 && d <= 14);   /* always flag the closest event */
    var rangeText = e.end ? fmtShort(e.date) + ' – ' + fmtShort(e.end) : fmtLong(e.date);
    return '<div class="ev pop">' +
      '<div class="ev__date"><span>' + esc(p.mon) + '</span><b>' + esc(p.day) + '</b><em>' + esc(p.yr) + '</em></div>' +
      '<div class="ev__body">' +
        '<div style="display:flex; align-items:center; gap:9px; flex-wrap:wrap">' +
          '<span class="pill pill--blue">' + esc(e.tag) + '</span>' +
          (soon ? '<span class="pill pill--gold"><span class="dot"></span>' + esc(countdownText(e.date)) + '</span>' : '') +
        '</div>' +
        '<h4 style="margin-top:9px">' + esc(e.title) + '</h4>' +
        '<p>' + esc(e.desc) + '</p>' +
        '<div class="ev__meta">' +
          '<span>' + ICONS.cal + esc(rangeText) + '</span>' +
          '<span>' + ICONS.clock + esc(e.time) + '</span>' +
          '<span>' + ICONS.pin + esc(e.venue) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="ev__side">' +
        '<span class="pill">' + esc(countdownText(e.date)) + '</span>' +
        '<a class="btn btn--ghost btn--sm" href="' + esc(c.website) + '" target="_blank" rel="noopener noreferrer" data-site="1" data-frame="' + frameFlag(c) + '" data-label="' + esc(e.title) + '">' + ICONS.link + 'Details</a>' +
      '</div>' +
    '</div>';
  }).join('');

  if (!list.length){
    cards = '<div class="empty"><b>No upcoming events in this category</b>Switch the filter to see all events, or check the official website for the full calendar.</div>';
  }

  var eventGallery = '';
  var em = mediaOf(c);
  if (c.id === 'psg' && em && em.eventGallery && em.eventGallery.length){
    eventGallery = '<div class="event-gallery" aria-label="Campus event photos">' +
      '<div class="event-gallery__track">' +
      em.eventGallery.map(function(src, i){ return '<div class="event-gallery__slide"><img src="' + src + '" alt="PSG campus event photo ' + (i + 1) + '" loading="lazy" decoding="async"></div>'; }).join('') +
      '</div>' +
      '<div class="event-gallery__hint">Scroll left or right to view event photos</div>' +
    '</div>';
  }

  return '' +
  '<section class="sec" id="sec-events">' +
    '<div class="sec-head">' +
      '<div class="sec-title"><span class="kicker">Campus events</span>' +
        '<h2>Upcoming events &amp; dates</h2>' +
        '<p>Open houses, admission info sessions, technical symposia, fests and sports meets — so you know exactly when to visit ' + esc(c.shortName) + '.</p>' +
      '</div>' +
      '<div class="filters" id="eventTags">' + chips + '</div>' +
    '</div>' +
    eventGallery +
    '<div class="events">' + cards + '</div>' +
  '</section>';
}


function contactHTML(c){
  var q = encodeURIComponent(c.name + ', ' + c.address);
  var mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + q;
  return '' +
  '<section class="sec" id="sec-contact">' +
    '<div class="sec-head">' +
      '<div class="sec-title"><span class="kicker">Reach the campus</span>' +
        '<h2>Contact &amp; location</h2>' +
        '<p>Get in touch with the admissions team, or open the address directly in maps.</p>' +
      '</div>' +
      '<div style="display:flex; gap:10px; flex-wrap:wrap">' +
        '<a class="btn btn--primary" href="' + esc(c.website) + '" target="_blank" rel="noopener noreferrer" data-site="1" data-frame="' + frameFlag(c) +
          '" data-label="' + esc(c.name) + '">' + ICONS.globe + esc(c.website.replace(/^https?:\/\//,'')) + '</a>' +
        '<a class="btn btn--ghost" href="' + mapUrl + '" target="_blank" rel="noopener noreferrer" data-site="1" data-frame="no" data-label="Google Maps directions">' + ICONS.pin + 'Get directions</a>' +
      '</div>' +
    '</div>' +

    '<div class="contact">' +
      '<div class="card" style="padding:6px 22px">' +
        '<div class="cline"><span class="cline__ico">' + ICONS.pin + '</span><div><span>Address</span><b>' + esc(c.address) + '</b></div></div>' +
        '<div class="cline"><span class="cline__ico">' + ICONS.phone + '</span><div><span>Admissions phone</span><b><a href="tel:' + esc(c.phone.replace(/\s/g,'')) + '">' + esc(c.phone) + '</a></b></div></div>' +
        '<div class="cline"><span class="cline__ico">' + ICONS.mail + '</span><div><span>Email</span><b><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></b></div></div>' +
        '<div class="cline"><span class="cline__ico">' + ICONS.globe + '</span><div><span>Official website</span><b><a class="link" href="' + esc(c.website) + '" target="_blank" rel="noopener noreferrer" data-site="1" data-frame="' + frameFlag(c) + '" data-label="' + esc(c.name) + '">' + esc(c.website) + '</a></b></div></div>' +
        '<div class="cline"><span class="cline__ico">' + ICONS.clock + '</span><div><span>Office hours</span><b>' + esc(c.officeHours) + '</b></div></div>' +
        '<div class="cline"><span class="cline__ico">' + ICONS.book + '</span><div><span>Affiliation</span><b>' + esc(c.affiliation) + '</b></div></div>' +
      '</div>' +

      '<div class="map">' +
        '<svg viewBox="0 0 600 380" role="img" aria-label="Illustrative map showing the location of ' + esc(c.name) + '">' +
          '<rect width="600" height="380" fill="#eef2f8"/>' +
          '<g stroke="#dfe6f1" stroke-width="10">' +
            '<path d="M-20 90h640M-20 250h640M110 -20v420M330 -20v420M500 -20v420"/>' +
          '</g>' +
          '<g stroke="#e8edf6" stroke-width="4">' +
            '<path d="M-20 170h640M-20 320h640M220 -20v420M420 -20v420"/>' +
          '</g>' +
          '<g fill="#e4ebf5"><rect x="140" y="105" width="70" height="52" rx="6"/><rect x="230" y="110" width="80" height="46" rx="6"/>' +
            '<rect x="350" y="100" width="60" height="60" rx="6"/><rect x="150" y="268" width="60" height="40" rx="6"/>' +
            '<rect x="345" y="270" width="70" height="40" rx="6"/><rect x="445" y="185" width="46" height="52" rx="6"/></g>' +
          '<g fill="#d9e6dc"><circle cx="40" cy="215" r="17"/><circle cx="62" cy="232" r="12"/><circle cx="548" cy="72" r="16"/><circle cx="570" cy="92" r="11"/></g>' +
          '<g transform="translate(300,150)">' +
            '<circle cx="0" cy="0" r="46" fill="rgba(199,143,34,.16)"/>' +
            '<circle cx="0" cy="0" r="26" fill="rgba(199,143,34,.24)"/>' +
            '<g transform="translate(-15,-30)">' +
              '<path d="M15 0C6.7 0 0 6.7 0 15c0 11 15 27 15 27s15-16 15-27C30 6.7 23.3 0 15 0Z" fill="#121d38"/>' +
              '<circle cx="15" cy="14" r="5.4" fill="#f0b64a"/>' +
            '</g>' +
          '</g>' +
          '<text x="300" y="248" text-anchor="middle" font-family="Inter,Segoe UI,system-ui,sans-serif" font-size="15" font-weight="700" fill="#121d38">' + esc(c.shortName) + '</text>' +
          '<text x="300" y="270" text-anchor="middle" font-family="Inter,Segoe UI,system-ui,sans-serif" font-size="12.5" fill="#74829d">' + esc(c.city) + ', ' + esc(c.state) + '</text>' +
          '<text x="300" y="352" text-anchor="middle" font-family="Inter,Segoe UI,system-ui,sans-serif" font-size="11.5" fill="#9aa6bd">Illustrative map · tap "Get directions" for the real location</text>' +
        '</svg>' +
      '</div>' +
    '</div>' +
  '</section>';
}


function websiteHTML(c){
  var others = COLLEGES.filter(function(x){ return x.id !== c.id; });
  var mates = others.filter(function(x){ return x.group === c.group; });
  var sideList = mates.length ? mates : others.slice(0, 4);

  var rows = sideList.map(function(x){
    return '<div class="site-row"><b>' + esc(x.shortName) + '</b>' +
      '<a href="' + esc(x.website) + '" target="_blank" rel="noopener noreferrer" data-site="1" data-frame="' + frameFlag(x) +
      '" data-label="' + esc(x.name) + '">' +
      esc(x.website.replace(/^https?:\/\//, '')) + '</a></div>';
  }).join('');

  var quick = others.map(function(x){
    return '<a class="qn" href="#" data-open="' + esc(x.id) + '">' + ICONS.globe +
      '<span>' + esc(x.shortName) + '<em>' + esc(categoryOf(x)) + ' · ' + esc(x.city) + '</em></span></a>';
  }).join('');

  return '' +
  '<section class="sec" id="sec-website">' +
    '<div class="sec-head">' +
      '<div class="sec-title"><span class="kicker">Step 06 · Last step</span>' +
        '<h2>Official website &amp; applying</h2>' +
        '<p>You have seen the whole profile — now go straight to the source. This button opens ' + esc(c.name) +
        '’s own website, where the application form, fee payment and notifications live.</p>' +
      '</div>' +
    '</div>' +

    '<div class="site-card">' +
      '<div>' +
        '<span class="pill pill--gold">Official website</span>' +
        '<h3>Apply on ' + esc(c.shortName) + '’s official website</h3>' +
        '<p>Everything on this page is a student-friendly summary. Fees, seat matrix, exam dates and application forms are updated by the college itself — always confirm them on the official website before you apply.</p>' +
        '<div class="site-btn">' +
          '<a class="btn btn--gold" id="sitePrimary" href="' + esc(c.website) + '" target="_blank" rel="noopener noreferrer" data-site="1" data-cid="' + esc(c.id) + '" data-frame="' + frameFlag(c) +
            '" data-label="' + esc(c.name) + '">' +
            ICONS.globe + 'Visit official website' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M14 5h5v5"/><path d="M19 5 10 14"/></svg>' +
          '</a>' +
          '<a class="btn btn--ghost" href="' + esc(c.admissionsUrl) + '" target="_blank" rel="noopener noreferrer" data-site="1" data-cid="' + esc(portalProxyId(c)) + '" data-frame="' + frameFlag(c) + '" data-label="' + esc(c.shortName) + ' admission portal">' + ICONS.book + 'Admission portal</a>' +
          '<button class="btn btn--ghost" data-copy="' + esc(c.website) + '">' + ICONS.link + 'Copy link</button>' +
          '<a class="btn btn--ghost" href="#sec-contact">' + ICONS.pin + 'Address &amp; directions</a>' +
        '</div>' +
        '<span class="tap-hint" id="siteHint">' + ICONS.globe + 'Tap the website box or the button above \u2014 both take you straight to ' +
          esc(c.website.replace(/^https?:\/\//, '')) + '</span>' +
        '<div class="site-note">Opens in a new tab where the browser allows it · ' + esc(groupLabelOf(c)) + ' · ' + esc(cityOf(c)) + '</div>' +

        (c.links && c.links.length ?
          '<div class="qlinks">' +
            '<h4>Real pages on ' + esc(c.shortName) + '\u2019s website</h4>' +
            '<div class="qlinks__grid">' +
              c.links.map(function(l){
                var domain = l.u.replace(/^https?:\/\//, '').split('/')[0];
                var path = l.u.replace(/^https?:\/\/[^/]+/, '').replace(/\/+$/, '') || '/';
                return '<a class="qn" href="' + esc(l.u) + '" target="_blank" rel="noopener noreferrer" data-site="1" data-cid="' + esc(c.id) + '" ' +
                  'data-frame="' + frameFlag(c) + '" data-label="' + esc(c.shortName + ' \u00b7 ' + l.t) + '">' +
                  ICONS.link + '<span>' + esc(l.t) + '<em>' + esc(domain + path) + '</em></span></a>';
              }).join('') +
            '</div>' +
            '<p class="qlinks__note">Checked on the official website: ' + esc(c.links.length) + ' live page' +
              (c.links.length > 1 ? 's' : '') + ' \u2014 each one opens, or shows a QR code if this preview blocks links.</p>' +
          '</div>' : '') +
      '</div>' +

      '<div class="site-side">' +
        '<a class="site-url" href="' + esc(c.website) + '" target="_blank" rel="noopener noreferrer" data-site="1" data-cid="' + esc(c.id) + '" data-frame="' + frameFlag(c) +
          '" data-label="' + esc(c.name) + '">' + ICONS.globe + '<span>' + esc(c.website) + '</span></a>' +
        '<div class="qr-card">' +
          '<span class="qr-card__code">' + qrSVG(c.website, 112) + '</span>' +
          '<span>' +
            '<h4>Open on your phone</h4>' +
            '<b>Scan this code</b>' +
            '<p>Your phone camera opens ' + esc(c.shortName) + '\u2019s official website straight away \u2014 no typing, no pop-ups.</p>' +
          '</span>' +
        '</div>' +
        '<div class="site-panel">' +
          '<h4>' + esc(isPSG(c) ? 'More institutions in the PSG group' : 'More colleges on CampusConnect') + '</h4>' +
          rows +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="quicknav">' +
      '<h4>Every college on this platform</h4>' +
      '<p>' + COLLEGES.length + ' colleges · tap any college to open its profile.</p>' +
      '<div class="quicknav__grid">' + quick + '</div>' +
    '</div>' +
  '</section>';
}


function deptListHTML(c){
  var q = cc.courseQuery.trim().toLowerCase();
  var level = cc.courseLevel;

  var matches = [];
  c.departments.forEach(function(d){
    var courses = d.courses.filter(function(cr){
      var levelOk = (level === 'All' || cr.level === level);
      var textOk = !q || (d.name + ' ' + cr.name + ' ' + cr.level).toLowerCase().indexOf(q) !== -1;
      return levelOk && textOk;
    });
    if (courses.length) matches.push({dept:d, courses:courses});
  });

  if (!matches.length){
    return '<div class="empty"><b>No courses match your search</b>Try a different keyword, or clear the filters to see all ' + countCourses(c) + ' programmes.</div>';
  }

  return matches.map(function(m, i){
    var openAttr = (matches.length <= 2 || (q !== '' && matches.length <= 3)) ? ' open' : (i === 0 && !q && level === 'All' ? ' open' : '');
    var rows = m.courses.map(function(cr){
      return '<div class="course">' +
        '<b>' + esc(cr.name) + '</b>' +
        '<span class="pill pill--blue">' + esc(cr.level) + '</span>' +
        '<div class="course__meta">' +
          '<span>' + ICONS.clock + esc(cr.duration) + '</span>' +
          '<span>' + ICONS.users + esc(cr.seats) + '</span>' +
        '</div>' +
        '<div class="course__el"><b style="color:var(--muted);font-weight:700">Eligibility:</b> ' + esc(cr.eligibility) + '</div>' +
      '</div>';
    }).join('');

    return '<details class="dept"' + openAttr + '>' +
      '<summary>' +
        '<span class="dept__ico">' + esc(m.dept.name.replace(/[^A-Za-z ]/g,'').trim().charAt(0)) + '</span>' +
        '<span class="dept__ttl"><b>' + esc(m.dept.name) + '</b><span>' + m.courses.length +
          ' programme' + (m.courses.length > 1 ? 's' : '') + (level === 'All' ? '' : ' · ' + esc(level)) + '</span></span>' +
        '<svg class="caret" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>' +
      '</summary>' +
      '<div class="dept__body"><p class="dept__blurb">' + esc(m.dept.blurb) + '</p>' + rows + '</div>' +
    '</details>';
  }).join('');
}

function pickerHTML(query){
  var q = (query || '').trim().toLowerCase();
  var html = '';
  var shown = 0;

  GROUP_ORDER.forEach(function(cat){
    var list = COLLEGES.filter(function(c){ return categoryOf(c) === cat; }).filter(function(c){
      if (!q) return true;
      var hay = (c.name + ' ' + c.shortName + ' ' + c.city + ' ' + c.state + ' ' + categoryOf(c) + ' ' +
        (isPSG(c) ? 'psg group ' : '') + (ITEM_NOTE[c.id] || '') + ' ' +
        c.departments.map(function(d){
          return d.name + ' ' + d.courses.map(function(x){ return x.name + ' ' + x.level; }).join(' ');
        }).join(' ')).toLowerCase();
      return hayMatches(hay.replace(/\./g, ''), q.replace(/\./g, ''));
    });
    if (!list.length) return;
    shown += list.length;
    html += '<div class="picker__group">' +
      '<div class="picker__gt">' + esc(groupLabelOfCategory(cat)) + '<span>' + list.length + '</span></div>' +
      list.map(function(c){
        return '<button class="pitem" data-open="' + esc(c.id) + '" aria-current="' + (c.id === cc.collegeId) + '">' +
          logoOrMono(c, 'pitem__logo', '') +
          '<span><b>' + esc(c.name) + '</b><span>' + esc(subLineOf(c)) +
            (ITEM_NOTE[c.id] ? ' · ' + esc(ITEM_NOTE[c.id]) : '') + '</span></span>' +
          '<span class="pitem__cat">' + esc(cat) + '</span>' +
        '</button>';
      }).join('') +
    '</div>';
  });

  if (!shown){
    html = '<div class="picker__empty" style="grid-column:1/-1">No college matches “' + esc(query) +
      '”. Try a city, a branch like “nursing” or “arts”, or clear the search.</div>';
  }
  return html;
}
var MEM_STORE = {};

function groupLabelOfCategory(cat){
  if (cat === 'Polytechnic') return 'Polytechnic · after Class 10';
  if (cat === 'Research') return 'Research & advanced studies';
  return cat;
}

var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

var WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];


/* ---- QR encoder (byte mode, versions 1-10) — for "open on your phone" ---- */
var GF_EXP = new Uint8Array(512), GF_LOG = new Uint8Array(256);
    (function () {
      var x = 1;
      for (var i = 0; i < 255; i++) { GF_EXP[i] = x; GF_LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11D; }
      for (var j = 255; j < 512; j++) GF_EXP[j] = GF_EXP[j - 255];
    })();
    function gfMul(a, b) { return (a === 0 || b === 0) ? 0 : GF_EXP[GF_LOG[a] + GF_LOG[b]]; }

      var EC_LEVELS = { L: { bits: 1, index: 0 }, M: { bits: 0, index: 1 }, Q: { bits: 3, index: 2 }, H: { bits: 2, index: 3 } };

    /* [totalCodewords, ecCodewordsPerBlock, dataCodewordsPerBlock...] per version, indexed by ECC */
      var BLOCKS = {
      L: { 1: [26, 7, 19], 2: [44, 10, 34], 3: [70, 15, 55], 4: [100, 20, 40, 40], 5: [134, 26, 54, 54],
           6: [172, 18, 68, 68], 7: [196, 20, 78, 78], 8: [242, 24, 97, 97], 9: [292, 30, 116, 116], 10: [346, 18, 68, 68, 69, 69] },
      M: { 1: [26, 10, 16], 2: [44, 16, 28], 3: [70, 26, 44], 4: [100, 18, 32, 32], 5: [134, 24, 43, 43],
           6: [172, 16, 27, 27, 27, 27], 7: [196, 18, 31, 31, 31, 31],
           8: [242, 22, 38, 38, 39, 39], 9: [292, 22, 36, 36, 36, 37, 37], 10: [346, 26, 43, 43, 43, 43, 44] },
      Q: { 1: [26, 13, 13], 2: [44, 22, 22], 3: [70, 18, 17, 17], 4: [100, 26, 24, 24], 5: [134, 18, 15, 15, 16, 16],
           6: [172, 24, 19, 19, 19, 19], 7: [196, 18, 14, 14, 15, 15], 8: [242, 22, 18, 18, 19, 19],
           9: [292, 20, 16, 16, 16, 17, 17], 10: [346, 24, 19, 19, 19, 19, 20, 20] },
      H: { 1: [26, 17, 9], 2: [44, 28, 16], 3: [70, 22, 13, 13], 4: [100, 16, 9, 9, 9, 9], 5: [134, 22, 11, 11, 12, 12],
           6: [172, 28, 15, 15, 15, 15], 7: [196, 26, 13, 13, 14, 14], 8: [242, 26, 14, 14, 15, 15],
           9: [292, 24, 12, 12, 12, 13, 13], 10: [346, 28, 15, 15, 15, 15, 16, 16] }
    };
      var ALIGN = { 1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34],
                  7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50] };

    function utf8(str) {
      var out = [], i, c;
      for (i = 0; i < str.length; i++) {
        c = str.charCodeAt(i);
        if (c < 0x80) out.push(c);
        else if (c < 0x800) out.push(0xC0 | (c >> 6), 0x80 | (c & 63));
        else if (c < 0xD800 || c >= 0xE000) out.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
        else { i++; c = 0x10000 + (((c & 0x3FF) << 10) | (str.charCodeAt(i) & 0x3FF));
          out.push(0xF0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63)); }
      }
      return out;
    }
    function dataCapacity(level, v) { var b = BLOCKS[level][v]; var n = 0; for (var i = 2; i < b.length; i++) n += b[i]; return n; }
    function chooseVersion(level, bytes) {
      for (var v = 1; v <= 10; v++) {
        var cc = v < 10 ? 8 : 16;
        if (dataCapacity(level, v) * 8 >= bytes.length * 8 + 4 + cc) return v;
      }
      return 10;
    }
    function buildCodewords(level, v, bytes) {
      var bits = [];
      function push(val, len) { for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); }
      push(4, 4);                       /* byte mode */
      push(bytes.length, v < 10 ? 8 : 16);
      for (var i = 0; i < bytes.length; i++) push(bytes[i], 8);
      var cap = dataCapacity(level, v) * 8;
      for (var t = 0; t < 4 && bits.length < cap; t++) bits.push(0);
      while (bits.length % 8) bits.push(0);
      var cw = [];
      for (var b = 0; b < bits.length; b += 8) { var byte = 0; for (var k = 0; k < 8; k++) byte = (byte << 1) | bits[b + k]; cw.push(byte); }
      var pad = [0xEC, 0x11], p = 0;
      while (cw.length < dataCapacity(level, v)) { cw.push(pad[p % 2]); p++; }
      return cw;
    }
    function rsGen(degree) {
      var poly = [1], i, k;
      for (i = 0; i < degree; i++) {
        var shifted = poly.concat([0]), scaled = poly.map(function (c) { return gfMul(c, GF_EXP[i]); });
        for (k = 0; k < scaled.length; k++) shifted[k + 1] ^= scaled[k];
        poly = shifted;
      }
      return poly;
    }
    function rsEncode(data, ecLen) {
      var gen = rsGen(ecLen), res = data.concat(new Array(ecLen).fill(0));
      for (var i = 0; i < data.length; i++) {
        var factor = res[i];
        if (!factor) continue;
        for (var j = 0; j < gen.length; j++) res[i + j] ^= gfMul(gen[j], factor);
      }
      return res.slice(data.length);
    }
    function interleave(level, v, cw) {
      var spec = BLOCKS[level][v], ecPer = spec[1], sizes = spec.slice(2);
      var blocks = [], off = 0;
      for (var b = 0; b < sizes.length; b++) {
        var chunk = cw.slice(off, off + sizes[b]); off += sizes[b];
        blocks.push({ data: chunk, ec: rsEncode(chunk, ecPer) });
      }
      var out = [], maxData = Math.max.apply(null, sizes), i;
      for (i = 0; i < maxData; i++) for (var b2 = 0; b2 < blocks.length; b2++) if (i < blocks[b2].data.length) out.push(blocks[b2].data[i]);
      for (i = 0; i < ecPer; i++) for (var b3 = 0; b3 < blocks.length; b3++) out.push(blocks[b3].ec[i]);
      return out;
    }
    function makeMatrix(level, version, codewords, mask) {
      var size = version * 4 + 17, dark = [], fn = [], y, x;
      for (y = 0; y < size; y++) { dark.push(new Uint8Array(size)); fn.push(new Uint8Array(size)); }
      function setFn(x, y, val) { dark[y][x] = val ? 1 : 0; fn[y][x] = 1; }
      function finder(cx, cy) {
        for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) {
          var xx = cx + dx, yy = cy + dy;
          if (xx < 0 || yy < 0 || xx >= size || yy >= size) continue;
          var d = Math.max(Math.abs(dx), Math.abs(dy));
          setFn(xx, yy, (d !== 2 && d <= 3) ? 1 : 0);
        }
      }
      finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
      for (var i = 8; i < size - 8; i++) { setFn(i, 6, i % 2 === 0 ? 1 : 0); setFn(6, i, i % 2 === 0 ? 1 : 0); }
      var ap = ALIGN[version] || [];
      for (var a = 0; a < ap.length; a++) for (var b = 0; b < ap.length; b++) {
        var px = ap[a], py = ap[b];
        if ((px === 6 && py === 6) || (px === 6 && py === size - 7) || (px === size - 7 && py === 6)) continue;
        for (var dy2 = -2; dy2 <= 2; dy2++) for (var dx2 = -2; dx2 <= 2; dx2++)
          setFn(px + dx2, py + dy2, (Math.max(Math.abs(dx2), Math.abs(dy2)) !== 1) ? 1 : 0);
      }
      setFn(8, size - 8, 1);                                   /* dark module */
      /* reserve the format-information areas (never overwrite the timing modules at 8,6 / 6,8) */
      for (var k = 0; k <= 8; k++) {
        if (k === 6) continue;
        setFn(8, k, 0);
        setFn(k, 8, 0);
      }
      for (var k2 = 0; k2 < 8; k2++) setFn(size - 1 - k2, 8, 0);
      for (var k3 = 8; k3 < 15; k3++) setFn(8, size - 15 + k3, 0);
      if (version >= 7) {
        for (var vi = 0; vi < 6; vi++) for (var vj = 0; vj < 3; vj++) {
          setFn(size - 11 + vj, vi, 0); setFn(vi, size - 11 + vj, 0);
        }
      }
      /* data placement, zig-zag from bottom-right */
      var bitIdx = 0, total = codewords.length * 8;
      for (var right = size - 1; right >= 1; right -= 2) {
        if (right === 6) right = 5;
        for (var vert = 0; vert < size; vert++) {
          for (var j = 0; j < 2; j++) {
            var x2 = right - j;
            var upward = ((right + 1) & 2) === 0;
            var y2 = upward ? size - 1 - vert : vert;
            if (fn[y2][x2]) continue;
            var val = 0;
            if (bitIdx < total) { val = (codewords[bitIdx >>> 3] >>> (7 - (bitIdx & 7))) & 1; bitIdx++; }
            if (mask !== null && mask !== undefined && maskFn(mask, x2, y2)) val ^= 1;
            dark[y2][x2] = val;
          }
        }
      }
      return { size: size, dark: dark };
    }
    function maskFn(m, x, y) {
      switch (m) {
        case 0: return (x + y) % 2 === 0;
        case 1: return y % 2 === 0;
        case 2: return x % 3 === 0;
        case 3: return (x + y) % 3 === 0;
        case 4: return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
        case 5: return (x * y) % 2 + (x * y) % 3 === 0;
        case 6: return ((x * y) % 2 + (x * y) % 3) % 2 === 0;
        case 7: return (((x + y) % 2) + (x * y) % 3) % 2 === 0;
      }
      return false;
    }
    function putFormat(dark, size, level, mask) {
      var ecBits = EC_LEVELS[level].bits;
      var data = (ecBits << 3) | mask, rem = data;
      for (var i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      var bits = ((data << 10) | rem) ^ 0x5412;
      function bit(i2) { return (bits >>> i2) & 1; }
      for (var a = 0; a <= 5; a++) dark[a][8] = bit(a);
      dark[7][8] = bit(6); dark[8][8] = bit(7); dark[8][7] = bit(8);
      for (var b = 9; b < 15; b++) dark[8][14 - b] = bit(b);
      for (var c = 0; c < 8; c++) dark[8][size - 1 - c] = bit(c);
      for (var d = 8; d < 15; d++) dark[size - 15 + d][8] = bit(d);
      dark[size - 8][8] = 1;
    }
    function putVersion(dark, size, version) {
      if (version < 7) return;
      var rem = version;
      for (var i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
      var bits = (version << 12) | rem;
      for (var j = 0; j < 18; j++) {
        var col = (bits >>> j) & 1, a = size - 11 + (j % 3), b = Math.floor(j / 3);
        dark[b][a] = col; dark[a][b] = col;
      }
    }
    function penalty(dark, size) {
      var p = 0, x, y, i;
      for (y = 0; y < size; y++) {
        var run = 1;
        for (x = 1; x < size; x++) {
          if (dark[y][x] === dark[y][x - 1]) run++; else { if (run >= 5) p += 3 + (run - 5); run = 1; }
        }
        if (run >= 5) p += 3 + (run - 5);
      }
      for (x = 0; x < size; x++) {
        var run2 = 1;
        for (y = 1; y < size; y++) {
          if (dark[y][x] === dark[y - 1][x]) run2++; else { if (run2 >= 5) p += 3 + (run2 - 5); run2 = 1; }
        }
        if (run2 >= 5) p += 3 + (run2 - 5);
      }
      for (y = 0; y < size - 1; y++) for (x = 0; x < size - 1; x++) {
        var c = dark[y][x];
        if (c === dark[y][x + 1] && c === dark[y + 1][x] && c === dark[y + 1][x + 1]) p += 3;
      }
      var pat1 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0], pat2 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
      function findPat(get) {
        for (var s = 0; s <= size - 11; s++) {
          var ok1 = true, ok2 = true;
          for (var k = 0; k < 11; k++) {
            var v = get(s + k);
            if (v !== pat1[k]) ok1 = false;
            if (v !== pat2[k]) ok2 = false;
          }
          if (ok1) p += 40;
          if (ok2) p += 40;
        }
      }
      for (y = 0; y < size; y++) { (function (yy) { findPat(function (s) { return dark[yy][s]; }); })(y); }
      for (x = 0; x < size; x++) { (function (xx) { findPat(function (s) { return dark[s][xx]; }); })(x); }
      var darkCount = 0;
      for (y = 0; y < size; y++) for (x = 0; x < size; x++) darkCount += dark[y][x];
      var pct = darkCount * 100 / (size * size);
      p += Math.floor(Math.abs(pct - 50) / 5) * 10;
      return p;
    }
      function qrMatrix(text, opts) {
      opts = opts || {};
      var level = opts.ecc || 'M';
      var bytes = utf8(String(text));
      var version = opts.version || chooseVersion(level, bytes);
      var codewords = interleave(level, version, buildCodewords(level, version, bytes));
      if (opts.mask !== undefined && opts.mask !== null) {
        var m = makeMatrix(level, version, codewords, opts.mask);
        putFormat(m.dark, m.size, level, opts.mask); putVersion(m.dark, m.size, version);
        return { size: m.size, version: version, mask: opts.mask, dark: m.dark };
      }
      var best = null;
      for (var mask = 0; mask < 8; mask++) {
        var mm = makeMatrix(level, version, codewords, mask);
        putFormat(mm.dark, mm.size, level, mask); putVersion(mm.dark, mm.size, version);
        var score = penalty(mm.dark, mm.size);
        if (!best || score < best.score) best = { score: score, size: mm.size, dark: mm.dark, mask: mask };
      }
      return { size: best.size, version: version, mask: best.mask, dark: best.dark };
    }

export {
  ICONS, COLLEGES, USERS, DEMO_CREDENTIALS, DEGREES, FACIL, MATCH, CATEGORY_OF, ITEM_NOTE, GROUP_ORDER, PROXY_ID, ROLE_COPY, NOT_SURE, ANY_DEGREE, STREAMS, WANT, STAY, HOSTELTYPE, TRAVEL, degreesFor, degreeRe, degreeMatches, courseMatches, fitScore, eligFor, storeGet, storeSet, storeDel, studentAccounts, studentLookup, isSeeded, saveStudentDetails, restoreStudentSession, saveStudentList, startStudentSession, studentColleges, studentVisible, stuPrefsLine, faciNote, subLineOf, hayMatches, collegesInGroup, categoryOf, isPSG, groupLabelOfCategory, proxyIdFor, portalProxyId, fmtLong, fmtShort, dayParts, countdownText, initials, collegeById, groupLabelOf, cityOf, nextAdmissionDate, upcomingEvents, esc, countCourses, selectionMode, qrSVG, pathFromUrl, logoOrMono, groupMarkHTML, mediaOf, stuCardHTML, heroHTML, aboutHTML, coursesHTML, admissionsHTML, eventsHTML, contactHTML, websiteHTML, deptListHTML, pickerHTML
};
