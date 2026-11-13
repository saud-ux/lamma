/* Lahza Studio layout (Record 17): home screen in style أ, studio in style ب.
   Loaded after app.js and customize.js. It only changes how things are laid out and opened;
   drawing, printing and saving stay in app.js and customize.js. */
'use strict';

/* Record 18: the studio is Arabic only and for designing only. */
lang = 'ar'; storeSet('lahza-lang', 'ar');
const birthday = occasions.find(o => o.id === 'birthday'); if (birthday) birthday.ar = 'يوم ميلاد';
templates.forEach(t => { if (t.ar === 'عيد ميلاد سعيد') t.ar = 'يوم ميلاد سعيد'; });
/* Where "الرئيسية" goes: the shop's home page when the studio is served beside it (a meta tag says so). */
const HOME_URL = document.querySelector('meta[name="lahza-home"]')?.content || 'https://saud-ux.github.io/lamma/';
function goHome() {
  const url = new URL(HOME_URL, location.href);
  if (url.origin === location.origin) { location.href = url.href; return; }
  /* Inside another page (the private trial link), a real link opens the لحظة site. */
  const a = Object.assign(document.createElement('a'), { href: url.href, target: '_blank', rel: 'noopener' });
  document.body.append(a); a.click(); a.remove();
}

/* Style ب: the design sits between the top bar, the side rail and the bottom bar. */
getFlatFrame = function (canvas) {
  const p = currentProfile(), cw = canvas.clientWidth, ch = canvas.clientHeight;
  if (!cw || !ch) return { x: 0, y: 0, w: 1, h: 1 };
  const narrow = cw < 700, sheetOpen = $('#workspace').classList.contains('sheet-open'), top = 86, side = narrow ? 74 : 104;
  const bottom = sheetOpen ? (parseFloat($('#workspace').style.getPropertyValue('--sheet-h')) || 0) + 16 : narrow ? 168 : 130;
  /* The tool rail sits on the left, so the design uses the space from the rail to the right edge. */
  const left = narrow ? 80 : side, right = narrow ? 14 : side;
  const aw = Math.max(40, cw - left - right), ah = Math.max(40, ch - top - bottom), ratio = p.widthMm / p.heightMm;
  let w = Math.min(aw, ah * ratio), h = w / ratio;
  return { x: left + (aw - w) / 2, y: top + (ah - h) / 2, w, h };
};

