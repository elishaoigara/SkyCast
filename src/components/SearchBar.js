import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, loading }) {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      setCity('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-4">
      <div className="input-group shadow-sm search-bar-container">
        <input
          type="text"
          className="form-control bg-primary text-white border-0 py-2 px-4"
          placeholder="🔍 Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-info text-white px-4"
          disabled={loading}
        >
          {loading ? (
            <span
              className="spinner-border spinner-border-sm text-white"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            'Go'
          )}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
