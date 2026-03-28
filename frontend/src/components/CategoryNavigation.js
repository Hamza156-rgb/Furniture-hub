import { useState } from 'react';
import { ChevronDown, Grid3X3, Sofa, Bed, Utensils, Armchair, Lamp, Package, Baby, Bath, Monitor, Home } from 'lucide-react';

const categoryIcons = {
  'Sofas': Sofa,
  'Beds': Bed,
  'Dining': Utensils,
  'Chairs': Armchair,
  'Lighting': Lamp,
  'Storage': Package,
  'Kids': Baby,
  'Bathroom': Bath,
  'Office': Monitor,
  'Outdoor': Home,
  'Living Room': Grid3X3,
  'Bedroom': Bed,
  'Kitchen': Utensils,
};

const categoryEmojis = {
  'Sofas': '🛋️',
  'Beds': '🛏️',
  'Dining': '🍽️',
  'Chairs': '🪑',
  'Lighting': '💡',
  'Storage': '📦',
  'Kids': '🧸',
  'Bathroom': '🛁',
  'Office': '🖥️',
  'Outdoor': '🌿',
  'Living Room': '🛋️',
  'Bedroom': '🛏️',
  'Kitchen': '🍽️',
  'Decor': '🏺',
  'Tables': '🪑',
  'Wardrobes': '🚪',
};

export default function CategoryNavigation({ categories, selectedCategory, onCategorySelect, showAll = true }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Default categories if none provided
  const defaultCategories = [
    { name: 'Living Room', icon: '🛋️', count: 2450 },
    { name: 'Bedroom', icon: '🛏️', count: 1820 },
    { name: 'Dining', icon: '🍽️', count: 1230 },
    { name: 'Chairs', icon: '🪑', count: 3100 },
    { name: 'Storage', icon: '📦', count: 1500 },
    { name: 'Office', icon: '🖥️', count: 890 },
    { name: 'Lighting', icon: '💡', count: 650 },
    { name: 'Decor', icon: '🏺', count: 420 },
    { name: 'Outdoor', icon: '🌿', count: 340 },
    { name: 'Kids', icon: '🧸', count: 280 },
  ];

  const displayCategories = categories?.length > 0 ? categories : defaultCategories;
  const visibleCategories = isExpanded ? displayCategories : displayCategories.slice(0, 8);
  
  const IconComponent = ({ categoryName }) => {
    const Icon = categoryIcons[categoryName];
    const emoji = categoryEmojis[categoryName];
    
    if (Icon) {
      return <Icon className="w-5 h-5" />;
    }
    return <span className="text-lg">{emoji || '📦'}</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
            <Grid3X3 className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-text-main">Browse Categories</h3>
            <p className="text-sm text-text-muted">Find exactly what you're looking for</p>
          </div>
        </div>
        
        {displayCategories.length > 8 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brown-mid hover:text-brown-dark transition-colors"
          >
            {isExpanded ? 'Show Less' : `Show All (${displayCategories.length})`}
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* All Categories Option */}
        {showAll && (
          <button
            onClick={() => onCategorySelect?.('')}
            className={`group relative p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedCategory === '' || !selectedCategory
                ? 'border-brown-mid bg-brown-mid/10 shadow-md'
                : 'border-border hover:border-gold hover:bg-cream-mid'
            }`}
            onMouseEnter={() => setHoveredCategory('all')}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                selectedCategory === '' || !selectedCategory
                  ? 'bg-brown-mid text-white'
                  : 'bg-cream text-brown-mid group-hover:bg-gold group-hover:text-white'
              }`}>
                <Grid3X3 className="w-6 h-6" />
              </div>
              <span className={`text-sm font-medium text-center ${
                selectedCategory === '' || !selectedCategory
                  ? 'text-brown-mid'
                  : 'text-text-main group-hover:text-brown-mid'
              }`}>
                All Items
              </span>
              <span className="text-xs text-text-muted">
                {displayCategories.reduce((sum, cat) => sum + (cat.count || 0), 0).toLocaleString()}+
              </span>
            </div>
            
            {/* Hover Effect */}
            {hoveredCategory === 'all' && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-brown-mid/10 to-transparent pointer-events-none"></div>
            )}
          </button>
        )}

        {/* Category Items */}
        {visibleCategories.map((category, index) => (
          <button
            key={category.name || category}
            onClick={() => onCategorySelect?.(category.name || category)}
            className={`group relative p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedCategory === (category.name || category)
                ? 'border-brown-mid bg-brown-mid/10 shadow-md'
                : 'border-border hover:border-gold hover:bg-cream-mid'
            }`}
            onMouseEnter={() => setHoveredCategory(category.name || category)}
            onMouseLeave={() => setHoveredCategory(null)}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                selectedCategory === (category.name || category)
                  ? 'bg-brown-mid text-white shadow-lg scale-105'
                  : 'bg-cream text-brown-mid group-hover:bg-gold group-hover:text-white group-hover:scale-105'
              }`}>
                <IconComponent categoryName={category.name || category} />
              </div>
              <span className={`text-sm font-medium text-center transition-colors ${
                selectedCategory === (category.name || category)
                  ? 'text-brown-mid'
                  : 'text-text-main group-hover:text-brown-mid'
              }`}>
                {category.name || category}
              </span>
              {category.count && (
                <span className="text-xs text-text-muted">
                  {category.count.toLocaleString()} items
                </span>
              )}
            </div>
            
            {/* Hover Effect */}
            {hoveredCategory === (category.name || category) && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-gold/10 to-transparent pointer-events-none"></div>
            )}
            
            {/* Animated Border */}
            {(selectedCategory === (category.name || category) || hoveredCategory === (category.name || category)) && (
              <div className="absolute inset-0 rounded-xl border-2 border-gold opacity-50 animate-pulse"></div>
            )}
          </button>
        ))}
      </div>

      {/* Popular Searches */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-text-muted">Popular:</span>
          <div className="flex flex-wrap gap-2">
            {['Modern Sofa', 'Wooden Bed', 'Dining Table', 'Office Chair'].map((term, index) => (
              <button
                key={term}
                onClick={() => onCategorySelect?.(term)}
                className="px-3 py-1 text-xs bg-cream-mid text-text-mid rounded-full hover:bg-gold hover:text-white transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
