/* ============================================================
   THE PALACE OF THE SCHOLAR — JS Engine
   ============================================================ */
(function () {
  'use strict';

  /* ── State ── */
  let palaceActive = false;
  let dustRAF = null;
  let dustCanvas = null;
  let dustCtx = null;
  let dustParticles = [];
  let roomObserver = null;
  let hiddenEls = [];

  /* ── Konami ── */
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];
  let konamiIdx = 0;

  /* ── Room map ── */
  const ROOMS = [
    { id: 'room-entrance',    label: 'The Grand Entrance' },
    { id: 'room-chronicle',   label: "The Scholar's Chronicle" },
    { id: 'room-pursuits',    label: 'Pursuits of the Mind' },
    { id: 'room-journey',     label: 'The Grand Journey' },
    { id: 'room-manuscripts', label: 'Manuscripts & Treatises' },
    { id: 'room-workshop',    label: "The Inventor's Workshop" },
    { id: 'room-courtyard',   label: 'The Courtyard' }
  ];

  /* ── Content ── */
  const C = {
    chronicle: [
      `<span class="drop-cap">I</span>n the grand tradition of natural philosophers, Ashwin commenced his inquiries at the distinguished Academy of BITS Pilani, where the hidden mathematics governing the propagation of signals through the aether first captured his imagination.`,
      `His scholarly wanderings carried him across the continent — to the workshops of Braunschweig, where he laboured upon <em>reconfigurable metasurfaces</em>, ingenious panels capable of bending and directing invisible waves at one's command; and to the laboratories of Offenburg, where he constructed virtual testbeds for the fifth generation of wireless communion.`,
      `Now bearing the title of Marie Skłodowska-Curie Doctoral Fellow, he pursues the grand unification of sensing and communication at the esteemed <em>Silicon Austria Labs</em> and the Technische Universität Wien — endeavouring to teach the very air itself to see.`,
      `When not attending to his instruments, the scholar may be found at the cricket pitch, at the pianoforte, or composing curious arrangements upon his GarageBand contraption.`
    ],
    pursuits: [
      { icon:'fas fa-chess-rook', sub:'Digital Twins', title:'The Art of Mirrored Worlds', text:'The construction of ethereal replicas — faithful mirrors of the physical realm — through which one may observe, predict, and perfect the behaviour of wireless systems without disturbing the originals.' },
      { icon:'fas fa-compass',    sub:'Localization & Sensing', title:'Charting the Unseen', text:'The ancient art of determining one\'s position, reimagined through radar-based techniques, Kalman\'s elegant filter, and the fusion of multiple sensing instruments for precision tracking within enclosed spaces.' },
      { icon:'fas fa-wind',       sub:'Integrated Sensing & Communications', title:'The Dual Nature of Waves', text:'A grand pursuit: to bestow upon a single wave two noble purposes — to carry messages across great distances and simultaneously to perceive the world through which it travels.' }
    ],
    journey: [
      { logo:'images/sal.jpg',   alt:'SAL',  period:'January 2025 — Present',      title:'Appointed Doctoral Fellow of Natural Philosophy', org:'Silicon Austria Labs (SAL)', location:'Linz, Austria',             desc:'Commissioned under the patronage of Marie Skłodowska-Curie to investigate Intelligent Sensing and Communication for Perceptive Mobile Networks in the forthcoming Sixth Generation (ISAC-NEWTON).' },
      { logo:'images/tubs.jpeg', alt:'TUBS', period:'January — May 2025',           title:'Dispatched as Visiting Scholar to Braunschweig', org:'Technische Universität Braunschweig', location:'Braunschweig, Germany', desc:'Conducted a Master\'s thesis upon the development and simulation of Multi-User Reconfigurable Intelligent Surface communications at the venerable Institute for Communications Technology (IfN).' },
      { logo:'images/hso.jpg',   alt:'HSO',  period:'July — December 2024',         title:'Granted the Baden-Württemberg Scholarship', org:'Offenburg University of Applied Sciences', location:'Offenburg, Germany',     desc:'Completed a Bachelor\'s thesis on the conceptualisation of Fifth Generation use-cases within a Virtual Network at the Institute for Reliable Embedded Systems (ivESK).' },
      { logo:'images/csio.jpg',  alt:'CSIO', period:'May — July 2022',              title:'Summoned as Research Apprentice', org:'CSIR — Central Scientific Instruments Organisation', location:'Chandigarh, India',      desc:'Apprenticed at the Centre of Excellence for Intelligent Sensors, developing a recommendation algorithm founded upon the curious principles of hyperbolic geometry and Poincaré embeddings.' },
      { logo:'images/hpe.jpg',   alt:'HPE',  period:'January — April 2022',         title:'Commissioned as Trainee', org:'Hewlett Packard Enterprises', location:'Remote',                                              desc:'Studied the arts of Azure Machine Learning, Natural Language Processing, and Computer Vision under the enterprise\'s tutelage.' }
    ],
    manuscripts: [
      { title:'LiDAR-Enabled Spatial Awareness for Beamforming in IRS-Assisted Wireless Communication Systems', venue:'IEEE Conference on Advanced Networks and Telecommunications Systems (ANTS), IIT Guwahati, 2024', authors:'<strong>A. S. Kumar</strong>, S. Joshi', url:'https://doi.org/10.1109/ANTS63515.2024.10898544', label:'View Treatise', citation:'A. S. Kumar and S. Joshi, "LiDAR-Enabled Spatial Awareness for Beamforming in IRS-Assisted Wireless Communication System," 2024 IEEE ANTS, Guwahati, India, 2024, pp. 1-6, doi: 10.1109/ANTS63515.2024.10898544.' },
      { title:'High-Resolution Aluminum-Based Plasmonic Devices Using Metamaterials for Cancer Cell Detection', venue:'Metamaterials XIV, SPIE Photonics Europe, Strasbourg, 2024', authors:'<strong>A. Sathish Kumar</strong>, D. Mahanta, P. Arora', badge:'Conference Poster', url:'https://doi.org/10.1117/12.3021474', label:'View Poster', citation:'A. Sathish Kumar, D. Mahanta, P. Arora. High-resolution aluminum-based plasmonic devices using metamaterials for cancer cell detection. Proc. SPIE PC12990, Metamaterials XIV, 2024.' }
    ],
    workshop: [
      { title:'The Virtual Fifth-Generation Testbed',          desc:'A system of programmable interfaces for a virtualised testbed employing Open5GS and UERANSIM — implementing three distinct use-cases: enhanced broadband, ultra-reliable low-latency, and massive machine-type communion.',                                                        img:'images/open5gs.png',     github:'https://github.com/ashwinsathish/Open5GS-API',              paper:null },
      { title:'The Crystal of Photonic Resonance',             desc:'A photonic crystal-based surface plasmon resonance sensor employing silicon and platinum diselenide stacks, achieving a remarkable sensitivity of 101.1 degrees per refractive index unit.',                                                                                        img:'images/phc.png',         github:'https://github.com/ashwinsathish/PhC-SPR-Biosensor',        paper:null },
      { title:'The Light-Ranging Beam Former',                 desc:'A spatially-aware beamforming framework that marries Light Detection and Ranging with Intelligent Reflecting Surfaces, demonstrating improved achievable rates through LiDAR-guided element grouping.',                                                                              img:'images/lidar.png',       github:'https://github.com/ashwinsathish/LiDAR-IRS-Beamforming',   paper:'https://doi.org/10.1109/ANTS63515.2024.10898544' },
      { title:'The Metamaterial Cancer Detection Apparatus',   desc:'An aluminium-based surface plasmon resonance sensor augmented with metamaterial, titanium dioxide, and molybdenum disulphide coatings, designed for the detection of cancerous cells at 101.2°/RIU.',                                                                              img:'images/metamaterial.png',github:'https://github.com/ashwinsathish/Metamaterial-SPR-Biosensor',paper:'https://doi.org/10.1117/12.3021474' },
      { title:'The Finite-Difference Time Analyser',           desc:'An analysis upon a three-dimensional concrete-rebar structure using the finite-difference time-domain method with staircase approximations and Mur\'s second-order absorbing boundary conditions.',                                                                               img:'images/fdtd.png',        github:'https://github.com/ashwinsathish/FDTD-analysis',            paper:null }
    ]
  };

  /* ── Floating geometry (MV palette colors) ── */
  const GEO = [
    { svg:`<svg viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 4 L56 18 L56 52 L30 66 L4 52 L4 18 Z" stroke="#7AADA6" stroke-width="0.8"/><line x1="30" y1="4" x2="30" y2="66" stroke="#7AADA6" stroke-width="0.4" opacity="0.45"/><line x1="4" y1="18" x2="56" y2="52" stroke="#7AADA6" stroke-width="0.4" opacity="0.3"/><line x1="56" y1="18" x2="4" y2="52" stroke="#7AADA6" stroke-width="0.4" opacity="0.3"/></svg>`, top:'8%', right:'6%', w:80, anim:'geoDrift 24s ease-in-out infinite', op:0.18 },
    { svg:`<svg viewBox="0 0 46 86" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 86 L5 33 Q5 4 23 4 Q41 4 41 33 L41 86" stroke="#CFA455" stroke-width="0.8"/><path d="M12 86 L12 36 Q12 14 23 14 Q34 14 34 36 L34 86" stroke="#CFA455" stroke-width="0.4" opacity="0.35"/></svg>`, top:'22%', left:'3%', w:52, anim:'geoFloat 20s ease-in-out infinite', op:0.16 },
    { svg:`<svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="25,2 48,25 25,48 2,25" stroke="#C47E8E" stroke-width="0.9"/><polygon points="25,10 40,25 25,40 10,25" stroke="#C47E8E" stroke-width="0.4" opacity="0.4"/></svg>`, bottom:'22%', left:'7%', w:52, anim:'geoRotate 38s linear infinite', op:0.18 },
    { svg:`<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 76 L4 56 L24 56 L24 36 L44 36 L44 16 L64 16 L64 4 L76 4" stroke="#7AADA6" stroke-width="0.9"/><path d="M4 76 L14 76 L14 66 L34 66 L34 46 L54 46 L54 26 L74 26 L74 4" stroke="#7AADA6" stroke-width="0.4" opacity="0.4"/></svg>`, bottom:'14%', right:'5%', w:82, anim:'geoFloat 26s ease-in-out infinite 3s', op:0.16 },
    { svg:`<svg viewBox="0 0 58 54" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="29,3 55,50 3,50" stroke="#CFA455" stroke-width="0.9"/><polygon points="29,14 46,46 12,46" stroke="#CFA455" stroke-width="0.4" opacity="0.38"/></svg>`, top:'52%', right:'4%', w:60, anim:'geoFloat 19s ease-in-out infinite 2s', op:0.15 },
    { svg:`<svg viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="29" cy="29" r="26" stroke="#7AADA6" stroke-width="0.8"/><circle cx="29" cy="29" r="16" stroke="#7AADA6" stroke-width="0.4" opacity="0.5"/><line x1="29" y1="3" x2="29" y2="55" stroke="#7AADA6" stroke-width="0.35" opacity="0.35"/><line x1="3" y1="29" x2="55" y2="29" stroke="#7AADA6" stroke-width="0.35" opacity="0.35"/><polygon points="29,7 32,18 29,15 26,18" fill="#7AADA6" opacity="0.5"/></svg>`, top:'8%', left:'8%', w:64, anim:'geoRotate 42s linear infinite reverse', op:0.14 },
    { svg:`<svg viewBox="0 0 90 28" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="10,2 18,14 10,26 2,14" stroke="#C47E8E" stroke-width="0.7" opacity="0.7"/><polygon points="45,2 53,14 45,26 37,14" stroke="#CFA455" stroke-width="0.7" opacity="0.5"/><polygon points="80,2 88,14 80,26 72,14" stroke="#C47E8E" stroke-width="0.7" opacity="0.3"/></svg>`, bottom:'8%', left:'50%', w:100, anim:'geoDrift 30s ease-in-out infinite 5s', op:0.14 },
    { svg:`<svg viewBox="0 0 34 52" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 52 L4 20 Q4 3 17 3 Q30 3 30 20 L30 52" stroke="#CFA455" stroke-width="0.8" opacity="0.6"/></svg>`, top:'5%', right:'18%', w:38, anim:'geoFloat 17s ease-in-out infinite 1.5s', op:0.14 }
  ];

  /* ── Helpers ── */
  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  function ornamentDivider() {
    return `<div class="ornament-divider"><div class="ornament-diamond"></div></div>`;
  }

  function roomHeading(title, sub) {
    return `<div class="animate-in s1" style="text-align:center;margin-bottom:1.8rem;">
      ${ornamentDivider()}
      <h2 class="palace-room-title">${title}</h2>
      ${sub ? `<p class="palace-room-intro">${sub}</p>` : ''}
      ${ornamentDivider()}
    </div>`;
  }

  /* ── Room builders ── */
  function buildEntrance() {
    const li = document.querySelector('header .profile-icon-link[title="LinkedIn"]');
    const gh = document.querySelector('header .profile-icon-link[title="GitHub"]');
    const sc = document.querySelector('header .profile-icon-link[title="Google Scholar"]');
    const el = document.querySelector('header .profile-icon-link[title="Elsevier Pure"]');
    return `<section class="palace-room room-entrance room-visible" id="room-entrance">
      <div class="palace-room-inner" style="display:flex;flex-direction:column;align-items:center;">
        <div class="palace-photo-wrap animate-in s1">
          <img src="images/profile.jpg" alt="Ashwin Sathish Kumar"/>
        </div>
        <div class="animate-in s2">${ornamentDivider()}</div>
        <h1 class="palace-name animate-in s3">Ashwin Sathish Kumar</h1>
        <p class="palace-epithet animate-in s3">Scholar of the Invisible Waves</p>
        <p class="palace-affiliation animate-in s4">Marie Skłodowska-Curie Doctoral Fellow &nbsp;·&nbsp; Silicon Austria Labs &nbsp;·&nbsp; TU Wien</p>
        <div class="entrance-icons animate-in s5">
          <a href="${li ? li.href : '#'}" target="_blank" class="entrance-icon-link">
            <i class="fas fa-scroll"></i><span class="entrance-icon-label">Résumé</span>
          </a>
          <a href="${gh ? gh.href : '#'}" target="_blank" class="entrance-icon-link">
            <i class="fas fa-compass"></i><span class="entrance-icon-label">Workshop</span>
          </a>
          <a href="${sc ? sc.href : '#'}" target="_blank" class="entrance-icon-link">
            <i class="fas fa-feather-pointed"></i><span class="entrance-icon-label">Treatises</span>
          </a>
          <a href="${el ? el.href : '#'}" target="_blank" class="entrance-icon-link">
            <i class="fas fa-book-open"></i><span class="entrance-icon-label">Library</span>
          </a>
        </div>
        <div class="animate-in s6">${ornamentDivider()}</div>
      </div>
      <div class="palace-scroll-hint"><span>Begin the Tour</span><i class="fas fa-chevron-down" style="font-size:0.65rem;"></i></div>
    </section>`;
  }

  function buildChronicle() {
    const paras = C.chronicle.map(p => `<p>${p}</p>`).join('');
    return `<section class="palace-room room-chronicle" id="room-chronicle">
      <div class="palace-room-inner">
        ${roomHeading("The Scholar's Chronicle", 'A life in pursuit of the unseen')}
        <div class="palace-parchment animate-in s2">${paras}</div>
      </div>
    </section>`;
  }

  function buildPursuits() {
    const cards = C.pursuits.map((p, i) => `
      <div class="pursuit-card animate-in s${i+2}">
        <i class="${p.icon} pursuit-icon"></i>
        <div class="pursuit-subtitle">${p.sub}</div>
        <div class="pursuit-title">${p.title}</div>
        <p class="pursuit-text">${p.text}</p>
      </div>`).join('');
    return `<section class="palace-room room-pursuits" id="room-pursuits">
      <div class="palace-room-inner">
        ${roomHeading('Pursuits of the Mind', 'The domains wherein the scholar labours')}
        <div class="pursuits-grid">${cards}</div>
      </div>
    </section>`;
  }

  function buildJourney() {
    const entries = C.journey.map((e, i) => `
      <div class="journey-entry animate-in s${Math.min(i+2,7)}">
        <div class="journey-logo-wrap">
          <img class="journey-logo" src="${e.logo}" alt="${e.alt}"/>
        </div>
        <div class="journey-dot-col"><div class="journey-dot"></div></div>
        <div class="journey-frame">
          <div class="journey-period">${e.period}</div>
          <div class="journey-title">${e.title}</div>
          <div class="journey-org">${e.org}</div>
          <p class="journey-desc">${e.desc}</p>
          <div class="journey-location"><i class="fas fa-location-dot" style="font-size:0.65rem;opacity:0.5;"></i>${e.location}</div>
        </div>
      </div>`).join('');
    return `<section class="palace-room room-journey" id="room-journey">
      <div class="palace-room-inner">
        ${roomHeading('The Grand Journey', 'Appointments and commissions across the realm')}
        <div class="journey-timeline">
          <div class="journey-thread"></div>
          ${entries}
        </div>
      </div>
    </section>`;
  }

  function buildManuscripts() {
    const cards = C.manuscripts.map((m, i) => {
      const badge = m.badge ? `<span class="manuscript-badge">${m.badge}</span>` : '';
      return `<div class="manuscript-card animate-in s${i+2}">
        <div class="manuscript-title">${m.title}${badge}</div>
        <div class="manuscript-venue">${m.venue}</div>
        <div class="manuscript-authors">${m.authors}</div>
        <div class="manuscript-actions">
          <a href="${m.url}" target="_blank" class="palace-seal-btn"><i class="fas fa-scroll" style="font-size:0.75rem;"></i>${m.label}</a>
          <button class="palace-quill-btn" data-citation="${m.citation.replace(/"/g,'&quot;')}" title="Copy citation">
            <i class="fas fa-feather-pointed"></i>
          </button>
        </div>
      </div>`;
    }).join('');
    return `<section class="palace-room room-manuscripts" id="room-manuscripts">
      <div class="palace-room-inner">
        ${roomHeading('Manuscripts & Treatises', 'Works submitted to the learned academies')}
        ${cards}
      </div>
    </section>`;
  }

  function buildWorkshop() {
    const cards = C.workshop.map((w, i) => {
      const btnPaper = w.paper ? `<a href="${w.paper}" target="_blank" class="invention-btn"><i class="fas fa-scroll" style="font-size:0.7rem;"></i> Treatise</a>` : '';
      return `<div class="invention-card animate-in s${Math.min(i+2,6)}">
        <img class="invention-image" src="${w.img}" alt="${w.title}"/>
        <div class="invention-title">${w.title}</div>
        <p class="invention-desc">${w.desc}</p>
        <div class="invention-actions">
          <a href="${w.github}" target="_blank" class="invention-btn"><i class="fas fa-compass" style="font-size:0.7rem;"></i> Blueprints</a>
          ${btnPaper}
        </div>
      </div>`;
    }).join('');
    return `<section class="palace-room room-workshop" id="room-workshop">
      <div class="palace-room-inner">
        ${roomHeading("The Inventor's Workshop", 'Contraptions and creations from the atelier')}
        <div class="projects-grid">${cards}</div>
      </div>
    </section>`;
  }

  function buildCourtyard() {
    return `<section class="palace-room room-courtyard" id="room-courtyard">
      <div class="palace-room-inner" style="display:flex;flex-direction:column;align-items:center;">
        <div class="animate-in s1">${ornamentDivider()}</div>
        <h2 class="palace-room-title animate-in s2">The Courtyard</h2>
        <p class="courtyard-intro animate-in s3">Should you wish to parley with the scholar, the gates are open.</p>
        ${ornamentDivider()}
        <div class="courtyard-contacts animate-in s4">
          <a href="mailto:ashwins2003@hotmail.com" class="courtyard-contact"><i class="fas fa-feather-pointed"></i>Dispatch a Letter</a>
          <a href="https://github.com/ashwinsathish" target="_blank" class="courtyard-contact"><i class="fas fa-compass"></i>Visit the Workshop</a>
          <a href="https://www.linkedin.com/in/ashwins-860442226/" target="_blank" class="courtyard-contact"><i class="fas fa-scroll"></i>Request an Audience</a>
        </div>
        <p class="courtyard-location animate-in s5"><i class="fas fa-location-dot" style="margin-right:5px;opacity:0.5;font-size:0.8rem;"></i>The scholar resides in Linz, Austria</p>
        <div class="courtyard-return animate-in s6">
          <p class="courtyard-return-hint">Thou hast seen the palace.</p>
          <button class="palace-cta" id="palace-exit-courtyard">
            <i class="fas fa-door-open" style="font-size:0.85rem;"></i>Return to the Present
          </button>
        </div>
      </div>
    </section>`;
  }

  /* ── Build full palace DOM ── */
  function buildPalace() {
    loadFonts();

    const palace = document.createElement('div');
    palace.id = 'palace';

    /* Geometry shapes */
    const geoEl = document.createElement('div');
    geoEl.id = 'palace-geometry';
    GEO.forEach(g => {
      const wrap = document.createElement('div');
      wrap.className = 'palace-geo';
      wrap.style.cssText = [
        g.top    ? `top:${g.top};`       : '',
        g.bottom ? `bottom:${g.bottom};` : '',
        g.left   ? `left:${g.left};`     : '',
        g.right  ? `right:${g.right};`   : '',
        g.left && g.left === '50%' ? 'transform:translateX(-50%);' : '',
        `width:${g.w}px;`,
        `opacity:${g.op};`,
        `animation:${g.anim};`
      ].join('');
      wrap.innerHTML = g.svg;
      geoEl.appendChild(wrap);
    });
    palace.appendChild(geoEl);

    /* Particle canvas */
    const canvas = document.createElement('canvas');
    canvas.id = 'palace-particles';
    palace.appendChild(canvas);

    /* Rooms */
    const roomsEl = document.createElement('div');
    roomsEl.id = 'palace-rooms';
    roomsEl.innerHTML =
      buildEntrance() +
      buildChronicle() +
      buildPursuits() +
      buildJourney() +
      buildManuscripts() +
      buildWorkshop() +
      buildCourtyard();
    palace.appendChild(roomsEl);

    /* Navigation */
    const nav = document.createElement('nav');
    nav.id = 'palace-nav';
    nav.innerHTML = ROOMS.map((r, i) => `
      <div class="palace-nav-item${i===0?' active':''}" data-room="${r.id}">
        <span class="palace-nav-label">${r.label}</span>
        <div class="palace-nav-dot"></div>
      </div>`).join('');
    palace.appendChild(nav);

    /* Exit button */
    const exitBtn = document.createElement('button');
    exitBtn.id = 'palace-exit-btn';
    exitBtn.innerHTML = `<i class="fas fa-door-open" style="font-size:0.8rem;"></i>Leave`;
    palace.appendChild(exitBtn);

    document.body.appendChild(palace);
    return palace;
  }

  /* ── Fonts ── */
  function loadFonts() {
    if (document.getElementById('palace-fonts')) return;
    const link = document.createElement('link');
    link.id = 'palace-fonts'; link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap';
    document.head.appendChild(link);
  }

  /* ── Column transition ── */
  const COL_COUNT = 6;
  const COL_STAGGER = 52; // ms between each column
  const COL_DURATION = 500; // ms per column transition

  function buildColumnsEl() {
    const el = document.createElement('div');
    el.id = 'palace-columns';
    for (let i = 0; i < COL_COUNT; i++) {
      const col = document.createElement('div');
      col.className = 'palace-col';
      col.style.transitionDelay = `${i * COL_STAGGER}ms`;
      el.appendChild(col);
    }
    return el;
  }

  /* Drop columns down to cover screen */
  async function columnsDown(colsEl) {
    colsEl.classList.add('glowing');
    await delay(20);
    colsEl.querySelectorAll('.palace-col').forEach(c => c.classList.add('down'));
    // Wait for last column to finish dropping
    await delay(COL_DURATION + (COL_COUNT - 1) * COL_STAGGER + 80);
  }

  /* Retract columns upward to reveal content beneath */
  async function columnsUp(colsEl) {
    const cols = Array.from(colsEl.querySelectorAll('.palace-col'));
    cols.forEach((c, i) => {
      c.style.transitionDelay = `${i * 42}ms`;
      c.classList.remove('down');
    });
    await delay(COL_DURATION + (COL_COUNT - 1) * 42 + 80);
    colsEl.remove();
  }

  /* ── Dust particles ── */
  function startDust() {
    dustCanvas = document.getElementById('palace-particles');
    if (!dustCanvas) return;
    dustCtx = dustCanvas.getContext('2d');
    dustParticles = [];

    function resize() {
      dustCanvas.width  = window.innerWidth;
      dustCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function tick() {
      dustCtx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
      if (dustParticles.length < 38 && Math.random() > 0.65) {
        dustParticles.push({
          x: Math.random() * dustCanvas.width,
          y: dustCanvas.height + 6,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -(Math.random() * 0.5 + 0.22),
          size: Math.random() * 2 + 0.7,
          op: Math.random() * 0.4 + 0.15,
          col: Math.random() > 0.5 ? '#CFA455' : '#A96058',
          life: 0
        });
      }
      dustParticles = dustParticles.filter(p => p.y > -20);
      dustParticles.forEach(p => {
        p.x  += p.vx + Math.sin(p.life * 0.04) * 0.12;
        p.y  += p.vy;
        p.life++;
        const fadeIn  = Math.min(p.life / 25, 1);
        const fadeOut = p.y < 90 ? p.y / 90 : 1;
        dustCtx.globalAlpha = p.op * fadeIn * fadeOut;
        dustCtx.fillStyle = p.col;
        dustCtx.beginPath();
        dustCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        dustCtx.fill();
      });
      dustCtx.globalAlpha = 1;
      dustRAF = requestAnimationFrame(tick);
    }
    tick();
  }

  function stopDust() {
    if (dustRAF) { cancelAnimationFrame(dustRAF); dustRAF = null; }
    dustCanvas = null; dustCtx = null; dustParticles = [];
  }

  /* ── Room observer ── */
  function setupObserver() {
    const roomsEl = document.getElementById('palace-rooms');
    if (!roomsEl) return;
    roomObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('room-visible');
          updateNav(entry.target.id);
        }
      });
    }, { root: roomsEl, threshold: 0.38 });
    document.querySelectorAll('.palace-room').forEach(r => roomObserver.observe(r));
  }

  function updateNav(activeId) {
    document.querySelectorAll('.palace-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.room === activeId);
    });
  }

  function setupNavClicks() {
    document.querySelectorAll('.palace-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const room = document.getElementById(item.dataset.room);
        if (room) room.scrollIntoView({ behavior: 'smooth' });
      });
    });
    const exitBtn = document.getElementById('palace-exit-btn');
    if (exitBtn) exitBtn.addEventListener('click', exitPalace);
    const courtyardExit = document.getElementById('palace-exit-courtyard');
    if (courtyardExit) courtyardExit.addEventListener('click', exitPalace);
  }

  /* ── Citation copy ── */
  function setupPalaceCitations() {
    document.querySelectorAll('.palace-quill-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.dataset.citation;
        if (!text) return;
        try {
          await navigator.clipboard.writeText(text);
          const orig = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check" style="color:#7AADA6;"></i>';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        } catch(e) {}
      });
    });
  }

  /* ── Hide / restore professional site ── */
  function hideSite() {
    hiddenEls = Array.from(document.querySelectorAll('body > nav, body > header, body > section, body > footer, body > .back-to-top, body > #modal-container'));
    hiddenEls.forEach(el => { el.style.display = 'none'; });
    document.body.classList.add('palace-active');
  }
  function restoreSite() {
    hiddenEls.forEach(el => { el.style.display = ''; });
    document.body.classList.remove('palace-active');
    hiddenEls = [];
  }

  /* ── Activate ── */
  async function activatePalace(skipTransition) {
    if (palaceActive) return;
    palaceActive = true;
    localStorage.setItem('palace-mode', 'on');

    if (!skipTransition) {
      // Columns drop from top — cover professional site
      const colsEl = buildColumnsEl();
      document.body.appendChild(colsEl);
      await columnsDown(colsEl);

      // Build palace silently behind the columns
      hideSite();
      const palace = buildPalace();

      // Hold 280ms, then retract columns to reveal palace
      await delay(280);
      await columnsUp(colsEl);

      startDust();
      setupObserver();
      setupNavClicks();
      setupPalaceCitations();
      setupCursorGlow();

      const entrance = document.getElementById('room-entrance');
      if (entrance) entrance.classList.add('room-visible');
    } else {
      // Restoring from localStorage: simple fade
      const overlay = getOrCreateOverlay();
      overlay.classList.add('active');
      await delay(600);
      hideSite();
      buildPalace();
      overlay.classList.remove('active');
      startDust();
      setupObserver();
      setupNavClicks();
      setupPalaceCitations();
      setupCursorGlow();
      const entrance = document.getElementById('room-entrance');
      if (entrance) entrance.classList.add('room-visible');
    }

    console.log('%c The Palace of the Scholar is open. ', 'background:#2A2348;color:#CFA455;font-family:serif;font-size:13px;padding:4px 10px;border-radius:2px;');
  }

  /* ── Deactivate ── */
  async function exitPalace() {
    if (!palaceActive) return;
    palaceActive = false;
    localStorage.removeItem('palace-mode');

    // Columns drop over the palace
    const colsEl = buildColumnsEl();
    document.body.appendChild(colsEl);
    await columnsDown(colsEl);

    // Swap: remove palace, restore site behind columns
    await delay(200);
    teardownCursorGlow();
    stopDust();
    if (roomObserver) { roomObserver.disconnect(); roomObserver = null; }
    const palace = document.getElementById('palace');
    if (palace) palace.remove();
    restoreSite();

    // Retract columns to reveal professional site
    await delay(100);
    await columnsUp(colsEl);

    console.log('Returned to the present.');
  }

  function getOrCreateOverlay() {
    let o = document.getElementById('palace-transition');
    if (!o) {
      o = document.createElement('div');
      o.id = 'palace-transition';
      document.body.appendChild(o);
    }
    return o;
  }

  /* ── Ambient cursor glow ── */
  let cursorCleanup = null;

  function setupCursorGlow() {
    const palace = document.getElementById('palace');
    if (!palace) return;
    const handler = e => {
      palace.style.setProperty('--px', (e.clientX / window.innerWidth  * 100).toFixed(1) + '%');
      palace.style.setProperty('--py', (e.clientY / window.innerHeight * 100).toFixed(1) + '%');
    };
    palace.addEventListener('mousemove', handler, { passive: true });
    cursorCleanup = () => palace.removeEventListener('mousemove', handler);
  }

  function teardownCursorGlow() {
    if (cursorCleanup) { cursorCleanup(); cursorCleanup = null; }
  }

  /* ── Thought bubble ── */
  function showBubble() {
    if (document.getElementById('palace-bubble')) return;
    loadFonts();

    const trigger = document.getElementById('freaky-trigger');
    if (!trigger) return;

    const bubble = document.createElement('div');
    bubble.id = 'palace-bubble';
    bubble.innerHTML = `
      <button id="palace-bubble-close" title="Close">×</button>
      <div class="bubble-eyebrow">Psst —</div>
      <div class="bubble-headline">Art thou of the royalty?</div>
      <div class="bubble-body">This seal conceals another world entirely. One of old stones, candlelight, and Renaissance wonder.</div>
      <div class="bubble-actions">
        <button id="bubble-enter">Enter the Palace ✦</button>
        <button id="bubble-stay">I shall remain</button>
      </div>`;
    trigger.appendChild(bubble);

    bubble.querySelector('#palace-bubble-close').addEventListener('click', e => {
      e.stopPropagation(); closeBubble();
    });
    bubble.querySelector('#bubble-stay').addEventListener('click', e => {
      e.stopPropagation(); closeBubble();
    });
    bubble.querySelector('#bubble-enter').addEventListener('click', e => {
      e.stopPropagation(); closeBubble(); activatePalace(false);
    });

    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', closeBubbleOutside);
    }, 10);
  }

  function closeBubble() {
    const bubble = document.getElementById('palace-bubble');
    if (bubble) bubble.remove();
    document.removeEventListener('click', closeBubbleOutside);
  }

  function closeBubbleOutside(e) {
    const trigger = document.getElementById('freaky-trigger');
    if (trigger && !trigger.contains(e.target)) closeBubble();
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    getOrCreateOverlay();

    const trigger = document.getElementById('freaky-trigger');
    if (trigger) {
      trigger.addEventListener('click', e => {
        e.stopPropagation();
        if (document.getElementById('palace-bubble')) {
          closeBubble();
        } else {
          showBubble();
        }
      });
    }

    /* Konami */
    document.addEventListener('keydown', e => {
      if (e.code === KONAMI[konamiIdx]) {
        konamiIdx++;
        if (konamiIdx === KONAMI.length) {
          konamiIdx = 0;
          palaceActive ? exitPalace() : activatePalace(false);
        }
      } else { konamiIdx = 0; }
    });

    /* Restore from localStorage */
    if (localStorage.getItem('palace-mode') === 'on') activatePalace(true);
  });

})();
