/* Lahza Studio layout (Record 17): home screen in style أ, studio in style ب.
   Loaded after app.js and customize.js. It only changes how things are laid out and opened;
   drawing, printing and saving stay in app.js and customize.js. */
'use strict';

/* Record 18: the studio is Arabic only and for designing only. */
lang = 'ar'; storeSet('lahza-lang', 'ar');
const birthday = occasions.find(o => o.id === 'birthday'); if (birthday) birthday.ar = 'يوم ميلاد';
templates.forEach(t => { if (t.ar === 'عيد ميلاد سعيد') t.ar = 'يوم ميلاد سعيد'; });
/* Where "الرئيسية" goes: the shop's home page when the studio is served beside it (a meta tag says so). */
const HOME_URL = document.querySelector('meta[name="lahza-home"]')?.content || '';
if (!HOME_URL) $('#homeLabel').textContent = 'تصاميمي';

/* Style ب: the design sits between the top bar, the side rail and the bottom bar. */
getFlatFrame = function (canvas) {
  const p = currentProfile(), cw = canvas.clientWidth, ch = canvas.clientHeight;
  if (!cw || !ch) return { x: 0, y: 0, w: 1, h: 1 };
  const narrow = cw < 700, sheetOpen = $('#workspace').classList.contains('sheet-open'), top = 86, side = narrow ? 74 : 104;
  const bottom = sheetOpen ? (parseFloat($('#workspace').style.getPropertyValue('--sheet-h')) || 0) + 16 : narrow ? 168 : 130;
  const aw = Math.max(40, cw - side * 2), ah = Math.max(40, ch - top - bottom), ratio = p.widthMm / p.heightMm;
  let w = Math.min(aw, ah * ratio), h = w / ratio;
  return { x: (cw - w) / 2, y: top + (ah - h) / 2, w, h };
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
async function startStudio() {
  let last = null; try { last = (await dbAll())[0] || null; } catch (e) { /* storage blocked: start fresh */ }
  if (last) openEditor(last); else startWizard('water');
}
showPage = function (page) {
  if (!state.project) { startStudio(); return; }
  if (page === 'home' && HOME_URL) { location.href = HOME_URL; return; }
  openProjectsModal();
};
/* Closing the first question without choosing still gives a bottle to design on. */
const baseCloseModal = closeModal;
closeModal = function () { baseCloseModal(); setTimeout(() => { if (!state.project && $('#modalBackdrop').hidden) openEditor(createProject('water')); }); };
$('#newDesignBtn').addEventListener('click', () => { closeMore(); startWizard(state.project?.productId || 'water'); });
$('#myDesignsBtn').addEventListener('click', () => { closeMore(); openProjectsModal(); });
document.addEventListener('click', e => { if (e.target.closest('[data-new-design]')) startWizard('water'); });
