import React, { useState } from 'react';
import GeolocationButton from './GeolocationButton';
import './SearchBar.css';

const SearchBar = ({ onSearch, loading, geoLoading, onLocationFound }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter city name..."
          className="search-input"
          disabled={loading}
          aria-label="Enter city name to search for weather"
        />
        <button 
          type="submit" 
          className="search-button"
          disabled={loading || !searchTerm.trim()}
          aria-label="Search for weather"
        >
          {loading ? (
            <>
              <span className="loading-spinner" aria-hidden="true"></span>
              <span aria-live="polite">Searching...</span>
            </>
          ) : (
            'Search'
          )}
        </button>
        <GeolocationButton 
          onLocationFound={onLocationFound} 
          loading={geoLoading} 
        />
      </form>
    </div>
  );
};

export default React.memo(SearchBar);