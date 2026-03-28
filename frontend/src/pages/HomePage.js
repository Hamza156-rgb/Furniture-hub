import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturedShopsCarousel from '../components/FeaturedShopsCarousel';
import CategoryNavigation from '../components/CategoryNavigation';
import ShopCard from '../components/shop/ShopCard';
import ProductCard from '../components/shop/ProductCard';
import { getShops, getProducts, getCities } from '../utils/api';

const ICONS = ['🛋️','🛏️','🍽️','🪑','🌿','📦','🧸','🛁','🖥️','🏡'];

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tabContentRef = useRef(null);
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
  
  // Get tab from URL params or default to 'shops'
  const currentTab = searchParams.get('tab') || 'shops';

  // Update URL when tab changes
  const handleTabChange = (newTab) => {
    console.log('Tab clicked:', newTab, 'at', new Date());
    if (newTab === 'shops') {
      navigate('/');
    } else {
      navigate(`/?tab=${newTab}`);
    }
    
    // Scroll to tab content using ref
    setTimeout(() => {
      if (tabContentRef.current) {
        tabContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Function to scroll to tab content (for external components)
  const scrollToTabContent = () => {
    setTimeout(() => {
      if (tabContentRef.current) {
        tabContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Scroll to tab content on initial load and when URL tab changes
  useEffect(() => {
    // Only scroll if not on the home page without a tab (to show hero section)
    if (searchParams.get('tab') || search) {
      console.log('Auto-scroll triggered for tab:', currentTab, 'search:', search);
      setTimeout(() => {
        if (tabContentRef.current) {
          console.log('Scrolling to tab content');
          tabContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.log('Tab content ref not available');
        }
      }, 500); // Increased delay for shops content to load
    }
  }, [currentTab, search]);

  // Additional scroll when shops data loads (for shops tab)
  useEffect(() => {
    if (currentTab === 'shops' && shops.length > 0 && searchParams.get('tab') === 'shops') {
      console.log('Shops loaded, scrolling to content');
      setTimeout(() => {
        if (tabContentRef.current) {
          tabContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [shops, currentTab]);

  // Scroll when location changes (covers Navbar clicks)
  useEffect(() => {
    console.log('Location changed:', location.pathname, location.search);
    const tab = searchParams.get('tab');
    if (tab === 'shops' || tab === 'products') {
      console.log('Scrolling due to location change to tab:', tab);
      setTimeout(() => {
        if (tabContentRef.current) {
          tabContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [location]);

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

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    // Scroll to tab content when searching
    setTimeout(() => {
      if (tabContentRef.current) {
        tabContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    // Scroll to tab content when city changes
    setTimeout(() => {
      if (tabContentRef.current) {
        tabContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div>
      <Navbar />
      
      {/* Enhanced Hero Section */}
      <HeroSection 
        onSearch={handleSearch}
        cities={cities}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
      />

      {/* Featured Shops Carousel */}
      {!search && selectedCity === 'all' && (
        <FeaturedShopsCarousel shops={shops} onScrollToTabContent={scrollToTabContent} />
      )}

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div ref={tabContentRef} className="container" style={{ paddingTop:'2.5rem', paddingBottom:'3rem' }}>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'.5rem', marginBottom:'2rem', background:'var(--cream-mid)', borderRadius:30, padding:'.25rem', width:'fit-content' }}>
          {[['shops','🏪 Shops'], ['products','🛋️ Products']].map(([key, label]) => (
            <button key={key} onClick={() => handleTabChange(key)} style={{
              padding:'.55rem 1.4rem', border:'none', borderRadius:30,
              background: currentTab === key ? 'var(--brown-dark)' : 'transparent',
              color: currentTab === key ? '#f5e6d3' : 'var(--text-muted)',
              fontWeight: currentTab === key ? 700 : 500, fontSize:'.88rem',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── SHOPS TAB ─────────────────────────────────────────────────── */}
        {currentTab === 'shops' && (
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
        {currentTab === 'products' && (
          <div>
            {/* Enhanced Category Navigation */}
            <CategoryNavigation 
              categories={allCatNames.map(name => ({ name, count: products.filter(p => p.category?.name === name).length }))}
              selectedCategory={activeCat}
              onCategorySelect={setActiveCat}
            />

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
