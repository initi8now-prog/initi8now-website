/* Initi8Now — interactions */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var inr = function (n) { return '\u20B9' + Math.round(n).toLocaleString('en-IN'); };

  /* ---------- scroll progress ---------- */
  var bar = $('#progress');
  function onScroll() {
    if (!bar) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? h.scrollTop / max * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- mobile nav (A11Y-02, MOB-04, MOB-08) ---------- */
  var burger = $('.burger'), menu = $('#primary-menu');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { var a = $('a', menu); if (a) a.focus(); }
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!menu.classList.contains('open')) return;
      if (!menu.contains(e.target) && !burger.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    $$('.rv').forEach(function (el) { io.observe(el); });
  } else {
    $$('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- hero glow ---------- */
  var glow = $('.hero .glow');
  if (glow && !reduce) window.addEventListener('pointermove', function (e) {
    glow.style.transform = 'translate(' + (e.clientX / window.innerWidth - .5) * 110 + 'px,' + (e.clientY / window.innerHeight - .5) * 110 + 'px)';
  }, { passive: true });

  /* ---------- hero infinity stroke length ---------- */
  var loop = $('#loop8');
  if (loop && loop.getTotalLength) {
    var L = loop.getTotalLength();
    loop.style.strokeDasharray = L;
    loop.style.setProperty('--len', L);
  }

  /* ---------- rotating headline word (A11Y-07) ---------- */
  var swap = $('.swap');
  if (swap && !reduce) {
    var words = JSON.parse(swap.getAttribute('data-words')), wi = 0;
    setInterval(function () {
      wi = (wi + 1) % words.length;
      swap.style.opacity = 0; swap.style.transform = 'translateY(8px)';
      setTimeout(function () { swap.textContent = words[wi]; swap.style.opacity = 1; swap.style.transform = 'none'; }, 300);
    }, 2800);
  }

  /* ---------- student / employer mode (A11Y-06, BUG-10) ---------- */
  var modeBtns = $$('.mode button');
  function applyMode(m) {
    modeBtns.forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-mode') === m ? 'true' : 'false'); });
    $$('[data-for]').forEach(function (el) { el.hidden = el.getAttribute('data-for') !== m; });
    var nav = $('.cta-nav');
    if (nav) {
      var hiring = m === 'employer';
      nav.textContent = hiring ? 'Post a role' : 'Get early access';
      nav.href = hiring ? nav.getAttribute('data-employer-href') : nav.getAttribute('data-student-href');
      if (hiring) { nav.removeAttribute('target'); nav.removeAttribute('rel'); }
      else { nav.target = '_blank'; nav.rel = 'noopener'; }
    }
  }
  modeBtns.forEach(function (b) { b.addEventListener('click', function () { applyMode(b.getAttribute('data-mode')); }); });
  if (modeBtns.length) applyMode('student');

  /* ---------- ticker duplicate (A11Y-10) ---------- */
  var track = $('.ticker .track');
  if (track && !reduce) {
    var clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    $$('span', clone).forEach(function (s) { s.setAttribute('aria-hidden', 'true'); });
    track.innerHTML += clone.innerHTML;
  }

  /* ---------- counters (BUG-04: HTML already holds the final value) ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; cio.unobserve(e.target);
        var el = e.target, end = +el.getAttribute('data-count');
        var pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
        var t0 = performance.now();
        (function tick(t) {
          var p = Math.min(1, (t - t0) / 1700);
          el.textContent = pre + Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString('en-IN') + suf;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: .5 });
    $$('[data-count]').forEach(function (el) { cio.observe(el); });
  }

  /* ---------- earnings calculator ---------- */
  var KINDS = {
    tech:     { rate: 320, jobs: ['Bug fixes for a D2C store', 'React landing page', 'QA testing sprint'] },
    creative: { rate: 260, jobs: ['Reels edit \u2014 six clips', 'Poster set for a fest', 'Thumbnail pack'] },
    content:  { rate: 210, jobs: ['Blog: two x 800 words', 'Product copy refresh', 'Newsletter draft'] },
    ops:      { rate: 180, jobs: ['Event day crew', 'Survey collection', 'Stall promotions'] }
  };
  var calc = $('[data-calc]');
  if (calc) {
    var hours = $('[data-hours]', calc), hoursOut = $('[data-hours-out]', calc),
        rateOut = $('[data-rate-out]', calc), payout = $('[data-payout]', calc),
        weekly = $('[data-weekly]', calc), ledger = $('[data-ledger]', calc),
        chips = $$('.chip', calc), kind = 'tech';
    function paint() {
      var h = +hours.value, k = KINDS[kind], week = h * k.rate, month = week * 4.3;
      hours.style.setProperty('--fill', ((h - hours.min) / (hours.max - hours.min) * 100) + '%');
      hoursOut.textContent = h + (h === 1 ? ' hour' : ' hours') + ' / week';
      rateOut.textContent = inr(k.rate) + ' / hour';
      weekly.textContent = inr(week) + ' a week';
      payout.textContent = inr(month);
      ledger.innerHTML = '';
      k.jobs.forEach(function (j, n) {
        var row = document.createElement('li');
        row.className = 'ledger-row';
        row.innerHTML = '<span class="who"></span><span class="amt"></span>';
        $('.who', row).textContent = j;
        $('.amt', row).textContent = '+ ' + inr([0.42, 0.33, 0.25][n] * week);
        ledger.appendChild(row);
      });
    }
    hours.addEventListener('input', paint);
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        kind = c.getAttribute('data-kind');
        chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
        paint();
      });
    });
    paint();
  }

  /* ---------- process rail ---------- */
  var rail = $('.rail');
  if (rail) {
    var down = false, sx = 0, sl = 0;
    rail.addEventListener('pointerdown', function (e) { down = true; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add('dragging'); });
    window.addEventListener('pointerup', function () { down = false; rail.classList.remove('dragging'); });
    rail.addEventListener('pointermove', function (e) { if (down) rail.scrollLeft = sl - (e.clientX - sx); });
    $$('.rail-nav button').forEach(function (b) {
      b.addEventListener('click', function () { rail.scrollBy({ left: (b.getAttribute('data-dir') === 'next' ? 1 : -1) * 340, behavior: reduce ? 'auto' : 'smooth' }); });
    });
  }

  /* ---------- scam game (BUG-05 next button, BUG-06 real swipe) ---------- */
  var deck = $('.deck');
  if (deck) {
    var cards = $$('.card', deck), idx = 0, score = 0, locked = false;
    var scoreEl = $('.score'), doneEl = $('.done'), ctl = $$('.game-ctl button');
    cards.forEach(function (c, i) { c.style.zIndex = cards.length - i; });
    function layout() {
      cards.forEach(function (c, i) {
        c.classList.remove('back', 'back2');
        if (i === idx + 1) c.classList.add('back');
        if (i >= idx + 2) c.classList.add('back2');
      });
    }
    layout();
    function answer(ans) {
      var c = cards[idx];
      if (!c || locked || c.classList.contains('reveal')) return;
      locked = true;
      var right = c.getAttribute('data-real') === ans;
      if (right) score++;
      scoreEl.textContent = score + ' / ' + cards.length;
      c.classList.add('reveal');
      c.style.transform = '';
      $('.why', c).textContent = (right ? '\u2705 Correct. ' : '\u274C Not quite. ') + c.getAttribute('data-why');
      var nx = $('.next', c);
      if (nx) nx.focus();
    }
    function advance() {
      var c = cards[idx];
      c.classList.add(c.getAttribute('data-real') === 'yes' ? 'out-r' : 'out-l');
      idx++; locked = false; layout();
      if (idx >= cards.length) {
        $('.final', doneEl).textContent = score + ' / ' + cards.length;
        doneEl.classList.add('show');
        ctl.forEach(function (b) { b.disabled = true; });
      }
    }
    ctl.forEach(function (b) { b.addEventListener('click', function () { answer(b.getAttribute('data-ans')); }); });
    $$('.next', deck).forEach(function (b) { b.addEventListener('click', advance); });
    var replay = $('.replay', doneEl);
    if (replay) replay.addEventListener('click', function () {
      idx = 0; score = 0; locked = false;
      scoreEl.textContent = '0 / ' + cards.length;
      doneEl.classList.remove('show');
      ctl.forEach(function (b) { b.disabled = false; });
      cards.forEach(function (c) { c.classList.remove('reveal', 'out-l', 'out-r'); c.style.transform = ''; });
      layout();
    });
    /* pointer swipe that actually follows the finger */
    var dx = 0, dragging = false, top = null;
    deck.addEventListener('pointerdown', function (e) {
      top = cards[idx];
      if (!top || locked || top.classList.contains('reveal')) { top = null; return; }
      dragging = true; dx = 0; sxg = e.clientX; top.classList.add('drag');
      try { deck.setPointerCapture(e.pointerId); } catch (err) {}
    });
    var sxg = 0;
    deck.addEventListener('pointermove', function (e) {
      if (!dragging || !top) return;
      dx = e.clientX - sxg;
      top.style.transform = 'translateX(' + dx + 'px) rotate(' + (dx / 22) + 'deg)';
    });
    function endDrag() {
      if (!dragging || !top) return;
      dragging = false; top.classList.remove('drag');
      if (Math.abs(dx) > 70) { answer(dx > 0 ? 'yes' : 'no'); }
      else { top.style.transform = ''; }
      top = null;
    }
    deck.addEventListener('pointerup', endDrag);
    deck.addEventListener('pointercancel', endDrag);
    deck.addEventListener('pointerleave', endDrag);
  }

  /* ---------- badge collector (A11Y-06) ---------- */
  var badges = $$('.badge');
  if (badges.length) {
    var fill = $('.bar i'), lab = $('.bar-lab');
    function update() {
      var n = badges.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).length;
      var p = Math.round(n / badges.length * 100);
      fill.style.width = p + '%';
      lab.textContent = n === 0 ? 'Select the badges you already have.'
        : n === badges.length ? 'Full stack. Employers on Initi8Now would see every one of these.'
        : n + ' of ' + badges.length + ' selected \u2014 ' + p + '% profile strength';
    }
    badges.forEach(function (b) {
      b.addEventListener('click', function () {
        b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        update();
      });
    });
    update();
  }

  /* ---------- video reel ---------- */
  var reel = $('#reel'), reelv = $('#reelv'), playBtn = $('#reel .play');
  if (reel && reelv && playBtn) {
    function sync() {
      var playing = !reelv.paused && !reelv.ended;
      reel.classList.toggle('playing', playing);
      playBtn.setAttribute('aria-label', playing ? 'Pause the walkthrough' : 'Play the walkthrough');
      $('span', playBtn).textContent = playing ? '\u275A\u275A' : '\u25B6';
    }
    playBtn.addEventListener('click', function () { reelv.paused ? reelv.play() : reelv.pause(); });
    ['play', 'pause', 'ended'].forEach(function (ev) { reelv.addEventListener(ev, sync); });
    sync();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (!e.isIntersecting && !reelv.paused) reelv.pause(); });
      }, { threshold: .25 }).observe(reel);
    }
  }

  /* ---------- looping videos: pause control (A11Y-07) ---------- */
  $$('[data-loopvid]').forEach(function (wrap) {
    var v = $('video', wrap), b = $('button', wrap);
    if (!v || !b) return;
    if (reduce) { v.pause(); v.removeAttribute('autoplay'); }
    function s() { b.textContent = v.paused ? 'Play' : 'Pause'; b.setAttribute('aria-label', (v.paused ? 'Play' : 'Pause') + ' this video'); }
    b.addEventListener('click', function () { v.paused ? v.play() : v.pause(); });
    ['play', 'pause'].forEach(function (ev) { v.addEventListener(ev, s); });
    s();
  });

  /* ---------- contact form (BUG-02) ---------- */
  var form = $('#contact-form');
  if (form) {
    var status = $('#form-status');
    form.addEventListener('submit', function (e) {
      var endpoint = form.getAttribute('action') || '';
      if (endpoint.indexOf('YOUR_FORM_ID') > -1 || !endpoint) {
        /* Not connected yet: fall back to email so nothing is lost. */
        e.preventDefault();
        var d = new FormData(form), lines = [];
        d.forEach(function (v, k) { lines.push(k + ': ' + v); });
        window.location.href = 'mailto:info@initi8now.com?subject=' +
          encodeURIComponent('[Website] ' + (d.get('topic') || 'Enquiry')) +
          '&body=' + encodeURIComponent(lines.join('\n'));
        return;
      }
      e.preventDefault();
      var btn = $('button[type=submit]', form);
      btn.disabled = true; btn.textContent = 'Sending\u2026';
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('bad response');
          form.reset();
          status.className = 'form-status ok';
          status.textContent = 'Thank you. Your message has reached us and we will reply within one working day.';
        })
        .catch(function () {
          status.className = 'form-status err';
          status.textContent = 'Sorry, that did not send. Please email info@initi8now.com or call +91 63780 48013.';
        })
        .then(function () { btn.disabled = false; btn.textContent = 'Send message'; status.focus(); });
    });
  }
})();
