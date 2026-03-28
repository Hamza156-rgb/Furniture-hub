import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import ProductCard from '../components/shop/ProductCard';
import { getShop, getShopProducts } from '../utils/api';

export default function ShopPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop]         = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await getShop(id);
        setShop(data.shop);
        setProducts(data.products);
        setCategories(data.shop.categories || []);
      } catch {
        navigate('/');
      }
      setLoading(false);
    }
    load();
  }, [id, navigate]);

  const filtered = activeCat
    ? products.filter(p => p.category?._id === activeCat || p.category === activeCat)
    : products;

  if (loading) return (
    <div>
      <Navbar />
      <div className="flex-center" style={{ height:'60vh' }}><div className="spinner" /></div>
    </div>
  );

  if (!shop) return null;

  return (
    <div>
      <Navbar />

      {/* ── Shop Hero ──────────────────────────────────────────────────────── */}
      <div className="page-hero" style={{ padding:'2rem 1.25rem 2.5rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle, rgba(196,149,106,.1), transparent 70%)' }} />

        <div className="container" style={{ position:'relative' }}>
          <button onClick={() => navigate(-1)} style={{
            background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)',
            color:'#f5e6d3', padding:'.45rem 1rem', borderRadius:'var(--radius-sm)',
            marginBottom:'1.5rem', fontSize:'.82rem', cursor:'pointer',
          }}>
            ← Back
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', flexWrap:'wrap' }}>
            {/* Logo */}
            <div style={{ width:88, height:88, borderRadius:20, overflow:'hidden', background:'rgba(196,149,106,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 8px 24px rgba(0,0,0,.35)' }}>
              {shop.shopLogo
                ? <img src={`http://localhost:5000${shop.shopLogo}`} alt={shop.shopName} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : <span style={{ fontSize:'2.8rem' }}>🛋️</span>
              }
            </div>

            <div style={{ flex:1 }}>
              <h1 className="serif" style={{ color:'#f5e6d3', fontSize:'clamp(1.5rem,4vw,2.2rem)', fontWeight:700, lineHeight:1.1 }}>
                {shop.shopName}
              </h1>
              {shop.tagline && (
                <p style={{ color:'var(--gold)', fontStyle:'italic', fontSize:'.9rem', marginTop:'.25rem' }}>"{shop.tagline}"</p>
              )}
              <div style={{ display:'flex', gap:'1.5rem', marginTop:'.75rem', flexWrap:'wrap' }}>
                {[
                  { icon:'⭐', text: shop.rating > 0 ? `${shop.rating.toFixed(1)} (${shop.reviewCount} reviews)` : 'New Shop' },
                  { icon:'📍', text: `${shop.shopLocation}, ${shop.shopCity}` },
                  { icon:'🕐', text: shop.shopTimings },
                  { icon:'📞', text: shop.shopNumber },
                ].map((item, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'.4rem', color:'#d4b896', fontSize:'.82rem' }}>
                    {item.icon} {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Info Strip ─────────────────────────────────────────────────────── */}
      <div style={{ background:'#fff', borderBottom:'1px solid var(--border)' }}>
        <div className="container" style={{ padding:'1rem 1.25rem', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'1rem' }}>
          {[
            { icon:'👤', label:'Owner', val: shop.owner ? `${shop.owner.firstName} ${shop.owner.lastName}` : '—' },
            { icon:'🏠', label:'Address', val: shop.shopAddress },
            { icon:'🏙️', label:'City', val: shop.shopCity },
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', gap:'.75rem', alignItems:'flex-start' }}>
              <span style={{ fontSize:'1.2rem', marginTop:'2px' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize:'.68rem', color:'var(--text-muted)', textTransform:'uppercase', fontWeight:700, letterSpacing:'.05em' }}>{item.label}</div>
                <div style={{ color:'var(--text-main)', fontSize:'.85rem', fontWeight:500, marginTop:'.1rem' }}>{item.val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Categories + Products ──────────────────────────────────────────── */}
      <div className="container" style={{ padding:'2rem 1.25rem 3rem' }}>
        {/* Category pills */}
        {categories.length > 0 && (
          <div style={{ marginBottom:'1.75rem' }}>
            <h2 className="serif" style={{ fontSize:'1.25rem', fontWeight:700, marginBottom:'.9rem' }}>Browse Categories</h2>
            <div style={{ display:'flex', gap:'.6rem', flexWrap:'wrap' }}>
              <CatPill active={activeCat === null} onClick={() => setActiveCat(null)} label="All Products" icon="✨" />
              {categories.map(c => (
                <CatPill key={c._id} active={activeCat === c._id} onClick={() => setActiveCat(c._id)} label={c.name} icon={c.icon} />
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'1.1rem' }}>
          <h2 className="serif" style={{ fontSize:'1.25rem', fontWeight:700 }}>
            {activeCat ? (categories.find(c => c._id === activeCat)?.name || 'Products') : 'All Products'}
            <span style={{ color:'var(--text-muted)', fontSize:'.95rem', fontWeight:400, marginLeft:'.5rem' }}>({filtered.length})</span>
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🛋️</div>
            <h3>No products in this category yet</h3>
          </div>
        ) : (
          <div className="grid-products">
            {filtered.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>

      <footer style={{ background:'var(--brown-darkest)', color:'#8a7468', textAlign:'center', padding:'1.75rem' }}>
        <div className="serif" style={{ color:'var(--gold)', marginBottom:'.25rem' }}>🪵 FurniHub</div>
        <div style={{ fontSize:'.78rem' }}>Pakistan's Premier Furniture Marketplace</div>
      </footer>
    </div>
  );
}

function CatPill({ active, onClick, label, icon }) {
  return (
    <button onClick={onClick} style={{
      padding:'.5rem 1.1rem', border: active ? 'none' : '1.5px solid var(--border)',
      borderRadius:30, background: active ? 'linear-gradient(135deg, var(--brown-dark), var(--brown-mid))' : '#fff',
      color: active ? '#f5e6d3' : 'var(--text-mid)', fontWeight:600, fontSize:'.82rem',
      display:'flex', alignItems:'center', gap:'.4rem',
    }}>
      {icon} {label}
    </button>
  );
}
