import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Clock, Heart, Eye } from 'lucide-react';
import { useState } from 'react';

export default function ShopCard({ shop }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleCardClick = () => {
    navigate(`/shop/${shop._id}`);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    // Quick view functionality can be implemented here
    console.log('Quick view for shop:', shop._id);
  };

  return (
    <div 
      className={`group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${
        isHovered ? 'transform -translate-y-1' : ''
      }`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quick Actions */}
      <div className={`absolute top-3 right-3 z-10 flex gap-2 transition-all duration-300 ${
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

      {/* Header */}
      <div className="relative bg-gradient-to-br from-brown-dark to-brown-mid p-4">
        {/* Verified Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green/20 backdrop-blur-sm rounded-full text-xs font-medium text-green border border-green/30">
            ✓ Verified
          </span>
        </div>

        <div className="flex items-center gap-3 pt-6">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gold/20 flex items-center justify-center flex-shrink-0 ring-2 ring-white/20">
              {shop.shopLogo ? (
                <img 
                  src={`http://localhost:5000${shop.shopLogo}`} 
                  alt={shop.shopName}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="text-2xl">🛋️</span>
              )}
            </div>
            {/* Online Status */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-cream font-bold text-lg truncate group-hover:text-gold transition-colors">
              {shop.shopName}
            </h3>
            <div className="flex items-center gap-2 text-gold-light text-sm mt-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{shop.shopCity} · {shop.shopLocation}</span>
            </div>
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-cream">
              {shop.rating > 0 ? shop.rating.toFixed(1) : 'New'}
            </span>
            {shop.reviewCount > 0 && (
              <span className="text-xs text-cream/70">({shop.reviewCount})</span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Tagline */}
        {shop.tagline && (
          <p className="text-sm text-text-muted italic mb-3 line-clamp-2">
            "{shop.tagline}"
          </p>
        )}

        {/* Shop Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-text-mid">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{shop.shopTimings}</span>
            </div>
          </div>
          <div className="text-xs text-text-muted">
            {shop.categories?.length || 0} categories
          </div>
        </div>

        {/* Categories */}
        {shop.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {shop.categories.slice(0, 3).map((c, index) => (
              <span 
                key={c._id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-cream-mid text-text-mid text-xs font-medium rounded-md"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </span>
            ))}
            {shop.categories.length > 3 && (
              <span className="text-xs text-text-muted px-2 py-1">
                +{shop.categories.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Contact Info */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Phone className="w-4 h-4" />
            <span>{shop.shopNumber}</span>
          </div>
          <button className="text-xs font-medium text-brown-mid hover:text-brown-dark transition-colors">
            View Shop →
          </button>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}></div>
    </div>
  );
}
