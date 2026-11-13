/* Lahza Studio: full customization (Record 16).
   Loaded after app.js. It replaces how the design is drawn and the edit panel, and adds fonts, colors,
   gradients, outlines, shadows, curved text, more shapes, photo masks and filters, and background styles.
   Everything is drawn on the same canvas that feeds the 3D preview and the print PDF, so what the customer
   sees is what prints. */
'use strict';

/* ---------- Fonts: all from Google Fonts under open licenses (OFL, or Apache for a few Latin faces) ---------- */
const FONTS = [
  { id: 'plex', family: 'IBM Plex Sans Arabic', ar: 'بلكس', en: 'Plex Arabic', script: 'ar', cat: 'modern', bold: true },
  { id: 'cairo', family: 'Cairo', ar: 'القاهرة', en: 'Cairo', script: 'ar', cat: 'modern', bold: true },
  { id: 'tajawal', family: 'Tajawal', ar: 'تجوال', en: 'Tajawal', script: 'ar', cat: 'modern', bold: true },
  { id: 'almarai', family: 'Almarai', ar: 'المراعي', en: 'Almarai', script: 'ar', cat: 'modern', bold: true },
  { id: 'readex', family: 'Readex Pro', ar: 'ريدكس', en: 'Readex Pro', script: 'ar', cat: 'modern', bold: true },
  { id: 'mada', family: 'Mada', ar: 'مدى', en: 'Mada', script: 'ar', cat: 'modern', bold: true },
  { id: 'baloo', family: 'Baloo Bhaijaan 2', ar: 'بالو', en: 'Baloo', script: 'ar', cat: 'fun', bold: true },
  { id: 'lemonada', family: 'Lemonada', ar: 'ليموناضة', en: 'Lemonada', script: 'ar', cat: 'fun', bold: true },
  { id: 'marhey', family: 'Marhey', ar: 'مرحي', en: 'Marhey', script: 'ar', cat: 'fun', bold: true },
  { id: 'changa', family: 'Changa', ar: 'تشانجا', en: 'Changa', script: 'ar', cat: 'fun', bold: true },
  { id: 'lalezar', family: 'Lalezar', ar: 'لاله‌زار', en: 'Lalezar', script: 'ar', cat: 'bold', bold: false },
  { id: 'rakkas', family: 'Rakkas', ar: 'رقّاص', en: 'Rakkas', script: 'ar', cat: 'bold', bold: false },
  { id: 'jomhuria', family: 'Jomhuria', ar: 'جمهورية', en: 'Jomhuria', script: 'ar', cat: 'bold', bold: false },
  { id: 'katibeh', family: 'Katibeh', ar: 'كاتبة', en: 'Katibeh', script: 'ar', cat: 'bold', bold: false },
  { id: 'blaka', family: 'Blaka', ar: 'بلاكا', en: 'Blaka', script: 'ar', cat: 'bold', bold: false },
  { id: 'amiri', family: 'Amiri', ar: 'أميري', en: 'Amiri', script: 'ar', cat: 'classic', bold: true },
  { id: 'naskh', family: 'Noto Naskh Arabic', ar: 'نسخ', en: 'Naskh', script: 'ar', cat: 'classic', bold: true },
  { id: 'scheherazade', family: 'Scheherazade New', ar: 'شهرزاد', en: 'Scheherazade', script: 'ar', cat: 'classic', bold: true },
  { id: 'harmattan', family: 'Harmattan', ar: 'هرمتان', en: 'Harmattan', script: 'ar', cat: 'classic', bold: true },
  { id: 'gulzar', family: 'Gulzar', ar: 'كلزار', en: 'Gulzar', script: 'ar', cat: 'classic', bold: false },
  { id: 'kufi', family: 'Noto Kufi Arabic', ar: 'كوفي', en: 'Kufi', script: 'ar', cat: 'kufi', bold: true },
  { id: 'reemkufi', family: 'Reem Kufi', ar: 'ريم كوفي', en: 'Reem Kufi', script: 'ar', cat: 'kufi', bold: true },
  { id: 'messiri', family: 'El Messiri', ar: 'المسيري', en: 'El Messiri', script: 'ar', cat: 'kufi', bold: true },
  { id: 'ruqaa', family: 'Aref Ruqaa', ar: 'رقعة', en: 'Ruqaa', script: 'ar', cat: 'hand', bold: true },
  { id: 'vibes', family: 'Vibes', ar: 'فايبز', en: 'Vibes', script: 'ar', cat: 'hand', bold: false },
  { id: 'dmsans', family: 'DM Sans', ar: 'DM Sans', en: 'DM Sans', script: 'en', cat: 'modern', bold: true },
  { id: 'montserrat', family: 'Montserrat', ar: 'Montserrat', en: 'Montserrat', script: 'en', cat: 'modern', bold: true },
  { id: 'josefin', family: 'Josefin Sans', ar: 'Josefin Sans', en: 'Josefin Sans', script: 'en', cat: 'modern', bold: true },
  { id: 'bebas', family: 'Bebas Neue', ar: 'Bebas Neue', en: 'Bebas Neue', script: 'en', cat: 'bold', bold: false },
  { id: 'abril', family: 'Abril Fatface', ar: 'Abril Fatface', en: 'Abril Fatface', script: 'en', cat: 'bold', bold: false },
  { id: 'lobster', family: 'Lobster', ar: 'Lobster', en: 'Lobster', script: 'en', cat: 'fun', bold: false },
  { id: 'pacifico', family: 'Pacifico', ar: 'Pacifico', en: 'Pacifico', script: 'en', cat: 'fun', bold: false },
  { id: 'playfair', family: 'Playfair Display', ar: 'Playfair', en: 'Playfair', script: 'en', cat: 'classic', bold: true, italic: true },
  { id: 'cormorant', family: 'Cormorant Garamond', ar: 'Cormorant', en: 'Cormorant', script: 'en', cat: 'classic', bold: true },
  { id: 'greatvibes', family: 'Great Vibes', ar: 'Great Vibes', en: 'Great Vibes', script: 'en', cat: 'hand', bold: false },
  { id: 'dancing', family: 'Dancing Script', ar: 'Dancing Script', en: 'Dancing Script', script: 'en', cat: 'hand', bold: true },
  { id: 'caveat', family: 'Caveat', ar: 'Caveat', en: 'Caveat', script: 'en', cat: 'hand', bold: true }
];
const FONT_CATS = [['all', 'الكل', 'All'], ['ar', 'عربي', 'Arabic'], ['en', 'إنجليزي', 'English'], ['modern', 'عصري', 'Modern'], ['classic', 'كلاسيكي', 'Classic'], ['kufi', 'كوفي', 'Kufi'], ['hand', 'خط يد', 'Handwritten'], ['fun', 'مرح', 'Playful'], ['bold', 'عريض', 'Display']];
const LEGACY_FONT = { arabic: { id: 'plex', weight: 700 }, latin: { id: 'dmsans', weight: 600 } };
const SYSTEM_FALLBACK = 'Tahoma, Arial, sans-serif';

function fontOf(el) {
  const legacy = LEGACY_FONT[el.font];
  const f = FONTS.find(x => x.id === (legacy ? legacy.id : el.font)) || FONTS[0];
  const weight = el.weight != null ? Number(el.weight) : legacy ? legacy.weight : 700;
  return { f, weight: f.bold ? weight : 400, italic: !!el.italic && !!f.italic };
}
function fontString(el, px) {
  const { f, weight, italic } = fontOf(el);
  return `${italic ? 'italic ' : ''}${weight} ${px}px "${f.family}", ${SYSTEM_FALLBACK}`;
}
const fontRequests = new Map();
function loadFontFor(el) {
  if (!document.fonts || !document.fonts.load) return Promise.resolve();
  const key = fontString(el, 40);
  if (!fontRequests.has(key)) {
    const p = document.fonts.load(key, el.text || 'لحظة Lahza').then(() => { refreshPreview(); }).catch(() => {});
    fontRequests.set(key, p);
  }
  return fontRequests.get(key);
}

