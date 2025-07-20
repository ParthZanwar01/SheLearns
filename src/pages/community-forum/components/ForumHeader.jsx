import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ForumHeader = ({ onSearch, onCategoryChange, onCreatePost, selectedCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: 'General Discussion' },
    { value: 'business-tips', label: 'Business Tips' },
    { value: 'success-stories', label: 'Success Stories' },
    { value: 'qa', label: 'Q&A' },
    { value: 'local-events', label: 'Local Events' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 2) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="bg-card border-b border-border sticky top-16 z-50">
      <div className="px-4 py-4">
        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-heading font-semibold text-foreground">
              Community Forum
            </h1>
            <Button
              variant="default"
              size="sm"
              iconName="Plus"
              onClick={onCreatePost}
            >
              Post
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              {isSearchExpanded ? (
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Input
                    type="search"
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchExpanded(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </form>
              ) : (
                <Select
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={onCategoryChange}
                  placeholder="Select category"
                />
              )}
            </div>
            
            {!isSearchExpanded && (
              <Button
                variant="ghost"
                size="icon"
                iconName="Search"
                onClick={() => setIsSearchExpanded(true)}
              />
            )}
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-heading font-semibold text-foreground">
                Community Forum
              </h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Users" size={16} />
                <span>2,847 members</span>
              </div>
            </div>
            
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={onCreatePost}
            >
              Create Post
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  type="search"
                  placeholder="Search discussions, topics, or members..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
                <Icon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </form>
            </div>
            
            <Select
              options={categoryOptions}
              value={selectedCategory}
              onChange={onCategoryChange}
              placeholder="All Categories"
              className="w-48"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumHeader;