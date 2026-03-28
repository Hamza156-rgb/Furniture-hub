import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Menu, X, ChevronDown, Heart, User, LogOut, Settings, Store, Package } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Shops', path: '/?tab=shops', icon: '🏪' },
    { name: 'Products', path: '/?tab=products', icon: '🛋️' },
    { name: 'About', path: '/about', icon: '📖' },
    { name: 'Contact', path: '/contact', icon: '📞' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-border/50' 
          : 'bg-white shadow-sm border-b border-border'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-brown-mid to-brown-dark rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-lg">🪵</span>
              </div>
              <span className="font-serif text-xl font-bold text-brown-dark group-hover:text-brown-mid transition-colors">
                FurniHub
              </span>
              <span className="hidden sm:inline-block px-2 py-1 bg-gold/20 text-gold text-xs font-semibold rounded-full">
                PK
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path || 
                    (link.path.includes('?tab=') && location.search.includes(link.path.split('?tab=')[1]))
                      ? 'text-brown-mid bg-cream-mid'
                      : 'text-text-muted hover:text-brown-mid hover:bg-cream/50'
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search Button (Desktop) */}
              <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-cream-mid text-text-mid rounded-lg hover:bg-cream hover:text-brown-mid transition-colors">
                <Search className="w-4 h-4" />
                <span className="text-sm font-medium">Search</span>
              </button>

              {/* Wishlist (Desktop) */}
              {user && (
                <button className="hidden sm:flex items-center justify-center w-10 h-10 bg-cream-mid text-text-mid rounded-lg hover:bg-cream hover:text-brown-mid transition-colors relative">
                  <Heart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
              )}

              {/* User Menu */}
              {!user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login">
                    <button className="px-4 py-2 text-brown-mid hover:text-brown-dark font-medium text-sm transition-colors">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="px-4 py-2 bg-brown-mid text-white rounded-lg hover:bg-brown-dark font-medium text-sm transition-colors">
                      List Your Shop
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-3 px-3 py-2 bg-cream-mid rounded-lg hover:bg-cream transition-colors"
                  >
                    <div className="w-8 h-8 bg-brown-mid rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-text-main">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-text-muted capitalize">
                        {user.role === 'owner' ? 'Shop Owner' : 'Customer'}
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${
                      profileMenuOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Profile Dropdown */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-border overflow-hidden">
                      {user.role === 'owner' && (
                        <>
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-cream-mid transition-colors"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <Store className="w-5 h-5 text-brown-mid" />
                            <div>
                              <div className="text-sm font-medium text-text-main">Dashboard</div>
                              <div className="text-xs text-text-muted">Manage your shop</div>
                            </div>
                          </Link>
                          <Link
                            to="/products"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-cream-mid transition-colors"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <Package className="w-5 h-5 text-brown-mid" />
                            <div>
                              <div className="text-sm font-medium text-text-main">My Products</div>
                              <div className="text-xs text-text-muted">View and manage items</div>
                            </div>
                          </Link>
                        </>
                      )}
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-cream-mid transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <Settings className="w-5 h-5 text-brown-mid" />
                        <div>
                          <div className="text-sm font-medium text-text-main">Profile Settings</div>
                          <div className="text-xs text-text-muted">Account preferences</div>
                        </div>
                      </Link>
                      <div className="border-t border-border">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-red/10 transition-colors w-full text-left"
                        >
                          <LogOut className="w-5 h-5 text-red" />
                          <div>
                            <div className="text-sm font-medium text-red">Sign Out</div>
                            <div className="text-xs text-text-muted">Log out of your account</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 bg-cream-mid rounded-lg hover:bg-cream transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-border">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-brown-mid hover:bg-cream-mid transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-base">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ))}
              
              {!user ? (
                <div className="pt-3 border-t border-border space-y-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full px-4 py-2 text-brown-mid hover:text-brown-dark font-medium text-sm transition-colors text-left">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full px-4 py-2 bg-brown-mid text-white rounded-lg hover:bg-brown-dark font-medium text-sm transition-colors text-left">
                      List Your Shop
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="pt-3 border-t border-border space-y-1">
                  {user.role === 'owner' && (
                    <>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-brown-mid hover:bg-cream-mid transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Store className="w-5 h-5" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/products"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-brown-mid hover:bg-cream-mid transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Package className="w-5 h-5" />
                        <span>My Products</span>
                      </Link>
                    </>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-brown-mid hover:bg-cream-mid transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Profile Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red hover:bg-red/10 transition-colors w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}
