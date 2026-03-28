import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Clock, Heart, Eye, MessageCircle, Mail, Globe, ExternalLink } from 'lucide-react';
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

        {/* Social Media & Contact Links */}
        <div className="space-y-2 mb-3">
          {/* Social Media Icons */}
          <div className="flex items-center gap-2">
            {shop.socialMedia?.facebook && (
              <a 
                href={shop.socialMedia.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                title="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}
            {shop.socialMedia?.instagram && (
              <a 
                href={shop.socialMedia.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 bg-pink-50 text-pink-600 rounded-md hover:bg-pink-100 transition-colors"
                title="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}
            {shop.socialMedia?.tiktok && (
              <a 
                href={shop.socialMedia.tiktok} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                title="TikTok"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.32 1.35 2.51 2.71 2.6 1.17.05 2.36-.68 2.96-1.69.32-.59.44-1.28.42-1.94-.04-3.62.01-7.23-.02-10.85z"/>
                </svg>
              </a>
            )}
            {shop.contactInfo?.email && (
              <a 
                href={`mailto:${shop.contactInfo.email}`} 
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
            {shop.contactInfo?.whatsapp && (
              <a 
                href={`https://wa.me/${shop.contactInfo.whatsapp.replace(/[^\d]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

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
