// Category, brand, search and wishlist lists: lifestyle headline, explore tiles, size tabs, faceted filters (brand, price,
// discount, stock, EMI, rating) that apply at once and stay in the address, applied-filter chips, sort, Top features, TV size guide.
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "./store.jsx";
import { qs } from "./api.js";
import { Card, Box, Icon } from "./components.jsx";
import { TOP_FEATURES, GUIDES, CAT_CLIPS, KV_IMG, catSizes, catUrl, listUrl, off, avg } from "./data.js";

const BANDS = [[0, 10000, "Under ₹10,000"], [10000, 25000, "₹10,000 to ₹25,000"], [25000, 50000, "₹25,000 to ₹50,000"], [50000, 0, "Above ₹50,000"]]; // [min, max, label]
const OFFS = [10, 20, 30];
// the filters live in the address, so a filtered list can be shared and the menu links keep working; they apply without a reload
const readFilters = () => ({ brand: (qs.get("brand") || "").split(",").filter(Boolean), size: qs.get("size") || "", min: +qs.get("min") || 0, max: +qs.get("max") || 0,
  off: +qs.get("off") || 0, instock: qs.has("instock"), emi: qs.has("emi"), rating: +qs.get("rating") || 0, sort: qs.get("sort") || "" });
const Group = ({ title, children }) => <fieldset className="fg"><legend>{title}</legend>{children}</fieldset>;
const Opt = ({ on, onChange, label, n }) => <label className={"fopt" + (on ? " on" : "")}><input type="checkbox" checked={on} onChange={onChange} /><span>{label}</span><small>{n}</small></label>;

