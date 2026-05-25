import React, { useState } from 'react';
import GeolocationButton from './GeolocationButton';
import './SearchBar.css';

function SearchBar({ onSearch, loading, geoLoading, onLocationFound }) {
  const [city, setCity] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      setCity('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-4">
      <div className={`input-group shadow-sm search-bar-container ${isFocused ? 'search-bar-focused' : ''}`}>
        <input
          type="text"
          className={`form-control bg-primary text-white border-0 py-2 px-4 ${isFocused ? 'search-input-focused' : ''}`}
          placeholder="🔍 Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={loading || geoLoading}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="Search for a city"
        />
        <button
          type="submit"
          className={`btn btn-info text-white px-4 ${isFocused ? 'search-btn-focused' : ''}`}
          disabled={loading || geoLoading || !city.trim()}
          aria-label="Search"
        >
          {loading ? (
            <span className="custom-spinner" role="status" aria-hidden="true"></span>
          ) : (
            'Go'
          )}
        </button>
        <GeolocationButton 
          onLocationFound={onLocationFound} 
          loading={geoLoading}
        />
      </div>
    </form>
  );
}

export default SearchBar;
