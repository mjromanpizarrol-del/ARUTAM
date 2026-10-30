(() => {
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- Idioma ---------- */
let saved = null; try { saved = localStorage.getItem('arutam-lang'); } catch (e) {}
let lang = saved || ((navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es');
const t = k => (T[k] || [k, k])[lang === 'es' ? 0 : 1];

const PRODUCTS = [
  { id: 'aya', name: 'Ayahuasca', cocks: [['Aya & Tonic', 'hi'], ['Aya Collins', 'hi'], ['Ayahuasca Punch', 'sour']] },
  { id: 'gua', name: 'Guayusa', cocks: [['Guayusa & Tonic', 'hi'], ['Guayusa Collins', 'hi'], ['Guayusa Espressotini', 'sour']] },
  { id: 'cac', name: 'Cacao', cocks: [['Cacao & Tonic', 'hi'], ['Cacao Collins', 'hi'], ['Cacao Sour', 'sour']] }
];
const GRAD = { aya: ['#4C6E52', '#021E02'], gua: ['#B68A3A', '#4C2204'], cac: ['#916132', '#1D0F0A'] };
let current = 0;

function buildCards() {
  $('#cards').innerHTML = PRODUCTS.map((p, i) => `
    <a class="card" href="#fichas" data-i="${i}">
      <div class="arch ph" data-ph="[img/botella-${p.name.toLowerCase()}.png]" style="--a:${GRAD[p.id][0]};--b:${GRAD[p.id][1]}"><img src="img/botella-${p.name.toLowerCase()}.png" alt="Arutam ${p.name}" data-opt></div>
      <h3>${p.name}</h3><p>${t('door.' + p.id)}</p><span class="go">${t('prod.view')}</span>
    </a>`).join('');
  $('#tabs').innerHTML = PRODUCTS.map((p, i) => `<button class="tab" role="tab" data-i="${i}" aria-selected="${i === current}">${p.name}</button>`).join('');
}
function renderFicha() {
  const p = PRODUCTS[current], nx = PRODUCTS[(current + 1) % 3];
  $('#f-name').textContent = p.name;
  $('#f-tag').textContent = t('col.' + p.id);
  ['look', 'taste', 'serve'].forEach(k => $('#f-' + k).textContent = t(p.id + '.' + k));
  const img = $('#f-img'); const src = `img/botella-${p.name.toLowerCase()}.png`;
  img.parentNode.classList.remove('noimg'); img.style.display = ''; img.src = src; img.alt = 'Arutam ' + p.name;
  $('#f-bottle').style.setProperty('--a', GRAD[p.id][0]); $('#f-bottle').style.setProperty('--b', GRAD[p.id][1]);
  $('#cocks').innerHTML = p.cocks.map((c, i) => `
    <article class="cock"><div class="arch ph" style="--a:${GRAD[p.id][0]};--b:${GRAD[p.id][1]}"><img src="img/cocktail-${p.id}-${i + 1}.jpg" alt="${c[0]}" data-opt></div>
    <h4>${c[0]}</h4><p>${t(p.id + '.c' + (i + 1))}</p><small>${t('glass.' + c[1])}</small></article>`).join('');
  $('#next-name').textContent = nx.name + ' →';
  $$('.f-bg').forEach(b => b.classList.toggle('on', b.dataset.p === p.id));
  $$('.tab').forEach((b, i) => b.setAttribute('aria-selected', i === current));
  markMissing();
}
function markMissing() {
  $$('img[data-opt]').forEach(im => {
    const fail = () => { im.style.display = 'none'; im.parentNode.classList.add('noimg'); };
    im.addEventListener('error', fail, { once: true });
    if (im.complete && im.naturalWidth === 0) fail();
  });
}
function applyLang() {
  document.documentElement.lang = lang;
  $$('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  $('#lang').dataset.l = lang;
  buildCards(); renderFicha();
  try { localStorage.setItem('arutam-lang', lang); } catch (e) {}
}
$('#lang').addEventListener('click', () => { lang = lang === 'es' ? 'en' : 'es'; applyLang(); });

/* ---------- Fichas + transición de cortina ---------- */
const curtain = $('#curtain');
function go(i, scroll) {
  if (i === current) { if (scroll) $('#fichas').scrollIntoView(); return; }
  const swap = () => { current = i; renderFicha(); if (scroll) $('#fichas').scrollIntoView({ behavior: 'instant' }); };
  if (reduce) return swap();
  curtain.classList.add('on'); requestAnimationFrame(() => requestAnimationFrame(() => curtain.classList.add('cover')));
  setTimeout(() => { swap(); curtain.classList.remove('cover'); setTimeout(() => curtain.classList.remove('on'), 750); }, 750);
}
document.addEventListener('click', e => {
  const card = e.target.closest('.card'); if (card) { e.preventDefault(); go(+card.dataset.i, true); }
  const tab = e.target.closest('.tab'); if (tab) go(+tab.dataset.i, false);
  if (e.target.closest('#next')) { go((current + 1) % 3, false); $('#fichas').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
  const door = e.target.closest('.door'); if (door) { const o = door.classList.toggle('open'); door.setAttribute('aria-expanded', o); }
  if (e.target.closest('#links a')) toggleMenu(false);
});

/* ---------- Menú móvil ---------- */
function toggleMenu(open) { document.body.classList.toggle('menu-open', open); $('#burger').setAttribute('aria-expanded', open); }
$('#burger').addEventListener('click', () => toggleMenu(!document.body.classList.contains('menu-open')));

/* ---------- Scroll: barra de progreso, parallax de hojas, sección activa ---------- */
const leaves = $$('.leaf'); let mx = .5, my = .5, ticking = false;
function frame() {
  ticking = false;
  const h = document.documentElement; const max = h.scrollHeight - innerHeight;
  $('#bar').style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
  if (reduce) return;
  $('#heroBg').style.setProperty('--bgy', (scrollY * .25) + 'px');
  leaves.forEach(l => {
    const r = l.parentNode.getBoundingClientRect(); if (r.bottom < -200 || r.top > innerHeight + 200) return;
    const d = +l.dataset.depth || .2, off = (r.top + r.height / 2 - innerHeight / 2);
    l.style.setProperty('--y', (off * d * .35) + 'px'); l.style.setProperty('--x', ((mx - .5) * 60 * d) + 'px');
  });
}
const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
addEventListener('scroll', req, { passive: true }); addEventListener('resize', req);
const groups = { inicio: 'inicio', nosotros: 'nosotros', origen: 'nosotros', productos: 'productos', fichas: 'productos', trade: 'contacto', contacto: 'contacto' };
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { const g = groups[en.target.id]; $$('#links a').forEach(a => a.classList.toggle('on', a.dataset.g === g)); }
}), { rootMargin: '-45% 0px -50% 0px' });
Object.keys(groups).forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });

/* ---------- Cursor de hoja y haz de luz (solo con ratón) ---------- */
if (fine && !reduce) {
  const c = $('#cursor'), hero = $('#inicio'), light = $('#heroLight');
  addEventListener('mousemove', e => {
    document.body.classList.add('has-cursor');
    c.style.transform = `translate(${e.clientX - 6}px,${e.clientY - 6}px) rotate(${(e.clientX - innerWidth / 2) * .03}deg)`;
    mx = e.clientX / innerWidth; my = e.clientY / innerHeight; req();
    const r = hero.getBoundingClientRect(); light.style.setProperty('--lx', (e.clientX - r.left) + 'px'); light.style.setProperty('--ly', (e.clientY - r.top) + 'px');
  });
}

/* ---------- Formulario (abre el correo; ver README para conectar un servicio) ---------- */
$('#form').addEventListener('submit', e => {
  e.preventDefault(); const f = e.target, n = $('#form-note');
  if (!f.name.value.trim() || !/\S+@\S+\.\S+/.test(f.email.value) || !f.msg.value.trim()) { n.textContent = t('c.err'); return; }
  n.textContent = t('c.ok');
  const body = `${f.msg.value}\n\n— ${f.name.value} (${f.venue.value}) <${f.email.value}>`;
  location.href = 'mailto:aeguiguren@arutamspirits.com?subject=' + encodeURIComponent('ARUTAM — ' + (f.venue.value || f.name.value)) + '&body=' + encodeURIComponent(body);
});

applyLang(); frame();
})();
