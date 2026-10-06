// Offers, cart, checkout, order, info and not-found pages (the home page is in home.jsx).
import { useEffect, useRef, useState } from "react";
import { useStore } from "./store.jsx";
import { api, qs, demoPay, track } from "./api.js";
import { Card, Row, Strip, Box, Line, OrderItems, BankOffers, Form, Ico, Icon } from "./components.jsx";
import { DRAW_ICONS, INFO, STEPS, FESTIVE, KV_IMG, catUrl, brandUrl, listUrl, off, etaText } from "./data.js";
import { reveal } from "./motion.js";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

export { Home } from "./home.jsx";

// the festive offers page: Deals in the bar and the wide banner on the home page open it
export function Offers() {
  const { P, CATS, catImg } = useStore();
  const [left, setLeft] = useState(0);
  useEffect(() => { document.title = FESTIVE.title + " | Mytekkstore"; if (!FESTIVE.ends) return; const t = setInterval(() => setLeft(Math.max(0, Math.floor((new Date(FESTIVE.ends) - Date.now()) / 1000))), 1000); return () => clearInterval(t); }, []);
  const deals = P.filter(p => off(p) > 0).sort((a, b) => off(b) - off(a));
  const maxOff = c => Math.max(0, ...P.filter(p => !c || p.cat === c).map(off)); // real figures from the catalogue
  const cells = [left / 86400, left / 3600 % 24, left / 60 % 60, left % 60].map(v => String(Math.floor(v)).padStart(2, "0"));
  return <>
    <div className="fest"><div className="sparks" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i style={{ "--i": i }} key={i}></i>)}</div>
      <span className="eyebrow">Limited time</span><h1>{FESTIVE.title}</h1><p>{FESTIVE.sub} · up to <b>{maxOff()}% off</b></p>
      {FESTIVE.ends && <div className="cdown" aria-label="Time left">{["Days", "Hours", "Minutes", "Seconds"].map((l, i) => <div key={l}><b>{cells[i]}</b><span>{l}</span></div>)}</div>}
      <div className="fcta">{CATS.map(c => <a className="btn" href={listUrl({ cat: c, sort: "off" })} key={c}>{c}</a>)}</div>
    </div>
    <section><h2>Offers by category</h2><div className="ftiles">{CATS.map(c => <a className="ftile" href={listUrl({ cat: c, sort: "off" })} key={c}><span><b>Up to {maxOff(c)}% off</b>{c}</span><img src={catImg(c)} alt="" loading="lazy" /></a>)}</div></section>
    <section><h2>Top deals <a href="category.html?sort=off">View all</a></h2><div className="grid">{deals.slice(0, 8).map(p => <Card p={p} key={p.id} />)}</div></section>
    <BankOffers />
    <section><div className="emiband"><div><p className="kicker">No Cost EMI</p><h2>Pay in easy monthly instalments</h2><p>Products marked "No Cost EMI" can be paid for in 3, 6 or 9 monthly instalments on participating bank credit cards, with no extra interest.</p></div><a className="btn" href="category.html">Shop now</a></div></section>
    <p className="muted small" style={{ marginTop: 24 }}>Offers depend on bank terms and stock. Discounts are against the MRP.</p>
  </>;
}

export function Cart() {
  const { P, cart, byId, money, cartCount, cartTotal } = useStore();
  useEffect(() => { document.title = "Cart | Mytekkstore"; }, []);
  if (!cartCount()) return <Box title="Your cart is empty" text="Add something you like and it will show up here." href="index.html" cta="Continue shopping" />;
  return <>
    <h1 style={{ margin: "24px 0 16px" }}>Your Cart ({cartCount()})</h1>
    <div className="cols">
      <div className="lines panel">{Object.keys(cart).map(id => <Line p={byId(id)} key={id} />)}</div>
      <aside className="panel sum"><h3>Order summary</h3>
        <div className="tot"><span>Items ({cartCount()})</span><span>{money(cartTotal())}</span></div>
        <div className="tot"><span>Delivery</span><span className="free">Free</span></div>
        <div className="tot grand"><span>Total</span><b>{money(cartTotal())}</b></div>
        <a className="btn" href="checkout.html">Proceed to checkout</a><a className="btn ghost" href="index.html">Continue shopping</a></aside>
    </div>
    <Row title="You may also like" href="category.html?sort=off" list={P.filter(p => !cart[p.id] && p.stock > 0).sort((a, b) => off(b) - off(a)).slice(0, 5)} />
  </>;
}

