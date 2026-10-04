/* scene3d.js
   Add ONE line before </body> in index.html:  <script src="scene3d.js"></script>
   Part 1 syncs the page with Abrar_Ahmed_CV.pdf. Part 2 adds the scroll-driven 3D background. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ========== PART 1: CV INFO (edit the text here any time) ========== */
  function syncCV() {
    $$('a.btn-cv').forEach(function (a) { a.setAttribute('href', 'Abrar_Ahmed_CV.pdf'); });

    var links = { 'SentinelPay': 'Fraud_Detection_Machine_Learning', 'CineMatch': 'Movie_Recommendation_System' };
    $$('.proj-item').forEach(function (p) {
      var n = ($('.proj-name', p) || {}).textContent || '';
      Object.keys(links).forEach(function (k) {
        var a = $('.proj-overlay', p);
        if (n.indexOf(k) > -1 && a) a.href = 'https://github.com/abrar35-cyber/' + links[k];
      });
    });

    var skills = {
      'AI & Emerging Tech': 'Generative AI, Agentic AI, LLMs, AI-assisted coding, AI tool integration, prompt engineering, RAG.',
      'Programming & ML': 'Python (pandas, numpy), scikit-learn, Next.js, FastAPI, HTML, CSS.',
      'Technical Understanding': 'Software development lifecycle, database concepts (SQL, SQLite), basic web technologies, information security concepts (KYC principles).',
      'Professional Skills': 'Resource coordination, stakeholder communication, cross-functional collaboration, time management, multitasking, documentation, follow-up and status tracking.'
    };
    $$('.svc-card').forEach(function (c) {
      var n = ($('.svc-name', c) || {}).textContent, d = $('.svc-desc', c);
      if (skills[n] && d) d.textContent = skills[n];
    });

    var t = $('.experience-title');
    if (t) t.innerHTML = 'Experience, Hackathon<br>&amp; Education.';
    var grid = $('.experience-grid');
    if (grid && !$('[data-cv]', grid)) {
      grid.insertAdjacentHTML('beforeend',
        '<div class="exp-card" data-cv><div class="exp-meta"><span>Pak Angels Hackathon</span><span>September 2026</span></div>' +
        '<div class="exp-role">Group Leader</div><div class="exp-company">Team of 6 members</div>' +
        '<ul class="exp-list"><li>Led a team of 6 members as group leader, coordinating the team to build Maamta AI, a source-grounded maternal and newborn health triage assistant, during the hackathon.</li></ul></div>' +
        '<div class="exp-card" data-cv><div class="exp-meta"><span>Education</span><span>2022 - 2025</span></div>' +
        '<div class="exp-role">Bachelor of Science (Computer Science)</div><div class="exp-company">University of Sindh, Jamshoro</div></div>');
    }

    var cg = $('.certifications-grid');
    if (cg && !$('[data-cv]', cg)) {
      ['Digiskills WordPress', 'Digiskills Graphic Design', 'Digiskills Freelancing'].forEach(function (n) {
        cg.insertAdjacentHTML('beforeend', '<div class="cert-card" data-cv><div class="cert-provider">Digiskills</div><div class="cert-name">' + n + '</div></div>');
      });
    }
    $$('.astat').forEach(function (s) {
      var l = $('.astat-l', s), n = $('.astat-n', s);
      if (l && n && /certification/i.test(l.textContent)) n.setAttribute('data-target', '6');
    });
  }
  syncCV();

  /* ========== PART 2: 3D BACKGROUND ========== */
  var st = document.createElement('style');
  st.textContent =
    '#gl3d{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;display:block}' +
    'section,footer{position:relative;z-index:1}' +
    '#home{background:color-mix(in srgb,var(--hero-bg) 45%,transparent)!important}' +
    'section:not(#home){background:color-mix(in srgb,var(--bg) 68%,transparent)!important}' +
    '@media(max-width:900px){section:not(#home){background:color-mix(in srgb,var(--bg) 82%,transparent)!important}}';
  document.head.appendChild(st);

  var s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload = init;
  document.head.appendChild(s);

  function init() {
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cv = document.createElement('canvas'); cv.id = 'gl3d'; cv.setAttribute('aria-hidden', 'true');
    document.body.prepend(cv);
    var R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    R.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    var S = new THREE.Scene(), C = new THREE.PerspectiveCamera(45, 1, .1, 100); C.position.z = 9;
    S.add(new THREE.AmbientLight(0xffffff, .85));
    var L1 = new THREE.PointLight(0xffffff, 1.6, 40); L1.position.set(5, 4, 6); S.add(L1);
    var L2 = new THREE.PointLight(0xff9a8a, 1.2, 40); L2.position.set(-6, -3, 4); S.add(L2);

    var G = new THREE.Group(); S.add(G);
    var geo = new THREE.TorusKnotGeometry(1.5, .45, 200, 28, 2, 3);
    var solid = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ metalness: .45, roughness: .35, flatShading: true, transparent: true }));
    var wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0 })); wire.scale.setScalar(1.03);
    var pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: .045, transparent: true, opacity: 0 }));
    G.add(solid, wire, pts);

    var N = 900, pos = new Float32Array(N * 3);
    for (var i = 0; i < N; i++) {
      var r = 7 + Math.random() * 16, a = Math.random() * 6.283, b = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(b) * Math.cos(a); pos[i * 3 + 1] = r * Math.sin(b) * Math.sin(a); pos[i * 3 + 2] = r * Math.cos(b) - 6;
    }
    var sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    var stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: .05, transparent: true, opacity: .5 })); S.add(stars);

    var PAL = { light: [0xe05c4b, 0x0f1c3f], dark: [0xe8705f, 0xe8edf5] };
    function theme() {
      var p = PAL[document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'];
      solid.material.color.setHex(p[0]); wire.material.color.setHex(p[0]);
      pts.material.color.setHex(p[1]); stars.material.color.setHex(p[0]);
    }
    theme();
    new MutationObserver(theme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    /* one keyframe per section, built from the page itself */
    var secs = $$('section'), X = [], SC = [], WF = [], PT = [], SO = [], marks = [], narrow = false;
    secs.forEach(function (sec, i) {
      var big = sec.id === 'available';
      X.push(i === 0 ? 2.4 : big ? 0 : (i % 2 ? -3 : 3));
      SC.push(i === 0 ? 1.15 : big ? 1.4 : 1);
      WF.push(i % 2 ? .5 : .1);
      PT.push(i % 3 === 0 ? .7 : .1);
      SO.push(i === 0 ? 1 : big ? .9 : .5);
    });
    function size() {
      R.setSize(innerWidth, innerHeight, false);
      C.aspect = innerWidth / innerHeight; C.updateProjectionMatrix();
      narrow = innerWidth < 900;
      var max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      marks = secs.map(function (sec, i) {
        if (i === 0) return 0;
        if (i === secs.length - 1) return 1;
        return Math.min(1, Math.max(0, (sec.offsetTop + sec.offsetHeight / 2 - innerHeight / 2) / max));
      });
    }
    addEventListener('resize', size); addEventListener('load', size); size();

    function keyed(v, p) {
      var n = marks.length - 1, i = 0;
      while (i < n - 1 && p > marks[i + 1]) i++;
      var t = (p - marks[i]) / Math.max(.0001, marks[i + 1] - marks[i]);
      t = Math.min(1, Math.max(0, t)); t = t * t * (3 - 2 * t);
      return v[i] + (v[i + 1] - v[i]) * t;
    }

    var mx = 0, my = 0, sp = 0, tgt = 0, t0 = performance.now();
    addEventListener('pointermove', function (e) { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
    function onScroll() { tgt = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight); }
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    function frame(now) {
      var t = (now - t0) / 1000;
      sp += (tgt - sp) * (reduce ? 1 : .07);
      var k = narrow ? .6 : 1, f = narrow ? .55 : 1;
      G.position.x = narrow ? 0 : keyed(X, sp);
      G.position.y = Math.sin(t * .8) * .15;
      G.scale.setScalar(keyed(SC, sp) * k);
      G.rotation.y = sp * Math.PI * 8 + mx * .6;
      G.rotation.x = sp * Math.PI * 2 + my * .4;
      solid.material.opacity = keyed(SO, sp) * f;
      wire.material.opacity = keyed(WF, sp) * f;
      pts.material.opacity = keyed(PT, sp) * f;
      pts.scale.setScalar(1 + keyed(PT, sp) * .2 * Math.sin(t * 1.5));
      stars.rotation.y = sp * 1.6 + t * .01;
      R.render(S, C);
      if (!reduce) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    if (reduce) addEventListener('scroll', function () { requestAnimationFrame(frame); }, { passive: true });
  }
})();
