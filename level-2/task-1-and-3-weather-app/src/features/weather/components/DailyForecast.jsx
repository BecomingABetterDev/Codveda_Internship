// src/features/weather/components/DailyForecast.jsx
import React, { useState } from 'react';
import './dailyForecast.css';

export default function DailyForecast({ weather }) {
  if (!weather || !weather.daily) return null;

  const { time, temperature_2m_max, temperature_2m_min, uv_index_max } = weather.daily;

  return (
    <section className="daily-forecast">
      <h3 className="forecast-title">7‑Day Forecast</h3>
      <div className="forecast-list">
        {time.map((day, i) => (
          <ForecastCard
            key={day}
            date={day}
            max={temperature_2m_max[i]}
            min={temperature_2m_min[i]}
            uv={uv_index_max[i]}
          />
        ))}
      </div>
    </section>
  );
}

function ForecastCard({ date, max, min, uv }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`forecast-card ${open ? 'open' : ''}`}>
      <div className="forecast-header" onClick={() => setOpen(!open)}>
        <span className="forecast-date">
          {new Date(date).toLocaleDateString([], {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </span>
        <span className="forecast-temp">
          {min}° / {max}°
        </span>
        <span className={`chevron ${open ? 'rotate' : ''}`}>⌄</span>
      </div>

      {open && (
        <div className="forecast-details">
          <span className="detail-label">UV INDEX</span>
          <span className="detail-value">{uv}</span>
        </div>
      )}
    </div>
  );
}