export function Checkout() {
  const { me, cart, byId, money, cartCount, cartTotal, clearCart } = useStore();
  const [place, setPlace] = useState("");
  useEffect(() => { document.title = "Checkout | Mytekkstore"; }, []);
  useEffect(() => { if (cartCount() && !me) location.replace("account.html?next=checkout.html"); }, []); // customers must sign in before checkout
  if (!cartCount()) return <Box title="Nothing to check out" text="Your cart is empty." href="index.html" cta="Continue shopping" />;
  if (!me) return null;
  // the delivery place under the pincode, from India Post (the field still accepts any pincode)
  const placeOf = async v => { setPlace(""); if (/^\d{6}$/.test(v)) try { const d = await api("pincode/" + v); if (d.district) setPlace("Delivering to " + d.district + ", " + d.state); } catch {} };
  useEffect(() => { placeOf(me.pin || ""); }, []);
  const submit = async f => {
    const items = Object.entries(cart).map(([id, qty]) => ({ id: +id, qty }));
    const online = f.pay !== "cod";
    if (online) await demoPay(f.pay, money(cartTotal()));
    const { id } = await api("orders", "POST", { name: f.name, phone: f.phone, address: f.address, pin: f.pin, pay: online ? "online" : "cod", items });
    track("purchase", { transaction_id: id, value: cartTotal(), items });
    clearCart();
    location.href = "order.html?id=" + id;
  };
  return <>
    <h1 style={{ margin: "24px 0 4px" }}>Checkout</h1>
    <p className="muted">Signed in as {me.email || me.phone}</p>
    <div className="cols">
      <Form className="form panel" onSubmit={submit} after={busy => <button className="btn" disabled={busy}>Place order</button>}>
        <h3>1. Delivery details</h3>
        <label>Full name<input name="name" required maxLength="80" autoComplete="name" defaultValue={me.name || ""} /></label>
        <label>Phone<input name="phone" type="tel" required pattern="[0-9+ ]{7,15}" autoComplete="tel" defaultValue={me.phone || ""} /></label>
        <label>Address<textarea name="address" rows="3" required maxLength="400" autoComplete="street-address" defaultValue={me.address || ""}></textarea></label>
        <label>Pincode<input name="pin" required pattern="[0-9A-Za-z ]{4,10}" autoComplete="postal-code" defaultValue={me.pin || ""} onChange={e => placeOf(e.target.value.trim())} /><span id="pinplace" className="small" role="status">{place}</span></label>
        <h3>2. Payment</h3>
        <label className="radio"><input type="radio" name="pay" value="cod" defaultChecked /> Cash on delivery</label>
        {["UPI", "Card", "Net banking"].map(m => <label className="radio" key={m}><input type="radio" name="pay" value={m} /> {m} <span className="stock low">demo</span></label>)}
        <p className="muted" style={{ fontSize: 13 }}>Online payment is a demo for now. No real money is taken.</p>
      </Form>
      <aside className="panel sum"><h3>Order summary</h3><div id="sum">
        <div className="lines">{Object.keys(cart).map(id => <Line p={byId(id)} key={id} />)}</div>
        <div className="tot"><span>Delivery</span><span className="free">Free</span></div>
        <div className="tot grand"><span>Total</span><b>{money(cartTotal())}</b></div><p className="muted small">Usually delivered by {etaText()}.</p></div></aside>
    </div>
  </>;
}

export function Order() {
  const { me, money, CFG } = useStore();
  const [o, setO] = useState(null), [bad, setBad] = useState(false);
  const id = qs.get("id") || "";
  useEffect(() => {
    if (!me) return location.replace("account.html?next=" + encodeURIComponent("order.html?id=" + id)); // an order is private to its customer
    (async () => { try { if (!/^MT[0-9A-F]{10}$/.test(id)) throw 0; const r = await api("orders/" + id); setO(r.order); document.title = `Order ${r.order.id} | Mytekkstore`; } catch { setBad(true); } })();
  }, []);
  useEffect(() => { if (o || bad) reveal(); }, [o, bad]);
  if (!me) return null;
  if (bad) return <Box title="Order not found" text="Please check the order number." href="index.html" cta="Back to home" />;
  if (!o) return null;
  const step = STEPS.indexOf(o.status);
  const confetti = step === 0 && !matchMedia("(prefers-reduced-motion: reduce)").matches; // a short celebration on a freshly placed order
  return <>
    <div className="box okbox">{confetti && <div className="confetti" aria-hidden="true">{Array.from({ length: 36 }, (_, i) => <i style={{ "--x": (Math.random() * 100).toFixed(1) + "%", "--d": (Math.random() * 1.4).toFixed(2) + "s", "--h": Math.floor(Math.random() * 360) }} key={i}></i>)}</div>}
      <div className="tick">✓</div><h1>{step === 0 ? "Order placed" : "Order " + o.status.toLowerCase()}</h1>
      <p>Order number <b style={{ color: "var(--text)" }}>{o.id}</b> · {new Date(o.at).toLocaleString()}</p>
      {step === 0 && (CFG.sms || CFG.mail) && <p className="muted small">We have sent a confirmation message to {CFG.sms ? o.phone : o.email || o.phone}.</p>}
      {o.status === "Cancelled" ? <span className="stock out">Cancelled</span> : <ol className="track">{STEPS.map((s, i) => <li className={i <= step ? "done" : ""} key={s}>{s}</li>)}</ol>}
      {step >= 0 && step < 3 && <p className="muted small">Expected delivery by {etaText(o.at)}</p>}
    </div>
    <div className="cols">
      <div className="panel"><h3>Items</h3><div className="lines"><OrderItems o={o} /></div><div className="tot grand"><span>Total</span><b>{money(o.total)}</b></div></div>
      <aside className="panel sum"><h3>Delivery</h3><p>{o.name}<br />{o.address}<br />{o.pin}<br />{o.phone}</p><h3>Payment</h3><p>{o.pay}</p>
        <a className="btn" href="index.html">Continue shopping</a></aside>
    </div>
  </>;
}

export function InfoPage() {
  const [title, html] = (Object.hasOwn(INFO, qs.get("p")) && INFO[qs.get("p")]) || ["Page not found", "<p>This page does not exist.</p>"];
  useEffect(() => { document.title = title + " | Mytekkstore"; }, []);
  return <><div className="crumbs"><a href="index.html">Home</a> › {title}</div><div className="prose"><h1>{title}</h1><div dangerouslySetInnerHTML={{ __html: html }} /></div></>;
}
export function NotFound() {
  useEffect(() => { document.title = "Page not found | Mytekkstore"; }, []);
  return <Box title="Page not found" text="The address may be wrong, or the page has moved." href="index.html" cta="Back to home" />;
}
