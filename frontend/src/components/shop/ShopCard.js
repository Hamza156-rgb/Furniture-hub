import { useNavigate } from 'react-router-dom';

export default function ShopCard({ shop }) {
  const navigate = useNavigate();

  return (
    <div className="card" onClick={() => navigate(`/shop/${shop._id}`)} style={{ cursor: 'pointer' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--brown-dark), var(--brown-mid))',
        padding: '1.25rem',
        display: 'flex', alignItems: 'center', gap: '1rem',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, overflow: 'hidden',
          background: 'rgba(196,149,106,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {shop.shopLogo ? (
            <img src={`http://localhost:5000${shop.shopLogo}`} alt={shop.shopName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '1.8rem' }}>🛋️</span>
          )}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div className="serif" style={{ color: '#f5e6d3', fontWeight: 700, fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {shop.shopName}
          </div>
          <div style={{ color: 'var(--gold)', fontSize: '0.75rem', marginTop: '0.1rem' }}>
            📍 {shop.shopCity} · {shop.shopLocation}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1rem' }}>
        {shop.tagline && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '0.75rem' }}>
            "{shop.tagline}"
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ color: '#f59e0b' }}>⭐</span>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
              {shop.rating > 0 ? shop.rating.toFixed(1) : 'New'}
            </span>
            {shop.reviewCount > 0 && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>({shop.reviewCount})</span>
            )}
          </div>
          <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
            🕐 {shop.shopTimings}
          </span>
        </div>

        {/* Categories */}
        {shop.categories?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {shop.categories.slice(0, 3).map(c => (
              <span key={c._id} style={{
                background: 'var(--cream-mid)', color: 'var(--text-mid)',
                fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.55rem', borderRadius: 6,
              }}>
                {c.icon} {c.name}
              </span>
            ))}
            {shop.categories.length > 3 && (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{shop.categories.length - 3} more</span>
            )}
          </div>
        )}

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
          📞 {shop.shopNumber}
        </div>
      </div>
    </div>
  );
}
