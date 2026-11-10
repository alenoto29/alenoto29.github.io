/* ----- block objects: b(x, y, z, width, depth, height, colour, [open dx,dy,dz], texture, text) ----- */
const b = (x, y, z, w, d, h, c, o, t, html) => ({ x, y, z, w, d, h, c, o: o || [0, 0, 0], t: t || '', html: html || '' });
const OBJECTS = {
  // a phone: the sound of the call lifts off the screen, the reasons slide out
  calls: () => [
    b(3, 1, 0, 6, 10, 1, 'k'),
    b(3.5, 1.6, 1, 5, 8.8, .15, 'w', [0, 0, 2.2]),
    ...[.7, 1.5, 2.5, 1.3, 3, 1.8, .9].map((h, i) => b(5.5, 2.5 + i * 1.05, 1.15, 1, .55, h, i % 2 ? 'k' : 'd', [0, 0, 4.6])),
    ...['w', 't', 'w'].map((c, i) => b(-.4, 5.6 + i * 1.9, i * 0, 2.6, 1.3, .45, c, [-1.2, .6, .4 + i * 1.1], 't-lines'))
  ],
  // a pile of pages that fans out, with letters leaving for journalists
  research: () => [
    ...[0, 1, 2, 3, 4].map(i => b(1.2 + i * .1, 1.5 + i * .1, i * .2, 7, 9, .12, i % 2 ? 'p' : 'w', [0, 0, i * 1.45], 't-lines')),
    b(2.3, 2.6, .92, 4.6, .75, .06, 'k', [0, 0, 5.8]),
    ...[.7, 1.3, 2].map((h, j) => b(2.3 + j * 1.15, 8.2, .92, .85, .85, h, 'd', [0, 0, 5.8])),
    ...[0, 1, 2].map(k => b(9.3, 4.4, k * .32, 2.5, 3.5, .26, k % 2 ? 't' : 'w', [.4 + k * .5, -2.4 + k * 2.4, k * 1.1], 't-env'))
  ],
  // a web page whose blocks lift out one by one
  seo: () => [
    b(.5, 2, 0, 11, 8, .5, 'k'),
    b(.5, 2, .5, 11, 1.1, .12, 'd', null, 't-dots'),
    b(1.1, 3.6, .5, 9.8, 2.1, .35, 'w', [0, 0, 3.6], 't-hero'),
    ...['t', 'w', 't'].map((c, i) => b(1.1 + i * 3.35, 6.1, .5, 3.1, 2.1, .35, c, [0, 0, 1.3 + i * 1], 't-lines')),
    b(1.1, 8.6, .5, 6.2, .8, .22, 'd', [0, 0, .9]),
    b(7.9, 8.3, .5, 3, 1.5, .5, 'w', [0, 0, 2.4], '', '✓')
  ],
  // a chart with one day left honestly empty
  paid: () => [
    b(.5, 2.5, 0, 11, 7, .5, 'k'),
    b(.9, 2.9, .5, 10.2, 6.2, .2, 'd', [0, 0, 1.5], 't-grid'),
    ...[.9, 0, 1.3, 1.6, 2, 2.4, 2.9].map((h, i) => h ? b(1.4 + i * 1.38, 3.5, .7, .95, .95, h, 't', [0, 0, 3.2]) : null).filter(Boolean),
    ...[1.2, 0, 2, 2.4, 3, 3.6, 4.4].map((h, i) => h
      ? b(1.4 + i * 1.38, 5.6, .7, .95, 1.6, h, 'w', [0, 0, 3.2])
      : b(1.4 + i * 1.38, 5.6, .7, .95, 1.6, 0, 'w', [0, 0, 3.2], 't-miss', '?'))
  ],
  // five models: how good (column) next to how much they cost (coins)
  evals: () => {
    const score = [3.2, 4.7, 5, 4.3, 4.4], cost = [1, 2, 4, 7, 10], col = ['w', 't', 'd', 'w', 'w'];
    return [
      b(.5, 2.6, 0, 11, 7, .4, 'k'),
      ...score.map((h, i) => b(1.15 + i * 2.1, 3.2, .4, 1.5, 1.5, h, col[i], [0, 0, 1.4])),
      ...cost.flatMap((n, i) => Array.from({ length: n }, (_, k) => b(1.4 + i * 2.1, 6.6, .4 + k * .2, 1, 1, .15, k % 2 ? 't' : 'w', [0, 0, k * .28])))
    ];
  },
  // a card box: every contact in one place, one card pulled out
  outreach: () => [
    b(2, 2, 0, 8, 8, .5, 'k'),
    b(2, 2, .5, 8, .4, 2.2, 'k'),
    b(9.6, 2, .5, .4, 8, 2.2, 'k'),
    ...[0, 1, 2, 3, 4, 5, 6].map(i => b(2.7, 3 + i * .95, .5, 6.4, .2, 2.6, i === 4 ? 'd' : i % 2 ? 't' : 'w', [0, 0, i === 4 ? 4.4 : .5 + (i % 3) * 1.1], 't-card'))
  ]
};
// each object gets its own camera angle and its own floor, so the six never look like one picture repeated
const VIEW = {
  calls:    { rz: -45, rx: 58, floor: 'circle' },
  research: { rz: -28, rx: 53, floor: 'square' },
  seo:      { rz: -62, rx: 61, floor: 'pill' },
  paid:     { rz: -36, rx: 55, floor: 'grid' },
  evals:    { rz: -54, rx: 62, floor: 'rings' },
  outreach: { rz: -24, rx: 50, floor: 'diamond' }
};
function buildObj(el, key) {
  el.innerHTML = `<span class="floor f-${VIEW[key].floor}"></span>` + OBJECTS[key]().map(p =>
    `<span class="bx c-${p.c} ${p.t}" style="--x:${p.x};--y:${p.y};--z:${p.z};--w:${p.w};--d:${p.d};--h:${p.h};--dx:${p.o[0]};--dy:${p.o[1]};--dz:${p.o[2]}">` +
    `<i class="tp">${p.html ? `<b>${p.html}</b>` : ''}</i><i class="fr"></i><i class="lf"></i></span>`).join('');
}

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ----- drag to turn; objects lean toward the pointer ----- */
const rotators = [];
function makeRotatable(area, obj, key, turn) {
  const hz = Math.max(-80, Math.min(-10, VIEW[key].rz + (turn || 0))), hx = VIEW[key].rx - (turn ? 5 : 0);
  const r = { obj, bz: hz, bx: hx, pz: 0, px: 0, z: hz, x: hx, drag: null, moved: false };
  obj.style.setProperty('--rz', hz + 'deg'); obj.style.setProperty('--rx', hx + 'deg');
  area.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.target.closest('button')) return;
    r.drag = { x: e.clientX, y: e.clientY, bz: r.bz, bx: r.bx }; r.moved = false;
  });
  window.addEventListener('pointermove', e => {
    if (r.drag) {
      const dx = e.clientX - r.drag.x, dy = e.clientY - r.drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 5) { r.moved = true; area.classList.add('dragging'); }
      r.bz = Math.min(-8, Math.max(-82, r.drag.bz - dx * .4));   // stay on the side the objects are drawn for
      r.bx = Math.min(74, Math.max(34, r.drag.bx - dy * .3));
    } else if (!calm) {
      const q = area.getBoundingClientRect();
      r.pz = ((e.clientX - q.left) / q.width - .5) * -12;
      r.px = ((e.clientY - q.top) / q.height - .5) * -6;
    }
  });
  window.addEventListener('pointerup', () => { r.drag = null; area.classList.remove('dragging'); });
  area.addEventListener('dblclick', () => { r.bz = hz; r.bx = hx; });
  rotators.push(r);
  return r;
}

