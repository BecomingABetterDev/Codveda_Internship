// src/features/weather/components/HourlyCarousel.jsx
import React from 'react';
import './hourlyCarousel.css';

export default function HourlyCarousel({ weather }) {
  if (!weather || !weather.hourly) return null;

  const { time, temperature_2m, relative_humidity_2m, windspeed_10m } = weather.hourly;

  // Limit to next 12 hours
  const currentIndex = time.indexOf(weather.current.time.split(':', 1) + ':00');
  const hours = time.slice(currentIndex, currentIndex + 12);
  return (
    <section className="hourly-carousel">
      <h3 className="carousel-title">Next Hours</h3>
      <div className="carousel-track">
        {hours.map((t, i) => (
          <div key={t} className="hour-card">
            <span className="hour-time">
              {new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="hour-temp">{temperature_2m[i]}°</span>
            <span className="hour-meta">💧 {relative_humidity_2m[i]}%</span>
            <span className="hour-meta"> {windspeed_10m[i]} km/h</span>
          </div>
        ))}
      </div>
    </section>
  );
}
