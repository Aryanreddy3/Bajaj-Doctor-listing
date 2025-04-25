import React, { useState, useRef, useEffect } from 'react';

interface SearchHeaderProps {
  search: string;
  suggestions: string[];
  onSearchChange: (search: string) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  search,
  suggestions,
  onSearchChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    setIsOpen(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSearchChange(suggestion);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsOpen(false);
    }
  };

  return (
    <div className="search-header" ref={wrapperRef}>
      <div className="search-container">
        <input
          type="text"
          value={search}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search doctors..."
          data-testid="autocomplete-input"
          className="search-input"
        />
        {isOpen && suggestions.length > 0 && (
          <div className="suggestions-container">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
                data-testid="suggestion-item"
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHeader; 