export function Category() {
  const { P, CATS, BRANDS, catImg, wish, money } = useStore();
  const cat = qs.get("cat") || "", q = (qs.get("q") || "").trim(), wishOnly = qs.has("wish");
  const [f, setF] = useState(readFilters);
  const [open, setOpen] = useState(false); // the filter drawer on phones
  const set = patch => setF(x => ({ ...x, ...patch }));
  const clear = () => setF(x => ({ brand: [], size: "", min: 0, max: 0, off: 0, instock: false, emi: false, rating: 0, sort: x.sort }));
  const { S, sizeOf, all: sizeList } = catSizes(P, cat);
  const catAll = P.filter(p => !cat || p.cat === cat);
  const base = catAll.filter(p => (!wishOnly || wish.includes(p.id)) && (p.brand + " " + p.cat + " " + p.name).toLowerCase().includes(q.toLowerCase()));
  // skip names one group, so a choice can show how many products it would give
  const pass = (p, skip) => (skip === "brand" || !f.brand.length || f.brand.includes(p.brand)) && (!f.size || (sizeOf(p) || {}).label === f.size)
    && (skip === "price" || ((!f.min || p.price >= f.min) && (!f.max || p.price <= f.max))) && (skip === "off" || !f.off || off(p) >= f.off)
    && (skip === "instock" || !f.instock || p.stock > 0) && (skip === "emi" || !f.emi || p.emi) && (skip === "rating" || !f.rating || avg(p) >= f.rating);
  const list = base.filter(p => pass(p));
  const count = (skip, test) => base.filter(p => pass(p, skip) && test(p)).length;
  const sorts = { low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, off: (a, b) => off(b) - off(a) };
  if (Object.hasOwn(sorts, f.sort)) list.sort(sorts[f.sort]);
  const title = wishOnly ? "My wishlist" : q ? 'Results for "' + q + '"' : [f.brand.length === 1 ? f.brand[0] : "", cat].filter(Boolean).join(" ") || "All products";
  useEffect(() => { document.title = title + " | Mytekkstore"; }, []);
  const params = { cat, q, wish: wishOnly ? 1 : "", brand: f.brand.join(","), size: f.size, min: f.min || "", max: f.max || "", off: f.off || "", instock: f.instock ? 1 : "", emi: f.emi ? 1 : "", rating: f.rating || "", sort: f.sort };
  const url = o => listUrl({ ...params, ...o });
  useEffect(() => { history.replaceState(null, "", url({}) + location.hash); }, [f]);
  useEffect(() => {
    document.body.classList.toggle("filters-open", open);
    if (!open) return;
    const k = e => { if (e.key === "Escape") setOpen(false); };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [open]);

  // tiles: this category first, then each brand in it, then the other categories
  const tiles = [], brandOn = b => f.brand.length === 1 && f.brand[0] === b;
  if (S && catAll.length) {
    tiles.push([S.short + " by " + S.by, S.note, catUrl(cat), catImg(cat), !f.brand.length && !q]);
    BRANDS.forEach(b => { const ps = catAll.filter(p => p.brand === b); if (ps.length) tiles.push([b + " " + S.short, ps.length + " model" + (ps.length > 1 ? "s" : ""), listUrl({ cat, brand: b }), ps[0].img, brandOn(b)]); });
    if (cat === "Televisions") {
      if (catAll.some(p => /4K/.test(p.name))) tiles.push(["4K Ultra HD", "Four times the detail of Full HD", listUrl({ cat, q: "4K" }), catAll.find(p => /4K/.test(p.name)).img, q === "4K"]);
      if (catAll.some(p => /Google/.test(p.name))) tiles.push(["Google TV", "Streaming apps and voice search built in", listUrl({ cat, q: "Google" }), catAll.find(p => /Google/.test(p.name)).img, q === "Google"]);
    }
  }
  if (!cat) CATS.forEach(c => tiles.push([c, P.filter(p => p.cat === c).length + " products", catUrl(c), catImg(c), false])); // category tiles only when no category is chosen
  const sizes = sizeList.map(s => s.label);
  const band = BANDS.find(([a, b]) => a === f.min && b === f.max);
  const chips = [...f.brand.map(b => [b, () => set({ brand: f.brand.filter(x => x !== b) })]), ...(f.size ? [[f.size, () => set({ size: "" })]] : []),
    ...((f.min || f.max) ? [[band ? band[2] : money(f.min) + " to " + money(f.max), () => set({ min: 0, max: 0 })]] : []), ...(f.off ? [[f.off + "% off or more", () => set({ off: 0 })]] : []),
    ...(f.instock ? [["In stock", () => set({ instock: false })]] : []), ...(f.emi ? [["No Cost EMI", () => set({ emi: false })]] : []), ...(f.rating ? [[f.rating + "★ and above", () => set({ rating: 0 })]] : [])];
  const n = list.length, nText = n + " product" + (n === 1 ? "" : "s");
  return <>
    <div className="crumbs"><a href="index.html">Home</a> › {title}</div>
    {wishOnly ? <h1>My wishlist</h1> : S && KV_IMG[cat] ? <div className="kv"><div className="kvimg" style={{ backgroundImage: `url(img/${KV_IMG[cat]}.jpg)` }}></div><div><span className="eyebrow">{cat}</span><h1 className="explore">Explore {S.short} by {S.by}</h1><p>{S.note}</p></div></div>
      : <h1 className="explore">{S ? "Explore " + S.short + " by " + S.by : title}</h1>}
    {!wishOnly && <div className="finder"><div className="tiles">{tiles.map(([name, note, href, img, on]) => <a className={"tile" + (on ? " on" : "")} href={href} aria-current={on ? "page" : undefined} key={href}><span><b>{name}</b><small>{note}</small></span><img src={img} alt="" loading="lazy" /></a>)}</div></div>}
    {sizes.length > 0 && <nav className="sizetabs" aria-label={S.by}><a href={url({ size: "" })} className={f.size ? undefined : "on"} aria-current={f.size ? undefined : "page"}>All</a>{sizes.map(s => <a href={url({ size: s })} className={s === f.size ? "on" : undefined} aria-current={s === f.size ? "page" : undefined} key={s}>{s}</a>)}</nav>}
    <div className="ptool"><p className="muted">{nText}{q ? ' · "' + q + '"' : ""}</p>
      {!wishOnly && <button type="button" className="btn ghost fbtn" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="filters"><Icon k="sliders" /> Filters{chips.length ? " (" + chips.length + ")" : ""}</button>}
      <label className="sortby">Sort by <select value={f.sort} onChange={e => set({ sort: e.target.value })}><option value="">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="off">Biggest discount</option></select></label></div>
    {chips.length > 0 && <div className="chips" aria-label="Applied filters"><AnimatePresence>{chips.map(([t, rm]) => <motion.button type="button" className="fchip" onClick={rm} aria-label={"Remove " + t} key={t} layout initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .8 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}>{t} <span aria-hidden="true">×</span></motion.button>)}</AnimatePresence><button type="button" className="link" onClick={clear}>Clear all</button></div>}
    <div className="plp">
      <div className="foverlay" onClick={() => setOpen(false)}></div>
      {!wishOnly && <aside className="filters" id="filters" aria-label="Filters">
        <div className="fhead"><b>Filters</b><button type="button" className="x" onClick={() => setOpen(false)} aria-label="Close filters">×</button></div>
        {!cat && <Group title="Category">{CATS.map(c => <a className="fopt" href={listUrl({ cat: c, q })} key={c}><span>{c}</span><small>{P.filter(p => p.cat === c).length}</small></a>)}</Group>}
        <Group title="Brand">{BRANDS.filter(b => catAll.some(p => p.brand === b)).map(b => <Opt label={b} n={count("brand", p => p.brand === b)} on={f.brand.includes(b)} onChange={e => set({ brand: e.target.checked ? [...f.brand, b] : f.brand.filter(x => x !== b) })} key={b} />)}</Group>
        <Group title="Price">{BANDS.map(([a, b, l]) => <Opt label={l} n={count("price", p => (!a || p.price >= a) && (!b || p.price <= b))} on={f.min === a && f.max === b} onChange={e => set(e.target.checked ? { min: a, max: b } : { min: 0, max: 0 })} key={l} />)}</Group>
        <Group title="Discount">{OFFS.map(o => <Opt label={o + "% off or more"} n={count("off", p => off(p) >= o)} on={f.off === o} onChange={e => set({ off: e.target.checked ? o : 0 })} key={o} />)}</Group>
        <Group title="More">
          <Opt label="In stock only" n={count("instock", p => p.stock > 0)} on={f.instock} onChange={e => set({ instock: e.target.checked })} />
          <Opt label="No Cost EMI" n={count("emi", p => p.emi)} on={f.emi} onChange={e => set({ emi: e.target.checked })} />
          <Opt label="4★ and above" n={count("rating", p => avg(p) >= 4)} on={f.rating === 4} onChange={e => set({ rating: e.target.checked ? 4 : 0 })} />
        </Group>
        <div className="ffoot"><button type="button" className="btn" onClick={() => setOpen(false)}>Show {nText}</button>{chips.length > 0 && <button type="button" className="link" onClick={clear}>Clear all</button>}</div>
      </aside>}
      {n ? <div className="grid">{list.map((p, i) => <Card p={p} i={i} key={p.id} />)}</div> : wishOnly ? <Box title="Your wishlist is empty" text="Tap the heart on any product to save it here." href="category.html" cta="Browse products" />
        : <div className="box"><h1>No products found</h1><p>Try a different size, search or filter.</p>{chips.length ? <button type="button" className="btn" onClick={clear}>Clear filters</button> : <a className="btn" href="category.html">See all products</a>}</div>}
    </div>
    {!wishOnly && <CategoryExtras cat={cat} sizes={sizeList} sizeUrl={s => url({ size: s })} />}
  </>;
}

