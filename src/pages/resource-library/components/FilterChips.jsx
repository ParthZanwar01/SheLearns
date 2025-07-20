import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ activeFilters, onFilterChange, onClearAll }) => {
  const filterCategories = [
    {
      key: 'category',
      label: 'Category',
      options: [
        { value: 'finance', label: 'Finance', icon: 'DollarSign' },
        { value: 'marketing', label: 'Marketing', icon: 'Megaphone' },
        { value: 'entrepreneurship', label: 'Entrepreneurship', icon: 'Lightbulb' },
        { value: 'digital-literacy', label: 'Digital Literacy', icon: 'Smartphone' }
      ]
    },
    {
      key: 'type',
      label: 'Content Type',
      options: [
        { value: 'video', label: 'Video', icon: 'Play' },
        { value: 'pdf', label: 'PDF', icon: 'FileText' },
        { value: 'audio', label: 'Audio', icon: 'Headphones' },
        { value: 'interactive', label: 'Interactive', icon: 'MousePointer' }
      ]
    },
    {
      key: 'difficulty',
      label: 'Difficulty',
      options: [
        { value: 'beginner', label: 'Beginner', icon: 'Star' },
        { value: 'intermediate', label: 'Intermediate', icon: 'TrendingUp' },
        { value: 'advanced', label: 'Advanced', icon: 'Award' }
      ]
    },
    {
      key: 'language',
      label: 'Language',
      options: [
        { value: 'english', label: 'English', icon: 'Globe' },
        { value: 'spanish', label: 'Spanish', icon: 'Globe' },
        { value: 'french', label: 'French', icon: 'Globe' },
        { value: 'hindi', label: 'Hindi', icon: 'Globe' }
      ]
    }
  ];

  const handleFilterToggle = (category, value) => {
    const currentFilters = activeFilters[category] || [];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(f => f !== value)
      : [...currentFilters, value];
    
    onFilterChange(category, newFilters);
  };

  const getTotalActiveFilters = () => {
    return Object.values(activeFilters).reduce((total, filters) => total + filters.length, 0);
  };

  return (
    <div className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-semibold text-sm text-foreground">
          Filters
        </h3>
        {getTotalActiveFilters() > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-primary hover:text-primary/80 font-medium transition-micro"
          >
            Clear All ({getTotalActiveFilters()})
          </button>
        )}
      </div>

      <div className="space-y-3">
        {filterCategories.map((category) => (
          <div key={category.key}>
            <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              {category.label}
            </h4>
            <div className="flex flex-wrap gap-2">
              {category.options.map((option) => {
                const isActive = activeFilters[category.key]?.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleFilterToggle(category.key, option.value)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium transition-micro ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                    }`}
                  >
                    <Icon name={option.icon} size={12} />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterChips;