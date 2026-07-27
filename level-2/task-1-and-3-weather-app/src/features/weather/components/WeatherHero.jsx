import React from 'react';
import './weatherHero.css';

export default function WeatherHero({ location, weather }) {
  if (!location || !weather) return null;

  const { current } = weather;

  return (
    <section className="weather-hero card">
      <div className="hero-header flex-between">
        <h2 className="hero-location">
          {location.name}, <span className="hero-country">{location.country}</span>
        </h2>
        <span className="hero-time">Now</span>
      </div>

      <div className="hero-main flex-between">
        <div className="hero-temp">
          <span className="temp-value">{current.temperature}</span>
          <span className="temp-unit">°C</span>
        </div>
        <div className="hero-icon">
          <span role="img" aria-label="condition">
            ☀️
          </span>
        </div>
      </div>

      <div className="hero-meta flex-between">
        <div>
          <span className="meta-label">WIND</span>
          <span className="meta-value">{current.windspeed} km/h</span>
        </div>
        <div>
          <span className="meta-label">CODE</span>
          <span className="meta-value">{current.weathercode}</span>
        </div>
      </div>
    </section>
  );
}