/* Sheets: the edit panel and "more" share one scrim. */
const scrim = $('#wsbScrim'), moreSheet = $('#moreSheet');
/* Only "more" dims the stage. The edit sheet leaves the design visible above it, so every change shows live. */
function syncScrim() {
  const props = $('#propertyPanel').classList.contains('mobile-open'), more = moreSheet.classList.contains('open'), ws = $('#workspace');
  scrim.hidden = !more;
  const narrow = window.innerWidth < 900, open = narrow && (props || more);
  ws.classList.toggle('sheet-open', open);
  ws.style.setProperty('--sheet-h', `${open ? (props ? $('#propertyPanel') : moreSheet).offsetHeight : 0}px`);
  clearTimeout(syncScrim.t); syncScrim.t = setTimeout(() => { state.bottle?.draw(); drawFlatEditor(); }, 320);
}
function openMore() { closeProps(); moreSheet.classList.add('open'); syncScrim(); $('#workspace').scrollTop = 0; $('#closeMore').focus({ preventScroll: true }); }
function closeMore() { moreSheet.classList.remove('open'); syncScrim(); }
const baseOpenProps = openProps, baseCloseProps = closeProps;
openProps = function (panel) { moreSheet.classList.remove('open'); baseOpenProps(panel); syncScrim(); };
closeProps = function () { baseCloseProps(); syncScrim(); };
$('#moreBtn').addEventListener('click', openMore);
$('#closeMore').addEventListener('click', closeMore);
scrim.addEventListener('click', () => { closeMore(); closeProps(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMore(); });
['#cloneDesignBtn', '#changeProductBtn', '#sizeSettingsBtn', '#helpBtn'].forEach(sel => $(sel).addEventListener('click', closeMore));
/* The rail's tools always open the edit sheet, on every screen size. */
$('#desktopTools').addEventListener('click', e => { const b = e.target.closest('[data-tool]'); if (b && b.dataset.tool !== 'upload') setTimeout(syncScrim); });

/* Quick colors at the bottom: the selected text or shape, or the background when nothing is selected. */
const QUICK = ['#FFFFFF', '#FFB627', '#8E1F4F', '#E07A9F', '#0F7C7C', '#5B3FA8', '#2A1620'];
let quickKey = '';
function renderQuickColors() {
  const box = $('#quickColors'); if (!box || !state.project) return;
  const el = getSelected(), target = el && el.type !== 'image' ? el : null;
  if (el && el.type === 'image') { if (quickKey !== 'image') { box.innerHTML = ''; box.hidden = true; quickKey = 'image'; } return; }
  const current = String(target ? target.color : state.project.bg || '').toUpperCase();
  const key = `${target ? target.id : 'bg'}|${current}|${lang}`;
  if (key === quickKey) return; quickKey = key; box.hidden = false;
  box.setAttribute('aria-label', target ? trans('لون العنصر', 'Element color') : trans('لون الخلفية', 'Background color'));
  box.innerHTML = `<span class="wsb-colors-label">${target ? trans('اللون', 'Color') : trans('الخلفية', 'Background')}</span>` +
    QUICK.map(c => `<button type="button" class="wsb-dot ${c === current ? 'on' : ''}" style="background:${c}" data-quick="${c}" aria-label="${c}" aria-pressed="${c === current}"></button>`).join('') +
    `<button type="button" class="wsb-dot wsb-dot-more" data-quick-more aria-label="${trans('ألوان أكثر', 'More colors')}">+</button>`;
}
$('#quickColors').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b || !state.project) return;
  const el = getSelected();
  if ('quickMore' in b.dataset) { if (el) { cx.tab = 'color'; openProps('element'); } else openProps('background'); return; }
  commitUndo();
  if (el && el.type !== 'image') el.color = b.dataset.quick; else state.project.bg = b.dataset.quick;
  rememberColor(b.dataset.quick); quickKey = ''; refreshPreview(); saveSoon();
  if ($('#propertyPanel').classList.contains('mobile-open')) renderProperties();
});
const baseRefreshSelectionBar = refreshSelectionBar;
refreshSelectionBar = function () {
  baseRefreshSelectionBar();
  const el = getSelected();
  if (el && el.type === 'text') { const { f } = fontOf(el); $('#selectedItemLabel').textContent = `${String(el.text || '').split('\n')[0].slice(0, 18)} · ${trans(f.ar, f.en)}`; }
  renderQuickColors();
};

window.addEventListener('resize', syncScrim);

