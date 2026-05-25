import React from 'react';
import './Skeleton.css';

export function WeatherCardSkeleton() {
  return (
    <div className="skeleton weather-card-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-subtitle"></div>
      </div>
      <div className="skeleton-body">
        <div className="skeleton-row">
          <div className="skeleton-icon"></div>
          <div className="skeleton-temp"></div>
        </div>
        <div className="skeleton-details">
          <div className="skeleton-line skeleton-detail"></div>
          <div className="skeleton-line skeleton-detail"></div>
          <div className="skeleton-line skeleton-detail"></div>
        </div>
      </div>
    </div>
  );
}

export function ForecastCardSkeleton() {
  return (
    <div className="skeleton forecast-card-skeleton">
      <div className="skeleton-line skeleton-date"></div>
      <div className="skeleton-icon-small"></div>
      <div className="skeleton-line skeleton-temp-small"></div>
      <div className="skeleton-line skeleton-temp-small"></div>
    </div>
  );
}

export function Skeleton({ variant = 'default', className = '' }) {
  const variants = {
    default: 'skeleton-line',
    circle: 'skeleton-circle',
    text: 'skeleton-text'
  };

  return <div className={`${variants[variant]} ${className}`}></div>;
}

export default Skeleton;