/* ---------- Colors ---------- */
const BIG_PALETTE = [
  '#FFFFFF', '#F5F0EB', '#D9D2CC', '#A39A94', '#5E5550', '#2A1620', '#000000',
  '#FBE6EE', '#F4C2D3', '#E07A9F', '#B83A6B', '#8E1F4F', '#5E1234',
  '#FFE29A', '#FFB627', '#F29E4C', '#E86A3A', '#C8442E', '#8A2B1C',
  '#C9E4C5', '#7FB685', '#3E7A5E', '#25483f', '#0F7C7C', '#0B4F4F',
  '#D6E8F8', '#8DB8E8', '#3D6FB6', '#1E3A6E', '#E3DBF6', '#A08BD8', '#5B3FA8',
  '#F2E6D0', '#E8D5B0', '#C7A26A', '#8A6A3B', '#6E4B3A'
];
const THEME_PALETTES = [
  { id: 'berry', ar: 'توتي', en: 'Berry', bg: '#FFF6F9', a: '#8E1F4F', b: '#B83A6B', c: '#FFB627' },
  { id: 'gold', ar: 'ذهبي فخم', en: 'Gold', bg: '#FBF7EF', a: '#6E4B3A', b: '#8A6A3B', c: '#C7A26A' },
  { id: 'grad', ar: 'أخضر التخرج', en: 'Graduation', bg: '#F3F7F2', a: '#25483f', b: '#3E7A5E', c: '#C7A26A' },
  { id: 'sea', ar: 'بحري', en: 'Sea', bg: '#F1F6FB', a: '#1E3A6E', b: '#3D6FB6', c: '#8DB8E8' },
  { id: 'lavender', ar: 'لافندر', en: 'Lavender', bg: '#F7F3FC', a: '#5B3FA8', b: '#8F78C9', c: '#E3B8D9' },
  { id: 'apricot', ar: 'مشمشي', en: 'Apricot', bg: '#FFF4EA', a: '#C8442E', b: '#E86A3A', c: '#F29E4C' },
  { id: 'blush', ar: 'وردي ناعم', en: 'Blush', bg: '#FFF7F5', a: '#A98072', b: '#C99383', c: '#F2D0C4' },
  { id: 'night', ar: 'ليلي', en: 'Night', bg: '#1F1A2E', a: '#FFB627', b: '#F4E9D8', c: '#8E7CC3' },
  { id: 'mint', ar: 'نعناعي', en: 'Mint', bg: '#F0FAF6', a: '#0F7C7C', b: '#3E7A5E', c: '#FFB627' },
  { id: 'mono', ar: 'أبيض وأسود', en: 'Mono', bg: '#FFFFFF', a: '#000000', b: '#5E5550', c: '#A39A94' }
];
function recentColors() { try { return JSON.parse(storeGet('lahza-recent-colors') || '[]').filter(c => /^#[0-9a-f]{6}$/i.test(c)).slice(0, 8); } catch (e) { return []; } }
function rememberColor(c) { if (!/^#[0-9a-f]{6}$/i.test(c)) return; const list = [c.toUpperCase(), ...recentColors().filter(x => x.toUpperCase() !== c.toUpperCase())].slice(0, 8); storeSet('lahza-recent-colors', JSON.stringify(list)); }
function rgba(hex, a) { const h = /^#?([0-9a-f]{6})$/i.exec(hex || '') ? hex.replace('#', '') : '000000'; return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`; }
function gradientFor(ctx, w, h, c1, c2, angle, radial) {
  if (radial) { const g = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.hypot(w, h) / 2); g.addColorStop(0, c1); g.addColorStop(1, c2); return g; }
  const a = (angle || 0) * Math.PI / 180, dx = Math.cos(a) * w / 2, dy = Math.sin(a) * h / 2;
  const g = ctx.createLinearGradient(-dx, -dy, dx, dy); g.addColorStop(0, c1); g.addColorStop(1, c2); return g;
}

/* ---------- Shapes ---------- */
const SHAPES = [
  ['sparkle', 'لمعة', 'Sparkle'], ['star', 'نجمة', 'Star'], ['heart', 'قلب', 'Heart'], ['circle', 'دائرة', 'Circle'],
  ['rectangle', 'مستطيل', 'Rectangle'], ['roundrect', 'مستطيل دائري', 'Rounded'], ['triangle', 'مثلث', 'Triangle'], ['diamond', 'معيّن', 'Diamond'],
  ['hexagon', 'سداسي', 'Hexagon'], ['moon', 'هلال', 'Moon'], ['flower', 'وردة', 'Flower'], ['cloud', 'غيمة', 'Cloud'],
  ['burst', 'شمس', 'Burst'], ['ring', 'حلقة', 'Ring'], ['frame', 'إطار', 'Frame'], ['banner', 'شريط', 'Banner'],
  ['bubble', 'فقاعة كلام', 'Speech bubble'], ['arrow', 'سهم', 'Arrow'], ['crown', 'تاج', 'Crown'], ['line', 'خط', 'Line']
];
const MASKS = [['none', 'بدون', 'None'], ['roundrect', 'زوايا دائرية', 'Rounded'], ['circle', 'دائرة', 'Circle'], ['heart', 'قلب', 'Heart'], ['star', 'نجمة', 'Star'], ['hexagon', 'سداسي', 'Hexagon'], ['diamond', 'معيّن', 'Diamond'], ['flower', 'وردة', 'Flower']];
function poly(ctx, pts) { pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); }
function starPts(n, rx, ry, inner) { const pts = []; for (let i = 0; i < n * 2; i++) { const r = i % 2 ? inner : 1, a = i * Math.PI / n - Math.PI / 2; pts.push([Math.cos(a) * rx * r, Math.sin(a) * ry * r]); } return pts; }
/* Builds the path of a shape centred on 0,0 in a w x h box. Returns 'evenodd' when the shape has a hole. */
function shapePath(ctx, shape, w, h, radius = 1) {
  const rx = w / 2, ry = h / 2;
  ctx.beginPath();
  switch (shape) {
    case 'circle': ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); break;
    case 'roundrect': ctx.roundRect(-rx, -ry, w, h, Math.min(rx, ry) * clamp(radius, 0, 1)); break;
    case 'triangle': poly(ctx, [[0, -ry], [rx, ry], [-rx, ry]]); break;
    case 'diamond': poly(ctx, [[0, -ry], [rx, 0], [0, ry], [-rx, 0]]); break;
    case 'hexagon': poly(ctx, Array.from({ length: 6 }, (_, i) => [Math.cos(i * Math.PI / 3) * rx, Math.sin(i * Math.PI / 3) * ry])); break;
    case 'star': poly(ctx, starPts(5, rx, ry, .44)); break;
    case 'sparkle': poly(ctx, starPts(4, rx, ry, .22)); break;
    case 'burst': poly(ctx, starPts(12, rx, ry, .72)); break;
    case 'heart': ctx.moveTo(0, ry * .8); ctx.bezierCurveTo(-rx * 1.2, 0, -rx * 1.2, -ry * .7, 0, -ry * .2); ctx.bezierCurveTo(rx * 1.2, -ry * .7, rx * 1.2, 0, 0, ry * .8); ctx.closePath(); break;
    case 'moon': {
      const R = 1, d = .55, r2 = .85, x = (R * R - r2 * r2 + d * d) / (2 * d), y = Math.sqrt(Math.max(0, R * R - x * x));
      ctx.save(); ctx.scale(rx, ry);
      ctx.arc(0, 0, R, Math.atan2(y, x), Math.atan2(-y, x), false);
      ctx.arc(d, 0, r2, Math.atan2(-y, x - d), Math.atan2(y, x - d), true);
      ctx.closePath(); ctx.restore(); break;
    }
    case 'flower': for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; ctx.moveTo(Math.cos(a) * rx * .5 + rx * .32, Math.sin(a) * ry * .5); ctx.ellipse(Math.cos(a) * rx * .5, Math.sin(a) * ry * .5, rx * .32, ry * .32, 0, 0, Math.PI * 2); } ctx.moveTo(rx * .3, 0); ctx.ellipse(0, 0, rx * .3, ry * .3, 0, 0, Math.PI * 2); break;
    case 'cloud': [[-.45, .15, .38], [0, -.1, .5], [.45, .12, .4], [.15, .3, .35], [-.2, .32, .33]].forEach(([cx, cy, r]) => { ctx.moveTo(cx * rx + r * rx, cy * ry); ctx.ellipse(cx * rx, cy * ry, r * rx, r * ry * 1.25, 0, 0, Math.PI * 2); }); break;
    case 'ring': ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.moveTo(rx * .78, 0); ctx.ellipse(0, 0, rx * .78, ry * .78, 0, 0, Math.PI * 2); return 'evenodd';
    case 'frame': { const t = Math.min(rx, ry) * .18; ctx.rect(-rx, -ry, w, h); ctx.rect(-rx + t, -ry + t, w - 2 * t, h - 2 * t); return 'evenodd'; }
    case 'banner': poly(ctx, [[-rx, -ry * .6], [rx, -ry * .6], [rx * .82, 0], [rx, ry * .6], [-rx, ry * .6], [-rx * .82, 0]]); break;
    case 'bubble': ctx.roundRect(-rx, -ry, w, h * .78, Math.min(rx, ry) * .35); ctx.moveTo(-rx * .25, ry * .56); ctx.lineTo(-rx * .45, ry); ctx.lineTo(rx * .05, ry * .56); ctx.closePath(); break;
    case 'arrow': poly(ctx, [[-rx, -ry * .3], [rx * .25, -ry * .3], [rx * .25, -ry], [rx, 0], [rx * .25, ry], [rx * .25, ry * .3], [-rx, ry * .3]]); break;
    case 'crown': poly(ctx, [[-rx, ry], [-rx, -ry * .5], [-rx * .5, ry * .05], [0, -ry], [rx * .5, ry * .05], [rx, -ry * .5], [rx, ry]]); break;
    default: ctx.rect(-rx, -ry, w, h);
  }
  return 'nonzero';
}

/* ---------- Patterns ---------- */
const PATTERNS = [['none', 'بدون', 'None'], ['frame', 'إطار', 'Frame'], ['lines', 'خطوط جانبية', 'Side lines'], ['dots', 'نقاط', 'Dots'], ['confetti', 'زينة', 'Confetti'], ['stripes', 'خطوط مائلة', 'Stripes'], ['grid', 'شبكة', 'Grid'], ['checks', 'مربعات', 'Checks'], ['waves', 'أمواج', 'Waves'], ['hearts', 'قلوب', 'Hearts'], ['stars', 'نجوم', 'Stars']];
function look(project) { project.look = project.look || {}; const L = project.look; L.fill = L.fill || { type: 'solid', c2: '#FBE6EE', angle: 90 }; L.pattern = L.pattern || {}; return L; }
drawPattern = function (ctx, w, h, project) {
  const L = look(project), type = project.pattern || 'none';
  if (type === 'none') return;
  const color = L.pattern.color || project.accent || '#b9a78e', scale = L.pattern.scale || 1, unit = h * .14 / scale;
  ctx.save(); ctx.globalAlpha = L.pattern.opacity ?? .17; ctx.strokeStyle = ctx.fillStyle = color; ctx.lineWidth = Math.max(1, w / 850);
  if (type === 'frame') { ctx.strokeRect(w * .018, h * .075, w * .964, h * .85); ctx.strokeRect(w * .026, h * .10, w * .948, h * .80); }
  else if (type === 'lines') { for (const side of [0, 1]) for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo((side ? 1 : 0) * w + (side ? -1 : 1) * w * (.02 + i * .014), h * .04); ctx.lineTo((side ? 1 : 0) * w + (side ? -1 : 1) * w * (.1 + i * .014), h * .96); ctx.stroke(); } }
  else if (type === 'dots') { for (let y = unit / 2; y < h; y += unit) for (let x = unit / 2 + ((y / unit | 0) % 2) * unit / 2; x < w; x += unit) { ctx.beginPath(); ctx.arc(x, y, unit * .09, 0, Math.PI * 2); ctx.fill(); } }
  else if (type === 'confetti') { const n = Math.round(31 * scale * scale); for (let i = 0; i < n; i++) { const xx = ((i * 197 + 23) % 983) / 983 * w, yy = ((i * 89 + 17) % 191) / 191 * h; ctx.save(); ctx.translate(xx, yy); ctx.rotate(i * .64); ctx.fillRect(-unit * .05, -unit * .17, unit * .1, unit * .34); ctx.restore(); } }
  else if (type === 'stripes') { ctx.lineWidth = unit * .18; for (let x = -h; x < w + h; x += unit) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + h, h); ctx.stroke(); } }
  else if (type === 'grid') { for (let x = 0; x <= w; x += unit) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); } for (let y = 0; y <= h; y += unit) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); } }
  else if (type === 'checks') { for (let y = 0, r = 0; y < h; y += unit, r++) for (let x = (r % 2) * unit; x < w; x += unit * 2) ctx.fillRect(x, y, unit, unit); }
  else if (type === 'waves') { ctx.lineWidth = Math.max(1, unit * .07); for (let y = unit / 2; y < h + unit; y += unit * .7) { ctx.beginPath(); for (let x = 0; x <= w; x += unit / 8) ctx.lineTo(x, y + Math.sin(x / unit * Math.PI) * unit * .15); ctx.stroke(); } }
  else if (type === 'hearts' || type === 'stars') { for (let y = unit / 2, r = 0; y < h + unit; y += unit, r++) for (let x = unit / 2 + (r % 2) * unit / 2; x < w + unit; x += unit) { ctx.save(); ctx.translate(x, y); shapePath(ctx, type === 'hearts' ? 'heart' : 'star', unit * .36, unit * .36); ctx.fill(); ctx.restore(); } }
  ctx.restore();
};

