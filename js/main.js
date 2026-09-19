/* Initi8Now — interactions */
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* scroll progress */
  const bar = $('#progress');
  const onScroll = () => {
    if (!bar) return;
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* mobile nav */
  const burger = $('.burger'), menu = $('.nav ul');
  if (burger) burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });

  /* current page highlight */
  const here = location.pathname.split('/').pop() || 'index.html';
  $$('.nav ul a').forEach(a => { if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page'); });

  /* reveal on scroll */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  $$('.rv').forEach(el => io.observe(el));

  /* hero glow follows cursor */
  const glow = $('.hero .glow');
  if (glow && !reduce) addEventListener('pointermove', e => {
    const x = (e.clientX / innerWidth - .5) * 120, y = (e.clientY / innerHeight - .5) * 120;
    glow.style.transform = `translate(${x}px,${y}px)`;
  }, { passive: true });

  /* size the infinity stroke to its real length so it draws fully */
  const loop = $('#loop8');
  if (loop) { const L = loop.getTotalLength(); loop.style.strokeDasharray = L; loop.style.strokeDashoffset = reduce ? 0 : L; }

  /* rotating word in hero headline */
  const swap = $('.swap');
  if (swap) {
    const words = JSON.parse(swap.dataset.words);
    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      swap.style.opacity = 0; swap.style.transform = 'translateY(10px)';
      setTimeout(() => { swap.textContent = words[i]; swap.style.transition = 'opacity .4s, transform .4s'; swap.style.opacity = 1; swap.style.transform = 'none'; }, 250);
    }, 2400);
  }

  /* student / employer mode */
  const modeBtns = $$('.mode button');
  const applyMode = m => {
    modeBtns.forEach(b => b.classList.toggle('active', b.dataset.mode === m));
    $$('[data-for]').forEach(el => el.hidden = el.dataset.for !== m);
    document.body.dataset.mode = m;
  };
  modeBtns.forEach(b => b.addEventListener('click', () => applyMode(b.dataset.mode)));
  if (modeBtns.length) applyMode('student');

  /* ticker duplicate for seamless loop */
  const track = $('.ticker .track');
  if (track) track.innerHTML += track.innerHTML;

  /* counters */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '', pre = el.dataset.prefix || '';
    if (reduce) { el.innerHTML = '<i>' + pre + '</i>' + end.toLocaleString('en-IN') + '<i>' + suf + '</i>'; return; }
    const t0 = performance.now(), dur = 1800;
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.innerHTML = '<i>' + pre + '</i>' + v.toLocaleString('en-IN') + '<i>' + suf + '</i>';
      if (p < 1) requestAnimationFrame(tick);
    }; requestAnimationFrame(tick);
  }), { threshold: .5 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* process rail: drag + arrows */
  const rail = $('.rail');
  if (rail) {
    let down = false, sx = 0, sl = 0;
    rail.addEventListener('pointerdown', e => { down = true; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add('dragging'); });
    addEventListener('pointerup', () => { down = false; rail.classList.remove('dragging'); });
    rail.addEventListener('pointermove', e => { if (down) rail.scrollLeft = sl - (e.clientX - sx); });
    $$('.rail-nav button').forEach(b => b.addEventListener('click', () => rail.scrollBy({ left: (b.dataset.dir === 'next' ? 1 : -1) * 360, behavior: 'smooth' })));
  }

  /* scam game */
  const deck = $('.deck');
  if (deck) {
    const cards = $$('.card', deck); cards.forEach((c, i) => c.style.zIndex = cards.length - i); // first in DOM = top
    let idx = 0, score = 0;
    const scoreEl = $('.score'), doneEl = $('.done');
    const layout = () => cards.forEach((c, i) => {
      c.classList.remove('back', 'back2');
      if (i === idx + 1) c.classList.add('back');
      if (i >= idx + 2) c.classList.add('back2');
    });
    layout();
    const answer = ans => {
      const c = cards[idx]; if (!c || c.classList.contains('reveal')) return;
      const right = c.dataset.real === ans;
      if (right) score++;
      scoreEl.textContent = `${score} / ${cards.length}`;
      c.classList.add('reveal');
      $('.why', c).textContent = (right ? '✅ Correct. ' : '❌ Not quite. ') + c.dataset.why;
      setTimeout(() => {
        c.classList.add(ans === 'yes' ? 'out-r' : 'out-l');
        idx++; layout();
        if (idx >= cards.length) {
          $('.final', doneEl).textContent = `${score} / ${cards.length}`;
          doneEl.classList.add('show');
        }
      }, 1900);
    };
    $$('.game-ctl button').forEach(b => b.addEventListener('click', () => answer(b.dataset.ans)));
    $('.replay', doneEl)?.addEventListener('click', () => {
      idx = 0; score = 0; scoreEl.textContent = `0 / ${cards.length}`; doneEl.classList.remove('show');
      cards.forEach(c => c.classList.remove('reveal', 'out-l', 'out-r')); layout();
    });
    // swipe
    let sx = 0;
    deck.addEventListener('pointerdown', e => sx = e.clientX);
    deck.addEventListener('pointerup', e => { const d = e.clientX - sx; if (Math.abs(d) > 70) answer(d > 0 ? 'yes' : 'no'); });
  }

  /* badge collector */
  const badges = $$('.badge');
  if (badges.length) {
    const fill = $('.bar i'), lab = $('.bar-lab');
    const update = () => {
      const n = $$('.badge.on').length, p = Math.round(n / badges.length * 100);
      fill.style.width = p + '%';
      lab.textContent = n === 0 ? 'Tap the badges you already have.' : n === badges.length ? 'Full stack! Employers on Initi8Now see every one of these.' : `${n} of ${badges.length} collected — ${p}% profile strength`;
    };
    badges.forEach(b => b.addEventListener('click', () => { b.classList.toggle('on'); update(); }));
    update();
  }

  /* team cards tap (mobile) */
  $$('.member').forEach(m => m.addEventListener('click', () => m.classList.toggle('open')));

  /* contact form → mailto (works without a backend) */
  const form = $('#contact-form');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form);
    const body = [...d.entries()].map(([k, v]) => `${k}: ${v}`).join('\n');
    location.href = `mailto:info@initi8now.com?subject=${encodeURIComponent('[Website] ' + d.get('topic'))}&body=${encodeURIComponent(body)}`;
    toast('Opening your email app…');
  });

  function toast(msg) {
    let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2600);
  }
  window.i8toast = toast;
})();