/* No home page of its own: the studio opens on the last design, or asks what to design. */
function openProjectsModal() {
  state.modal = 'projects';
  openModal(`<div class="modal-kicker">محفوظة على هذا الجهاز</div><h2>تصاميمي</h2><div class="projects-top"><button class="button button-primary" type="button" data-new-design>＋ تصميم جديد</button><label class="button button-outline file-label" for="importProjectInput">استيراد مشروع</label></div><div class="projects-grid" id="projectsGrid"></div>`);
  renderProjects();
}
/* Record 20: the studio opens on a start screen (option ١): new design, ready templates, my designs, latest designs. */
const startEl = $('#startScreen');
function hideStart() { startEl.hidden = true; }
async function showStart() {
  closeProps(); closeMore();
  $('#workspace').hidden = true; document.body.classList.remove('editor-open'); startEl.hidden = false; startEl.scrollTop = 0;
  $('#startTemplatesCount').textContent = `${templates.length} قوالب للمناسبات`;
  let list = []; try { list = await dbAll(); } catch (e) { /* storage blocked */ }
  $('#startMineCount').textContent = list.length ? `${list.length} محفوظة على هذا الجهاز` : 'ما فيه تصاميم بعد';
  $('#startRecent').innerHTML = list.length ? list.slice(0, 3).map(p => {
    const product = productCatalog.find(x => x.id === p.productId) || productCatalog[0];
    const text = p.elements.find(x => x.type === 'text')?.text || p.title;
    return `<button class="st-item" type="button" data-open-project="${p.id}"><span class="st-item-art" style="background:${htmlEscape(p.bg || '#F8F4E9')};color:${htmlEscape(p.accent || '#8E1F4F')}">${htmlEscape(String(text).split('\n')[0].slice(0, 10))}</span><span class="st-item-text"><strong>${htmlEscape(p.title)}</strong><small>${product.ar} · ${new Date(p.updatedAt).toLocaleDateString('ar-SA')}</small></span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8E1F4F" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>`;
  }).join('') : '<p class="st-empty">أول تصميم ينحفظ هنا تلقائيًا.</p>';
}
function startStudio() { showStart(); }
function openTemplatesModal() {
  state.modal = 'templates';
  openModal(`<div class="modal-kicker">نقطة بداية جاهزة</div><h2>قوالب جاهزة</h2><p class="modal-sub">كل قالب يتعدّل بالكامل بعد اختياره.</p><div class="template-grid st-templates">${templates.map(templateCard).join('')}</div>`);
}
const baseOpenEditor = openEditor;
openEditor = function (project) { hideStart(); baseOpenEditor(project); };
$('#startHomeBtn').addEventListener('click', () => goHome());
$('#startNewBtn').addEventListener('click', () => startWizard('water'));
$('#startTemplatesBtn').addEventListener('click', openTemplatesModal);
$('#startMineBtn').addEventListener('click', openProjectsModal);
$('#startAllBtn').addEventListener('click', openProjectsModal);
$('#startScreenBtn').addEventListener('click', async () => { await saveNow(false); showStart(); });
showPage = function (page) {
  if (!state.project) { startStudio(); return; }
  if (page === 'home') { goHome(); return; }
  openProjectsModal();
};
/* Closing a window with no design open goes back to the start screen. */
const baseCloseModal = closeModal;
closeModal = function () { baseCloseModal(); setTimeout(() => { if ($('#modalBackdrop').hidden && $('#workspace').hidden && startEl.hidden) showStart(); }); };
$('#newDesignBtn').addEventListener('click', () => { closeMore(); startWizard(state.project?.productId || 'water'); });
$('#myDesignsBtn').addEventListener('click', () => { closeMore(); openProjectsModal(); });
document.addEventListener('click', e => { if (e.target.closest('[data-new-design]')) startWizard('water'); });

/* ===== Record 19: smooth, free editing ===== */
/* One scene render per frame; the 3D texture only updates while 3D is showing. */
refreshPreview = function () {
  if (!state.project) return;
  refreshSelectionBar(); state.dirty = true;
  if (state.renderQueued) return;
  state.renderQueued = true;
  requestAnimationFrame(() => {
    state.renderQueued = false; if (!state.project) return;
    try { const scene = getSceneCanvas(1200); if (state.view === '3d' && state.bottle && !state.bottle.failed) state.bottle.setArtwork(scene); else drawFlat(scene); }
    catch (err) { console.error('preview render', err); }
  });
};
drawFlatEditor = function () { if (state.project && !$('#flatCanvas').hidden) drawFlat(getSceneCanvas(1200)); };

const HANDLE_R = 11, HIT_R = 24, ROT_GAP = 34;
function selBox(el, frame) {
  const r = getElementRect(el);
  return { cx: frame.x + el.x * frame.w, cy: frame.y + el.y * frame.h, w: r.w * frame.w, h: r.h * frame.h, a: (el.rot || 0) * Math.PI / 180 };
}
function handlesFor(el, b, forDrawing) {
  const small = b.w < 46 || b.h < 46;
  const list = [['nw', -1, -1], ['ne', 1, -1], ['sw', -1, 1], ['se', 1, 1]].map(([id, sx, sy]) => ({ id, kind: 'scale', lx: sx * b.w / 2, ly: sy * b.h / 2 }));
  if (el.type !== 'text') list.push({ id: 'e', kind: 'sx', lx: b.w / 2, ly: 0 }, { id: 'w', kind: 'sx', lx: -b.w / 2, ly: 0 }, { id: 'n', kind: 'sy', lx: 0, ly: -b.h / 2 }, { id: 's', kind: 'sy', lx: 0, ly: b.h / 2 });
  list.push({ id: 'rot', kind: 'rot', lx: 0, ly: -b.h / 2 - ROT_GAP });
  /* On a small element only one corner and the rotate handle are drawn, so they never cover it; all still respond. */
  return forDrawing && small ? list.filter(h => h.id === 'se' || h.id === 'rot') : list;
}
const toWorld = (b, lx, ly) => ({ x: b.cx + lx * Math.cos(b.a) - ly * Math.sin(b.a), y: b.cy + lx * Math.sin(b.a) + ly * Math.cos(b.a) });
const toLocal = (b, x, y) => { const dx = x - b.cx, dy = y - b.cy; return { x: dx * Math.cos(-b.a) - dy * Math.sin(-b.a), y: dx * Math.sin(-b.a) + dy * Math.cos(-b.a) }; };