/* ---------- Text ---------- */
const NON_JOINING = 'اأإآٱدذرزوؤةىء';
const ARABIC_LETTER = /[ؠ-ي]/;
/* Kashida: tatweel after each letter that joins the next one. Shaping stays correct because the browser shapes the result. */
function withKashida(text, n) {
  if (!n) return text;
  const ch = [...text]; let out = '';
  ch.forEach((c, i) => { out += c; const next = ch[i + 1]; if (next && ARABIC_LETTER.test(c) && ARABIC_LETTER.test(next) && !NON_JOINING.includes(c)) out += 'ـ'.repeat(n); });
  return out;
}
const hasLetterSpacing = 'letterSpacing' in CanvasRenderingContext2D.prototype;
function textLayout(ctx, el, H) {
  const fsize = (el.size || .2) * H;
  ctx.font = fontString(el, fsize);
  if (hasLetterSpacing) ctx.letterSpacing = `${(el.spacing || 0) * fsize}px`;
  const lines = withKashida(String(el.text || ''), el.kashida || 0).split(/\r?\n/).slice(0, 8);
  const widths = lines.map(l => ctx.measureText(l).width);
  const lh = fsize * (el.lineHeight || 1.25), maxW = Math.max(1, ...widths), blockH = lh * lines.length;
  const box = el.box && el.box.on ? (el.box.pad ?? .3) * fsize : 0;
  const stroke = el.stroke && el.stroke.on ? (el.stroke.width ?? .08) * fsize : 0;
  return { fsize, lines, widths, lh, maxW, blockH, w: maxW + 2 * box + stroke, h: blockH + 2 * box + stroke, box, stroke };
}
function arcSag(width, curve) { if (!curve) return 0; const R = width / (Math.abs(curve) / 100 * Math.PI); const a = width / 2 / R; return R * (1 - Math.cos(a)); }
/* Draws the straight text block centred on 0,0. */
function paintTextBlock(ctx, el, L, W) {
  const align = el.align || 'center';
  ctx.textAlign = align; ctx.textBaseline = 'middle';
  const ax = align === 'right' ? L.maxW / 2 : align === 'left' ? -L.maxW / 2 : 0;
  if (L.box) { ctx.save(); ctx.shadowColor = 'transparent'; ctx.fillStyle = rgba(el.box.color || '#FFFFFF', el.box.alpha ?? 1); ctx.beginPath(); ctx.roundRect(-L.maxW / 2 - L.box, -L.blockH / 2 - L.box, L.maxW + 2 * L.box, L.blockH + 2 * L.box, Math.min(L.maxW, L.blockH) / 2 * (el.box.radius ?? .5) + L.box * (el.box.radius ?? .5)); ctx.fill(); ctx.restore(); }
  const fill = el.fill && el.fill.type === 'gradient' ? gradientFor(ctx, L.maxW, L.blockH, el.color || '#8E1F4F', el.fill.color2 || '#FFB627', el.fill.angle ?? 0, false) : (el.color || '#8E1F4F');
  const y0 = -(L.lines.length - 1) * L.lh / 2, maxWidth = el.curve ? undefined : W * .95;
  L.lines.forEach((line, i) => {
    const y = y0 + i * L.lh;
    if (L.stroke) { ctx.save(); ctx.lineJoin = 'round'; ctx.lineWidth = L.stroke * 2; ctx.strokeStyle = el.stroke.color || '#FFFFFF'; maxWidth ? ctx.strokeText(line, ax, y, maxWidth) : ctx.strokeText(line, ax, y); ctx.restore(); if (el.shadow && el.shadow.on) { ctx.shadowColor = 'transparent'; } }
    ctx.fillStyle = fill; if (maxWidth) ctx.fillText(line, ax, y, maxWidth); else ctx.fillText(line, ax, y);
  });
}
function drawText(ctx, el, W, H) {
  loadFontFor(el);
  const L = textLayout(ctx, el, H);
  if (!el.curve) { paintTextBlock(ctx, el, L, W); return; }
  /* Curved: paint the block flat on its own canvas, then lay thin strips along an arc. Arabic stays joined. */
  const pad = Math.ceil(L.fsize * .6 + (el.shadow && el.shadow.on ? (el.shadow.blur || .1) * H : 0));
  const bw = Math.ceil(L.w + pad * 2), bh = Math.ceil(L.h + pad * 2);
  const off = document.createElement('canvas'); off.width = bw; off.height = bh;
  const o = off.getContext('2d'); o.translate(bw / 2, bh / 2);
  if (el.shadow && el.shadow.on) applyShadow(o, el, H);
  textLayout(o, el, H); paintTextBlock(o, el, L, W);
  ctx.shadowColor = 'transparent';
  const sign = el.curve > 0 ? 1 : -1, R = L.w / (Math.abs(el.curve) / 100 * Math.PI), step = 2;
  for (let x = 0; x < bw; x += step) {
    const a = (x + step / 2 - bw / 2) / R;
    ctx.save(); ctx.translate(R * Math.sin(a), sign * R * (1 - Math.cos(a))); ctx.rotate(sign * a);
    ctx.drawImage(off, x, 0, step, bh, -step / 2, -bh / 2, step + .6, bh); ctx.restore();
  }
}
function applyShadow(ctx, el, H) {
  const s = el.shadow; const a = (s.angle ?? 45) * Math.PI / 180, d = (s.dist ?? .03) * H;
  ctx.shadowColor = rgba(s.color || '#000000', s.alpha ?? .35); ctx.shadowBlur = (s.blur ?? .06) * H; ctx.shadowOffsetX = Math.cos(a) * d; ctx.shadowOffsetY = Math.sin(a) * d;
}

