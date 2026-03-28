import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  getMyShop, updateMyShop,
  getShopCategories, createCategory, updateCategory, deleteCategory,
  getShopProducts, createProduct, updateProduct, deleteProduct,
} from '../utils/api';

const EMOJI_ICONS = ['🛋️','🛏️','🍽️','🪑','🌿','📦','🧸','🛁','🖥️','🏡','🪞','🚿','🪴','💡','🖼️'];

export default function DashboardPage() {
  const { user, shop: authShop, setShop: setAuthShop, logout } = useAuth();
  const navigate = useNavigate();

  const [panel, setPanel]         = useState('overview');
  const [shop, setShop]           = useState(authShop);
  const [categories, setCategories] = useState([]);
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);

  // ── Load data ─────────────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    try {
      const { data } = await getMyShop();
      setShop(data.shop);
      setAuthShop(data.shop);
      setCategories(data.shop.categories || []);

      if (data.shop._id) {
        const { data: pd } = await getShopProducts(data.shop._id);
        setProducts(pd.products);
      }
    } catch {}
    setLoading(false);
  }, [setAuthShop]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const NAV = [
    { key:'overview',   icon:'📊', label:'Overview'      },
    { key:'categories', icon:'🗂️', label:'Categories'    },
    { key:'products',   icon:'🛋️', label:'Products'      },
    { key:'profile',    icon:'🏪', label:'Shop Profile'  },
  ];

  if (loading) return (
    <div className="flex-center" style={{ height:'100vh' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div className="dashboard-layout">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-logo">🪵 FurniHub</div>
        <div className="sidebar-sub">Owner Dashboard</div>

        <div style={{ background:'rgba(196,149,106,.12)', borderRadius:'var(--radius-sm)', padding:'.75rem', marginBottom:'1.5rem' }}>
          <div style={{ fontSize:'.68rem', color:'var(--gold)', textTransform:'uppercase', letterSpacing:'.05em', fontWeight:700 }}>Shop</div>
          <div style={{ color:'#f5e6d3', fontWeight:600, fontSize:'.9rem', marginTop:'.15rem' }}>{shop?.shopName || '—'}</div>
          <div style={{ color:'#a89080', fontSize:'.75rem' }}>{user?.firstName} {user?.lastName}</div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(n => (
            <button key={n.key} onClick={() => setPanel(n.key)}
              className={`nav-item ${panel === n.key ? 'active' : ''}`}>
              <span className="nav-icon">{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>

        <div style={{ borderTop:'1px solid rgba(255,255,255,.08)', paddingTop:'1rem', marginTop:'auto' }}>
          <button onClick={() => { navigate('/'); }} className="nav-item" style={{ width:'100%' }}>
            <span className="nav-icon">🏠</span>View Site
          </button>
          {shop?._id && (
            <button onClick={() => navigate(`/shop/${shop._id}`)} className="nav-item" style={{ width:'100%' }}>
              <span className="nav-icon">👁️</span>My Shop Page
            </button>
          )}
          <button onClick={() => { logout(); navigate('/'); }} className="nav-item" style={{ width:'100%', color:'#e08080' }}>
            <span className="nav-icon">🚪</span>Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="dash-main">
        <div className="dash-content">
          {panel === 'overview'   && <OverviewPanel shop={shop} categories={categories} products={products} />}
          {panel === 'categories' && <CategoriesPanel shopId={shop?._id} categories={categories} setCategories={setCategories} products={products} />}
          {panel === 'products'   && <ProductsPanel shopId={shop?._id} categories={categories} products={products} setProducts={setProducts} />}
          {panel === 'profile'    && <ProfilePanel shop={shop} setShop={setShop} setAuthShop={setAuthShop} />}
        </div>
      </main>
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────────────────────────
function OverviewPanel({ shop, categories, products }) {
  return (
    <div>
      <h1 className="dash-title">Overview</h1>
      <div className="stat-grid">
        {[
          { icon:'🗂️', val: categories.length, label:'Categories' },
          { icon:'🛋️', val: products.length,   label:'Products'   },
          { icon:'✅', val: products.filter(p => p.inStock).length, label:'In Stock' },
          { icon:'❌', val: products.filter(p => !p.inStock).length, label:'Sold Out' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {shop && (
        <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'1.5rem', marginBottom:'1.5rem' }}>
          <h3 style={{ fontWeight:700, marginBottom:'1rem', color:'var(--text-main)' }}>Shop Details</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'1rem' }}>
            {[
              ['📍', 'Location', `${shop.shopLocation}, ${shop.shopCity}`],
              ['🏠', 'Address', shop.shopAddress],
              ['📞', 'Phone', shop.shopNumber],
              ['🕐', 'Timings', shop.shopTimings],
            ].map(([icon, label, val]) => (
              <div key={label}>
                <div style={{ fontSize:'.7rem', color:'var(--text-muted)', textTransform:'uppercase', fontWeight:700, letterSpacing:'.05em' }}>{icon} {label}</div>
                <div style={{ fontSize:'.88rem', color:'var(--text-main)', marginTop:'.2rem', fontWeight:500 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent products */}
      <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', overflow:'hidden' }}>
        <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid var(--border)', fontWeight:700, color:'var(--text-main)' }}>
          Recent Products
        </div>
        {products.length === 0 ? (
          <div className="empty-state" style={{ padding:'2rem' }}>
            <div>🛋️</div><p>No products yet. Add some from the Products panel.</p>
          </div>
        ) : products.slice(0, 5).map(p => (
          <div key={p._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'.85rem 1.25rem', borderBottom:'1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight:600, fontSize:'.9rem', color:'var(--text-main)' }}>{p.name}</div>
              <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>{p.category?.icon} {p.category?.name}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
              <span className="serif" style={{ fontWeight:700, color:'var(--brown-mid)' }}>Rs {p.price.toLocaleString()}</span>
              <span className={`badge ${p.inStock ? 'badge-green' : 'badge-red'}`}>{p.inStock ? 'In Stock' : 'Sold Out'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Categories Panel ──────────────────────────────────────────────────────────
function CategoriesPanel({ shopId, categories, setCategories, products }) {
  const [form, setForm]   = useState({ name:'', icon:'🛋️', description:'' });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.name.trim()) return toast.error('Category name is required');
    setSaving(true);
    try {
      if (editId) {
        const { data } = await updateCategory(editId, form);
        setCategories(cs => cs.map(c => c._id === editId ? data.category : c));
        toast.success('Category updated');
        setEditId(null);
      } else {
        const { data } = await createCategory(form);
        setCategories(cs => [...cs, data.category]);
        toast.success('Category added');
      }
      setForm({ name:'', icon:'🛋️', description:'' });
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    setSaving(false);
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      setCategories(cs => cs.filter(c => c._id !== id));
      toast.success('Category deleted');
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const startEdit = (cat) => {
    setEditId(cat._id);
    setForm({ name: cat.name, icon: cat.icon, description: cat.description || '' });
  };

  return (
    <div>
      <h1 className="dash-title">Categories</h1>

      {/* Add / Edit form */}
      <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'1.5rem', marginBottom:'1.5rem' }}>
        <h3 style={{ fontWeight:700, marginBottom:'1rem', color:'var(--text-main)' }}>{editId ? '✏️ Edit Category' : '+ Add New Category'}</h3>
        <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap', alignItems:'flex-end' }}>
          <div className="form-group" style={{ flex:1, minWidth:160 }}>
            <label className="form-label">Name *</label>
            <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Living Room" />
          </div>
          <div className="form-group">
            <label className="form-label">Icon</label>
            <select className="form-select" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}>
              {EMOJI_ICONS.map(ic => <option key={ic} value={ic}>{ic} {ic}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex:1, minWidth:160 }}>
            <label className="form-label">Description (optional)</label>
            <input className="form-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description..." />
          </div>
          <div style={{ display:'flex', gap:'.5rem' }}>
            <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? '...' : editId ? 'Update' : '+ Add'}</button>
            {editId && <button className="btn btn-outline" onClick={() => { setEditId(null); setForm({ name:'', icon:'🛋️', description:'' }); }}>Cancel</button>}
          </div>
        </div>
      </div>

      {/* Category list */}
      {categories.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🗂️</div><h3>No categories yet</h3><p>Add your first category above</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'1rem' }}>
          {categories.map(c => {
            const count = products.filter(p => p.category?._id === c._id || p.category === c._id).length;
            return (
              <div key={c._id} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'1.25rem' }}>
                <div style={{ fontSize:'2rem', marginBottom:'.5rem' }}>{c.icon}</div>
                <div style={{ fontWeight:700, color:'var(--text-main)', fontSize:'1rem' }}>{c.name}</div>
                {c.description && <div style={{ fontSize:'.78rem', color:'var(--text-muted)', marginTop:'.2rem' }}>{c.description}</div>}
                <div style={{ fontSize:'.75rem', color:'var(--text-muted)', marginTop:'.4rem' }}>{count} product{count !== 1 ? 's' : ''}</div>
                <div style={{ display:'flex', gap:'.5rem', marginTop:'1rem' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => startEdit(c)}>✏️ Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(c._id)}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Products Panel ────────────────────────────────────────────────────────────
function ProductsPanel({ shopId, categories, products, setProducts }) {
  const blank = { name:'', price:'', categoryId:'', description:'', inStock:true };
  const [form, setForm]   = useState(blank);
  const [editId, setEditId] = useState(null);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name || !form.price || !form.categoryId) return toast.error('Name, price, and category are required');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach(img => fd.append('images', img));

      if (editId) {
        const { data } = await updateProduct(editId, fd);
        setProducts(ps => ps.map(p => p._id === editId ? data.product : p));
        toast.success('Product updated');
        setEditId(null);
      } else {
        const { data } = await createProduct(fd);
        setProducts(ps => [data.product, ...ps]);
        toast.success('Product added');
      }
      setForm(blank);
      setImages([]);
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    setSaving(false);
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(ps => ps.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const startEdit = (p) => {
    setEditId(p._id);
    setForm({ name: p.name, price: p.price, categoryId: p.category?._id || p.category, description: p.description || '', inStock: p.inStock });
    setImages([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayed = filterCat ? products.filter(p => (p.category?._id || p.category) === filterCat) : products;

  return (
    <div>
      <h1 className="dash-title">Products</h1>

      {/* Form */}
      <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'1.5rem', marginBottom:'1.75rem' }}>
        <h3 style={{ fontWeight:700, marginBottom:'1rem', color:'var(--text-main)' }}>{editId ? '✏️ Edit Product' : '+ Add New Product'}</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Milan Sectional Sofa" />
          </div>
          <div className="form-group">
            <label className="form-label">Price (Rs) *</label>
            <input className="form-input" type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="85000" />
          </div>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select className="form-select" value={form.categoryId} onChange={e => set('categoryId', e.target.value)}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Availability</label>
            <select className="form-select" value={form.inStock ? 'true' : 'false'} onChange={e => set('inStock', e.target.value === 'true')}>
              <option value="true">✅ In Stock</option>
              <option value="false">❌ Sold Out</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn:'1 / -1' }}>
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the product — material, size, color options..." />
          </div>
          <div className="form-group" style={{ gridColumn:'1 / -1' }}>
            <label className="form-label">Product Images (up to 5)</label>
            <input type="file" accept="image/*" multiple onChange={e => setImages(Array.from(e.target.files))}
              style={{ padding:'.6rem', border:'1.5px dashed var(--border)', borderRadius:'var(--radius-sm)', background:'var(--cream-mid)', width:'100%', cursor:'pointer' }} />
            {images.length > 0 && <div style={{ fontSize:'.78rem', color:'var(--green)', marginTop:'.3rem' }}>✓ {images.length} image(s) selected</div>}
          </div>
        </div>
        <div style={{ display:'flex', gap:'.75rem', marginTop:'1rem' }}>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? '⏳ Saving...' : editId ? 'Update Product' : '+ Add Product'}</button>
          {editId && <button className="btn btn-outline" onClick={() => { setEditId(null); setForm(blank); setImages([]); }}>Cancel</button>}
        </div>
      </div>

      {/* Filter */}
      {categories.length > 0 && (
        <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
          <CatPill active={filterCat === ''} onClick={() => setFilterCat('')} label="All" />
          {categories.map(c => <CatPill key={c._id} active={filterCat === c._id} onClick={() => setFilterCat(c._id)} label={`${c.icon} ${c.name}`} />)}
        </div>
      )}

      {/* Product grid */}
      {displayed.length === 0 ? (
        <div className="empty-state"><div className="icon">🛋️</div><h3>No products</h3><p>Add your first product above</p></div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'1rem' }}>
          {displayed.map(p => (
            <div key={p._id} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', overflow:'hidden' }}>
              <div style={{ height:120, background:'linear-gradient(135deg, var(--cream-mid), var(--cream-dark))', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                {p.images?.[0]
                  ? <img src={`http://localhost:5000${p.images[0]}`} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <span style={{ fontSize:'3rem' }}>🛋️</span>}
              </div>
              <div style={{ padding:'.9rem' }}>
                <div style={{ fontWeight:700, fontSize:'.9rem', color:'var(--text-main)' }}>{p.name}</div>
                <div style={{ fontSize:'.75rem', color:'var(--text-muted)', marginTop:'.15rem' }}>{p.category?.icon} {p.category?.name}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'.6rem' }}>
                  <span className="serif" style={{ fontWeight:700, color:'var(--brown-mid)' }}>Rs {p.price.toLocaleString()}</span>
                  <span className={`badge ${p.inStock ? 'badge-green' : 'badge-red'}`} style={{ fontSize:'.65rem' }}>{p.inStock ? 'In Stock' : 'Sold Out'}</span>
                </div>
                <div style={{ display:'flex', gap:'.5rem', marginTop:'.75rem' }}>
                  <button className="btn btn-outline btn-sm" style={{ flex:1 }} onClick={() => startEdit(p)}>✏️ Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(p._id)}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CatPill({ active, onClick, label }) {
  return (
    <button onClick={onClick} style={{
      padding:'.4rem .9rem', border: active ? 'none' : '1.5px solid var(--border)',
      borderRadius:30, background: active ? 'var(--brown-dark)' : '#fff',
      color: active ? '#f5e6d3' : 'var(--text-mid)', fontWeight:600, fontSize:'.78rem',
    }}>
      {label}
    </button>
  );
}

// ── Shop Profile Panel ────────────────────────────────────────────────────────
function ProfilePanel({ shop, setShop, setAuthShop }) {
  const [form, setForm] = useState({
    shopName:     shop?.shopName     || '',
    shopNumber:   shop?.shopNumber   || '',
    shopCity:     shop?.shopCity     || '',
    shopAddress:  shop?.shopAddress  || '',
    shopLocation: shop?.shopLocation || '',
    shopTimings:  shop?.shopTimings  || '',
    tagline:      shop?.tagline      || '',
  });
  const [logo, setLogo]     = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (logo) fd.append('shopLogo', logo);
      const { data } = await updateMyShop(fd);
      setShop(data.shop);
      setAuthShop(data.shop);
      toast.success('Shop profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="dash-title">Shop Profile</h1>
      <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'1.75rem' }}>

        {/* Current logo */}
        <div style={{ display:'flex', alignItems:'center', gap:'1.25rem', marginBottom:'1.5rem', padding:'1rem', background:'var(--cream-mid)', borderRadius:'var(--radius-sm)' }}>
          <div style={{ width:72, height:72, borderRadius:16, overflow:'hidden', background:'var(--cream-dark)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            {shop?.shopLogo
              ? <img src={`http://localhost:5000${shop.shopLogo}`} alt="logo" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : <span style={{ fontSize:'2rem' }}>🛋️</span>
            }
          </div>
          <div>
            <div style={{ fontWeight:700, color:'var(--text-main)', marginBottom:'.4rem' }}>Shop Logo</div>
            <input type="file" accept="image/*" onChange={e => setLogo(e.target.files[0])}
              style={{ fontSize:'.8rem', cursor:'pointer' }} />
            {logo && <div style={{ fontSize:'.75rem', color:'var(--green)', marginTop:'.25rem' }}>✓ {logo.name} selected</div>}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.85rem' }}>
          {[
            ['shopName',     'Shop Name',           ''],
            ['shopNumber',   'Shop Phone Number',   '+92-300-0000000'],
            ['shopCity',     'Shop City',           ''],
            ['shopLocation', 'Shop Location / Area',''],
          ].map(([key, label, ph]) => (
            <div key={key} className="form-group">
              <label className="form-label">{label}</label>
              <input className="form-input" value={form[key]} onChange={e => set(key, e.target.value)} placeholder={ph} />
            </div>
          ))}
          <div className="form-group" style={{ gridColumn:'1 / -1' }}>
            <label className="form-label">Shop Address</label>
            <input className="form-input" value={form.shopAddress} onChange={e => set('shopAddress', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Shop Timings</label>
            <input className="form-input" value={form.shopTimings} onChange={e => set('shopTimings', e.target.value)} placeholder="10:00 AM – 9:00 PM" />
          </div>
          <div className="form-group">
            <label className="form-label">Tagline</label>
            <input className="form-input" value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Your shop's motto..." />
          </div>
        </div>

        <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving} style={{ marginTop:'1.25rem' }}>
          {saving ? '⏳ Saving...' : '💾 Save Changes'}
        </button>
      </div>
    </div>
  );
}
