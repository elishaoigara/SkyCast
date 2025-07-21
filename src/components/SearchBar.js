import React, { useState } from 'react';

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
      <div className="input-group">
        <input
          type="text"
          className="form-control bg-dark text-white border-secondary"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-outline-light"
          disabled={loading}
        >
          {loading ? (
            <span
              className="spinner-border spinner-border-sm text-light"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <i className="bi bi-search"></i>
          )}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
