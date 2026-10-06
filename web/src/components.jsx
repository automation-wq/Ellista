// Shared pieces: icons, product card, rows, forms, header with the category menus, footer, cart drawer, toast.
import { forwardRef, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { useStore } from "./store.jsx";
import { api, qs, load, save } from "./api.js";
import { ICONS, DRAW_ICONS, COUNTRIES, BANK_OFFERS, TOP_FEATURES, GUIDES, CAT_SIZE, catSizes, catUrl, brandUrl, listUrl, off, avg, starRow, eta } from "./data.js";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// ===== icons =====
export const Icon = ({ k, cls = "ic" }) => <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[k] }} />;
// line icon that draws itself when its section scrolls into view (see .ico in style.css)
export const Ico = ({ shapes }) => <i className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: shapes }} /></i>;

// ===== product pieces =====
// the main photo on a product page loads first; every other photo waits until it scrolls near the screen
export const Photo = ({ p, main }) => main ? <img src={p.img} alt={p.brand + " " + p.name} fetchPriority="high" /> : <img src={p.img} alt={p.brand + " " + p.name} loading="lazy" decoding="async" />;
export const Stars = ({ p }) => p.reviews && p.reviews.length ? <span className="stars" title={avg(p).toFixed(1) + " out of 5"}><span>{starRow(Math.round(avg(p)))}</span> <small>{avg(p).toFixed(1)} ({p.reviews.length})</small></span> : null;
export function Stepper({ p }) {
  const { qtyOf } = useStore();
  return <div className="stepper"><button data-q={p.id} data-n={qtyOf(p.id) - 1} aria-label="Decrease quantity">−</button><span>{qtyOf(p.id)}</span><button data-q={p.id} data-n={qtyOf(p.id) + 1} aria-label="Increase quantity">+</button></div>;
}
// "Add to cart" turns into a − 1 + stepper once the product is in the cart
export function Buy({ p }) {
  const { qtyOf } = useStore();
  return <div className="buy" data-pid={p.id}>{p.stock <= 0 ? <button className="btn" disabled>Out of stock</button> : qtyOf(p.id) ? <Stepper p={p} /> : <button className="btn" data-add={p.id}>Add to cart</button>}</div>;
}
export function Heart({ p }) {
  const { wish } = useStore();
  const on = wish.includes(p.id);
  return <button className={"heart" + (on ? " on" : "")} data-wish={p.id} aria-label="Save to wishlist" aria-pressed={on}>♥</button>;
}
export function Card({ p }) {
  const { money } = useStore();
  return <div className="card"><Heart p={p} />
    <a href={"product.html?id=" + p.id}><div className="img"><Photo p={p} />{off(p) > 0 && <span className="badge">{off(p)}% off</span>}</div><small>{p.brand}</small><h3>{p.name}</h3><Stars p={p} /></a>
    <div className="price"><b>{money(p.price)}</b>{p.mrp > p.price && <><s>{money(p.mrp)}</s><em className="save">Save {money(p.mrp - p.price)}</em></>}</div>{p.emi && <span className="emi">No Cost EMI</span>}<span className="geta"><Icon k="truck" /> Free delivery · get it by {eta()[1]}</span><Buy p={p} /></div>;
}
export function Line({ p }) {
  const { money, qtyOf } = useStore();
  return <div className="line"><a className="img" href={"product.html?id=" + p.id}><Photo p={p} /></a>
    <div><a href={"product.html?id=" + p.id}>{p.brand} {p.name}</a>
      <div className="lrow"><Stepper p={p} /><b>{money(p.price * qtyOf(p.id))}</b></div>
      <button className="link" data-q={p.id} data-n="0">Remove</button></div></div>;
}
// a sideways-scrolling strip with arrow buttons (hidden when the row fits on the screen)
export const Strip = ({ children }) => <div className="strip"><button className="sarrow" data-scroll="-1" aria-label="Scroll left">‹</button><div className="row">{children}</div><button className="sarrow" data-scroll="1" aria-label="Scroll right">›</button></div>;
export const Row = ({ title, href, list }) => list.length ? <section><h2>{title} {href ? <a href={href}>View all</a> : null}</h2><Strip>{list.map(p => <Card key={p.id} p={p} />)}</Strip></section> : null;
export const Box = ({ title, text, href, cta }) => <div className="box"><h1>{title}</h1><p>{text}</p><a className="btn" href={href}>{cta}</a></div>;
export function OrderItems({ o }) {
  const { money } = useStore();
  return o.items.map(it => <div className="line" key={it.id}><span className="img"><img src={it.img} alt="" /></span>
    <div><span>{it.brand} {it.name}</span><div className="lrow"><span className="muted">Qty {it.qty}</span><b>{money(it.price * it.qty)}</b></div></div></div>);
}
// bank offers block, used on the home page and the offers page
export const BankOffers = () => <section className="offers" id="bank"><h2>Bank offers <a href="offers.html">All offers</a></h2><div className="ogrid">{BANK_OFFERS.map(([bank, big, note, c]) =>
  <div className="offer" style={{ "--bc": c }} key={bank}><i className="blogo">{bank.split(" ")[0]}</i><b>{big}</b><span>{note}</span><small>{bank} · T&amp;C apply</small></div>)}</div></section>;

