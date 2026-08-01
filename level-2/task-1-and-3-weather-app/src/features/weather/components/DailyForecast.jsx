// src/features/weather/components/DailyForecast.jsx
import React, { useState, useMemo } from 'react';
import Icon from '@/shared/components/Icons';
import './dailyForecast.css';
import { toFahrenheit } from '../utils/convert';

export default function DailyForecast({ weather, unit }) {
  if (!weather || !weather.daily) return null;

  const {
    time,
    temperature_2m_max,
    temperature_2m_min,
    precipitation_sum,
    sunrise,
    sunset,
    uv_index_max,
    weathercode,
  } = weather.daily;

  const days = time.map((t, i) => ({
    date: t,
    max: temperature_2m_max?.[i],
    min: temperature_2m_min?.[i],
    precip: precipitation_sum?.[i],
    sunrise: sunrise?.[i],
    sunset: sunset?.[i],
    uv: uv_index_max?.[i],
    code: weathercode?.[i],
  }));

  const [openIndex, setOpenIndex] = useState(-1);
  const toggle = (idx) => setOpenIndex((s) => (s === idx ? -1 : idx));

  return (
    <section className="daily-forecast" aria-label="7 day forecast">
      <div className="forecast-header-row">
        <h3 className="forecast-title">7‑Day Forecast</h3>
      </div>

      <div className="forecast-grid">
        {days.map((d, i) => (
          <ForecastCard
            key={d.date}
            index={i}
            day={d}
            unit={unit}
            open={openIndex === i}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>
    </section>
  );
}

function ForecastCard({ day, unit, index, open, onToggle }) {
  const label = useMemo(
    () =>
      new Date(day.date).toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    [day.date]
  );

  const fmtTime = (iso) =>
    iso
      ? new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
      : '—';

  const uvValue = Math.round(day.uv ?? 0);
  const uvLabel =
    uvValue >= 8 ? 'Very High' : uvValue >= 6 ? 'High' : uvValue >= 3 ? 'Moderate' : 'Low';

  const codeToIcon = (code) => {
    if (code >= 0 && code <= 3) return 'Sun';
    if (code >= 45 && code <= 48) return 'CloudFog';
    if (code >= 51 && code <= 67) return 'CloudRain';
    if (code >= 71 && code <= 77) return 'Snowflake';
    if (code >= 80 && code <= 82) return 'CloudRain';
    if (code >= 95 && code <= 99) return 'CloudLightning';
    return 'Cloud';
  };

  const iconName = codeToIcon(day.code);

  const max = Number.isFinite(day.max)
    ? Math.round(unit === 'C' ? day.max : toFahrenheit(day.max))
    : '—';
  const min = Number.isFinite(day.min)
    ? Math.round(unit === 'C' ? day.min : toFahrenheit(day.min))
    : '—';

  return (
    <article className={`forecast-card ${open ? 'open' : ''}`} aria-expanded={open}>
      <div className="forecast-inner">
        {/* Front face */}
        <div className="forecast-front">
          <header
            className="forecast-top"
            onClick={onToggle}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle()}
            aria-controls={`forecast-back-${index}`}
            aria-expanded={open}
          >
            <div className="left">
              <div className="date-block">
                <span className="date-label">{label}</span>
              </div>

              <div className="temps">
                <div className="day-icon">
                  <Icon name={iconName} size={40} />
                </div>
                <span className="temp-max">
                  {max}°{unit}
                </span>
                <span className="temp-min">
                  / {min}°{unit}
                </span>
              </div>
            </div>

            <div className="right">
              <div className="precip-badge">
                <Icon name="CloudRain" size={14} />
                <span className="precip-value">
                  {day.precip != null ? `${Math.round(day.precip)} mm` : '—'}
                </span>
              </div>

              <div
                className={`uv-chip uv-${Math.min(11, uvValue)}`}
                title={`UV ${uvValue} — ${uvLabel}`}
              >
                <span className="uv-value">UV {uvValue}</span>
                <span className="uv-label">{uvLabel}</span>
              </div>
            </div>
          </header>
        </div>

        <div className="forecast-back" id={`forecast-back-${index}`}>
          <div className="detail-list">
            <div className="detail-row">
              <span className="detail-label">Sunrise</span>
              <span className="detail-value">{fmtTime(day.sunrise)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Sunset</span>
              <span className="detail-value">{fmtTime(day.sunset)}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
