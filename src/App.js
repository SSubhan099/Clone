import { useState, useEffect, useMemo } from "react";
import "./App.css";

/* ---------- DATA ---------- */
const CATS = [
  ["all", "🌍", "All"], ["beach", "🏖️", "Beachfront"], ["mountain", "🏔️", "Mountains"],
  ["city", "🏙️", "City"], ["villa", "🏡", "Villas"], ["lake", "🛶", "Lakeside"],
  ["desert", "🏜️", "Desert"], ["farm", "🌾", "Farm stays"],
];
const L = [
  { id: 1, title: "Sea-facing villa with private pool", city: "Alibaug", state: "Maharashtra", cat: "beach", price: 9800, rating: 4.92, reviews: 128, guests: 8, beds: 4, baths: 4, host: "Meera", am: ["Pool", "WiFi", "Kitchen", "Parking", "AC"] },
  { id: 2, title: "Cottage above the tea estate", city: "Munnar", state: "Kerala", cat: "mountain", price: 4200, rating: 4.88, reviews: 214, guests: 4, beds: 2, baths: 1, host: "Thomas", am: ["WiFi", "Fireplace", "Breakfast", "Parking"] },
  { id: 3, title: "Loft in the heart of Bandra", city: "Mumbai", state: "Maharashtra", cat: "city", price: 6500, rating: 4.76, reviews: 97, guests: 3, beds: 1, baths: 1, host: "Aisha", am: ["WiFi", "AC", "Kitchen", "Workspace"] },
  { id: 4, title: "Heritage haveli with courtyard", city: "Jaipur", state: "Rajasthan", cat: "villa", price: 7800, rating: 4.95, reviews: 302, guests: 6, beds: 3, baths: 3, host: "Vikram", am: ["WiFi", "Breakfast", "AC", "Garden"] },
  { id: 5, title: "Houseboat on Dal Lake", city: "Srinagar", state: "J&K", cat: "lake", price: 5400, rating: 4.9, reviews: 176, guests: 4, beds: 2, baths: 2, host: "Bilal", am: ["Breakfast", "Heater", "WiFi", "Shikara ride"] },
  { id: 6, title: "Luxury tent under the stars", city: "Jaisalmer", state: "Rajasthan", cat: "desert", price: 3900, rating: 4.81, reviews: 88, guests: 2, beds: 1, baths: 1, host: "Kishan", am: ["Bonfire", "Dinner", "Camel safari"] },
  { id: 7, title: "Organic farm bungalow", city: "Karjat", state: "Maharashtra", cat: "farm", price: 3200, rating: 4.7, reviews: 64, guests: 6, beds: 3, baths: 2, host: "Sunil", am: ["Parking", "Kitchen", "Farm tour", "WiFi"] },
  { id: 8, title: "Beach shack steps from the sand", city: "Palolem", state: "Goa", cat: "beach", price: 2800, rating: 4.68, reviews: 143, guests: 2, beds: 1, baths: 1, host: "Fatima", am: ["WiFi", "Hammock", "Kayak"] },
  { id: 9, title: "Pine-wood chalet with valley view", city: "Manali", state: "Himachal Pradesh", cat: "mountain", price: 5100, rating: 4.85, reviews: 190, guests: 5, beds: 2, baths: 2, host: "Rohit", am: ["Heater", "Kitchen", "Parking", "WiFi"] },
  { id: 10, title: "Lakeview penthouse", city: "Udaipur", state: "Rajasthan", cat: "lake", price: 11200, rating: 4.97, reviews: 251, guests: 6, beds: 3, baths: 3, host: "Neha", am: ["Pool", "AC", "Breakfast", "Terrace"] },
  { id: 11, title: "Studio near Cubbon Park", city: "Bengaluru", state: "Karnataka", cat: "city", price: 3600, rating: 4.72, reviews: 71, guests: 2, beds: 1, baths: 1, host: "Arjun", am: ["WiFi", "Workspace", "AC", "Gym"] },
  { id: 12, title: "Portuguese-style Goan villa", city: "Assagao", state: "Goa", cat: "villa", price: 8900, rating: 4.93, reviews: 162, guests: 7, beds: 4, baths: 4, host: "Lucia", am: ["Pool", "Kitchen", "AC", "Garden", "Parking"] },
].map(l => ({ ...l, imgs: [1, 2, 3, 4, 5].map(n => `https://picsum.photos/seed/stay${l.id}-${n}/900/650`) }));

const REVIEWS = [
  ["Priya", "Spotless, exactly like the photos. The host replied within minutes."],
  ["Jason", "Woke up to the best view of the trip. Would book again."],
  ["Farah", "Great location and very comfortable beds. Check-in was smooth."],
  ["Dev", "Perfect for a long weekend with friends. Loved the kitchen."],
];
const inr = n => "₹" + n.toLocaleString("en-IN");