function drawFlat(scene) {
  const canvas = $('#flatCanvas'); if (!canvas || canvas.hidden || !state.project) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2), w = Math.max(1, Math.round(canvas.clientWidth * dpr)), h = Math.max(1, Math.round(canvas.clientHeight * dpr));
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  const ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
  const f = getFlatFrame(canvas); state.frame = f;
  ctx.save(); ctx.shadowColor = 'rgba(42,22,32,.16)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; ctx.fillStyle = '#fff'; ctx.fillRect(f.x, f.y, f.w, f.h); ctx.restore();
  ctx.drawImage(scene, f.x, f.y, f.w, f.h);
  const pr = currentProfile();
  if (state.guides.safe) { const sx = clamp(3 / pr.widthMm, .006, .16), sy = clamp(3 / pr.heightMm, .006, .28); ctx.save(); ctx.strokeStyle = 'rgba(199,119,58,.75)'; ctx.setLineDash([5, 5]); ctx.strokeRect(f.x + f.w * sx, f.y + f.h * sy, f.w * (1 - 2 * sx), f.h * (1 - 2 * sy)); ctx.restore(); }
  if (state.guides.center || state.snapHint) {
    ctx.save(); ctx.setLineDash([3, 6]);
    const hx = state.snapHint?.x, hy = state.snapHint?.y;
    ctx.strokeStyle = hx ? 'rgba(142,31,79,.95)' : 'rgba(142,31,79,.28)'; ctx.lineWidth = hx ? 1.6 : 1;
    if (state.guides.center || hx) { ctx.beginPath(); ctx.moveTo(f.x + f.w / 2, f.y); ctx.lineTo(f.x + f.w / 2, f.y + f.h); ctx.stroke(); }
    ctx.strokeStyle = hy ? 'rgba(142,31,79,.95)' : 'rgba(142,31,79,.28)'; ctx.lineWidth = hy ? 1.6 : 1;
    if (state.guides.center || hy) { ctx.beginPath(); ctx.moveTo(f.x, f.y + f.h / 2); ctx.lineTo(f.x + f.w, f.y + f.h / 2); ctx.stroke(); }
    ctx.restore();
  }
  const el = getSelected();
  if (el && !el.hidden && !el.locked) {
    const b = selBox(el, f);
    ctx.save(); ctx.translate(b.cx, b.cy); ctx.rotate(b.a);
    ctx.strokeStyle = '#8E1F4F'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]); ctx.strokeRect(-b.w / 2, -b.h / 2, b.w, b.h); ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(0, -b.h / 2); ctx.lineTo(0, -b.h / 2 - ROT_GAP + HANDLE_R); ctx.stroke();
    for (const hd of handlesFor(el, b, true)) {
      ctx.save(); ctx.translate(hd.lx, hd.ly); ctx.shadowColor = 'rgba(42,22,32,.25)'; ctx.shadowBlur = 6; ctx.fillStyle = '#fff'; ctx.strokeStyle = '#8E1F4F'; ctx.lineWidth = 2.2;
      ctx.beginPath();
      if (hd.kind === 'sx') ctx.roundRect(-4, -10, 8, 20, 4); else if (hd.kind === 'sy') ctx.roundRect(-10, -4, 20, 8, 4); else ctx.arc(0, 0, hd.kind === 'rot' ? HANDLE_R + 2 : HANDLE_R, 0, Math.PI * 2);
      ctx.fill(); ctx.shadowColor = 'transparent'; ctx.stroke();
      if (hd.kind === 'rot') { ctx.beginPath(); ctx.arc(0, 0, 5.5, -Math.PI * .1, Math.PI * 1.4); ctx.stroke(); }
      ctx.restore();
    }
    ctx.restore();
  }
}

