import Icon from '@/shared/components/Icons';
import React from 'react';
import './metricsGrid.css';

export default function MetricsColumn({ weather }) {
  if (!weather) return null;
  const { current, hourly, daily } = weather;
  const currentIndex = hourly.time.indexOf(current.time.split(':', 1) + ':00');

  const humidity = currentIndex !== -1 ? hourly.relative_humidity_2m[currentIndex] : null;
  const pressure =
    current.surface_pressure ??
    (currentIndex !== -1 ? hourly.surface_pressure?.[currentIndex] : null);
  const wind = current.windspeed;
  const uv = daily.uv_index_max?.[0];

  // advisory text based on UV
  const uvAdvisory =
    uv >= 8
      ? 'High UV — protect skin and wear sunscreen.'
      : uv >= 6
      ? 'Moderate UV — consider sun protection.'
      : 'UV levels are low.';

  return (
    <aside className="metrics-col">
      <div className="metric-card metric-uv">
        <div className="metric-head">
          <Icon name="Sun" size={18} strokeWidth={3} />
          <span className="metric-label">UV Index</span>
        </div>
        <div className="metric-value-hero">{uv ?? '—'}</div>
        <div className="metric-advisory">{uvAdvisory}</div>
      </div>

      <div className="metric-card">
        <div className="metric-head">
          <Icon name="CloudRain" size={16} strokeWidth={3} />
          <span className="metric-label">precipitation</span>
        </div>
        <div className="metric-value precip">
          {currentIndex !== -1 ? `${hourly.precipitation_probability[currentIndex]}` : '—'}
          <span className="metric-unit">%</span>
        </div>
        <span className="precip-text">Likelihood of rain</span>
      </div>

      <div className="metric-card">
        <div className="metric-head">
          <Icon name="Gauge" size={16} strokeWidth={3} />
          <span className="metric-label">Pressure</span>
        </div>
        <div className="metric-value">
          {pressure ?? '—'}
          <span className="metric-unit"> hPa</span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-head">
          <Icon name="Wind" size={16} strokeWidth={3} />
          <span className="metric-label">Wind</span>
        </div>
        <div className="metric-value">
          {wind ?? '—'}
          <span className="metric-unit"> km/h</span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-head">
          <Icon name="Droplet" size={16} strokeWidth={3} />
          <span className="metric-label">Humidity</span>
        </div>
        <div className="metric-value ">
          {humidity ?? '—'}
          <span className="metric-unit">%</span>
        </div>
      </div>
    </aside>
  );
}
