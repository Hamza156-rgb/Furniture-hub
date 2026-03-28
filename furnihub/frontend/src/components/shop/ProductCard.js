export default function ProductCard({ product, onClick }) {
  const img = product.images?.[0];

  return (
    <div className="card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{
        height: 140,
        background: img ? 'none' : 'linear-gradient(135deg, var(--cream-mid), var(--cream-dark))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {img ? (
          <img src={`http://localhost:5000${img}`} alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '3.5rem' }}>🛋️</span>
        )}
      </div>
      <div style={{ padding: '0.9rem' }}>
        {product.category && (
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {product.category.icon} {product.category.name}
          </span>
        )}
        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem', marginTop: '0.2rem', lineHeight: 1.3 }}>
          {product.name}
        </div>
        {product.description && (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', lineHeight: 1.4,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {product.description}
          </div>
        )}
        {product.shop?.shopName && (
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            🏪 {product.shop.shopName}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.65rem' }}>
          <div className="serif" style={{ color: 'var(--brown-mid)', fontWeight: 700, fontSize: '1rem' }}>
            Rs {product.price.toLocaleString()}
          </div>
          <span className={`badge ${product.inStock ? 'badge-green' : 'badge-red'}`}>
            {product.inStock ? '✓ In Stock' : 'Sold Out'}
          </span>
        </div>
      </div>
    </div>
  );
}