/* ---------- Photos: filters are done per pixel, so they print the same on every browser ---------- */
const filterCache = new Map();
const hasCanvasFilter = 'filter' in CanvasRenderingContext2D.prototype;
function filtered(img, src, f) {
  if (!f) return img;
  const b = f.brightness || 0, c = f.contrast || 0, s = f.saturate ?? 100, g = f.grayscale || 0, sp = f.sepia || 0, wm = f.warmth || 0;
  if (!b && !c && s === 100 && !g && !sp && !wm) return img;
  const key = `${b}|${c}|${s}|${g}|${sp}|${wm}`;
  let per = filterCache.get(src); if (!per) { per = new Map(); filterCache.set(src, per); if (filterCache.size > 24) filterCache.delete(filterCache.keys().next().value); }
  if (per.has(key)) return per.get(key);
  const cv = document.createElement('canvas'); cv.width = img.naturalWidth || img.width; cv.height = img.naturalHeight || img.height;
  const x = cv.getContext('2d'); x.drawImage(img, 0, 0); const id = x.getImageData(0, 0, cv.width, cv.height), d = id.data;
  const cf = (259 * (c * 2.55 + 255)) / (255 * (259 - c * 2.55)), sat = s / 100, gr = g / 100, se = sp / 100;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], gg = d[i + 1], bb = d[i + 2];
    r += b * 2.55; gg += b * 2.55; bb += b * 2.55;
    r = cf * (r - 128) + 128; gg = cf * (gg - 128) + 128; bb = cf * (bb - 128) + 128;
    const l = .299 * r + .587 * gg + .114 * bb;
    r = l + (r - l) * sat; gg = l + (gg - l) * sat; bb = l + (bb - l) * sat;
    if (gr) { const l2 = .299 * r + .587 * gg + .114 * bb; r += (l2 - r) * gr; gg += (l2 - gg) * gr; bb += (l2 - bb) * gr; }
    if (se) { const tr = .393 * r + .769 * gg + .189 * bb, tg = .349 * r + .686 * gg + .168 * bb, tb = .272 * r + .534 * gg + .131 * bb; r += (tr - r) * se; gg += (tg - gg) * se; bb += (tb - bb) * se; }
    r += wm * .6; bb -= wm * .6;
    d[i] = r < 0 ? 0 : r > 255 ? 255 : r; d[i + 1] = gg < 0 ? 0 : gg > 255 ? 255 : gg; d[i + 2] = bb < 0 ? 0 : bb > 255 ? 255 : bb;
  }
  x.putImageData(id, 0, 0); per.set(key, cv); return cv;
}
function drawImageEl(ctx, el, W, H) {
  const img = loadedImage(el.src); if (!img) return;
  const ww = (el.w || .25) * W, hh = (el.h || .6) * H, z = el.zoom || 1, mask = el.mask || 'none';
  ctx.save();
  if (mask !== 'none' || z > 1) { const rule = shapePath(ctx, mask === 'none' ? 'rectangle' : mask, ww, hh, el.radius ?? .35); ctx.clip(rule); }
  const dw = ww * z, dh = hh * z, ox = (el.panX || 0) * (dw - ww) / 2, oy = (el.panY || 0) * (dh - hh) / 2;
  if (hasCanvasFilter && el.filters && el.filters.blur) ctx.filter = `blur(${el.filters.blur / 100 * Math.min(ww, hh) * .05}px)`;
  ctx.drawImage(filtered(img, el.src, el.filters), -dw / 2 + ox, -dh / 2 + oy, dw, dh);
  ctx.restore();
  if (el.border && el.border.on) { ctx.save(); ctx.shadowColor = 'transparent'; const rule = shapePath(ctx, mask === 'none' ? 'rectangle' : mask, ww, hh, el.radius ?? .35); ctx.lineWidth = (el.border.width ?? .04) * Math.min(ww, hh); ctx.strokeStyle = el.border.color || '#FFFFFF'; ctx.stroke(); ctx.restore(); }
}
function drawShapeEl(ctx, el, W, H) {
  const ww = (el.w || .1) * W, hh = (el.h || .3) * H;
  const rule = shapePath(ctx, el.shape, ww, hh, el.radius ?? .35);
  ctx.fillStyle = el.fill && el.fill.type === 'gradient' ? gradientFor(ctx, ww, hh, el.color || '#8E1F4F', el.fill.color2 || '#FFB627', el.fill.angle ?? 90, el.fill.radial) : (el.color || '#8E1F4F');
  if (!(el.fill && el.fill.type === 'none')) ctx.fill(rule);
  if (el.stroke && el.stroke.on) { ctx.shadowColor = 'transparent'; ctx.lineJoin = 'round'; ctx.lineWidth = (el.stroke.width ?? .06) * Math.min(ww, hh); ctx.strokeStyle = el.stroke.color || '#2A1620'; ctx.stroke(); }
}

/* ---------- The design renderer used by the editor, the 3D preview and print ---------- */
drawScene = function (ctx, w, h, project) {
  ctx.save(); ctx.clearRect(0, 0, w, h);
  const L = look(project);
  if (L.fill.type === 'linear' || L.fill.type === 'radial') { ctx.save(); ctx.translate(w / 2, h / 2); ctx.fillStyle = gradientFor(ctx, w, h, project.bg || '#ffffff', L.fill.c2 || '#FBE6EE', L.fill.angle ?? 90, L.fill.type === 'radial'); ctx.fillRect(-w / 2, -h / 2, w, h); ctx.restore(); }
  else { ctx.fillStyle = project.bg || '#ffffff'; ctx.fillRect(0, 0, w, h); }
  drawPattern(ctx, w, h, project);
  if (project.productId === 'circle') { ctx.save(); ctx.beginPath(); ctx.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2); ctx.clip(); }
  for (const el of project.elements) {
    if (el.hidden) continue;
    ctx.save(); ctx.globalAlpha = el.opacity ?? 1; ctx.translate(el.x * w, el.y * h); ctx.rotate((el.rot || 0) * Math.PI / 180); ctx.scale(el.flipX ? -1 : 1, el.flipY ? -1 : 1);
    if (el.shadow && el.shadow.on && !(el.type === 'text' && el.curve)) applyShadow(ctx, el, h);
    try { if (el.type === 'image') drawImageEl(ctx, el, w, h); else if (el.type === 'text') drawText(ctx, el, w, h); else if (el.type === 'shape') drawShapeEl(ctx, el, w, h); }
    catch (err) { console.error('draw element', err); }
    ctx.restore();
  }
  if (project.productId === 'circle') ctx.restore();
  ctx.restore();
};
const measureCtx = document.createElement('canvas').getContext('2d');
getElementRect = function (el) {
  if (!el) return null;
  if (el.type === 'text') { const W = designCanvas.width, H = designCanvas.height, L = textLayout(measureCtx, el, H), sag = arcSag(L.w, el.curve || 0); return { w: clamp(L.w / W + .02, .04, 1.2), h: (L.h + sag * 2) / H }; }
  return { w: el.w || .18, h: el.h || .36 };
};
measureTextMm = function (el, heightMm) { const px = 400, L = textLayout(measureCtx, el, px); return { w: L.w / px * heightMm, h: (L.h + arcSag(L.w, el.curve || 0) * 2) / px * heightMm }; };
const baseWaitForArtwork = waitForArtworkImages;
waitForArtworkImages = async function () { await baseWaitForArtwork(); if (state.project) await Promise.all(state.project.elements.filter(e => e.type === 'text' && !e.hidden).map(loadFontFor)); };

/* Undo covers the background style too. */
function snapshot() { const p = state.project; return JSON.stringify({ elements: p.elements, bg: p.bg, pattern: p.pattern, accent: p.accent, customSize: p.customSize, look: p.look || null }); }
commitUndo = function () { if (!state.project) return; state.history.push(snapshot()); if (state.history.length > 50) state.history.shift(); state.redo = []; };
restoreSnapshot = function (json) { const o = JSON.parse(json), p = state.project; p.elements = o.elements; p.bg = o.bg; p.pattern = o.pattern; p.accent = o.accent; p.customSize = o.customSize; p.look = o.look || undefined; if (!p.elements.some(e => e.id === state.selectedId)) state.selectedId = null; renderWorkspace(); refreshPreview(); renderProperties(); saveSoon(); };
undo = function () { if (!state.history.length) return; state.redo.push(snapshot()); restoreSnapshot(state.history.pop()); };
redo = function () { if (!state.redo.length) return; state.history.push(snapshot()); restoreSnapshot(state.redo.pop()); };

/* ---------- Edit panel ---------- */
const baseRenderProperties = renderProperties;
const cx = { tab: null, fontCat: 'all', replaceFrom: null, armed: false };
const T = (ar, en) => trans(ar, en);
const fmt = { pct: v => `${Math.round(v * 100)}%`, deg: v => `${Math.round(v)}°`, x: v => `${(Math.round(v * 100) / 100)}×`, raw: v => `${Math.round(v * 100) / 100}`, int: v => `${Math.round(v)}` };

function getPath(path) {
  const project = path.startsWith('@'); let o = project ? state.project : getSelected(); if (!o) return undefined;
  for (const k of (project ? path.slice(1) : path).split('.')) { if (o == null) return undefined; o = o[k]; }
  return o;
}
function setPath(path, value) {
  const project = path.startsWith('@'); let o = project ? state.project : getSelected(); if (!o) return;
  const keys = (project ? path.slice(1) : path).split('.'), last = keys.pop();
  if (project && keys[0] === 'look') look(state.project);
  for (const k of keys) { if (o[k] == null || typeof o[k] !== 'object') o[k] = {}; o = o[k]; }
  o[last] = value;
}
const val = (path, d) => { const v = getPath(path); return v == null ? d : v; };

