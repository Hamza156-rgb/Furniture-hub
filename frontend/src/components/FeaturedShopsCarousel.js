import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, MapPin, Award } from 'lucide-react';
import ShopCard from './shop/ShopCard';

export default function FeaturedShopsCarousel({ shops, onScrollToTabContent }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Filter featured shops (top rated or randomly selected for demo)
  const featuredShops = shops
    ?.filter(shop => shop.rating >= 4.5 || Math.random() > 0.7)
    .slice(0, 8) || [];

  const shopsPerSlide = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    large: 4
  };

  const totalSlides = Math.ceil(featuredShops.length / shopsPerSlide.desktop);

  useEffect(() => {
    if (!isAutoPlaying || featuredShops.length <= shopsPerSlide.desktop) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides, featuredShops.length, shopsPerSlide.desktop]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setIsAutoPlaying(false);
  };

  const getVisibleShops = () => {
    const start = currentIndex * shopsPerSlide.desktop;
    const end = start + shopsPerSlide.desktop;
    return featuredShops.slice(start, end);
  };

  if (featuredShops.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 rounded-full mb-4">
            <Award className="w-4 h-4 text-gold" />
            <span className="text-sm font-semibold text-brown-dark">Featured Shops</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-text-main mb-3">
            Top Rated Furniture Shops
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Discover the most trusted and highly-rated furniture stores in Pakistan, 
            known for quality craftsmanship and exceptional customer service.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-brown-mid hover:bg-brown-mid hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="Previous shops"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-brown-mid hover:bg-brown-mid hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="Next shops"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Shops Grid */}
          <div className="overflow-hidden">
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`
              }}
            >
              {featuredShops.map((shop, index) => (
                <div
                  key={shop._id}
                  className="w-full flex-shrink-0"
                  style={{
                    opacity: index >= currentIndex * shopsPerSlide.desktop && 
                             index < (currentIndex + 1) * shopsPerSlide.desktop ? 1 : 0.3,
                    transform: index >= currentIndex * shopsPerSlide.desktop && 
                               index < (currentIndex + 1) * shopsPerSlide.desktop ? 'scale(1)' : 'scale(0.95)',
                    transition: 'all 0.5s ease-in-out'
                  }}
                >
                  <ShopCard shop={shop} />
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {totalSlides > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-8 bg-brown-mid' 
                      : 'bg-cream-dark hover:bg-gold'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Shops', value: featuredShops.length, icon: '🏪' },
            { label: 'Average Rating', value: '4.8★', icon: '⭐' },
            { label: 'Cities Covered', value: new Set(featuredShops.map(s => s.shopCity)).size, icon: '🏙️' },
            { label: 'Products Listed', value: '2.5K+', icon: '🛋️' },
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-xl font-serif font-bold text-text-main">{stat.value}</div>
              <div className="text-sm text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <button 
            onClick={() => {
              navigate('/?tab=shops');
              if (onScrollToTabContent) {
                onScrollToTabContent();
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brown-mid text-white rounded-lg font-semibold hover:bg-brown-dark transition-colors duration-200"
          >
            View All Shops
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
