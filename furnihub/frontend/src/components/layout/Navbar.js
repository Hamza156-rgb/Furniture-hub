import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 200,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div className="container" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <span style={{ fontSize: '1.5rem' }}>🪵</span>
          <span className="serif" style={{ fontSize: '1.4rem', color: 'var(--brown-dark)', fontWeight: 700 }}>FurniHub</span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!user ? (
            <>
              <Link to="/login">
                <button className="btn btn-outline btn-sm">Sign In</button>
              </Link>
              <Link to="/register">
                <button className="btn btn-primary btn-sm">List Your Shop</button>
              </Link>
            </>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'var(--cream-mid)', border: '1.5px solid var(--border)',
                  borderRadius: 30, padding: '0.4rem 1rem', cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>👤</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-mid)' }}>
                  {user.firstName}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>▼</span>
              </button>
              {menuOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: '#fff', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', minWidth: 180,
                  boxShadow: 'var(--shadow-md)', zIndex: 300, overflow: 'hidden',
                }}>
                  {user.role === 'owner' && (
                    <MenuItem icon="📊" label="Dashboard" to="/dashboard" close={() => setMenuOpen(false)} />
                  )}
                  <MenuItem icon="👤" label="My Profile" to="/profile" close={() => setMenuOpen(false)} />
                  <div style={{ borderTop: '1px solid var(--border)', margin: '0.25rem 0' }} />
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      width: '100%', padding: '0.65rem 1rem', border: 'none',
                      background: 'none', cursor: 'pointer', color: 'var(--red)',
                      fontSize: '0.85rem', fontWeight: 500,
                    }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function MenuItem({ icon, label, to, close }) {
  return (
    <Link to={to} onClick={close} style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.65rem 1rem', color: 'var(--text-mid)',
      fontSize: '0.85rem', fontWeight: 500, transition: 'background .15s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--cream-mid)'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      {icon} {label}
    </Link>
  );
}