function range(label, path, value, min, max, step, f = 'raw') {
  return `<div class="cx-field"><div class="prop-label"><span>${label}</span><span class="prop-value" data-cx-out="${path}" data-fmt="${f}">${fmt[f](value)}</span></div><input class="prop-slider" type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-cx="${path}" data-type="num" aria-label="${htmlEscape(label)}"></div>`;
}
function seg(path, options, current, cls = '') {
  return `<div class="cx-seg ${cls}" role="group">${options.map(([v, ar, en]) => `<button type="button" class="${String(current) === String(v) ? 'on' : ''}" data-cx-set="${path}" data-value='${JSON.stringify(v)}'>${T(ar, en)}</button>`).join('')}</div>`;
}
function toggle(label, path, on) {
  return `<label class="cx-toggle"><input type="checkbox" data-cx="${path}" data-type="bool" ${on ? 'checked' : ''}><span class="cx-switch" aria-hidden="true"></span><span>${label}</span></label>`;
}
function colorField(label, path, value) {
  value = /^#[0-9a-f]{6}$/i.test(value || '') ? value : '#8E1F4F';
  const recents = recentColors();
  const sw = c => `<button type="button" class="cx-swatch ${c.toUpperCase() === value.toUpperCase() ? 'on' : ''}" style="background:${c}" title="${c}" aria-label="${c}" data-cx-set="${path}" data-value='"${c}"'></button>`;
  return `<div class="cx-field"><div class="prop-label"><span>${label}</span></div><div class="cx-swatches">${BIG_PALETTE.map(sw).join('')}</div>${recents.length ? `<div class="cx-sub">${T('ألوان مستخدمة مؤخرًا', 'Recent')}</div><div class="cx-swatches">${recents.map(sw).join('')}</div>` : ''}<div class="cx-color-row"><input type="color" value="${value}" data-cx="${path}" data-type="color" aria-label="${T('لون مخصص', 'Custom color')}"><input type="text" class="cx-hex" value="${value.toUpperCase()}" maxlength="7" data-cx-hex="${path}" aria-label="HEX" dir="ltr">${window.EyeDropper ? `<button type="button" class="cx-mini" data-cx-eyedrop="${path}" title="${T('التقاط لون من الشاشة', 'Pick from screen')}">⌖ ${T('قطّارة', 'Eyedropper')}</button>` : ''}</div></div>`;
}
function section(title, body) { return `<div class="prop-group cx-group"><div class="cx-title">${title}</div>${body}</div>`; }

const TEXT_STYLES = [
  { id: 'elegant', ar: 'فخم', en: 'Elegant', set: { font: 'amiri', weight: 700, color: '#6E4B3A', stroke: { on: false }, shadow: { on: false }, box: { on: false }, fill: { type: 'solid' } } },
  { id: 'bold', ar: 'عريض بحدود', en: 'Bold outline', set: { font: 'lalezar', weight: 400, color: '#8E1F4F', stroke: { on: true, color: '#FFFFFF', width: .1 }, shadow: { on: true, color: '#2A1620', alpha: .3, blur: .04, dist: .03, angle: 60 }, box: { on: false }, fill: { type: 'solid' } } },
  { id: 'gold', ar: 'ذهبي متدرج', en: 'Gold gradient', set: { font: 'messiri', weight: 700, color: '#8A6A3B', fill: { type: 'gradient', color2: '#FFD979', angle: 90 }, stroke: { on: false }, shadow: { on: false }, box: { on: false } } },
  { id: 'hand', ar: 'خط يد', en: 'Handwritten', set: { font: 'ruqaa', weight: 700, color: '#2A1620', stroke: { on: false }, shadow: { on: false }, box: { on: false }, fill: { type: 'solid' } } },
  { id: 'label', ar: 'ملصق', en: 'Label', set: { font: 'cairo', weight: 700, color: '#FFFFFF', box: { on: true, color: '#8E1F4F', alpha: 1, pad: .35, radius: 1 }, stroke: { on: false }, shadow: { on: false }, fill: { type: 'solid' } } },
  { id: 'kufi', ar: 'كوفي', en: 'Kufi', set: { font: 'reemkufi', weight: 700, color: '#0F7C7C', stroke: { on: false }, shadow: { on: false }, box: { on: false }, fill: { type: 'solid' } } },
  { id: 'soft', ar: 'ناعم بظل', en: 'Soft shadow', set: { font: 'marhey', weight: 700, color: '#B83A6B', shadow: { on: true, color: '#8E1F4F', alpha: .25, blur: .08, dist: .02, angle: 90 }, stroke: { on: false }, box: { on: false }, fill: { type: 'solid' } } },
  { id: 'script', ar: 'إنجليزي مزخرف', en: 'Script', set: { font: 'greatvibes', weight: 400, color: '#6E4B3A', stroke: { on: false }, shadow: { on: false }, box: { on: false }, fill: { type: 'solid' } } }
];

