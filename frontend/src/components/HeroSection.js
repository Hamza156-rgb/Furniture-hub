import { useState, useEffect } from 'react';
import { Search, MapPin, Star, ArrowRight } from 'lucide-react';

export default function HeroSection({ onSearch, cities, selectedCity, onCityChange }) {
  const [searchInput, setSearchInput] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const popularCategories = [
    { name: 'Sofas', icon: '🛋️', count: '2.5k' },
    { name: 'Beds', icon: '🛏️', count: '1.8k' },
    { name: 'Dining', icon: '🍽️', count: '1.2k' },
    { name: 'Chairs', icon: '🪑', count: '3.1k' },
    { name: 'Decor', icon: '🌿', count: '890' },
    { name: 'Storage', icon: '📦', count: '1.5k' },
  ];

  const stats = [
    { label: 'Verified Shops', value: '500+', icon: '🏪' },
    { label: 'Products Listed', value: '50K+', icon: '🪑' },
    { label: 'Happy Customers', value: '25K+', icon: '😊' },
    { label: 'Cities Covered', value: '20+', icon: '🏙️' },
  ];

  return (
    <div className="relative bg-gradient-to-br from-brown-darkest via-brown-dark to-brown-mid overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-cream mb-6 animate-fade-in">
            Discover Pakistan's
            <span className="block text-gold">Finest Furniture</span>
          </h1>
          <p className="text-lg sm:text-xl text-cream-dark max-w-3xl mx-auto mb-8 animate-slide-up">
            Connect with trusted local furniture shops. Browse thousands of quality products 
            from verified sellers across Pakistan.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'transform scale-105' : ''}`}>
              <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden">
                <div className="flex items-center px-4 py-3 border-r border-border">
                  <MapPin className="w-5 h-5 text-text-muted" />
                  <select
                    value={selectedCity}
                    onChange={(e) => onCityChange(e.target.value)}
                    className="ml-2 bg-transparent border-none outline-none text-text-main font-medium focus:ring-0"
                  >
                    <option value="all">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search for shops, products, or categories..."
                  className="flex-1 px-4 py-3 outline-none text-text-main placeholder-text-muted"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-brown-mid to-brown-dark text-cream px-6 py-3 font-semibold hover:from-brown-dark hover:to-brown-darkest transition-all duration-200 flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button className="px-4 py-2 bg-cream-mid text-text-mid rounded-full text-sm font-medium hover:bg-cream-dark transition-colors">
              🛋️ Living Room
            </button>
            <button className="px-4 py-2 bg-cream-mid text-text-mid rounded-full text-sm font-medium hover:bg-cream-dark transition-colors">
              🛏️ Bedroom
            </button>
            <button className="px-4 py-2 bg-cream-mid text-text-mid rounded-full text-sm font-medium hover:bg-cream-dark transition-colors">
              🍽️ Dining Set
            </button>
            <button className="px-4 py-2 bg-cream-mid text-text-mid rounded-full text-sm font-medium hover:bg-cream-dark transition-colors">
              🏠 Office Furniture
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-serif font-bold text-cream">{stat.value}</div>
              <div className="text-sm text-cream-dark">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Popular Categories */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-xl font-serif font-semibold text-cream mb-4 text-center">
            Popular Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCategories.map((category, index) => (
              <button
                key={index}
                className="flex flex-col items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 group"
              >
                <div className="text-3xl mb-2 group-transform: scale-110 transition-transform">
                  {category.icon}
                </div>
                <div className="text-cream font-medium text-sm">{category.name}</div>
                <div className="text-cream-dark text-xs">{category.count} items</div>
              </button>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 bg-gold/20 backdrop-blur-sm rounded-full px-6 py-3 text-cream">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-medium">Join 25,000+ satisfied customers</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