// "Top features" at the end of every category page, plus the interactive size guide on the TV page
function CategoryExtras({ cat, sizes, sizeUrl }) {
  const feats = Object.hasOwn(TOP_FEATURES, cat) ? TOP_FEATURES[cat] : null, g = Object.hasOwn(GUIDES, cat) ? GUIDES[cat] : null; // cat comes from the address
  return <>
    {feats && <section className="topf" id="features">{CAT_CLIPS[cat] && <video className="bvid" muted loop playsInline preload="none" data-src={`img/${CAT_CLIPS[cat]}.mp4`} aria-hidden="true"></video>}<p className="kicker">Top features</p><h2>{g ? g.featTitle : "What makes these " + cat.toLowerCase() + " stand out"}</h2>
      <div className="tfgrid">{feats.map(([icon, title, text]) => <div className="tf" key={title}><i><Icon k={icon} /></i><b>{title}</b><span>{text}</span></div>)}</div></section>}
    {g && sizes.length > 0 && <Guide g={g} sizes={sizes} sizeUrl={sizeUrl} />}
  </>;
}
function Guide({ g, sizes, sizeUrl }) {
  const [v, setV] = useState(g.value);
  const sorted = [...sizes].sort((a, b) => a.n - b.n);
  const n = g.rec(v), best = sorted.reduce((a, b) => Math.abs(b.n - n) < Math.abs(a.n - n) ? b : a);
  const note = n > sorted[sorted.length - 1].n * 1.1 ? "Bigger than we stock right now. Our largest, " + best.label + ", is the right pick for this room." : "Closest in our range: " + best.label + ".";
  return <section className="guide" id="guide">
    <div className="gart" id="gart" aria-hidden="true" dangerouslySetInnerHTML={{ __html: g.art(v, n) }}></div>
    <div className="gcopy"><p className="kicker">Buying guide</p><h2>{g.title}</h2><p>{g.intro}</p>
      <label className="gask"><span>{g.ask} <output id="gval">{g.show(v)}</output></span><input type="range" id="grange" min={g.min} max={g.max} step={g.step} value={v} onChange={e => setV(+e.target.value)} style={{ "--fill": (v - g.min) / (g.max - g.min) * 100 + "%" }} /></label>
      <div className="gres"><span>We recommend</span><b id="grec">{g.fmt(n)}</b><small id="gnote">{note}</small></div>
      <a className="btn" id="gshop" href={sizeUrl(best.label)}>Shop {best.label}</a></div>
    <div className="gtable"><table className="specs"><tbody><tr><th>{g.thead[0]}</th><th>{g.thead[1]}</th></tr>
      {sorted.map(s => <tr key={s.label}><td><a className="alink" href={sizeUrl(s.label)}>{s.label}</a></td><td>{g.row(s.n)}</td></tr>)}</tbody></table>
      <p className="muted">{g.foot}</p></div></section>;
}