function tabsFor(el) {
  if (el.type === 'text') return [['text', 'النص', 'Text'], ['font', 'الخط', 'Font'], ['color', 'اللون', 'Color'], ['effects', 'تأثيرات', 'Effects'], ['arrange', 'ترتيب', 'Arrange']];
  if (el.type === 'image') return [['image', 'الصورة', 'Photo'], ['filters', 'فلاتر', 'Filters'], ['effects', 'تأثيرات', 'Effects'], ['arrange', 'ترتيب', 'Arrange']];
  return [['shape', 'الشكل', 'Shape'], ['color', 'اللون', 'Color'], ['effects', 'تأثيرات', 'Effects'], ['arrange', 'ترتيب', 'Arrange']];
}
function elementPanel(el) {
  const tabs = tabsFor(el); if (!tabs.some(t => t[0] === cx.tab)) cx.tab = tabs[0][0];
  let h = `<div class="cx-tabs" role="tablist">${tabs.map(([id, ar, en]) => `<button type="button" role="tab" aria-selected="${cx.tab === id}" class="${cx.tab === id ? 'on' : ''}" data-cx-tab="${id}">${T(ar, en)}</button>`).join('')}</div>`;
  const tab = cx.tab;
  if (tab === 'text') {
    h += section(T('نص العبارة', 'Text'), `<textarea class="prop-input prop-textarea" data-text-edit="text" dir="auto">${htmlEscape(el.text)}</textarea>`);
    h += section(T('أنماط جاهزة', 'Quick styles'), `<div class="cx-styles">${TEXT_STYLES.map(s => { const f = FONTS.find(x => x.id === s.set.font); return `<button type="button" class="cx-style" data-cx-style="${s.id}" style="font-family:'${f.family}';color:${s.set.fill && s.set.fill.type === 'gradient' ? s.set.color : s.set.color};${s.set.box && s.set.box.on ? `background:${s.set.box.color};` : ''}${s.set.stroke && s.set.stroke.on ? `-webkit-text-stroke:1px ${s.set.stroke.color};paint-order:stroke fill;` : ''}"><span>${f.script === 'en' ? 'Lahza' : 'لحظة'}</span><small>${T(s.ar, s.en)}</small></button>`; }).join('')}</div>`);
    h += section(T('المحاذاة', 'Alignment'), seg('align', [['right', 'يمين', 'Right'], ['center', 'وسط', 'Center'], ['left', 'يسار', 'Left']], el.align || 'center'));
    h += section(T('الحجم والمسافات', 'Size & spacing'),
      propertySlider(T('حجم الخط', 'Font size'), 'size', Math.round((el.size || .2) * 100), 4, 90, 1, '%') +
      range(T('تباعد الأسطر', 'Line spacing'), 'lineHeight', el.lineHeight || 1.25, .8, 2.4, .05, 'x') +
      range(T('تباعد الأحرف', 'Letter spacing'), 'spacing', el.spacing || 0, -.1, .6, .01, 'raw') +
      range(T('تمديد الكشيدة (للعربي)', 'Kashida stretch (Arabic)'), 'kashida', el.kashida || 0, 0, 4, 1, 'int') +
      range(T('انحناء النص', 'Curve'), 'curve', el.curve || 0, -100, 100, 1, 'int'));
  } else if (tab === 'font') {
    const { f, weight } = fontOf(el);
    const list = FONTS.filter(x => cx.fontCat === 'all' || x.script === cx.fontCat || x.cat === cx.fontCat);
    h += section(T('نوع الخط', 'Typeface'), `<div class="cx-chips">${FONT_CATS.map(([id, ar, en]) => `<button type="button" class="${cx.fontCat === id ? 'on' : ''}" data-cx-fontcat="${id}">${T(ar, en)}</button>`).join('')}</div><div class="cx-fonts">${list.map(x => `<button type="button" class="cx-font ${x.id === f.id ? 'on' : ''}" data-cx-set="font" data-value='"${x.id}"' style="font-family:'${x.family}',${SYSTEM_FALLBACK}"><span>${x.script === 'en' ? 'Lahza' : 'لحظة'}</span><small>${T(x.ar, x.en)}</small></button>`).join('')}</div><p class="small-explain">${T(`${FONTS.length} خط مجاني الترخيص. الخطوط الإنجليزية ما فيها حروف عربية.`, `${FONTS.length} open-licence fonts. English fonts have no Arabic letters.`)}</p>`);
    h += section(T('سماكة الخط', 'Weight'), f.bold ? seg('weight', [[400, 'عادي', 'Regular'], [700, 'عريض', 'Bold']], weight) : `<p class="small-explain">${T('هذا الخط له سماكة وحدة.', 'This font has one weight.')}</p>`);
    if (f.italic) h += section(T('مائل', 'Italic'), toggle(T('خط مائل', 'Italic'), 'italic', !!el.italic));
  } else if (tab === 'color') {
    const fillType = (el.fill && el.fill.type) || 'solid';
    h += section(T('نوع التعبئة', 'Fill'), seg('fill.type', el.type === 'shape' ? [['solid', 'لون واحد', 'Solid'], ['gradient', 'تدرج', 'Gradient'], ['none', 'بدون تعبئة', 'None']] : [['solid', 'لون واحد', 'Solid'], ['gradient', 'تدرج', 'Gradient']], fillType));
    if (fillType !== 'none') h += colorField(fillType === 'gradient' ? T('اللون الأول', 'First color') : T('اللون', 'Color'), 'color', el.color);
    if (fillType === 'gradient') {
      h += colorField(T('اللون الثاني', 'Second color'), 'fill.color2', (el.fill && el.fill.color2) || '#FFB627');
      h += range(T('اتجاه التدرج', 'Gradient angle'), 'fill.angle', (el.fill && el.fill.angle) ?? (el.type === 'text' ? 0 : 90), 0, 360, 5, 'deg');
      if (el.type === 'shape') h += toggle(T('تدرج دائري', 'Radial gradient'), 'fill.radial', !!(el.fill && el.fill.radial));
    }
    h += propertySlider(T('الشفافية', 'Opacity'), 'opacity', Math.round((el.opacity ?? 1) * 100), 5, 100, 1, '%');
  } else if (tab === 'shape') {
    h += section(T('تغيير الشكل', 'Change shape'), `<div class="cx-shapes">${SHAPES.map(([id, ar, en]) => `<button type="button" class="${el.shape === id ? 'on' : ''}" data-cx-set="shape" data-value='"${id}"' title="${T(ar, en)}"><canvas width="44" height="44" data-shape-thumb="${id}"></canvas><small>${T(ar, en)}</small></button>`).join('')}</div>`);
    h += section(T('الحجم', 'Size'), propertySlider(T('حجم الرمز', 'Size'), 'scale', Math.round((el.w || .1) * 100), 3, 100, 1, '%') + range(T('العرض', 'Width'), 'w', el.w || .1, .02, 1, .01, 'pct') + range(T('الارتفاع', 'Height'), 'h', el.h || .3, .02, 1.6, .01, 'pct') + (['roundrect', 'bubble'].includes(el.shape) ? range(T('استدارة الزوايا', 'Corner radius'), 'radius', el.radius ?? .35, 0, 1, .05, 'pct') : ''));
  } else if (tab === 'image') {
    h += section(T('شكل القص', 'Crop shape'), seg('mask', MASKS, el.mask || 'none', 'cx-seg-wrap'));
    if (el.mask === 'roundrect') h += range(T('استدارة الزوايا', 'Corner radius'), 'radius', el.radius ?? .35, 0, 1, .05, 'pct');
    h += section(T('القص والتكبير', 'Crop & zoom'), range(T('تكبير داخل الإطار', 'Zoom inside frame'), 'zoom', el.zoom || 1, 1, 3, .05, 'x') + range(T('تحريك أفقي', 'Pan horizontal'), 'panX', el.panX || 0, -1, 1, .02, 'raw') + range(T('تحريك رأسي', 'Pan vertical'), 'panY', el.panY || 0, -1, 1, .02, 'raw'));
    h += section(T('الحجم', 'Size'), propertySlider(T('الحجم', 'Size'), 'scale', Math.round((el.w || .2) * 100), 5, 100, 1, '%') + `<div class="prop-row"><button class="prop-action" data-action="fit-background">▣ ${T('تملأ المنتج كامل', 'Fill the whole product')}</button><button class="prop-action" data-cx-replace-image>⇄ ${T('استبدال الصورة', 'Replace photo')}</button></div>`);
  } else if (tab === 'filters') {
    const f = el.filters || {};
    h += section(T('فلاتر جاهزة', 'Presets'), `<div class="cx-chips">${[['none', 'الأصل', 'Original', {}], ['bw', 'أبيض وأسود', 'B&W', { grayscale: 100 }], ['vintage', 'قديم', 'Vintage', { sepia: 60, contrast: -10, warmth: 10 }], ['warm', 'دافئ', 'Warm', { warmth: 25, saturate: 115 }], ['cool', 'بارد', 'Cool', { warmth: -25 }], ['bright', 'مشرق', 'Bright', { brightness: 12, contrast: 8, saturate: 110 }], ['soft', 'ناعم', 'Soft', { contrast: -18, brightness: 8, saturate: 90 }], ['vivid', 'زاهي', 'Vivid', { saturate: 150, contrast: 12 }]].map(([id, ar, en, v]) => `<button type="button" data-cx-set="filters" data-value='${JSON.stringify(v)}'>${T(ar, en)}</button>`).join('')}</div>`);
    h += section(T('تعديل يدوي', 'Adjust'), range(T('الإضاءة', 'Brightness'), 'filters.brightness', f.brightness || 0, -60, 60, 1, 'int') + range(T('التباين', 'Contrast'), 'filters.contrast', f.contrast || 0, -60, 60, 1, 'int') + range(T('تشبّع الألوان', 'Saturation'), 'filters.saturate', f.saturate ?? 100, 0, 200, 1, 'int') + range(T('الدفء', 'Warmth'), 'filters.warmth', f.warmth || 0, -50, 50, 1, 'int') + range(T('رمادي', 'Grayscale'), 'filters.grayscale', f.grayscale || 0, 0, 100, 1, 'int') + range(T('بني قديم', 'Sepia'), 'filters.sepia', f.sepia || 0, 0, 100, 1, 'int') + (hasCanvasFilter ? range(T('تنعيم', 'Blur'), 'filters.blur', f.blur || 0, 0, 100, 1, 'int') : ''));
  } else if (tab === 'effects') {
    const s = el.shadow || {}, st = el.stroke || {};
    if (el.type === 'image') {
      const b = el.border || {};
      h += section(T('إطار الصورة', 'Photo border'), toggle(T('إظهار إطار', 'Show border'), 'border.on', !!b.on) + (b.on ? colorField(T('لون الإطار', 'Border color'), 'border.color', b.color || '#FFFFFF') + range(T('سماكة الإطار', 'Border width'), 'border.width', b.width ?? .04, .005, .2, .005, 'pct') : ''));
    } else {
      h += section(el.type === 'text' ? T('حدود الحروف', 'Letter outline') : T('حدود الشكل', 'Outline'), toggle(T('إظهار الحدود', 'Show outline'), 'stroke.on', !!st.on) + (st.on ? colorField(T('لون الحدود', 'Outline color'), 'stroke.color', st.color || (el.type === 'text' ? '#FFFFFF' : '#2A1620')) + range(T('سماكة الحدود', 'Outline width'), 'stroke.width', st.width ?? (el.type === 'text' ? .08 : .06), .01, .3, .01, 'pct') : ''));
    }
    if (el.type === 'text') {
      const b = el.box || {};
      h += section(T('خلفية خلف النص', 'Highlight behind text'), toggle(T('إظهار خلفية', 'Show highlight'), 'box.on', !!b.on) + (b.on ? colorField(T('لون الخلفية', 'Highlight color'), 'box.color', b.color || '#FFFFFF') + range(T('شفافية الخلفية', 'Highlight opacity'), 'box.alpha', b.alpha ?? 1, .05, 1, .05, 'pct') + range(T('المسافة حول النص', 'Padding'), 'box.pad', b.pad ?? .3, 0, 1, .02, 'pct') + range(T('استدارة الزوايا', 'Corner radius'), 'box.radius', b.radius ?? .5, 0, 1, .05, 'pct') : ''));
    }
    h += section(T('الظل', 'Shadow'), toggle(T('إظهار ظل', 'Show shadow'), 'shadow.on', !!s.on) + (s.on ? colorField(T('لون الظل', 'Shadow color'), 'shadow.color', s.color || '#000000') + range(T('قوة الظل', 'Strength'), 'shadow.alpha', s.alpha ?? .35, .05, 1, .05, 'pct') + range(T('النعومة', 'Softness'), 'shadow.blur', s.blur ?? .06, 0, .4, .01, 'pct') + range(T('المسافة', 'Distance'), 'shadow.dist', s.dist ?? .03, 0, .3, .005, 'pct') + range(T('الاتجاه', 'Direction'), 'shadow.angle', s.angle ?? 45, 0, 360, 5, 'deg') : ''));
    h += section(T('القلب والدوران', 'Flip & rotate'), `<div class="prop-row"><button class="prop-action ${el.flipX ? 'is-on' : ''}" data-cx-flip="flipX">⇋ ${T('قلب أفقي', 'Flip horizontal')}</button><button class="prop-action ${el.flipY ? 'is-on' : ''}" data-cx-flip="flipY">⇵ ${T('قلب رأسي', 'Flip vertical')}</button></div>` + propertySlider(T('الدوران', 'Rotation'), 'rot', el.rot || 0, -180, 180, 1, '°'));
    if (el.type === 'image') h += propertySlider(T('الشفافية', 'Opacity'), 'opacity', Math.round((el.opacity ?? 1) * 100), 5, 100, 1, '%');
  } else if (tab === 'arrange') {
    h += section(T('المكان', 'Position'), range(T('أفقي', 'Horizontal'), 'x', el.x, 0, 1, .005, 'pct') + range(T('رأسي', 'Vertical'), 'y', el.y, 0, 1, .005, 'pct') + `<div class="cx-align-grid">${[['left', '⇤', 'يسار', 'Left'], ['center-x', '↔', 'وسط أفقي', 'Center'], ['right', '⇥', 'يمين', 'Right'], ['top', '⤒', 'أعلى', 'Top'], ['center-y', '↕', 'وسط رأسي', 'Middle'], ['bottom', '⤓', 'أسفل', 'Bottom']].map(([id, i, ar, en]) => `<button type="button" class="prop-action" data-cx-align="${id}">${i} ${T(ar, en)}</button>`).join('')}</div>`);
    h += section(T('التحكم', 'Control'), `<div class="prop-row"><button class="prop-action" data-action="reset-rotation">${T('استقامة', 'Straighten')}</button><button class="prop-action" data-action="toggle-lock">${el.locked ? T('فتح القفل', 'Unlock') : T('قفل العنصر', 'Lock')}</button><button class="prop-action" data-action="toggle-hidden">${el.hidden ? T('إظهار', 'Show') : T('إخفاء', 'Hide')}</button></div>`);
    h += section(T('الطبقات والنسخ', 'Layers & copies'), `<div class="prop-row"><button class="prop-action" data-action="duplicate">${T('نسخ', 'Duplicate')}</button><button class="prop-action" data-action="forward">${T('للأمام', 'Forward')}</button><button class="prop-action" data-action="backward">${T('للخلف', 'Backward')}</button></div><div class="prop-row" style="margin-top:7px"><button class="prop-action" data-cx-layer="top">${T('للأمام تمامًا', 'To front')}</button><button class="prop-action" data-cx-layer="bottom">${T('للخلف تمامًا', 'To back')}</button><button class="prop-action danger" data-action="delete">${T('حذف', 'Delete')}</button></div>`);
  }
  return h;
}
function usedColors() {
  const p = state.project, set = new Set();
  const add = c => { if (/^#[0-9a-f]{6}$/i.test(c || '')) set.add(c.toUpperCase()); };
  add(p.bg); add(look(p).fill.c2); add(look(p).pattern.color || p.accent);
  p.elements.forEach(e => { add(e.color); e.fill && add(e.fill.color2); e.stroke && e.stroke.on && add(e.stroke.color); e.shadow && e.shadow.on && add(e.shadow.color); e.box && e.box.on && add(e.box.color); e.border && e.border.on && add(e.border.color); });
  return [...set];
}
function backgroundPanel() {
  const p = state.project, L = look(p), type = L.fill.type || 'solid';
  let h = section(T('ألوان جاهزة للتصميم كله', 'Color themes for the whole design'), `<div class="cx-themes">${THEME_PALETTES.map(t => `<button type="button" class="cx-theme" data-cx-theme="${t.id}"><span class="cx-theme-dots"><i style="background:${t.bg}"></i><i style="background:${t.a}"></i><i style="background:${t.b}"></i><i style="background:${t.c}"></i></span><small>${T(t.ar, t.en)}</small></button>`).join('')}</div>`);
  const used = usedColors();
  h += section(T('تبديل لون في كل التصميم', 'Swap a color everywhere'), `<div class="cx-swatches">${used.map(c => `<button type="button" class="cx-swatch ${cx.replaceFrom === c ? 'on' : ''}" style="background:${c}" title="${c}" aria-label="${c}" data-cx-replace-from="${c}"></button>`).join('')}</div>${cx.replaceFrom ? `<p class="small-explain">${T('اللون الجديد:', 'Pick the new color:')}</p><div class="cx-swatches">${BIG_PALETTE.map(c => `<button type="button" class="cx-swatch" style="background:${c}" aria-label="${c}" data-cx-replace-to="${c}"></button>`).join('')}</div><div class="cx-color-row"><input type="color" value="${cx.replaceFrom}" data-cx-replace-input aria-label="${T('لون مخصص', 'Custom color')}"></div>` : `<p class="small-explain">${T('الضغط على أي لون من ألوان التصميم يبدّله في كل مكان.', 'Tap a color from your design to change it everywhere.')}</p>`}`);
  h += section(T('نوع الخلفية', 'Background type'), seg('@look.fill.type', [['solid', 'لون واحد', 'Solid'], ['linear', 'تدرج', 'Gradient'], ['radial', 'تدرج دائري', 'Radial']], type) + `<button type="button" class="prop-action cx-wide" data-cx-bg-photo>▧ ${T('صورة كخلفية', 'Photo as background')}</button>`);
  h += colorField(type === 'solid' ? T('لون الخلفية', 'Background color') : T('اللون الأول', 'First color'), '@bg', p.bg);
  if (type !== 'solid') { h += colorField(T('اللون الثاني', 'Second color'), '@look.fill.c2', L.fill.c2 || '#FBE6EE'); if (type === 'linear') h += range(T('اتجاه التدرج', 'Gradient angle'), '@look.fill.angle', L.fill.angle ?? 90, 0, 360, 5, 'deg'); }
  h += section(T('زخرفة الخلفية', 'Pattern'), `<div class="cx-chips">${PATTERNS.map(([id, ar, en]) => `<button type="button" class="${(p.pattern || 'none') === id ? 'on' : ''}" data-cx-set="@pattern" data-value='"${id}"'>${T(ar, en)}</button>`).join('')}</div>`);
  if ((p.pattern || 'none') !== 'none') h += colorField(T('لون الزخرفة', 'Pattern color'), '@look.pattern.color', L.pattern.color || p.accent || '#C7A26A') + range(T('وضوح الزخرفة', 'Pattern strength'), '@look.pattern.opacity', L.pattern.opacity ?? .17, .03, 1, .01, 'pct') + range(T('كثافة الزخرفة', 'Pattern density'), '@look.pattern.scale', L.pattern.scale || 1, .4, 3, .05, 'x');
  return h;
}
function stickerPanel() {
  return section(T('أشكال ورموز', 'Shapes'), `<div class="cx-shapes">${SHAPES.map(([id, ar, en]) => `<button type="button" data-add-shape="${id}" title="${T(ar, en)}"><canvas width="44" height="44" data-shape-thumb="${id}"></canvas><small>${T(ar, en)}</small></button>`).join('')}</div>`) +
    section(T('نص جديد', 'New text'), `<div class="prop-row"><button class="prop-action" data-cx-add-text="title">${T('عنوان', 'Heading')}</button><button class="prop-action" data-cx-add-text="sub">${T('عنوان فرعي', 'Subheading')}</button><button class="prop-action" data-cx-add-text="body">${T('نص صغير', 'Small text')}</button></div>`);
}
renderProperties = function () {
  const box = $('#propertiesContent'); if (!box || !state.project) return baseRenderProperties();
  const el = getSelected();
  if (state.panel === 'background') box.innerHTML = backgroundPanel();
  else if (state.panel === 'sticker') box.innerHTML = stickerPanel();
  else if (state.panel === 'layers' || !el) return baseRenderProperties();
  else box.innerHTML = elementPanel(el);
  paintShapeThumbs(box);
};
function paintShapeThumbs(root) {
  root.querySelectorAll('[data-shape-thumb]').forEach(c => { const g = c.getContext('2d'); g.clearRect(0, 0, 44, 44); g.save(); g.translate(22, 22); const shape = c.dataset.shapeThumb; const rule = shapePath(g, shape, shape === 'line' ? 36 : 32, shape === 'line' ? 5 : shape === 'banner' ? 20 : 32, .35); g.fillStyle = '#8E1F4F'; g.fill(rule); g.restore(); });
}

/* Adding elements uses the brand color and the selected tab resets. */
addShape = function (shape = 'sparkle') {
  const p = currentProfile(), ratio = p.widthMm / p.heightMm, size = .32;
  const h = shape === 'line' ? .03 : shape === 'banner' ? size * .55 : size, w = shape === 'line' ? .5 : clamp(size / ratio * (shape === 'banner' ? 2.4 : 1), .04, .9);
  addElement({ type: 'shape', shape, x: .5, y: .5, w, h, rot: 0, color: state.project.accent || '#8E1F4F', opacity: 1 });
  cx.tab = 'shape'; openProps('element');
};
function addTextKind(kind) {
  const sizes = { title: .26, sub: .15, body: .09 }, texts = { title: T('عنوانك هنا', 'Your heading'), sub: T('عنوان فرعي', 'Subheading'), body: T('التفاصيل هنا', 'Add the details here') };
  addElement({ type: 'text', text: texts[kind], x: .5, y: kind === 'title' ? .4 : kind === 'sub' ? .62 : .8, size: sizes[kind], rot: 0, color: state.project.accent || '#8E1F4F', opacity: 1, font: kind === 'body' ? 'tajawal' : 'plex', weight: kind === 'body' ? 400 : 700, align: 'center' });
  cx.tab = 'text'; openProps('element');
}

function applyTheme(id) {
  const t = THEME_PALETTES.find(x => x.id === id); if (!t) return;
  commitUndo(); const p = state.project, L = look(p);
  p.bg = t.bg; L.fill = { ...L.fill, type: 'solid' }; p.accent = t.c; L.pattern.color = t.c;
  let firstText = true;
  p.elements.forEach(e => {
    if (e.type === 'text') { e.color = firstText ? t.a : t.b; firstText = false; if (e.fill && e.fill.type === 'gradient') e.fill.color2 = t.c; if (e.box && e.box.on) { e.box.color = t.a; e.color = t.bg; } }
    else if (e.type === 'shape') { e.color = t.c; if (e.stroke && e.stroke.on) e.stroke.color = t.a; }
    else if (e.border && e.border.on) e.border.color = t.a;
  });
  afterChange(true); toast(T(`طبّقنا ألوان «${t.ar}» على التصميم كله`, `Applied the ${t.en} colors`));
}
function replaceColor(from, to) {
  if (!from || !to || from.toUpperCase() === to.toUpperCase()) return;
  commitUndo(); const p = state.project, L = look(p), same = c => typeof c === 'string' && c.toUpperCase() === from.toUpperCase();
  if (same(p.bg)) p.bg = to; if (same(L.fill.c2)) L.fill.c2 = to; if (same(L.pattern.color || p.accent)) L.pattern.color = to; if (same(p.accent)) p.accent = to;
  p.elements.forEach(e => { if (same(e.color)) e.color = to; for (const k of ['fill', 'stroke', 'shadow', 'box', 'border']) if (e[k]) { if (same(e[k].color)) e[k].color = to; if (same(e[k].color2)) e[k].color2 = to; } });
  rememberColor(to); cx.replaceFrom = to.toUpperCase(); afterChange(true);
}
function afterChange(rerender) { refreshPreview(); saveSoon(); if (rerender) renderProperties(); }
function setAndRefresh(path, value, rerender) {
  setPath(path, value);
  if (path === 'font') { const el = getSelected(); const { f } = fontOf(el); if (!f.bold) el.weight = 400; else if (el.weight == null) el.weight = 700; }
  if (/color/i.test(path) || path === '@bg') rememberColor(value);
  afterChange(rerender);
}

/* ---------- Panel events ---------- */
function installCustomize() {
  const box = $('#propertiesContent');
  box.addEventListener('pointerdown', e => { if (e.target.closest('[data-cx]')) { commitUndo(); cx.armed = true; } }, true);
  box.addEventListener('focusin', e => { if (e.target.matches('[data-cx-hex],[data-cx][type="color"],[data-cx-replace-input]') && !cx.armed) { commitUndo(); cx.armed = true; } });
  box.addEventListener('input', e => {
    const t = e.target;
    if (t.matches('[data-cx]')) {
      if (!cx.armed) { commitUndo(); cx.armed = true; }
      const path = t.dataset.cx, type = t.dataset.type;
      const v = type === 'num' ? Number(t.value) : type === 'bool' ? t.checked : t.value;
      if (type === 'color') { setPath(path, v); afterChange(false); const hex = box.querySelector(`[data-cx-hex="${path}"]`); if (hex) hex.value = v.toUpperCase(); }
      else setAndRefresh(path, v, type === 'bool');
      const out = box.querySelector(`[data-cx-out="${path}"]`); if (out) out.textContent = fmt[out.dataset.fmt](v);
    }
    if (t.matches('[data-cx-hex]')) { const v = t.value.trim(); if (/^#[0-9a-f]{6}$/i.test(v)) { setPath(t.dataset.cxHex, v); afterChange(false); } }
    if (t.matches('[data-cx-replace-input]')) { replaceColorQuiet(cx.liveFrom || cx.replaceFrom, t.value); cx.liveFrom = t.value; }
  });
  box.addEventListener('change', e => {
    const t = e.target; cx.armed = false;
    if (t.matches('[data-cx][type="color"]')) { rememberColor(t.value); renderProperties(); }
    if (t.matches('[data-cx-hex]')) renderProperties();
    if (t.matches('[data-cx-replace-input]')) { rememberColor(t.value); cx.replaceFrom = t.value.toUpperCase(); cx.liveFrom = null; renderProperties(); }
  });
  box.addEventListener('click', async e => {
    const b = e.target.closest('button'); if (!b || !box.contains(b)) return;
    if (b.dataset.cxTab) { cx.tab = b.dataset.cxTab; renderProperties(); box.scrollTop = 0; return; }
    if (b.dataset.cxFontcat) { cx.fontCat = b.dataset.cxFontcat; renderProperties(); return; }
    if (b.dataset.cxSet) { commitUndo(); cx.armed = false; setAndRefresh(b.dataset.cxSet, JSON.parse(b.dataset.value), true); return; }
    if (b.dataset.cxStyle) { const s = TEXT_STYLES.find(x => x.id === b.dataset.cxStyle), el = getSelected(); if (s && el) { commitUndo(); Object.assign(el, JSON.parse(JSON.stringify(s.set))); afterChange(true); } return; }
    if (b.dataset.cxFlip) { const el = getSelected(); if (el) { commitUndo(); el[b.dataset.cxFlip] = !el[b.dataset.cxFlip]; afterChange(true); } return; }
    if (b.dataset.cxAlign) { const el = getSelected(); if (!el) return; commitUndo(); const r = getElementRect(el), a = b.dataset.cxAlign; if (a === 'left') el.x = r.w / 2; if (a === 'right') el.x = 1 - r.w / 2; if (a === 'center-x') el.x = .5; if (a === 'top') el.y = r.h / 2; if (a === 'bottom') el.y = 1 - r.h / 2; if (a === 'center-y') el.y = .5; afterChange(true); return; }
    if (b.dataset.cxLayer) { const el = getSelected(); if (!el) return; commitUndo(); const list = state.project.elements.filter(x => x !== el); if (b.dataset.cxLayer === 'top') list.push(el); else list.unshift(el); state.project.elements = list; afterChange(true); return; }
    if (b.dataset.cxTheme) { applyTheme(b.dataset.cxTheme); return; }
    if (b.dataset.cxReplaceFrom) { cx.replaceFrom = cx.replaceFrom === b.dataset.cxReplaceFrom ? null : b.dataset.cxReplaceFrom; renderProperties(); return; }
    if (b.dataset.cxReplaceTo) { replaceColor(cx.replaceFrom, b.dataset.cxReplaceTo); return; }
    if (b.dataset.cxAddText) { addTextKind(b.dataset.cxAddText); return; }
    if ('cxBgPhoto' in b.dataset) { pickPhoto('background'); return; }
    if ('cxReplaceImage' in b.dataset) { pickPhoto('replace'); return; }
    if (b.dataset.cxEyedrop && window.EyeDropper) { try { const r = await new EyeDropper().open(); commitUndo(); setAndRefresh(b.dataset.cxEyedrop, r.sRGBHex, true); } catch (err) { /* closed */ } }
  });
  photoInput.addEventListener('change', async () => {
    const file = photoInput.files[0]; photoInput.value = ''; if (!file) return;
    try {
      const src = await fileToDataUrl(file), img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
      imageCache.set(src, { img, ready: true }); commitUndo();
      if (photoMode === 'replace' && getSelected()?.type === 'image') { const el = getSelected(); el.src = src; el.originalWidth = img.width; el.originalHeight = img.height; }
      else { const el = { id: uid(), type: 'image', src, x: .5, y: .5, w: 1, h: 1, rot: 0, opacity: 1, originalWidth: img.width, originalHeight: img.height }; state.project.elements.unshift(el); state.selectedId = el.id; cx.tab = 'image'; state.panel = 'element'; }
      afterChange(true);
    } catch (err) { toast(err.message || T('ما قدرنا نفتح الصورة', 'Could not open the photo'), true); }
  });
}
function replaceColorQuiet(from, to) { if (!from) return; const p = state.project, L = look(p), same = c => typeof c === 'string' && c.toUpperCase() === from.toUpperCase(); if (same(p.bg)) p.bg = to; if (same(L.fill.c2)) L.fill.c2 = to; if (same(L.pattern.color)) L.pattern.color = to; if (same(p.accent)) p.accent = to; p.elements.forEach(e => { if (same(e.color)) e.color = to; for (const k of ['fill', 'stroke', 'shadow', 'box', 'border']) if (e[k]) { if (same(e[k].color)) e[k].color = to; if (same(e[k].color2)) e[k].color2 = to; } }); refreshPreview(); saveSoon(); }
const photoInput = Object.assign(document.createElement('input'), { type: 'file', accept: 'image/*,.heic,.heif', hidden: true });
let photoMode = 'background';
function pickPhoto(mode) { photoMode = mode; photoInput.click(); }
document.body.append(photoInput);
installCustomize();
/* The original panel listener handles data-slider, data-text-edit and data-action; a selection change resets nothing else. */