/* Flat editor gestures, each computed from where it started. */
const ptrs = new Map(); let gesture = null;
function canvasPoint(e) { const r = $('#flatCanvas').getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
function snapshotEl(el) { return { x: el.x, y: el.y, w: el.w, h: el.h, size: el.size, rot: el.rot || 0 }; }
onFlatPointerDown = function (e) {
  if (!state.project) return;
  const canvas = $('#flatCanvas'); canvas.setPointerCapture(e.pointerId);
  const p = canvasPoint(e); ptrs.set(e.pointerId, p);
  const f = getFlatFrame(canvas), el = getSelected();
  if (ptrs.size === 2) {
    if (el && !el.locked) { const [a, c] = [...ptrs.values()]; if (!gesture || !gesture.undoDone) commitUndo(); gesture = { type: 'pinch', d0: Math.hypot(a.x - c.x, a.y - c.y), a0: Math.atan2(c.y - a.y, c.x - a.x), s: snapshotEl(el), undoDone: true }; }
    return;
  }
  if (el && !el.hidden && !el.locked) {
    const b = selBox(el, f), local = toLocal(b, p.x, p.y);
    const hd = handlesFor(el, b).find(h => Math.hypot(local.x - h.lx, local.y - h.ly) <= HIT_R);
    if (hd) { commitUndo(); gesture = { type: hd.kind, b, s: snapshotEl(el), l0: local, d0: Math.max(4, Math.hypot(p.x - b.cx, p.y - b.cy)), undoDone: true }; return; }
  }
  const nx = (p.x - f.x) / f.w, ny = (p.y - f.y) / f.h, found = findAtPoint(nx, ny);
  if (found) {
    state.selectedId = found.id; state.panel = 'element'; commitUndo();
    gesture = { type: 'move', p0: p, s: snapshotEl(found), undoDone: true };
    if ($('#propertyPanel').classList.contains('mobile-open')) renderProperties();
  } else { state.selectedId = null; gesture = null; if ($('#propertyPanel').classList.contains('mobile-open')) renderProperties(); }
  refreshPreview();
};
onFlatPointerMove = function (e) {
  if (!ptrs.has(e.pointerId) || !gesture || !state.project) return;
  const p = canvasPoint(e); ptrs.set(e.pointerId, p);
  const el = getSelected(); if (!el) return;
  const f = state.frame || getFlatFrame($('#flatCanvas')), s = gesture.s;
  const scaleTo = k => { if (el.type === 'text') el.size = clamp((s.size || .2) * k, .015, 3); else { el.w = clamp((s.w || .1) * k, .005, 4); el.h = clamp((s.h || .3) * k, .005, 4); } };
  if (gesture.type === 'pinch' && ptrs.size >= 2) {
    const [a, c] = [...ptrs.values()], d = Math.hypot(a.x - c.x, a.y - c.y), ang = Math.atan2(c.y - a.y, c.x - a.x);
    scaleTo(d / gesture.d0); el.rot = Math.round(s.rot + (ang - gesture.a0) * 180 / Math.PI);
  } else if (gesture.type === 'move') {
    let x = s.x + (p.x - gesture.p0.x) / f.w, y = s.y + (p.y - gesture.p0.y) / f.h;
    const snapX = state.guides.snap && Math.abs(x - .5) < 8 / f.w, snapY = state.guides.snap && Math.abs(y - .5) < 8 / f.h;
    state.snapHint = { x: snapX, y: snapY }; el.x = clamp(snapX ? .5 : x, -.2, 1.2); el.y = clamp(snapY ? .5 : y, -.2, 1.2);
  } else if (gesture.type === 'scale') {
    scaleTo(Math.hypot(p.x - gesture.b.cx, p.y - gesture.b.cy) / gesture.d0);
  } else if (gesture.type === 'sx' || gesture.type === 'sy') {
    const l = toLocal(gesture.b, p.x, p.y);
    if (gesture.type === 'sx') el.w = clamp((s.w || .1) * Math.abs(l.x) / Math.max(4, Math.abs(gesture.l0.x)), .005, 4);
    else el.h = clamp((s.h || .3) * Math.abs(l.y) / Math.max(4, Math.abs(gesture.l0.y)), .005, 4);
  } else if (gesture.type === 'rot') {
    let deg = Math.atan2(p.y - gesture.b.cy, p.x - gesture.b.cx) * 180 / Math.PI + 90;
    deg = ((deg + 540) % 360) - 180;
    for (const t of [-180, -90, 0, 90, 180]) if (Math.abs(deg - t) < 4) deg = t;
    el.rot = Math.round(deg);
  }
  refreshPreview(); saveSoon();
};
onFlatPointerUp = function (e) {
  ptrs.delete(e.pointerId);
  if (ptrs.size === 0) { gesture = null; state.snapHint = null; refreshPreview(); if ($('#propertyPanel').classList.contains('mobile-open')) renderProperties(); }
  else if (gesture && gesture.type === 'pinch') { const el = getSelected(), [only] = [...ptrs.values()]; if (el && only) gesture = { type: 'move', p0: only, s: snapshotEl(el), undoDone: true }; }
};

/* 3D: drag on the product spins it (with a gentle glide), drag on an element moves it, two fingers zoom. */
const p3 = new Map(); let spin = null, glide = 0;
function stopGlide() { cancelAnimationFrame(glide); glide = 0; }
onBottlePointerDown = function (e) {
  if (!state.project || !has3D(state.project.productId) || !state.bottle || state.bottle.failed) return;
  const canvas = $('#bottleCanvas'); canvas.setPointerCapture(e.pointerId); stopGlide();
  p3.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (p3.size === 2) { const [a, c] = [...p3.values()]; spin = { type: 'zoom', d0: Math.hypot(a.x - c.x, a.y - c.y), z0: state.zoom }; state.drag = null; return; }
  const hit = state.bottle.pick(e.clientX, e.clientY), found = hit && findAtPoint(hit.x, hit.y);
  if (found && !found.locked && !found.hidden) {
    state.selectedId = found.id; state.panel = 'element'; commitUndo();
    state.drag = { type: 'bottle', pointer: e.pointerId, offsetX: hit.x - found.x, offsetY: hit.y - found.y }; spin = null; refreshPreview();
  } else { state.drag = null; spin = { type: 'spin', x: e.clientX, a0: state.angle, lastX: e.clientX, lastT: performance.now(), v: 0, moved: false }; }
};
onBottlePointerMove = function (e) {
  if (!p3.has(e.pointerId)) return;
  p3.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (spin && spin.type === 'zoom' && p3.size >= 2) { const [a, c] = [...p3.values()]; state.zoom = clamp(spin.z0 * Math.hypot(a.x - c.x, a.y - c.y) / spin.d0, .55, 1.8); state.bottle.zoom = state.zoom; state.bottle.draw(); return; }
  if (spin && spin.type === 'spin') {
    const now = performance.now(), dt = Math.max(1, now - spin.lastT);
    spin.v = .7 * spin.v + .3 * ((e.clientX - spin.lastX) * .011 / dt); spin.lastX = e.clientX; spin.lastT = now;
    if (Math.abs(e.clientX - spin.x) > 3) spin.moved = true;
    state.angle = spin.a0 + (e.clientX - spin.x) * .011; state.bottle.angle = state.angle; state.bottle.draw(); return;
  }
  if (state.drag && state.drag.type === 'bottle') { const uv = state.bottle.pick(e.clientX, e.clientY); if (uv) setDragElementPosition(uv); }
};
onBottlePointerUp = function (e) {
  p3.delete(e.pointerId);
  if (spin && spin.type === 'spin') {
    if (!spin.moved && state.selectedId) { state.selectedId = null; refreshPreview(); }
    let v = spin.v; const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && Math.abs(v) > .0004) { let last = performance.now(); const step = now => { const dt = now - last; last = now; state.angle += v * dt; v *= Math.pow(.94, dt / 16); state.bottle.angle = state.angle; state.bottle.draw(); glide = Math.abs(v) > .00008 ? requestAnimationFrame(step) : 0; }; glide = requestAnimationFrame(step); }
  }
  if (p3.size === 0) { spin = null; state.drag = null; state.snapHint = null; refreshPreview(); }
};

/* Never a blank screen: whenever no window is open and no design is showing, open one. */
setInterval(() => {
  if (!$('#modalBackdrop').hidden || !$('#workspace').hidden || !startEl.hidden) return;
  if (state.project) { $('#workspace').hidden = false; document.body.classList.add('editor-open'); renderWorkspace(); refreshPreview(); }
  else startStudio();
}, 600);
