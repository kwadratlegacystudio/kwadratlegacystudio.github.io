/* ═══════════════════════════════════════════════════════════════
   Kwadrat Legacy Studio
   Four rooms. The page never scrolls; only the rail unrolls.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var ROOMS = ['threshold', 'works', 'standard', 'enquiry'];
  var calm  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var rooms   = {};
  var links   = {};
  var current = 'threshold';

  ROOMS.forEach(function (name) { rooms[name] = document.getElementById(name); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-goto]'), function (a) {
    if (a.classList.contains('compass') || a.parentNode.classList.contains('compass')) {
      links[a.getAttribute('data-goto')] = a;
    }
    a.addEventListener('click', function (e) { e.preventDefault(); enter(a.getAttribute('data-goto')); });
  });

  /* ── Moving between rooms ─────────────────────────────────── */

  function enter(name, silent) {
    if (!rooms[name] || name === current) return;

    // Re-arm the veils so each room performs its entrance every visit.
    var leaving = rooms[current];
    if (leaving) leaving.classList.remove('is-open');

    current = name;
    rooms[name].classList.add('is-open');
    document.body.setAttribute('data-room', name);

    ROOMS.forEach(function (n) {
      if (links[n]) links[n].classList.toggle('is-here', n === name);
    });

    if (!silent && history.replaceState) history.replaceState(null, '', '#' + name);
    if (name === 'works') requestAnimationFrame(measure);
  }

  function step(dir) {
    var i = ROOMS.indexOf(current) + dir;
    if (i >= 0 && i < ROOMS.length) enter(ROOMS[i]);
  }

  /* ── The rail ─────────────────────────────────────────────── */

  var works    = window.KWADRAT_WORKS || {};

  /* The tongue in use. If i18n.js is absent for any reason the
     English written here still stands. */
  function T(key, fill, plain) {
    var said = window.KW_T ? window.KW_T(key, fill) : '';
    return said || plain;
  }

  var GROUPS = {
    unrolled: { hint: 'Select a scroll to open it, then drag to travel and scroll to magnify.' },
    bound:    { hint: 'Select a sefer to open it, then turn its pages one by one.' },
    hand:     { hint: 'Select a project to see its photographs, one after another.' },
    motion:   { hint: 'Select a project to watch its films.' },
    spoken:   { hint: 'Interviews, clips, and pieces published elsewhere.' }
  };
  var rail     = document.getElementById('rail');
  var tally    = document.getElementById('tally');
  var prevBtn  = document.querySelector('.rail-prev');
  var nextBtn  = document.querySelector('.rail-next');
  var tabs     = Array.prototype.slice.call(document.querySelectorAll('.ledger-tab'));
  var group    = 'pages';
  var items    = [];

  /* The works are listed with paths written from the site root. On
     /he/ and /yi/ the page sits a level down, so the root is said
     out loud there. */
  var ROOT = window.KWADRAT_ROOT || '';
  function url(path) { return encodeURI(ROOT + path); }

  function cover(item) { return item.cover || item.poster || item.src; }
  function frames(item) { return (item && item.frames) || []; }
  function isDoc(item) { return item.type === 'scroll' || item.type === 'sefer'; }

  /* How to describe a set of several things on the rail. */
  /* An ordinary work: a picture you can open. */
  function plateFor(item, i) {
    var b = document.createElement('button');
    b.type = 'button';
    var f0 = frames(item)[0];
    b.className = 'plate'
      + (f0 && f0.kind === 'film' ? ' plate-film' : '')
      + (item.type === 'scroll' ? ' plate-scroll' : '')
      + (item.reads === 'ltr' ? ' reads-ltr' : '');
    b.setAttribute('aria-label', 'Open ' + item.title);

    var img = document.createElement('img');
    /* The cover's own shape, measured at publish. The browser needs it to
       give the plate a width before the picture lands — without it every
       plate is zero wide until then, and they collapse onto each other. */
    if (item.cw && item.ch) { img.width = item.cw; img.height = item.ch; }
    img.src = url(cover(item));
    /* A plate is 860 CSS px on a desktop and about a third of that on a
       handset. Offered both widths, the browser takes the one it needs
       instead of the one that looks best on the largest screen. */
    if (item.coverSm) {
      img.srcset = url(item.coverSm) + ' 800w, ' + url(cover(item)) + ' 1400w';
      img.sizes = '(max-width:640px) 92vw, (max-width:1100px) 60vw, 860px';
    }
    img.alt = item.title;
    img.loading = i < 3 ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.draggable = false;
    // The rail only becomes scrollable once its pictures have arrived, so
    // the arrows must be re-armed then — otherwise they stay disabled from
    // the moment of painting, when nothing was wide enough to scroll.
    img.addEventListener('load', measure);
    b.appendChild(img);

    var cap = document.createElement('span');
    cap.className = 'plate-mark';
    var much = measureOf(item);
    cap.textContent = item.title + (much ? '  ·  ' + much : '');
    b.appendChild(cap);

    b.addEventListener('click', function () { if (!dragged) show(items.indexOf(item)); });
    return b;
  }

  /* A piece published elsewhere. Always set as a card — the type leads,
     and the picture is a band of colour within it rather than the whole
     face of the plate. A wall of photographs is somebody else's gallery. */
  function doorway(item) {
    var a = document.createElement('button');
    a.type = 'button';
    a.className = 'plate plate-door';
    a.setAttribute('aria-label', 'Read about ' + item.title);

    var card = document.createElement('span');
    card.className = 'door-card';

    var type = document.createElement('span');
    type.className = 'door-type';
    if (semitic(item.title)) type.dir = 'rtl';

    var who = document.createElement('span');
    who.className = 'door-source';
    who.textContent = host(item.url);

    var rule = document.createElement('span');
    rule.className = 'door-rule';

    var what = document.createElement('span');
    what.className = 'door-title';
    what.textContent = item.title;

    type.appendChild(who); type.appendChild(rule); type.appendChild(what);
    card.appendChild(type);

    if (item.cover) {
      var band = document.createElement('span');
      band.className = 'door-photo';
      var img = document.createElement('img');
      img.src = url(item.cover);
      img.alt = '';
      img.loading = 'lazy';
      img.draggable = false;
      img.addEventListener('load', measure);
      band.appendChild(img);
      card.appendChild(band);
    } else {
      card.classList.add('is-plain');
    }

    a.appendChild(card);
    a.addEventListener('click', function () { if (!dragged) show(items.indexOf(item)); });
    return a;
  }

  function host(u) {
    try { return new URL(u).hostname.replace(/^www\./, ''); }
    catch (e) { return 'Elsewhere'; }
  }

  function measureOf(item) {
    if (item.type === 'link') return '';
    var f = frames(item);
    if (f.length < 2) return '';
    if (isDoc(item)) return f.length + ' pages';
    var films = 0, i;
    for (i = 0; i < f.length; i++) if (f[i].kind === 'film') films++;
    if (films === 0)        return f.length + ' photographs';
    if (films === f.length) return f.length + ' films';
    return f.length + ' pieces';
  }

  /* A change of tongue used to repaint the whole rail. paint() begins by
     emptying it, which takes every plate out of the document while its
     cover is still arriving — and a browser abandons the request for an
     image that has left the page. The covers came back blank, and only
     a reload cured it, because by then they were in the cache and the
     second set resolved before anything could interrupt it. It showed
     on /he/ and /yi/ every time and on / almost never, since a language
     page always applies a language and so always fires this.

     Nothing inside a plate is translated — not the title, not the count,
     not the address on a card. Only the line beneath the rail is, so
     only that is said again. */
  document.addEventListener('kwadrat:tongue', function () {
    if (!GROUPS[group]) return;        // never before the rail has a group
    var note = document.querySelector('.hint');
    if (note) note.textContent = T('hint.' + group, null, GROUPS[group].hint);
    var bare = rail.querySelector('.rail-empty');
    if (bare) bare.textContent = T('works.empty', null, 'This portfolio is being prepared.');
  });

  function paint(name) {
    group = name;
    items = (works[name] || []).slice();
    rail.innerHTML = '';

    tabs.forEach(function (t) {
      var on = t.getAttribute('data-group') === name;
      t.classList.toggle('is-current', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    var note = document.querySelector('.hint');
    if (note && GROUPS[name]) note.textContent = T('hint.' + name, null, GROUPS[name].hint);

    if (!items.length) {
      var empty = document.createElement('p');
      empty.className = 'rail-empty';
      empty.textContent = T('works.empty', null, 'This portfolio is being prepared.');
      rail.appendChild(empty);
      tally.textContent = '—';
      arm();
      return;
    }

    items.forEach(function (item, i) {
      rail.appendChild(item.type === 'link' ? doorway(item) : plateFor(item, i));
    });

    rail.scrollLeft = 0;
    measure();
    requestAnimationFrame(measure);
    setTimeout(measure, 300);
  }

  /* Which plate is nearest the middle of the frame? */
  function measure() {
    if (!items.length) return;
    var mid = rail.scrollLeft + rail.clientWidth / 2;
    var best = 0, bestGap = Infinity;
    Array.prototype.forEach.call(rail.children, function (el, i) {
      var gap = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
      if (gap < bestGap) { bestGap = gap; best = i; }
    });
    tally.textContent = pad(best + 1) + '  /  ' + pad(items.length);
    arm();
  }

  function arm() {
    var slack = rail.scrollWidth - rail.clientWidth - 1;
    prevBtn.disabled = rail.scrollLeft <= 0;
    nextBtn.disabled = rail.scrollLeft >= slack || slack <= 0;
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* One press, one work. */
  function nudge(dir) {
    stopGlide();
    var mid = rail.scrollLeft + rail.clientWidth / 2;
    var kids = rail.children, i, best = -1, gap = Infinity, d;
    for (i = 0; i < kids.length; i++) {
      d = Math.abs(kids[i].offsetLeft + kids[i].offsetWidth / 2 - mid);
      if (d < gap) { gap = d; best = i; }
    }
    var to = kids[Math.min(kids.length - 1, Math.max(0, best + dir))];
    if (!to) return;
    var slack = rail.scrollWidth - rail.clientWidth;
    var left = to.offsetLeft + to.offsetWidth / 2 - rail.clientWidth / 2;
    steer(Math.max(0, Math.min(slack, left)));
  }

  prevBtn.addEventListener('click', function () { nudge(-1); });
  nextBtn.addEventListener('click', function () { nudge(1); });
  tabs.forEach(function (t) {
    t.addEventListener('click', function () { stopGlide(); paint(t.getAttribute('data-group')); });
  });

  /* Settle on a work once the rail has come to rest. Done here rather
     than with CSS scroll-snap: a plate wider than half the frame gives
     snap positions so far apart that the browser drags every scroll back
     to the start, which stops the rail moving at all. */
  var settling = 0, steeringUntil = 0;

  /* A smooth scroll of our own emits scroll events all the way; without
     this the settle fires mid-flight, decides the nearest work is still
     the one we are leaving, and hauls the rail back where it started. */
  function steer(left) {
    steeringUntil = Date.now() + 700;
    rail.scrollTo({ left: left, behavior: calm ? 'auto' : 'smooth' });
  }

  function settleSoon() {
    clearTimeout(settling);
    settling = setTimeout(function () {
      if (down || gliding || !items.length) return;
      if (Date.now() < steeringUntil) return;
      var mid = rail.scrollLeft + rail.clientWidth / 2;
      var kids = rail.children, best = null, gap = Infinity, i, d;
      for (i = 0; i < kids.length; i++) {
        d = Math.abs(kids[i].offsetLeft + kids[i].offsetWidth / 2 - mid);
        if (d < gap) { gap = d; best = kids[i]; }
      }
      if (!best || gap < 8) return;
      var to = best.offsetLeft + best.offsetWidth / 2 - rail.clientWidth / 2;
      var slack = rail.scrollWidth - rail.clientWidth;
      to = Math.max(0, Math.min(slack, to));
      if (Math.abs(to - rail.scrollLeft) < 8) return;
      steer(to);
    }, 220);
  }

  var ticking = false;
  rail.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; measure(); });
    settleSoon();
  }, { passive: true });

  /* Drag to unroll. */
  var down = false, dragged = false, startX = 0, startY = 0, startLeft = 0, travel = 0;

  /* A flick should carry. Without momentum the rail stops dead the moment
     you let go, and crossing a long rail becomes a dozen separate drags. */
  var speed = 0, lastX = 0, lastT = 0, gliding = 0;

  function stopGlide() {
    if (gliding) { cancelAnimationFrame(gliding); gliding = 0; }
  }

  function glide() {
    var v = speed * 16;                 // pixels per frame
    if (Math.abs(v) < 1.5) return;
    stopGlide();
    (function step() {
      v *= 0.94;                        // friction
      if (Math.abs(v) < 0.4) { gliding = 0; measure(); return; }
      var before = rail.scrollLeft;
      rail.scrollLeft = before + v;
      if (rail.scrollLeft === before) { gliding = 0; return; }   // hit the end
      gliding = requestAnimationFrame(step);
    })();
  }

  rail.addEventListener('pointerdown', function (e) {
    if (e.button) return;
    stopGlide();
    down = true; dragged = false; travel = 0;
    speed = 0; lastX = e.clientX; lastT = performance.now();
    startX = e.clientX; startY = e.clientY; startLeft = rail.scrollLeft;
    // `is-dragging` disables pointer events on the plates, so it must not
    // be set until a drag is actually under way — set it on pressing and
    // the plate stops being clickable before the click ever lands.
  });
  rail.addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - startX;
    travel = Math.max(travel, Math.hypot(dx, e.clientY - startY));
    // Only a real drag suppresses the click; a wobbling hand does not.
    if (travel > 10 && !dragged) {
      dragged = true;
      rail.classList.add('is-dragging');
    }
    if (!dragged) return;
    rail.scrollLeft = startLeft - dx;

    var now = performance.now();
    var span = now - lastT;
    if (span > 0) {
      // smoothed, so one jittery frame does not throw the flick
      speed = speed * 0.7 + ((lastX - e.clientX) / span) * 0.3;
      lastX = e.clientX; lastT = now;
    }
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
    rail.addEventListener(ev, function () {
      if (down && dragged) glide();
      down = false;
      rail.classList.remove('is-dragging');
      setTimeout(function () { dragged = false; travel = 0; }, 0);
    });
  });

  /* A wheel over the rail turns it sideways rather than nowhere. */
  rail.addEventListener('wheel', function (e) {
    var slack = rail.scrollWidth - rail.clientWidth - 1;
    if (slack <= 0) return;
    stopGlide();
    var v = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (e.deltaMode === 1) v *= 16;          // some mice report lines, not pixels
    // A sideways stroke on a Magic Mouse arrives in small steps; give it
    // more ground to cover than a vertical wheel notch.
    var sideways = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    e.preventDefault();
    rail.scrollLeft += v * (sideways ? 2.6 : 1.4);
  }, { passive: false });

  /* ── The vitrine: pan, magnify, and turn pages ────────────── */

  var vitrine = document.getElementById('vitrine');
  var view    = document.getElementById('vitrine-view');
  var canvas  = document.getElementById('vitrine-canvas');
  var guard   = document.getElementById('vitrine-guard');
  var vTitle  = document.getElementById('vitrine-title');
  var vTally  = document.getElementById('vitrine-tally');
  var vPrev   = vitrine.querySelector('.vitrine-prev');
  var vNext   = vitrine.querySelector('.vitrine-next');
  var vClose  = vitrine.querySelector('.vitrine-close');
  var leafBox = document.getElementById('vitrine-leaves');
  var leafBack= document.getElementById('leaf-back');
  var leafFwd = document.getElementById('leaf-fwd');
  var leafNum = document.getElementById('leaf-count');
  var loupe   = document.getElementById('vitrine-loupe');
  var zoomIn  = document.getElementById('zoom-in');
  var zoomOut = document.getElementById('zoom-out');
  var zoomFit = document.getElementById('zoom-reset');
  var zoomLvl = document.getElementById('zoom-level');

  var at = 0, leaf = 0, opener = null, sheets = [];
  var MIN = 1, MAX = 7;
  var baseW = 0, baseH = 0;   // the opening at "fit", in CSS pixels
  var rtl = false;

  /* Magnify until one pixel of the page lands on one pixel of the
     SCREEN, and little further. On a retina display that is half the
     zoom you would expect: a CSS pixel is two device pixels there, so
     stopping at 1:1 in CSS terms still asks the browser to double the
     image, which is exactly what looks blurry. */
  function setCeiling() {
    var box = sheets[leaf];
    baseW = baseH = 0;
    if (!box || box.classList.contains('has-film')) { MAX = 7; return; }

    // Natural size of the whole opening: pages laid side by side, brought
    // to a common height.
    var imgs = Array.prototype.filter.call(box.children, function (el) {
      return el.tagName === 'IMG' && el.naturalWidth;
    });
    if (!imgs.length) { MAX = 7; return; }

    // Measure the MASTER, whose size is declared on the sheet even when
    // what is loaded is only the reading copy. Otherwise the ceiling
    // would fall to the stand-in's resolution and the loupe would stop
    // short of the detail the work actually holds.
    function fullW(el) { return +el.dataset.fullw || el.naturalWidth; }
    function fullH(el) { return +el.dataset.fullh || el.naturalHeight; }

    var tall = 0, wide = 0, i;
    for (i = 0; i < imgs.length; i++) tall = Math.max(tall, fullH(imgs[i]));
    for (i = 0; i < imgs.length; i++) {
      wide += fullW(imgs[i]) * (tall / fullH(imgs[i]));
    }

    var vw = view.clientWidth, vh = view.clientHeight;
    var k = Math.min(vw / wide, vh / tall);
    baseW = wide * k;
    baseH = tall * k;

    var dpr = window.devicePixelRatio || 1;
    MAX = Math.max(2, Math.min(24, (wide / baseW / dpr) * 1.05));

    /* Where the magnification stops being served by the reading copy.
       One sheet is the case that matters — a rendered scroll — and for
       anything more complicated the master is fetched on the first
       gesture rather than guessed at. */
    CAP = 0;
    if (imgs.length === 1 && imgs[0].dataset.full && baseW) {
      CAP = (imgs[0].naturalWidth / baseW) / dpr;
    }
  }

  /* Fetch the master, once, and swap it in only when it has arrived —
     assigning src directly would blank the sheet while it loaded. */
  function outgrow() {
    var box = sheets[leaf];
    if (!box) return;
    Array.prototype.forEach.call(box.children, function (el) {
      if (el.tagName !== 'IMG' || !el.dataset.full) return;
      if (CAP && scale < CAP * 0.95) return;
      var master = el.dataset.full;
      delete el.dataset.full;              // asked for once, whatever happens
      var full = new Image();
      full.decoding = 'async';
      full.onload = function () {
        el.src = master;
        if (sheets[leaf] === box) setCeiling();
      };
      full.src = master;
    });
  }
  var scale = 1, tx = 0, ty = 0, CAP = 0;

  function isOpen() { return !vitrine.hidden; }

  /* ── the transform ── */

  /* Zoom by RESIZING the page, not by scaling a layer. A CSS transform
     stretches whatever bitmap the browser already rasterised — at fit
     size — so the sharpest source in the world still arrives blurred.
     Setting the width makes it redraw from the original pixels. */
  function apply(animate) {
    canvas.classList.toggle('is-live', !animate);
    var box = sheets[leaf];
    if (box && baseW) {
      box.style.width  = Math.round(baseW * scale) + 'px';
      box.style.height = Math.round(baseH * scale) + 'px';
    }
    canvas.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
    zoomLvl.textContent = Math.round(scale * 100) + '%';
    zoomOut.disabled = scale <= MIN + 0.001;
    zoomIn.disabled  = scale >= MAX - 0.001;
    view.classList.toggle('is-flat', scale <= MIN + 0.001);
    view.classList.toggle('is-turnable', sheets.length > 1 && scale <= MIN + 0.01);
    if (scale > MIN + 0.01) outgrow();
    markPage();
  }

  /* Keep the page within the frame: no dragging it off into the dark. */
  function rein() {
    var r    = view.getBoundingClientRect();
    var page = shown();
    // Clamp against the page as laid out, not the frame — a scroll is a
    // wide band in a tall frame, and using the frame would let it wander.
    var w = baseW ? baseW * scale : (page ? page.offsetWidth  : r.width);
    var h = baseH ? baseH * scale : (page ? page.offsetHeight : r.height);
    var slackX = Math.max(0, (w * scale - r.width)  / 2);
    var slackY = Math.max(0, (h * scale - r.height) / 2);
    tx = Math.min(slackX, Math.max(-slackX, tx));
    ty = Math.min(slackY, Math.max(-slackY, ty));
  }

  // `current` is already the open room; this is the opening on show.
  function shown() { return sheets[leaf] || null; }

  /* The mark sits over the page itself. Zoomed in, the page fills the
     frame and so does the mark; at rest it stops at the page edge. */
  function markPage() {
    var item = items[at];
    var page = shown();
    if (!page || !item || !isDoc(item)) { guard.style.width = guard.style.height = '0'; return; }
    var v = view.getBoundingClientRect();
    var p = page.getBoundingClientRect();
    var left   = Math.max(0, p.left - v.left);
    var top    = Math.max(0, p.top  - v.top);
    var right  = Math.min(v.width,  p.right  - v.left);
    var bottom = Math.min(v.height, p.bottom - v.top);
    guard.style.left   = left + 'px';
    guard.style.top    = top + 'px';
    guard.style.width  = Math.max(0, right - left) + 'px';
    guard.style.height = Math.max(0, bottom - top) + 'px';
  }

  function fit(animate) { scale = MIN; tx = ty = 0; apply(animate !== false); }

  /* Magnify about a point, so the detail under the cursor stays put. */
  function magnify(next, px, py, animate) {
    var r = view.getBoundingClientRect();
    next = Math.min(MAX, Math.max(MIN, next));
    if (Math.abs(next - scale) < 0.0005) return;
    var cx = (px === undefined ? r.width  / 2 : px - r.left) - r.width  / 2;
    var cy = (py === undefined ? r.height / 2 : py - r.top)  - r.height / 2;
    var k = next / scale;
    tx = cx - (cx - tx) * k;
    ty = cy - (cy - ty) * k;
    scale = next;
    rein();
    apply(!!animate);
  }

  zoomIn .addEventListener('click', function () { magnify(scale * 1.6, undefined, undefined, true); });
  zoomOut.addEventListener('click', function () { magnify(scale / 1.6, undefined, undefined, true); });
  zoomFit.addEventListener('click', function () { fit(true); });

  view.addEventListener('wheel', function (e) {
    if (!zoomable()) return;
    e.preventDefault();
    magnify(scale * (e.deltaY < 0 ? 1.14 : 1 / 1.14), e.clientX, e.clientY, false);
  }, { passive: false });

  view.addEventListener('dblclick', function (e) {
    if (!zoomable()) return;
    if (sheets.length > 1 && scale <= MIN + 0.01) return;   // turning, not zooming
    if (scale > MIN + 0.01) fit(true);
    else magnify(2.6, e.clientX, e.clientY, true);
  });

  function zoomable() {
    var box = sheets[leaf];
    return !!box && !box.classList.contains('has-film');
  }

  /* ── dragging, with two fingers for pinch ── */

  var pointers = {}, panning = false, panX = 0, panY = 0, pinch = 0;

  view.addEventListener('pointerdown', function (e) {
    if (!zoomable()) return;
    view.setPointerCapture(e.pointerId);
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ids = Object.keys(pointers);
    if (ids.length === 1) {
      panning = true; panX = e.clientX - tx; panY = e.clientY - ty;
      view.classList.add('is-panning');
    } else if (ids.length === 2) {
      panning = false;
      pinch = spread(ids);
    }
  });

  view.addEventListener('pointermove', function (e) {
    if (!pointers[e.pointerId]) return;
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ids = Object.keys(pointers);

    if (ids.length === 2 && pinch) {
      var now = spread(ids);
      var mid = middle(ids);
      magnify(scale * (now / pinch), mid.x, mid.y, false);
      pinch = now;
      return;
    }
    if (!panning || scale <= MIN + 0.001) return;
    tx = e.clientX - panX; ty = e.clientY - panY;
    rein(); apply(false);
  });

  ['pointerup', 'pointercancel'].forEach(function (ev) {
    view.addEventListener(ev, function (e) {
      delete pointers[e.pointerId];
      if (Object.keys(pointers).length < 2) pinch = 0;
      if (!Object.keys(pointers).length) { panning = false; view.classList.remove('is-panning'); }
    });
  });

  function spread(ids) {
    var a = pointers[ids[0]], b = pointers[ids[1]];
    return Math.hypot(a.x - b.x, a.y - b.y);
  }
  function middle(ids) {
    var a = pointers[ids[0]], b = pointers[ids[1]];
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  }

  /* ── opening a work ── */

  function show(i) {
    at = i; leaf = 0;
    opener = document.activeElement;
    mount();
    vitrine.hidden = false;
    requestAnimationFrame(function () { vitrine.classList.add('is-open'); });
    vClose.focus();
  }

  /* ── Openings ─────────────────────────────────────────────────
     A sefer is read as a book, not as a stack of pages: the shaar
     blatt stands alone, and everything after it falls into spreads.
     Hebrew reads right to left, so within a spread the earlier page
     sits on the RIGHT, and turning forward moves leftward.
     ──────────────────────────────────────────────────────────── */

  function openingsOf(item) {
    var fr = frames(item);
    if (item.type !== 'sefer') return fr.map(function (f, i) { return [i]; });

    /* The published pages fall together two at a time, in the order they
       were chosen — the shaar blatt alone, then every pair after it. The
       physical book's own imposition is not reconstructed: a selection
       skips whole stretches, so what matters is how the chosen pages sit
       beside each other, not which leaf they were printed on. */
    var out = [], i = 0;
    var lone = item.spread !== 'all' && fr.length && (fr[0].page || 1) === 1;
    if (lone) { out.push([0]); i = 1; }
    for (; i < fr.length; i += 2) {
      out.push(i + 1 < fr.length ? [i, i + 1] : [i]);
    }
    return out;
  }

  function mount() {
    var item = items[at];
    if (!item) return;

    canvas.innerHTML = '';
    sheets = [];
    leaf = 0;
    rtl = item.reads === 'rtl';
    view.classList.remove('is-reading');
    fit(false);

    guard.classList.toggle('is-armed', isDoc(item));

    if (item.type === 'link') { mountCard(item); return; }

    var fr = frames(item);
    openingsOf(item).forEach(function (group, n) {
      var box = document.createElement('div');
      box.className = 'opening leafsheet is-holding' + (n === 0 ? ' is-shown' : '');
      if (rtl) box.classList.add('reads-rtl');
      box.dataset.pages = group.map(function (i) { return fr[i].page || (i + 1); }).join('–');
      box.dataset.section = group.map(function (i) { return fr[i].section || ''; })
                                 .filter(Boolean)[0] || '';

      group.forEach(function (i) {
        var f = fr[i], el;
        if (f.kind === 'film') {
          el = document.createElement('video');
          el.preload = n === 0 ? 'metadata' : 'none';
          el.controls = true;
          el.playsInline = true;
          el.setAttribute('controlsList', 'nodownload noplaybackrate');
          el.disablePictureInPicture = true;
          if (f.poster) el.poster = url(f.poster);
          if (n === 0) el.src = url(f.src); else el.dataset.src = url(f.src);
          box.classList.add('has-film');
          box.classList.remove('is-holding');
        } else {
          el = document.createElement('img');
          el.alt = item.title + (fr.length > 1 ? ', page ' + (f.page || (i + 1)) : '');
          el.draggable = false;
          el.decoding = 'async';
          el.addEventListener('load', function () {
            if (sheets[leaf] === box) { setCeiling(); fit(false); }
            box.classList.remove('is-holding');
          });
          /* The master of a rendered scroll is forty to seventy
             megapixels and ten megabytes. Opening a work used to fetch
             and decode the whole of that before anything appeared. What
             loads now is the reading copy; the master is kept in hand
             and fetched only if someone magnifies past what the reading
             copy can resolve. Its declared size travels with it, so the
             zoom ceiling is still the master's and not the stand-in's. */
          var wanted = url(f.src);
          if (f.screen) {
            el.dataset.full = wanted;
            if (f.w) el.dataset.fullw = f.w;
            if (f.h) el.dataset.fullh = f.h;
            wanted = url(f.screen);
          }
          if (n < 2) el.src = wanted; else el.dataset.src = wanted;
        }
        el.className = 'sheet';
        box.appendChild(el);
      });

      /* A single-sheet work has a thumbnail already fetched and decoded
         for the rail. Painting it behind the frame means the picture is
         there the instant the viewer opens — soft, but at fit size on
         most screens barely distinguishable — and the sheet proper
         fades in over it. Only where the thumbnail IS this sheet: a
         second page must not wear the first page's face. */
      if (fr.length === 1 && item.cover && !box.classList.contains('has-film')) {
        box.style.backgroundImage = 'url("' + url(item.cover).replace(/"/g, '\\"') + '")';
        box.classList.add('has-stand-in');
      }

      canvas.appendChild(box);
      sheets.push(box);
    });

    /* If a picture never arrives, the sheet is still shown rather than
       left blank. Late enough that a normal load has already revealed it. */
    setTimeout(function () {
      sheets.forEach(function (b) { b.classList.remove('is-holding'); });
    }, 1500);

    leafBox.hidden = sheets.length < 2;
    dressLeafButtons();
    turnTo(0, false);

    vTitle.textContent = item.title;
    vTally.textContent = pad(at + 1) + ' / ' + pad(items.length);
    dressWorkButtons();
  }

  function dressWorkButtons() {
    if (!workBack) return;
    workBack.disabled = at === 0;
    workFwd.disabled  = at === items.length - 1;
  }

  /* A piece published elsewhere: set as a card, so a visitor reads
     something composed before deciding to leave for someone else's page. */
  /* A piece published elsewhere, set as a page of its own: the source,
     the headline, who wrote it and when, the picture the site gives its
     own link, and the text — so a visitor reads it here and leaves only
     if they want the rest. */
  function mountCard(item) {
    var card = document.createElement('article');
    card.className = 'reading';

    var col = document.createElement('div');
    col.className = 'reading-text';
    if (semitic(item.title + ' ' + (item.body || []).join(' '))) col.dir = 'rtl';

    col.appendChild(line('p', 'reading-source', host(item.url)));
    col.appendChild(line('h3', 'reading-title', item.title));

    var rule = document.createElement('div');
    rule.className = 'rule left';
    col.appendChild(rule);

    if (item.by || item.date) {
      var cred = document.createElement('p');
      cred.className = 'reading-credit';
      if (item.by) {
        if (item.bylink) {
          var a = document.createElement('a');
          a.href = item.bylink; a.target = '_blank'; a.rel = 'noopener noreferrer';
          a.textContent = item.by;
          cred.appendChild(a);
        } else {
          cred.appendChild(document.createTextNode(item.by));
        }
      }
      if (item.by && item.date) cred.appendChild(document.createTextNode('  ·  '));
      if (item.date) cred.appendChild(document.createTextNode(item.date));
      col.appendChild(cred);
    }

    // The picture sits under the caption, where a paper would put it.
    if (item.cover) {
      var fig = document.createElement('div');
      fig.className = 'reading-picture';
      var img = document.createElement('img');
      img.src = url(item.cover);
      img.alt = item.title;
      img.draggable = false;
      fig.appendChild(img);
      col.appendChild(fig);
    }

    if (item.quote) {
      col.appendChild(line('blockquote', 'reading-quote',
        '\u201C' + item.quote.replace(/^["\u201C]|["\u201D]$/g, '') + '\u201D'));
    }

    (item.body || []).forEach(function (para) {
      col.appendChild(line('p', 'reading-para', para));
    });

    var go = document.createElement('a');
    go.className = 'quiet-link reading-go';
    go.href = item.url;
    go.target = '_blank';
    go.rel = 'noopener noreferrer';
    go.textContent = T('viewer.readAt', { host: host(item.url) }, 'Read at ' + host(item.url));
    col.appendChild(go);

    card.appendChild(col);
    canvas.appendChild(card);

    sheets = [];
    baseW = baseH = 0;
    leafBox.hidden = true;
    loupe.hidden = true;
    canvas.style.transform = 'translate(0px,0px)';
    view.classList.add('is-reading');

    vTitle.textContent = item.title;
    vTally.textContent = pad(at + 1) + ' / ' + pad(items.length);
    dressWorkButtons();
    vPrev.disabled = vNext.disabled = true;
  }

  function line(tag, cls, text) {
    var el = document.createElement(tag);
    el.className = cls;
    el.textContent = text;
    return el;
  }

  /* Hebrew and Yiddish set right to left. */
  function semitic(text) { return /[\u0590-\u05FF]/.test(text || ''); }

  /* In a Hebrew book the button on the left carries you forward. */
  function dressLeafButtons() {
    leafBack.innerHTML = rtl ? '&#8250;' : '&#8249;';
    leafFwd.innerHTML  = rtl ? '&#8249;' : '&#8250;';
    leafBack.setAttribute('aria-label', 'Previous opening');
    leafFwd.setAttribute('aria-label', 'Next opening');
    leafBox.style.flexDirection = rtl ? 'row-reverse' : 'row';
  }

  /* ── turning: one opening dissolves into the next ── */

  function turnTo(n, animate) {
    if (!sheets.length) return;
    n = Math.min(sheets.length - 1, Math.max(0, n));
    leaf = n;

    sheets.forEach(function (box, i) {
      box.style.transition = animate === false ? 'none' : '';
      box.classList.toggle('is-shown', i === n);
      if (i !== n) {
        Array.prototype.forEach.call(box.querySelectorAll('video'), function (v) {
          if (!v.paused) v.pause();
        });
      }
    });

    // This opening first, then its neighbours before they are asked for.
    [n, n - 1, n + 1].forEach(function (i) {
      var box = sheets[i];
      if (!box) return;
      Array.prototype.forEach.call(box.children, function (el) {
        if (el.src || !el.dataset.src) return;
        if (el.tagName === 'VIDEO' && i !== n) return;   // never preload a film
        el.src = el.dataset.src;
      });
    });

    var box = sheets[n];
    var count = T('viewer.of', { n: n + 1, total: sheets.length }, (n + 1) + ' of ' + sheets.length);
    var where = box.dataset.pages
      ? T('viewer.pages', { n: box.dataset.pages }, 'Pages ' + box.dataset.pages)
      : count;
    if (!isDoc(items[at])) where = count;
    else if (box.dataset.pages && box.dataset.pages.indexOf('–') === -1)
      where = T('viewer.page', { n: box.dataset.pages }, 'Page ' + box.dataset.pages);
    leafNum.textContent = box.dataset.section
      ? box.dataset.section + '  ·  ' + where
      : where;

    leafBack.disabled = n === 0;
    leafFwd.disabled  = n === sheets.length - 1;
    view.classList.toggle('is-turnable', sheets.length > 1 && scale <= MIN + 0.01);
    // The edge arrows mirror them, in reading order.
    if (rtl) { vNext.disabled = n === 0; vPrev.disabled = n === sheets.length - 1; }
    else     { vPrev.disabled = n === 0; vNext.disabled = n === sheets.length - 1; }
    loupe.hidden = !zoomable();
    setCeiling();
    fit(true);
  }

  leafBack.addEventListener('click', function () { turnTo(leaf - 1, true); });
  leafFwd .addEventListener('click', function () { turnTo(leaf + 1, true); });

  function turn(dir) {
    var i = at + dir;
    if (i < 0 || i >= items.length) return;
    at = i;
    mount();
    var plate = rail.children[at];
    if (plate && plate.scrollIntoView) {
      plate.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
    }
  }

  function close() {
    vitrine.classList.remove('is-open');
    Array.prototype.forEach.call(canvas.querySelectorAll('video'), function (v) { v.pause(); });
    setTimeout(function () {
      vitrine.hidden = true;
      canvas.innerHTML = '';
      sheets = [];
      if (opener && opener.focus) opener.focus();
    }, calm ? 0 : 400);
  }

  var workBack = document.getElementById('work-back');
  var workFwd  = document.getElementById('work-fwd');

  /* The arrows at the edges of the screen do the thing you came to do —
     turn the page, or move to the next photograph. Moving to a different
     WORK is a rarer act, and lives beside the count in the bar. */
  function edge(dir) {           // dir: -1 back, +1 on, in reading order
    if (sheets.length > 1) turnTo(leaf + dir, true);
    else turn(dir);
  }

  vClose.addEventListener('click', close);
  vPrev.addEventListener('click', function () { edge(rtl ?  1 : -1); });
  vNext.addEventListener('click', function () { edge(rtl ? -1 :  1); });
  workBack.addEventListener('click', function () { turn(-1); });
  workFwd .addEventListener('click', function () { turn(1); });
  vitrine.addEventListener('click', function (e) {
    // Only the ground around the work dismisses it. The page itself is
    // for turning — see below.
    if (e.target === vitrine) close();
  });

  /* Click a page to turn it: in a Hebrew book the left page carries you
     forward and the right page back, exactly as the hand does. Only when
     the page is at rest — once magnified, a click belongs to panning. */
  view.addEventListener('click', function (e) {
    if (sheets.length < 2) return;
    if (scale > MIN + 0.01) return;
    if (turnedBy > 8) return;                  // that was a drag
    if (e.target.closest && e.target.closest('video, a, button')) return;

    var r = view.getBoundingClientRect();
    var left = (e.clientX - r.left) < r.width / 2;
    var forward = rtl ? left : !left;
    turnTo(leaf + (forward ? 1 : -1), true);
  });

  /* How far the pointer travelled between pressing and letting go, so a
     drag across the page is never mistaken for a click on it. */
  var turnedBy = 0, pressX = 0, pressY = 0;
  view.addEventListener('pointerdown', function (e) {
    pressX = e.clientX; pressY = e.clientY; turnedBy = 0;
  });
  view.addEventListener('pointerup', function (e) {
    turnedBy = Math.hypot(e.clientX - pressX, e.clientY - pressY);
  });
  window.addEventListener('resize', function () {
    if (!isOpen()) return;
    setCeiling();
    if (scale > MAX) scale = MAX;
    rein(); apply(false);
  });

  /* ── the pages are not yours to take ── */

  ['contextmenu', 'dragstart'].forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      if (e.target.closest && e.target.closest('.vitrine, .rail')) e.preventDefault();
    });
  });

  document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd+P and Ctrl/Cmd+S have nothing to act on here.
    if ((e.metaKey || e.ctrlKey) && (e.key === 'p' || e.key === 's')) {
      if (isOpen()) e.preventDefault();
    }
  });

  /* ── Keyboard ─────────────────────────────────────────────── */

  document.addEventListener('keydown', function (e) {
    if (isOpen()) {
      var many = sheets.length > 1;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === '0') { fit(true); return; }
      if (e.key === '+' || e.key === '=') { magnify(scale * 1.6, undefined, undefined, true); return; }
      if (e.key === '-' || e.key === '_') { magnify(scale / 1.6, undefined, undefined, true); return; }

      // In a Hebrew book the left arrow carries you FORWARD; in a Latin
      // one it carries you back. Shift moves between works either way.
      if (e.key === 'ArrowLeft') {
        if (e.shiftKey || !many) turn(-1); else turnTo(leaf + (rtl ?  1 : -1), true);
        return;
      }
      if (e.key === 'ArrowRight') {
        if (e.shiftKey || !many) turn(1);  else turnTo(leaf + (rtl ? -1 :  1), true);
        return;
      }
      if (e.key === 'PageUp')   { turn(-1); return; }
      if (e.key === 'PageDown') { turn(1);  return; }
      return;
    }

    var el = document.activeElement;
    var typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');
    if (typing) return;

    if (current === 'works' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault();
      nudge(e.key === 'ArrowRight' ? 1 : -1);
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowUp'   || e.key === 'PageUp')   { e.preventDefault(); step(-1); }
  });

  /* ── Swipe turns the room ────────────────────────────────────
     The wheel deliberately does NOT. Hijacking a scroll gesture to
     move a page sideways or between screens makes a site feel broken:
     you reach for the rail and the whole room changes under you.
     The wheel scrolls the rail and nothing else.
     ──────────────────────────────────────────────────────────── */

  var latched = 0;
  function turnable(node) {
    while (node && node !== document.body) {
      if (node === rail || node === vitrine) return false;
      if (node.scrollHeight - node.clientHeight > 4 &&
          /auto|scroll/.test(getComputedStyle(node).overflowY)) return false;
      node = node.parentNode;
    }
    return true;
  }

  var touchY = null, touchX = null;
  window.addEventListener('touchstart', function (e) {
    touchY = e.touches[0].clientY; touchX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener('touchend', function (e) {
    if (isOpen() || touchY === null) return;
    var dy = touchY - e.changedTouches[0].clientY;
    var dx = touchX - e.changedTouches[0].clientX;
    touchY = touchX = null;
    if (Math.abs(dy) < 110 || Math.abs(dy) < Math.abs(dx) * 1.6) return;
    if (!turnable(e.target)) return;
    var now = Date.now();
    if (now - latched < 900) return;
    latched = now;
    step(dy > 0 ? 1 : -1);
  }, { passive: true });

  window.addEventListener('resize', function () { if (current === 'works') measure(); });

  /* ── The enquiry ──────────────────────────────────────────── */

  var form   = document.getElementById('inquiry-form');
  var fields = document.getElementById('form-fields');
  var sent   = document.getElementById('sent-message');
  var wa     = document.getElementById('whatsapp-link');
  var status = document.getElementById('form-status');

  function value(name) {
    return form && form.elements[name] ? form.elements[name].value.trim() : '';
  }

  function refreshWhatsApp() {
    if (!form || !wa) return;
    var text = 'Kwadrat Legacy Studio enquiry\n\n' +
      'Name: '  + value('name')  + '\n' +
      'Email: ' + value('email') + '\n' +
      'Phone / WhatsApp: ' + value('phone') + '\n\n' +
      'Message:\n' + value('message');
    wa.href = 'https://wa.me/447974770973?text=' + encodeURIComponent(text);
  }

  if (form) {
    ['input', 'change'].forEach(function (ev) { form.addEventListener(ev, refreshWhatsApp); });
    refreshWhatsApp();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var button = form.querySelector('button[type="submit"]');
      if (button) { button.disabled = true; button.textContent = T('enq.sending', null, 'Sending…'); }
      status.className = 'form-status';
      status.textContent = '';

      var key = (window.KWADRAT_FORM_KEY || '').trim();
      if (!key) {
        if (button) { button.disabled = false; button.textContent = T('enq.send', null, 'Send Enquiry'); }
        status.className = 'form-status show';
        status.textContent = T('enq.error', null,
          'The enquiry could not be sent. Please write to info@kwadratlegacystudio.com, or use WhatsApp.');
        return;
      }

      /* Sent as FormData on purpose. A JSON body would set a
         Content-Type that makes the browser send a CORS preflight, and
         the endpoint refuses preflights outright — 403, every origin.
         FormData is a "simple request" and goes straight through. */
      var body = new FormData();
      body.append('access_key', key);
      body.append('subject', 'Kwadrat Legacy Studio — Private Commission Enquiry');
      body.append('from_name', 'Kwadrat Legacy Studio');
      body.append('name',     value('name'));
      body.append('email',    value('email'));
      body.append('phone',    value('phone'));
      body.append('message',  value('message'));
      body.append('botcheck', value('botcheck'));
      /* Which tongue they were reading in, so the reply can be written
         in the same one. */
      body.append('language', ({ en: 'English', he: 'Hebrew', yi: 'Yiddish' })[window.KW_LANG] || 'English');
      body.append('page', location.href);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: body
      }).then(function (r) {
        return r.json().catch(function () { return { success: r.ok }; });
      }).then(function (out) {
        if (!out || !out.success) throw new Error((out && out.message) || 'refused');
        fields.hidden = true;
        sent.hidden = false;
      }).catch(function (err) {
        if (button) { button.disabled = false; button.textContent = T('enq.send', null, 'Send Enquiry'); }
        status.className = 'form-status show';
        status.textContent = T('enq.error', null,
          'The enquiry could not be sent. Please write to info@kwadratlegacystudio.com, or use WhatsApp.')
          + '  (' + err.message + ')';
      });
    });
  }

  /* ── Open the doors ───────────────────────────────────────── */

  paint('unrolled');

  var start = (location.hash || '').replace('#', '');
  if (ROOMS.indexOf(start) === -1) start = 'threshold';
  rooms[start].classList.add('is-open');
  current = start;
  document.body.setAttribute('data-room', start);
  if (links[start]) links[start].classList.add('is-here');


  window.addEventListener('hashchange', function () {
    var name = (location.hash || '').replace('#', '');
    if (ROOMS.indexOf(name) !== -1) enter(name, true);
  });
})();
