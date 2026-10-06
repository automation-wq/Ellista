// Page motion on the rendered DOM, built on Motion (motion.dev): reveals, numbers that count up, room clips, strips, scroll
// chrome and the fly-to-cart. Each helper is safe to call again after a page draws more content.
import { animate, inView } from "motion";
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const EASE = [.2, .8, .2, 1];

// sections fade and rise as they scroll into view; the CSS keyed on .reveal.in staggers the cards, headings and icons inside them
export function reveal() {
  $$("main > section, main > .hero, main > .pdp, main > .plp, main > .box, main > .cols, main > .fest, main > .auth, main > .kv").forEach(el => {
    if (el.classList.contains("reveal")) return;
    el.classList.add("reveal");
    if (reduced()) return el.classList.add("in");
    el.style.opacity = 0; // hidden until it scrolls in, so it never flashes before the animation starts
    inView(el, () => { el.classList.add("in"); animate(el, { opacity: [0, 1], y: [24, 0] }, { duration: .7, ease: EASE }); }, { margin: "0px 0px -40px" });
  });
}

// numbers roll up from 0 the first time they scroll into view
export function countUp(root) {
  $$("[data-n]", root).forEach(el => {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    if (reduced()) { el.textContent = el.dataset.n; return; }
    inView(el, () => { animate(0, +el.dataset.n, { duration: 1.4, ease: "circOut", onUpdate: v => { el.textContent = Math.round(v); } }); }, { amount: .6 });
  });
}

// looping background clips: loaded only when needed, never on data saver or reduced motion (the poster photo stays instead)
export const clipsOk = !reduced() && !(navigator.connection && navigator.connection.saveData);
export function playClip(v) {
  if (!clipsOk) return;
  if (!v.src) { v.src = v.dataset.src; v.onplaying = () => v.classList.add("playing"); }
  v.play().catch(() => {});
}
let clipIO;
export function lazyClips() {
  clipIO = clipIO || new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { playClip(e.target); clipIO.unobserve(e.target); } }), { rootMargin: "200px" });
  $$("video.tvid:not([data-seen]), video.bvid:not([data-seen])").forEach(v => { v.dataset.seen = "1"; clipIO.observe(v); });
}

// rows that fit on the screen need no scroll arrows
export const fitStrips = () => $$(".strip").forEach(x => { const r = $(".row", x); if (r) x.classList.toggle("nos", r.scrollWidth <= r.clientWidth + 2); });

// window-level listeners, attached once: back-to-top, card tilt and light (the scroll progress line is a Motion value in Chrome)
let chromeDone = false;
export function chrome() {
  if (chromeDone) return;
  chromeDone = true;
  addEventListener("scroll", () => document.body.classList.toggle("scrolled", document.documentElement.scrollTop > 300), { passive: true });
  // soft light follows the pointer across a product card, and the card tilts a little toward it (hover devices only, see CSS)
  document.addEventListener("pointermove", e => {
    const c = e.target.closest && e.target.closest(".card");
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", e.clientX - r.left + "px");
    c.style.setProperty("--my", e.clientY - r.top + "px");
    c.style.setProperty("--rx", ((e.clientY - r.top) / r.height - .5) * -5 + "deg");
    c.style.setProperty("--ry", ((e.clientX - r.left) / r.width - .5) * 7 + "deg");
  }, { passive: true });
  document.addEventListener("pointerout", e => {
    const c = e.target.closest && e.target.closest(".card");
    if (c && !c.contains(e.relatedTarget)) { c.style.removeProperty("--rx"); c.style.removeProperty("--ry"); }
  }, { passive: true });
  addEventListener("resize", fitStrips);
}

// the product photo flies to the cart icon when something is added: a copy shrinks toward the icon's centre, then goes away
export function fly(btn) {
  const img = btn.closest(".card, .pdp")?.querySelector(".img img"), target = $("[data-drawer]");
  if (!img || !target || reduced()) return;
  const from = img.getBoundingClientRect(), to = target.getBoundingClientRect(), ghost = img.cloneNode();
  Object.assign(ghost.style, { position: "fixed", left: from.left + "px", top: from.top + "px", width: from.width + "px", height: from.height + "px", zIndex: 50, borderRadius: "12px", pointerEvents: "none", objectFit: "contain", background: "#fff" });
  document.body.append(ghost);
  animate(ghost, { x: to.left + to.width / 2 - (from.left + from.width / 2), y: to.top + to.height / 2 - (from.top + from.height / 2), scale: 24 / Math.max(from.width, 1), opacity: .25 },
    { duration: .7, ease: [.5, -.2, .3, 1] }).finished.then(() => ghost.remove());
}