/* ---------- HASH ROUTER (clean, shareable URLs) ---------- */
function useRoute() {
  const read = () => {
    const [p, q = ""] = (window.location.hash.slice(1) || "/").split("?");
    return { path: p, q: Object.fromEntries(new URLSearchParams(q)) };
  };
  const [r, setR] = useState(read);
  useEffect(() => {
    const f = () => { setR(read()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  return r;
}
const go = (path, q = {}) => {
  const s = new URLSearchParams(Object.entries(q).filter(([, v]) => v && v !== "all")).toString();
  window.location.hash = path + (s ? "?" + s : "");
};

/* ---------- SMALL PIECES ---------- */
const Heart = ({ on, onClick }) => (
  <button className={"heart" + (on ? " on" : "")} aria-label="Save to wishlist" onClick={e => { e.stopPropagation(); onClick(); }}>
    {on ? "♥" : "♡"}
  </button>
);

function Card({ l, saved, toggle }) {
  const [i, setI] = useState(0);
  return (
    <article className="card" onClick={() => go("/listing/" + l.id)}>
      <div className="card-img">
        <img src={l.imgs[i]} alt={l.title} loading="lazy" />
        <Heart on={saved} onClick={() => toggle(l.id)} />
        <div className="dots">
          {l.imgs.map((_, n) => (
            <span key={n} className={n === i ? "d on" : "d"} onMouseEnter={() => setI(n)} />
          ))}
        </div>
      </div>
      <div className="card-top"><b>{l.city}, {l.state}</b><span>★ {l.rating}</span></div>
      <p className="muted">{l.title}</p>
      <p><b>{inr(l.price)}</b> <span className="muted">night</span></p>
    </article>
  );
}

function Header({ q }) {
  const [text, setText] = useState(q.q || "");
  useEffect(() => setText(q.q || ""), [q.q]);
  return (
    <header className="header">
      <a className="logo" href="#/">◆ staywise</a>
      <form className="search" onSubmit={e => { e.preventDefault(); go("/", { ...q, q: text }); }}>
        <input placeholder="Search city, state or stay" value={text} onChange={e => setText(e.target.value)} />
        <select value={q.guests || ""} onChange={e => go("/", { ...q, guests: e.target.value })}>
          <option value="">Any guests</option>
          {[1, 2, 4, 6, 8].map(n => <option key={n} value={n}>{n}+ guests</option>)}
        </select>
        <button>Search</button>
      </form>
      <a className="wish-link" href="#/wishlist">♥ Wishlist</a>
    </header>
  );
}

/* ---------- PAGES ---------- */
function Home({ q, saved, toggle }) {
  const max = Number(q.max) || 12000;
  const list = useMemo(() => {
    let r = L.filter(l =>
      (!q.cat || q.cat === "all" || l.cat === q.cat) &&
      (!q.q || (l.city + l.state + l.title).toLowerCase().includes(q.q.toLowerCase())) &&
      (!q.guests || l.guests >= Number(q.guests)) && l.price <= max);
    if (q.sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    if (q.sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    if (q.sort === "rated") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [q, max]);
  return (
    <main className="page">
      <nav className="cats">
        {CATS.map(([k, e, n]) => (
          <button key={k} className={(q.cat || "all") === k ? "cat on" : "cat"} onClick={() => go("/", { ...q, cat: k })}>
            <span>{e}</span>{n}
          </button>
        ))}
      </nav>
      <div className="filters">
        <label>Max price: <b>{inr(max)}</b>
          <input type="range" min="2000" max="12000" step="500" value={max} onChange={e => go("/", { ...q, max: e.target.value })} />
        </label>
        <select value={q.sort || ""} onChange={e => go("/", { ...q, sort: e.target.value })}>
          <option value="">Recommended</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
          <option value="rated">Top rated</option>
        </select>
        <span className="muted">{list.length} stays</span>
      </div>
      {list.length ? (
        <section className="grid">{list.map(l => <Card key={l.id} l={l} saved={saved.includes(l.id)} toggle={toggle} />)}</section>
      ) : (
        <div className="empty"><h3>No stays match these filters</h3><p>Raise the price limit or clear the search.</p><button className="btn" onClick={() => go("/")}>Clear filters</button></div>
      )}
    </main>
  );
}

function Detail({ id, saved, toggle }) {
  const l = L.find(x => x.id === Number(id));
  const [ci, setCi] = useState(""), [co, setCo] = useState(""), [g, setG] = useState(1), [done, setDone] = useState(false);
  if (!l) return <main className="page"><div className="empty"><h3>Stay not found</h3><a className="btn" href="#/">Back to stays</a></div></main>;
  const nights = ci && co ? Math.max(0, Math.round((new Date(co) - new Date(ci)) / 864e5)) : 0;
  const sub = nights * l.price, clean = Math.round(sub * 0.05), fee = Math.round(sub * 0.12);
  const today = new Date().toISOString().slice(0, 10);
  return (
    <main className="page detail">
      <a className="back" href="#/">← All stays</a>
      <div className="title-row">
        <h1>{l.title}</h1>
        <Heart on={saved.includes(l.id)} onClick={() => toggle(l.id)} />
      </div>
      <p className="muted">★ {l.rating} · {l.reviews} reviews · {l.city}, {l.state}</p>
      <div className="gallery">{l.imgs.map((s, n) => <img key={n} src={s} alt={`${l.title} ${n + 1}`} />)}</div>
      <div className="cols">
        <section>
          <h2>Hosted by {l.host}</h2>
          <p className="muted">{l.guests} guests · {l.beds} bedrooms · {l.baths} bathrooms</p>
          <hr />
          <p>Wake up in {l.city} in a space made for slowing down. {l.host} keeps the place stocked and is a message away during your stay.</p>
          <h3>What this place offers</h3>
          <ul className="amen">{l.am.map(a => <li key={a}>✓ {a}</li>)}</ul>
          <h3>Reviews</h3>
          <div className="revs">{REVIEWS.map(([n, t]) => <div key={n} className="rev"><b>{n}</b><p>{t}</p></div>)}</div>
        </section>
        <aside className="book">
          <p><b className="big">{inr(l.price)}</b> <span className="muted">night</span></p>
          <div className="dates">
            <label>Check-in<input type="date" min={today} value={ci} onChange={e => setCi(e.target.value)} /></label>
            <label>Check-out<input type="date" min={ci || today} value={co} onChange={e => setCo(e.target.value)} /></label>
          </div>
          <label>Guests
            <select value={g} onChange={e => setG(Number(e.target.value))}>
              {Array.from({ length: l.guests }, (_, n) => <option key={n} value={n + 1}>{n + 1} guest{n ? "s" : ""}</option>)}
            </select>
          </label>
          <button className="btn full" disabled={!nights} onClick={() => setDone(true)}>{nights ? "Reserve" : "Select dates"}</button>
          {nights > 0 && (
            <div className="sum">
              <div><span>{inr(l.price)} × {nights} nights</span><span>{inr(sub)}</span></div>
              <div><span>Cleaning fee</span><span>{inr(clean)}</span></div>
              <div><span>Service fee</span><span>{inr(fee)}</span></div>
              <div className="tot"><span>Total</span><span>{inr(sub + clean + fee)}</span></div>
            </div>
          )}
        </aside>
      </div>
      {done && (
        <div className="modal" onClick={() => setDone(false)}>
          <div className="box" onClick={e => e.stopPropagation()}>
            <h2>Booking confirmed</h2>
            <p>{l.title}, {l.city}<br />{ci} to {co} · {g} guest{g > 1 ? "s" : ""}</p>
            <p><b>Total paid: {inr(sub + clean + fee)}</b></p>
            <button className="btn" onClick={() => { setDone(false); go("/"); }}>Done</button>
          </div>
        </div>
      )}
    </main>
  );
}

function Wishlist({ saved, toggle }) {
  const list = L.filter(l => saved.includes(l.id));
  return (
    <main className="page">
      <h1>Wishlist</h1>
      {list.length ? <section className="grid">{list.map(l => <Card key={l.id} l={l} saved toggle={toggle} />)}</section>
        : <div className="empty"><h3>Nothing saved yet</h3><p>Tap the heart on any stay to keep it here.</p><a className="btn" href="#/">Browse stays</a></div>}
    </main>
  );
}

/* ---------- APP ---------- */
export default function App() {
  const { path, q } = useRoute();
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wish")) || []; } catch { return []; }
  });
  useEffect(() => { try { localStorage.setItem("wish", JSON.stringify(saved)); } catch {} }, [saved]);
  const toggle = id => setSaved(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));
  const parts = path.split("/").filter(Boolean);
  return (
    <>
      <Header q={q} />
      {parts[0] === "listing" ? <Detail id={parts[1]} saved={saved} toggle={toggle} />
        : parts[0] === "wishlist" ? <Wishlist saved={saved} toggle={toggle} />
        : <Home q={q} saved={saved} toggle={toggle} />}
      <footer className="foot">© 2026 staywise · Demo project</footer>
    </>
  );
}