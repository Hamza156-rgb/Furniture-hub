import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/layout/Navbar';
import ShopCard from '../components/shop/ShopCard';
import ProductCard from '../components/shop/ProductCard';
import { getShops, getProducts, getCities } from '../utils/api';

const ICONS = ['🛋️','🛏️','🍽️','🪑','🌿','📦','🧸','🛁','🖥️','🏡'];

export default function HomePage() {
  const [shops, setShops]             = useState([]);
  const [products, setProducts]       = useState([]);
  const [cities, setCities]           = useState([]);
  const [selectedCity, setSelectedCity] = useState('all');
  const [search, setSearch]           = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeCat, setActiveCat]     = useState('');
  const [allCatNames, setAllCatNames] = useState([]);
  const [loadingShops, setLoadingShops]   = useState(false);
  const [loadingProds, setLoadingProds]   = useState(false);
  const [tab, setTab] = useState('shops');

  // Load cities
  useEffect(() => {
    getCities().then(r => setCities(r.data.cities)).catch(() => {});
  }, []);

  // Load shops
  const loadShops = useCallback(async () => {
    setLoadingShops(true);
    try {
      const params = {};
      if (selectedCity !== 'all') params.city = selectedCity;
      if (search) params.search = search;
      const { data } = await getShops(params);
      setShops(data.shops);

      // Extract unique category names
      const cats = [...new Set(data.shops.flatMap(s => (s.categories || []).map(c => c.name)))];
      setAllCatNames(cats);
    } catch {}
    setLoadingShops(false);
  }, [selectedCity, search]);

  // Load products
  const loadProducts = useCallback(async () => {
    setLoadingProds(true);
    try {
      const params = {};
      if (selectedCity !== 'all') params.city = selectedCity;
      if (activeCat) params.categoryName = activeCat;
      if (search) params.search = search;
      const { data } = await getProducts(params);
      setProducts(data.products);
    } catch {}
    setLoadingProds(false);
  }, [selectedCity, activeCat, search]);

  useEffect(() => { loadShops(); }, [loadShops]);
  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="page-hero" style={{ padding: '4rem 1.25rem 5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position:'absolute', top:'-80px', left:'-80px', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(196,149,106,.12), transparent 70%)' }} />
        <div style={{ position:'absolute', bottom:'-60px', right:'10%', width:260, height:260, borderRadius:'50%', background:'radial-gradient(circle, rgba(196,149,106,.08), transparent 70%)' }} />

        <div style={{ position:'relative', maxWidth:640, margin:'0 auto' }}>
          <div style={{ display:'inline-block', background:'rgba(196,149,106,.15)', border:'1px solid rgba(196,149,106,.3)', borderRadius:30, padding:'.3rem 1rem', color:'var(--gold)', fontSize:'.78rem', fontWeight:700, letterSpacing:'.06em', marginBottom:'1.25rem' }}>
            🇵🇰 PAKISTAN'S #1 FURNITURE MARKETPLACE
          </div>
          <h1 className="serif" style={{ fontSize:'clamp(2rem,5vw,3rem)', color:'#f5e6d3', fontWeight:800, lineHeight:1.12, marginBottom:'.9rem' }}>
            Find the Perfect<br />Furniture Near You
          </h1>
          <p style={{ color:'#c4a882', fontSize:'1rem', marginBottom:'2rem', lineHeight:1.6 }}>
            Browse verified furniture shops across Pakistan — explore their full collections, categories, and pricing, all in one place.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', justifyContent:'center', maxWidth:580, margin:'0 auto' }}>
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search shops, areas, furniture..."
              style={{ flex:1, minWidth:180, padding:'.85rem 1.25rem', border:'none', borderRadius:'var(--radius-sm)', fontSize:'.95rem', outline:'none', fontFamily:'DM Sans, sans-serif' }}
            />
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              style={{ padding:'.85rem 1rem', border:'none', borderRadius:'var(--radius-sm)', fontSize:'.9rem', background:'#fff', cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}
            >
              <option value="all">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="submit" className="btn btn-primary" style={{ padding:'.85rem 1.4rem' }}>
              🔍 Search
            </button>
          </form>

          {/* Stats */}
          <div style={{ display:'flex', justifyContent:'center', gap:'2.5rem', marginTop:'2.5rem', flexWrap:'wrap' }}>
            {[['🏪','Verified Shops'], ['🛋️','Products Listed'], ['🌆','Cities Covered']].map(([icon, label]) => (
              <div key={label} style={{ color:'#c4a882', textAlign:'center' }}>
                <div style={{ fontSize:'1.6rem' }}>{icon}</div>
                <div style={{ fontSize:'.78rem', marginTop:'.2rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="container" style={{ paddingTop:'2.5rem', paddingBottom:'3rem' }}>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'.5rem', marginBottom:'2rem', background:'var(--cream-mid)', borderRadius:30, padding:'.25rem', width:'fit-content' }}>
          {[['shops','🏪 Shops'], ['products','🛋️ Products']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding:'.55rem 1.4rem', border:'none', borderRadius:30,
              background: tab === key ? 'var(--brown-dark)' : 'transparent',
              color: tab === key ? '#f5e6d3' : 'var(--text-muted)',
              fontWeight: tab === key ? 700 : 500, fontSize:'.88rem',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── SHOPS TAB ─────────────────────────────────────────────────── */}
        {tab === 'shops' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'1.25rem' }}>
              <h2 className="serif" style={{ fontSize:'1.5rem', fontWeight:700 }}>
                {selectedCity === 'all' ? 'All Shops' : `Shops in ${selectedCity}`}
                <span style={{ color:'var(--text-muted)', fontSize:'1rem', fontWeight:400, marginLeft:'.5rem' }}>({shops.length})</span>
              </h2>
            </div>
            {loadingShops ? (
              <div className="flex-center" style={{ padding:'4rem' }}><div className="spinner" /></div>
            ) : shops.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🔍</div>
                <h3>No shops found</h3>
                <p>Try a different city or search term</p>
              </div>
            ) : (
              <div className="grid-auto">
                {shops.map(s => <ShopCard key={s._id} shop={s} />)}
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCTS TAB ──────────────────────────────────────────────── */}
        {tab === 'products' && (
          <div>
            {/* Category filter pills */}
            <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
              <CatPill active={activeCat === ''} onClick={() => setActiveCat('')} label="All Products" icon="✨" />
              {allCatNames.map(name => (
                <CatPill key={name} active={activeCat === name} onClick={() => setActiveCat(name)} label={name} icon="" />
              ))}
            </div>

            <div style={{ marginBottom:'1.25rem' }}>
              <h2 className="serif" style={{ fontSize:'1.5rem', fontWeight:700 }}>
                {activeCat || 'All Products'}
                <span style={{ color:'var(--text-muted)', fontSize:'1rem', fontWeight:400, marginLeft:'.5rem' }}>({products.length})</span>
              </h2>
            </div>

            {loadingProds ? (
              <div className="flex-center" style={{ padding:'4rem' }}><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🛋️</div>
                <h3>No products found</h3>
                <p>Try selecting a different category or city</p>
              </div>
            ) : (
              <div className="grid-products">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background:'var(--brown-darkest)', color:'#8a7468', textAlign:'center', padding:'2.5rem 1rem' }}>
        <div className="serif" style={{ color:'var(--gold)', fontSize:'1.2rem', marginBottom:'.4rem' }}>🪵 FurniHub</div>
        <div style={{ fontSize:'.8rem' }}>Pakistan's Premier Furniture Marketplace · {new Date().getFullYear()}</div>
        <div style={{ fontSize:'.75rem', marginTop:'.5rem', color:'#665550' }}>
          Built with MERN Stack · MongoDB · Express · React · Node.js
        </div>
      </footer>
    </div>
  );
}

function CatPill({ active, onClick, label, icon }) {
  return (
    <button onClick={onClick} style={{
      padding:'.45rem 1rem', border: active ? 'none' : '1.5px solid var(--border)',
      borderRadius:30, background: active ? 'linear-gradient(135deg, var(--brown-dark), var(--brown-mid))' : '#fff',
      color: active ? '#f5e6d3' : 'var(--text-mid)', fontWeight:600, fontSize:'.8rem',
      display:'flex', alignItems:'center', gap:'.35rem', transition:'all .15s',
    }}>
      {icon} {label}
    </button>
  );
}
