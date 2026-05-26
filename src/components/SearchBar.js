import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';
import GeolocationButton from './GeolocationButton';
import './SearchBar.css';

const SearchBar = ({ onSearch, loading, geoLoading, onLocationFound }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { searchHistory, clearHistory } = useWeather();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await onSearch(searchTerm.trim());
      setSearchTerm('');
      setIsFocused(false);
    }
  };

  const handleHistoryClick = async (city) => {
    await onSearch(city);
    setSearchTerm('');
    setIsFocused(false);
  };

  const showHistory = searchHistory.length > 0 && (isFocused || searchTerm === '');

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
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

      <AnimatePresence>
        {showHistory && (
          <motion.div
            className="search-history-container"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="search-history-header">
              <span className="search-history-label">Recent Searches</span>
              <button
                className="clear-history-btn"
                onClick={clearHistory}
                type="button"
                aria-label="Clear search history"
              >
                Clear History
              </button>
            </div>
            <div className="search-history-chips">
              {searchHistory.map((item, index) => (
                <motion.button
                  key={`${item}-${index}`}
                  className="history-chip"
                  onClick={() => handleHistoryClick(item)}
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(SearchBar);