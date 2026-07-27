import React from 'react';
import './metricsGrid.css';

export default function MetricsGrid({ weather }) {
  if (!weather || !weather.current) return null;

  const { current, daily, hourly } = weather;

  const currentIndex = hourly.time.indexOf(current.time.split(':', 1) + ':00');
  const humidity = currentIndex !== -1 ? hourly.relative_humidity_2m[currentIndex] : null;
  const pressure = currentIndex !== -1 ? hourly.surface_pressure[currentIndex] : null;
  return (
    <section className="metrics-grid grid">
      {/* Hero metric — UV index spans two columns */}
      <div className="metric-card metric-hero">
        <span className="metric-label">UV INDEX</span>
        <span className="metric-value">{daily.uv_index_max?.[0] ?? '--'}</span>
      </div>

      <div className="metric-card">
        <span className="metric-label">HUMIDITY</span>
        <span className="metric-value">{humidity ?? '--'}%</span>
      </div>

      <div className="metric-card">
        <span className="metric-label">PRESSURE</span>
        <span className="metric-value">{pressure ?? '--'} hPa</span>
      </div>

      <div className="metric-card">
        <span className="metric-label">WIND</span>
        <span className="metric-value">{current.windspeed ?? '--'} km/h</span>
      </div>
    </section>
  );
}
