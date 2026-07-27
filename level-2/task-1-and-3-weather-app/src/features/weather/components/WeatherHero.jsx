// src/features/weather/components/WeatherHero.jsx
import React, { useEffect, useState } from 'react';
import { getWeather } from '../../../shared/services/api';
import './weatherHero.css';

export default function WeatherHero({ location }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;

    setLoading(true);
    setError(null);

    getWeather(location.lat, location.lon)
      .then((data) => setWeather(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [location]);

  if (loading) return <div className="hero-status">Loading weather...</div>;
  if (error) return <div className="hero-status error">{error}</div>;
  if (!weather) return null;

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
          {/* Placeholder for weather icon (lucide-react or custom SVG) */}
          <span role="img" aria-label="condition">
            ☀️
          </span>
        </div>
      </div>

      <div className="hero-meta flex-between">
        <div className="container">
          <span className="meta-label">WIND</span>
          <span className="meta-value"> {current.windspeed} km/h</span>
        </div>
        <div className="container">
          <span className="meta-label">CODE</span>
          <span className="meta-value"> {current.weathercode}</span>
        </div>
      </div>
    </section>
  );
}
