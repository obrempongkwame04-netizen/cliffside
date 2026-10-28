(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footer year
  $('#year').textContent = new Date().getFullYear();

  // Sticky header + back-to-top
  var header = $('#header'), toTop = $('#toTop');
  function onScroll() {
    header.classList.toggle('solid', window.scrollY > 60);
    toTop.hidden = window.scrollY < 900;
    parallax();
  }
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  // Mobile menu
  var btn = $('#menuBtn'), nav = $('#nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  btn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); btn.focus(); } });

  // Scroll reveals
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(function (r) { io.observe(r); });
  } else { reveals.forEach(function (r) { r.classList.add('in'); }); }

  // Gentle parallax on the signature image
  var pimg = $('[data-parallax]');
  function parallax() {
    if (!pimg || reduce) return;
    var r = pimg.parentNode.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    var p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
    pimg.style.transform = 'translateY(' + (p * -30).toFixed(1) + 'px)';
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(function () { onScroll(); ticking = false; }); ticking = true; }
  }, { passive: true });
  onScroll();

  // Gallery filter
  var tiles = $$('.tile'), chips = $$('.chip');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
      c.classList.add('active'); c.setAttribute('aria-pressed', 'true');
      var f = c.dataset.filter;
      tiles.forEach(function (t) { t.hidden = !(f === 'all' || t.dataset.cat === f); });
    });
  });

  // Lightbox
  var lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), idx = 0, opener = null;
  function visible() { return tiles.filter(function (t) { return !t.hidden; }); }
  function show(i) {
    var list = visible(); idx = (i + list.length) % list.length;
    var t = list[idx];
    lbImg.src = t.dataset.src; lbImg.alt = t.dataset.alt; lbCap.textContent = t.dataset.cap;
  }
  function open(t) { opener = t; lb.hidden = false; document.body.style.overflow = 'hidden'; show(visible().indexOf(t)); $('#lbClose').focus(); }
  function close() { lb.hidden = true; document.body.style.overflow = ''; if (opener) opener.focus(); }
  tiles.forEach(function (t) { t.addEventListener('click', function () { open(t); }); });
  $('#lbClose').addEventListener('click', close);
  $('#lbPrev').addEventListener('click', function () { show(idx - 1); });
  $('#lbNext').addEventListener('click', function () { show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
    else if (e.key === 'Tab') { // keep focus inside the dialog
      var f = $$('button', lb), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Enquiry form (front-end demonstration only: nothing is sent anywhere)
  var form = $('#enquiry'), status = $('#status');
  var rules = {
    name: function (v) { return v.trim().length < 2 ? 'Enter your full name.' : ''; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email address, for example name@example.com.'; },
    phone: function (v) { return v && !/^[+\d\s()\-]{7,20}$/.test(v.trim()) ? 'Use digits, spaces, + or - only, or leave this blank.' : ''; },
    subject: function (v) { return v ? '' : 'Choose an area of interest.'; },
    message: function (v) { return v.trim().length < 10 ? 'Write a message of at least 10 characters.' : ''; },
    consent: function (v, el) { return el.checked ? '' : 'Tick the box to confirm your consent.'; }
  };
  function check(el) {
    var msg = rules[el.name](el.value, el), box = $('#' + el.id + '-err');
    box.textContent = msg;
    el.closest('.field').classList.toggle('invalid', !!msg);
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }
  var fields = Object.keys(rules).map(function (n) { return form.elements[n]; });
  fields.forEach(function (el) { el.addEventListener('blur', function () { check(el); }); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = fields.filter(function (el) { return !check(el); });
    if (bad.length) {
      status.textContent = 'Please correct ' + bad.length + (bad.length === 1 ? ' field' : ' fields') + ' and submit again.';
      bad[0].focus(); return;
    }
    // To make this form live, replace this block with a fetch() to your form service (see README).
    status.textContent = 'Demonstration only: your enquiry was checked but not sent. See the README to connect a form service.';
    form.reset();
  });
})();
