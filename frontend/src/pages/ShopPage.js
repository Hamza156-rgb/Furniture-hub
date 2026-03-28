import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Mail, ExternalLink, Phone } from 'lucide-react';
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

      {/* ── Social Media & Contact Section ─────────────────────────────────────── */}
      <div style={{ background:'#fff', borderBottom:'1px solid var(--border)' }}>
        <div className="container" style={{ padding:'1.5rem 1.25rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1.5rem' }}>
            
            {/* Social Media Links */}
            <div>
              <h3 style={{ fontSize:'0.9rem', fontWeight:600, color:'var(--text-main)', marginBottom:'0.75rem' }}>Connect With Us</h3>
              <div style={{ display:'flex', gap:'0.5rem' }}>
                {/* Facebook */}
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  title="Facebook"
                  style={{ display:'flex', alignItems:'center', justifyContent:'center' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
                  title="Instagram"
                  style={{ display:'flex', alignItems:'center', justifyContent:'center' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                {/* TikTok */}
                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  title="TikTok"
                  style={{ display:'flex', alignItems:'center', justifyContent:'center' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.32 1.35 2.51 2.71 2.6 1.17.05 2.36-.68 2.96-1.69.32-.59.44-1.28.42-1.94-.04-3.62.01-7.23-.02-10.85z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Contact Actions */}
            <div>
              <h3 style={{ fontSize:'0.9rem', fontWeight:600, color:'var(--text-main)', marginBottom:'0.75rem' }}>Get in Touch</h3>
              <div style={{ display:'flex', gap:'0.5rem' }}>
                {/* Email */}
                <a 
                  href={`mailto:${shop.shopEmail || 'info@example.com'}`}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  title="Email"
                  style={{ display:'flex', alignItems:'center', justifyContent:'center' }}
                >
                  <Mail size={16} />
                </a>
                {/* WhatsApp */}
                <a 
                  href={`https://wa.me/${shop.shopNumber?.replace(/[^\d]/g, '') || '1234567890'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                  title="WhatsApp"
                  style={{ display:'flex', alignItems:'center', justifyContent:'center' }}
                >
                  <MessageCircle size={16} />
                </a>
                {/* Phone */}
                <a 
                  href={`tel:${shop.shopNumber || '+923001234567'}`}
                  className="p-2 bg-brown-mid text-white rounded-lg hover:bg-brown-dark transition-colors"
                  title="Call"
                  style={{ display:'flex', alignItems:'center', justifyContent:'center' }}
                >
                  <Phone size={16} />
                </a>
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
