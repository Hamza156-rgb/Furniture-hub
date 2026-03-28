import { useState } from 'react';
import { Heart, Eye, Star, Store, Tag, Phone, MessageCircle } from 'lucide-react';

export default function ProductCard({ product, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const img = product.images?.[0];

  const handleCardClick = () => {
    if (onClick) onClick();
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    console.log('Quick view for product:', product._id);
  };

  const handleContactShop = (e) => {
    e.stopPropagation();
    console.log('Contact shop for product:', product._id);
  };

  const discountPercentage = product.originalPrice && product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      className={`group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${
        isHovered ? 'transform -translate-y-1' : ''
      }`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quick Actions */}
      <div className={`absolute top-2 right-2 z-10 flex flex-col gap-2 transition-all duration-300 ${
        isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
      }`}>
        <button
          onClick={handleLikeClick}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
        >
          <Heart 
            className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
        <button
          onClick={handleQuickView}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
        >
          <Eye className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-red-500 text-white text-xs font-bold rounded-full">
            -{discountPercentage}%
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-40 bg-gradient-to-br from-cream-mid to-cream-dark overflow-hidden">
        {img ? (
          <img 
            src={`http://localhost:5000${img}`} 
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-4xl opacity-50">🛋️</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Product Info */}
      <div className="p-3">
        {/* Category */}
        {product.category && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
              {product.category.icon} {product.category.name}
            </span>
          </div>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-text-main text-sm mb-1 line-clamp-2 group-hover:text-brown-dark transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-text-muted mb-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Shop Info */}
        {product.shop?.shopName && (
          <div className="flex items-center gap-1 text-xs text-text-muted mb-2">
            <Store className="w-3 h-3" />
            <span>{product.shop.shopName}</span>
          </div>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-text-muted">
              {product.rating.toFixed(1)}
              {product.reviewCount && ` (${product.reviewCount})`}
            </span>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="font-serif text-brown-mid font-bold text-sm">
              Rs {product.price.toLocaleString()}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-xs text-text-muted line-through">
                Rs {product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {/* Stock Status */}
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              product.inStock 
                ? 'bg-green/10 text-green border border-green/20' 
                : 'bg-red/10 text-red border border-red/20'
            }`}>
              {product.inStock ? '✓' : '✗'} 
              <span className="hidden sm:inline">
                {product.inStock ? 'In Stock' : 'Sold Out'}
              </span>
            </span>

            {/* Contact Shop */}
            {product.inStock && (
              <button
                onClick={handleContactShop}
                className="p-1.5 rounded-md bg-cream-mid text-text-mid hover:bg-brown-mid hover:text-white transition-colors"
                title="Contact Shop"
              >
                <MessageCircle className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-cream text-text-muted text-xs rounded"
              >
                <Tag className="w-2 h-2" />
                {tag}
              </span>
            ))}
            {product.tags.length > 2 && (
              <span className="text-xs text-text-muted">
                +{product.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}></div>
    </div>
  );
}
