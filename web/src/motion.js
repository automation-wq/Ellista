// Page motion that works on the rendered DOM: reveals, room clips, strips, scroll chrome. Each helper is safe to call again
// after a page draws more content.
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// fade sections in as they scroll into view
let revealIO;
export function reveal() {
  revealIO = revealIO || new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); } }), { rootMargin: "0px 0px -40px" });
  $$("main > section, main > .hero, main > .pdp, main > .plp, main > .box, main > .cols, main > .fest, main > .auth, main > .kv").forEach(el => {
    if (el.classList.contains("reveal")) return;
    el.classList.add("reveal"); revealIO.observe(el);
  });
}

// looping background clips: loaded only when needed, never on data saver or reduced motion (the poster photo stays instead)
export const clipsOk = !matchMedia("(prefers-reduced-motion: reduce)").matches && !(navigator.connection && navigator.connection.saveData);
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

// window-level listeners, attached once: scroll progress, back-to-top, card tilt and light
let chromeDone = false;
export function chrome() {
  if (chromeDone) return;
  chromeDone = true;
  addEventListener("scroll", () => {
    const h = document.documentElement;
    document.body.classList.toggle("scrolled", h.scrollTop > 300);
    document.documentElement.style.setProperty("--p", h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight));
  }, { passive: true });
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

// the product photo flies to the cart icon when something is added
export function fly(btn) {
  const img = btn.closest(".card, .pdp")?.querySelector(".img img"), target = $("[data-drawer]");
  if (!img || !target || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const from = img.getBoundingClientRect(), to = target.getBoundingClientRect(), ghost = img.cloneNode();
  Object.assign(ghost.style, { position: "fixed", left: from.left + "px", top: from.top + "px", width: from.width + "px", height: from.height + "px", zIndex: 50,
    borderRadius: "12px", pointerEvents: "none", objectFit: "contain", background: "#fff", transition: "all .7s cubic-bezier(.5,-0.2,.3,1)" });
  document.body.append(ghost);
  requestAnimationFrame(() => requestAnimationFrame(() => Object.assign(ghost.style, { left: to.left + "px", top: to.top + "px", width: "24px", height: "24px", opacity: ".25" })));
  setTimeout(() => ghost.remove(), 750);
}