(function loop() {
  for (const r of rotators) {
    const tz = r.bz + (r.drag ? 0 : r.pz), tx = r.bx + (r.drag ? 0 : r.px);
    if (Math.abs(tz - r.z) + Math.abs(tx - r.x) > .02) {
      r.z += (tz - r.z) * .14; r.x += (tx - r.x) * .14;
      r.obj.style.setProperty('--rz', r.z.toFixed(2) + 'deg');
      r.obj.style.setProperty('--rx', r.x.toFixed(2) + 'deg');
    }
  }
  requestAnimationFrame(loop);
})();

/* ----- bar colour follows the section under it ----- */
function barTheme() {
  const top = [...document.querySelectorAll('[data-theme]')].find(el => { const r = el.getBoundingClientRect(); return r.top <= 28 && r.bottom > 28; });
  document.body.dataset.on = top ? top.dataset.theme : 'dark';
}

/* ----- a single project page ----- */
function initPage(key, nextKey) {
  const obj = document.getElementById('obj'), visual = document.getElementById('visual'), toggle = document.getElementById('toggle');
  buildObj(obj, key);
  const nextObj = document.getElementById('nextObj');
  buildObj(nextObj, nextKey);
  nextObj.parentElement.style.setProperty('--brz', VIEW[nextKey].rz + 'deg'); nextObj.parentElement.style.setProperty('--brx', VIEW[nextKey].rx + 'deg');
  const rot = makeRotatable(visual, obj, key, key === 'outreach' || key === 'research' ? -22 : 16);   // a different angle from the home page
  let open = false;
  const flip = () => { open = !open; obj.style.setProperty('--o', open ? 1 : 0); toggle.textContent = open ? 'Close it' : 'Open it up'; };
  toggle.addEventListener('click', flip);
  obj.addEventListener('click', () => { if (!rot.moved) flip(); rot.moved = false; });
  window.addEventListener('scroll', barTheme, { passive: true });
  barTheme();
  if (!calm) setTimeout(flip, 500);   // one opening move on arrival, so it is clear the object does something
}