// forms: show the server's message under the form and stop double submits. onSubmit gets the fields; throw to show an error.
// after(busy) renders the buttons row so it can be disabled while the form is busy.
export const Form = forwardRef(function Form({ onSubmit, after, children, ...rest }, ref) {
  const [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const submit = async e => {
    e.preventDefault();
    const form = e.currentTarget;
    setErr(""); setBusy(true);
    try { await onSubmit(Object.fromEntries(new FormData(form)), form); }
    catch (ex) { setErr(ex.message); }
    finally { setBusy(false); }
  };
  return <form {...rest} ref={ref} onSubmit={submit}>{children}<p className="err" role="alert">{err}</p>{after ? after(busy) : <button className="btn" disabled={busy}>Submit</button>}</form>;
});

// ===== header: ticker, search, country, links and the category menus =====
function navItems(P, CATS, BRANDS, catImg) {
  const page = document.body.dataset.page;
  const byId = id => P.find(p => p.id === +id);
  const curCat = page === "category" ? qs.get("cat") : page === "product" ? (byId(qs.get("id")) || {}).cat : "";
  const top = list => [...list].sort((a, b) => off(b) - off(a)).slice(0, 4);
  const items = CATS.map(cat => {
    const inCat = P.filter(p => p.cat === cat), { S, sizeOf, all } = catSizes(P, cat), g = all.length ? GUIDES[cat] : null, short = S ? S.short : cat;
    return {
      label: cat, href: catUrl(cat), cur: curCat === cat, head: "Shop " + cat, prodHead: "Popular " + cat, prods: top(inCat),
      tiles: [["All " + cat, catUrl(cat), catImg(cat)],
        ...all.map(s => [s.label, listUrl({ cat, size: s.label }), inCat.find(p => (sizeOf(p) || {}).label === s.label).img]),
        ...BRANDS.filter(b => inCat.some(p => p.brand === b)).map(b => [b + " " + short, listUrl({ cat, brand: b }), inCat.find(p => p.brand === b).img])],
      links: [...(g ? [[g.nav, catUrl(cat) + "#guide"]] : []), ...(TOP_FEATURES[cat] ? [["Top features", catUrl(cat) + "#features"]] : []),
        ["Deals on " + short, listUrl({ cat, sort: "off" })], ["Delivery and returns", "page.html?p=shipping"], ["Store locator", "page.html?p=stores"]],
      promo: g ? ["Not sure which " + S.by.toLowerCase() + "?", "Answer one question and we will suggest the right one.", catUrl(cat) + "#guide"] : null,
    };
  });
  items.push({
    label: "Brands", href: "category.html", cur: page === "category" && !curCat && !!qs.get("brand"), head: "Shop by brand", prodHead: "Top deals", prods: top(P),
    tiles: BRANDS.flatMap(b => [["All " + b, brandUrl(b), P.find(p => p.brand === b).img],
      ...CATS.filter(c => P.some(p => p.brand === b && p.cat === c)).map(c => [b + " " + (CAT_SIZE[c] ? CAT_SIZE[c].short : c), listUrl({ cat: c, brand: b }), P.find(p => p.brand === b && p.cat === c).img])]),
    links: [["All products", "category.html"], ["Deals of the day", "category.html?sort=off"], ["My wishlist", "category.html?wish=1"], ["About Mytekkstore", "page.html?p=about"], ["Contact us", "page.html?p=contact"]],
  });
  items.push({ label: "Deals", href: "offers.html", cur: page === "offers" }); // a plain link to the festive offers page, no panel
  return items;
}

// search box with live suggestions: matching products, categories and brands as you type; the biggest deals before typing
function Search() {
  const { P, CATS, BRANDS, money } = useStore();
  const [q, setQ] = useState(qs.get("q") || ""), [open, setOpen] = useState(false), [sel, setSel] = useState(-1);
  const t = q.trim().toLowerCase(), typing = t.length >= 2;
  const hits = typing ? P.filter(p => (p.brand + " " + p.cat + " " + p.name).toLowerCase().includes(t)).slice(0, 6) : [...P].sort((a, b) => off(b) - off(a)).slice(0, 4);
  const links = typing ? [...CATS.filter(c => c.toLowerCase().includes(t)).map(c => [c, catUrl(c)]), ...BRANDS.filter(b => b.toLowerCase().includes(t)).map(b => ["All " + b, brandUrl(b)])].slice(0, 4) : [];
  const items = [...links.map(([label, href]) => ({ label, href })), ...hits.map(p => ({ label: p.brand + " " + p.name, href: "product.html?id=" + p.id, p }))];
  const show = open && items.length > 0;
  const onKey = e => {
    if (!show) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setSel(x => (x + 1) % items.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel(x => (x - 1 + items.length) % items.length); }
    else if (e.key === "Enter" && sel >= 0) { e.preventDefault(); location.href = items[sel].href; }
    else if (e.key === "Escape") setOpen(false);
  };
  return <form role="search" action="category.html" className="sbox" onSubmit={e => { if (!q.trim()) e.preventDefault(); }}>
    <input type="search" name="q" value={q} placeholder="What are you looking for?" aria-label="Search products" autoComplete="off"
      role="combobox" aria-expanded={show} aria-controls="sugg" aria-autocomplete="list" aria-activedescendant={sel >= 0 ? "sg" + sel : undefined}
      onChange={e => { setQ(e.target.value); setSel(-1); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onKeyDown={onKey} />
    {show && <div className="sugg" id="sugg" role="listbox" onMouseDown={e => e.preventDefault()}>
      <p className="shead">{typing ? "Suggestions" : "Popular right now"}</p>
      {items.map((it, i) => <a href={it.href} className={"sg" + (it.p ? " sp" : "") + (i === sel ? " on" : "")} id={"sg" + i} role="option" aria-selected={i === sel} key={it.href}>
        {it.p ? <><img src={it.p.img} alt="" loading="lazy" /><span><small>{it.p.brand} · {it.p.cat}</small><b>{it.p.name}</b></span><i>{money(it.p.price)}</i></> : <><Icon k="search" /><b>{it.label}</b></>}</a>)}
      {typing && <a className="sg all" href={"category.html?q=" + encodeURIComponent(q.trim())}><Icon k="search" /><b>See all results for "{q.trim()}"</b></a>}
    </div>}
  </form>;
}

// "Deliver to" chip: the pincode typed once here is remembered for the product pages and the checkout (a native details pop-over)
function Deliver() {
  const [pin, setPin] = useState(() => load("pin", "")), [place, setPlace] = useState(() => load("pinplace", "")), [msg, setMsg] = useState("");
  const ref = useRef();
  useEffect(() => { const h = e => { if (ref.current && ref.current.open && !ref.current.contains(e.target)) ref.current.open = false; }; document.addEventListener("click", h); return () => document.removeEventListener("click", h); }, []);
  const submit = async e => {
    e.preventDefault();
    const v = e.currentTarget.pin.value.trim();
    if (!/^\d{6}$/.test(v)) return setMsg("Please enter a 6-digit pincode.");
    setMsg("Checking…");
    let district = "";
    try { district = (await api("pincode/" + v)).district || ""; }
    catch (ex) { if (/find/.test(ex.message)) return setMsg(ex.message); } // service down: keep the pincode, the standard promise still applies
    save("pin", v); save("pinplace", district); setPin(v); setPlace(district); setMsg(""); ref.current.open = false;
  };
  return <details className="deliver" ref={ref}><summary aria-label="Delivery pincode"><Icon k="pin" /><span><small>Deliver to</small><b>{pin ? (place ? place + " " + pin : pin) : "Enter pincode"}</b></span></summary>
    <form className="dpop" onSubmit={submit}><label>Pincode<input name="pin" inputMode="numeric" maxLength="6" defaultValue={pin} placeholder="6-digit pincode" /></label><button className="btn">Check</button>
      <p className="muted small" role="status">{msg || "Free delivery, usually in 3 to 5 days. Cash on delivery available."}</p></form></details>;
}

export function Header() {
  const { P, CATS, BRANDS, catImg, me, money, country, wish, cartCount, bump, closeCart } = useStore();
  const items = navItems(P, CATS, BRANDS, catImg);
  const page = document.body.dataset.page;
  const navRef = useRef();

  // category menus: the category name is the only control. A mouse opens the panel by hovering the name and a click goes to the
  // category page; a finger opens it with one tap and follows the link with a second; the keyboard opens it by focusing the name.
  useEffect(() => {
    let openLi = null, pinned = false, navTimer, lastPointer = "mouse";
    const setOpen = (li, pin = false) => {
      clearTimeout(navTimer);
      pinned = !!li && pin;
      if (li === openLi) return;
      if (openLi) { openLi.classList.remove("open"); $(".l0link", openLi).setAttribute("aria-expanded", "false"); }
      openLi = li;
      if (li) { li.classList.add("open"); $(".l0link", li).setAttribute("aria-expanded", "true"); }
      document.body.classList.toggle("nav-open", !!li);
      document.body.classList.toggle("nav-pinned", pinned);
    };
    const offs = [];
    const on = (el, ev, fn) => { el.addEventListener(ev, fn); offs.push(() => el.removeEventListener(ev, fn)); };
    $$(".l0", navRef.current).filter(li => $(".npanel", li)).forEach(li => {
      // short delays so the menu does not flash open when the pointer only passes over the bar
      on(li, "pointerenter", e => { if (e.pointerType === "mouse") { clearTimeout(navTimer); navTimer = setTimeout(() => { if (openLi !== li) setOpen(li); }, openLi ? 110 : 150); } });
      on(li, "pointerleave", e => { if (e.pointerType === "mouse") { clearTimeout(navTimer); if (!pinned) navTimer = setTimeout(() => setOpen(null), 250); } });
      on(li, "focusout", e => { if (openLi === li && e.relatedTarget && !li.contains(e.relatedTarget)) setOpen(null); });
      const link = $(".l0link", li);
      on(link, "pointerdown", e => lastPointer = e.pointerType);
      on(link, "keydown", () => lastPointer = "keyboard");
      on(link, "focus", () => { if (link.matches(":focus-visible")) setOpen(li); }); // reached by Tab: show the panel
      on(link, "click", e => {
        if (lastPointer !== "touch" && lastPointer !== "pen") return; // a mouse click or Enter goes to the category page
        if (openLi !== li) { e.preventDefault(); setOpen(li, true); } // first tap opens the menu; a second tap on the name follows the link
      });
    });
    // an open category menu closes on a click outside it, or once one of its links is followed
    on(document, "click", e => { if (openLi && (!openLi.contains(e.target) || e.target.closest(".npanel a"))) setOpen(null); });
    on(document, "keydown", e => {
      if (e.key !== "Escape") return;
      if (openLi) { if (openLi.contains(document.activeElement)) $(".l0link", openLi).focus(); setOpen(null); } // focus goes back to the category name
      closeCart();
    });
    // other sticky parts and the menu panels sit just below the header, whatever its height
    const syncHeader = () => document.documentElement.style.setProperty("--hh", $("#hdr").offsetHeight + "px");
    syncHeader(); on(window, "resize", syncHeader);
    if (document.fonts) document.fonts.ready.then(syncHeader);
    return () => offs.forEach(f => f());
  }, [P]);

  const n = cartCount();
  return <header id="hdr">
    <div className="ticker" aria-label="Store offers"><div>{[0, 1].flatMap(r => [["truck", "Free delivery on every order"], ["shield", "100% genuine products with brand warranty"], ["cash", "Cash on delivery available"], ["undo", "Easy returns"], ["box", "Track every order from your account"]].map(([i, t]) => <span key={r + i}><Icon k={i} /> {t}</span>))}</div></div>
    <div className="wrap">
      <a className="logo" href="index.html"><svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#08805f" /><path d="M18 5 9 18h6l-2 9 10-14h-6z" fill="#ffffff" /></svg><span>mytekk<b>store</b></span></a>
      <Search /><Deliver />
      <select id="country" aria-label="Country" defaultValue={country} onChange={e => { save("country", e.target.value); location.reload(); }}>{Object.keys(COUNTRIES).map(c => <option value={c} key={c}>{c}</option>)}</select>
      <a className="hlink" href="account.html"><Icon k="user" /> <span>{me ? me.name.split(" ")[0] : "Sign in"}</span></a>
      <a className="hlink" href="category.html?wish=1" aria-label="Wishlist"><Icon k="heart" /> <span id="wishN" className="count" hidden={!wish.length}>{wish.length}</span></a>
      <a className="hlink" href="cart.html" data-drawer aria-label="Cart"><Icon k="cart" /> <span id="cartN" className={"count" + (bump ? " bump" : "")} key={bump} hidden={!n}>{n}</span></a>
    </div>
    <nav className="gnav" aria-label="Shop" ref={navRef}><ul className="gbar">{items.map((it, i) => <li className={"l0" + (it.cur ? " cur" : "")} key={it.label}>
      <a className="l0link" href={it.href} aria-current={it.cur && page === "category" ? "page" : undefined} {...(it.tiles ? { "aria-haspopup": "true", "aria-expanded": "false", "aria-controls": "nav" + i } : {})}>{it.label}</a>{it.tiles &&
      <div className="npanel" id={"nav" + i}><div className="ngrid">
        <div><p className="nhead">{it.head}</p><div className="ntiles">{it.tiles.map(([t, h, img]) => <a className="ntile" href={h} key={h}><img src={img} alt="" loading="lazy" /><span>{t}</span></a>)}</div></div>
        <div><p className="nhead">{it.prodHead}</p><div className="nprods">{it.prods.map(p => <a className="nprod" href={"product.html?id=" + p.id} key={p.id}><img src={p.img} alt="" loading="lazy" /><span><small>{p.brand}</small><b>{p.name}</b><i>{money(p.price)}</i></span></a>)}</div></div>
        <div className="ndisc"><p className="nhead">Discover</p>{it.links.map(([t, h]) => <a href={h} key={t}>{t}</a>)}{it.promo && <a className="npromo" href={it.promo[2]}><b>{it.promo[0]}</b><span>{it.promo[1]}</span><u>Open the guide →</u></a>}</div>
      </div></div>}</li>)}</ul></nav>
  </header>;
}

export function Footer() {
  const { CATS, BRANDS } = useStore();
  return <footer id="ftr"><div className="wrap">
    <div className="ftrust">{[["lock", "No card details stored"], ["cash", "Cash on delivery"], ["undo", "Easy returns"], ["shield", "Brand warranty on everything"], ["truck", "Free delivery on every order"]].map(([i, t]) => <span key={t}><Icon k={i} />{t}</span>)}</div>
    <div className="fcols">
      <div><b>Shop</b>{CATS.slice(0, 6).map(c => <a href={catUrl(c)} key={c}>{c}</a>)}</div>
      <div><b>Brands</b>{BRANDS.slice(0, 6).map(b => <a href={brandUrl(b)} key={b}>{b}</a>)}</div>
      <div><b>Help</b><a href="page.html?p=contact">Contact</a><a href="page.html?p=shipping">Shipping</a><a href="page.html?p=returns">Returns</a><a href="page.html?p=stores">Store locator</a></div>
      <div><b>Mytekkstore</b><a href="page.html?p=about">About</a><a href="account.html">My account</a><a href="page.html?p=terms">Terms</a><a href="page.html?p=privacy">Privacy</a></div>
    </div>
    <div className="copy">© 2026 Mytekkstore. All rights reserved.</div>
  </div></footer>;
}

// cart drawer, dim layers, toast, scroll progress and back-to-top
// phones: a fixed bar at the bottom with the five places shoppers go most (hidden on desktop, see .mnav)
function MobileNav() {
  const { cartCount } = useStore();
  const page = document.body.dataset.page, n = cartCount();
  const items = [["index.html", "home", "Home", page === "home"], ["category.html", "apps", "Shop", page === "category" || page === "product"], ["offers.html", "tag", "Deals", page === "offers"],
    ["cart.html", "cart", "Cart", page === "cart" || page === "checkout"], ["account.html", "user", "Account", page === "account" || page === "order"]];
  return <nav className="mnav" aria-label="Quick links">{items.map(([h, i, t, on]) => <a href={h} className={on ? "on" : undefined} aria-current={on ? "page" : undefined} key={h}><Icon k={i} />{t}{i === "cart" && n > 0 && <span className="count">{n}</span>}</a>)}</nav>;
}

// the drawer slides on a spring, the toast pops in and out, and the progress line follows a sprung scroll value (Motion)
const SPRING = { type: "spring", stiffness: 320, damping: 32 };
const DRAWER = { open: { x: 0, visibility: "visible" }, closed: { x: "100%", transitionEnd: { visibility: "hidden" } } };
export function Chrome() {
  const { cart, byId, money, cartCount, cartTotal, toastState, cartOpen } = useStore();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: .4 });
  const n = cartCount();
  return <>
    <div className="navshade"></div><div className="overlay" data-close></div>
    <motion.aside className="drawer" aria-label="Cart" initial={false} animate={cartOpen ? "open" : "closed"} variants={DRAWER} transition={SPRING}><h2>Your cart (<span>{n}</span>) <button className="x" data-close aria-label="Close cart">×</button></h2><div className="dbody">{n ? <>
      <div className="lines">{Object.keys(cart).map(id => <Line p={byId(id)} key={id} />)}</div>
      <div className="dfoot"><div className="tot"><span>Subtotal</span><b>{money(cartTotal())}</b></div><a className="btn" href="checkout.html">Checkout</a><a className="btn ghost" href="cart.html">View cart</a></div></>
      : <div className="empty"><div className="big"><Icon k="cart" /></div><p>Your cart is empty.</p><button className="btn" data-close>Continue shopping</button></div>}</div></motion.aside>
    <AnimatePresence>{toastState.msg && <motion.div className="toast on" role="status" key="toast" style={{ x: "-50%" }} initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 90, opacity: 0 }} transition={SPRING}><span>{toastState.msg}</span>{toastState.withCart && <button data-drawer>View cart</button>}</motion.div>}</AnimatePresence>
    <MobileNav />
    <motion.div className="progress" style={{ scaleX: progress }}></motion.div><button className="totop" aria-label="Back to top" onClick={() => scrollTo({ top: 0, behavior: "smooth" })}>↑</button>
  </>;
}
