import React, { useState, useMemo } from 'react';
import './hourlyCarousel.css';
import Icon from '@/shared/components/Icons';
import { toFahrenheit } from '../utils/convert';

export default function HourlyCarousel({ weather, unit }) {
  if (!weather || !weather.hourly) return null;

  const { time, temperature_2m, precipitation_probability } = weather.hourly;
  const currentIndex = time.indexOf(weather.current.time.split(':', 1) + ':00');
  const hours = time.slice(currentIndex, currentIndex + 12);

  const safeSlice = (arr) =>
    hours.map((_, i) => {
      const val = arr[currentIndex + i];
      return typeof val === 'number' && !isNaN(val) ? val : 0;
    });
  const tempsRaw = safeSlice(temperature_2m);
  const temps = unit === 'C' ? tempsRaw : tempsRaw.map((t) => Math.round(toFahrenheit(t)));
  const precip = safeSlice(precipitation_probability);

  // Catmull-Rom to Bezier conversion for smooth, controlled curves
  const catmullRom2bezier = (points, tension = 0.25) => {
    // points: [{x,y}, ...]
    if (!points.length) return '';
    if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
    const d = [];
    for (let i = 0; i < points.length; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1] || p1;
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + ((p2.x - p0.x) * tension) / 3;
      const cp1y = p1.y + ((p2.y - p0.y) * tension) / 3;

      const cp2x = p2.x - ((p3.x - p1.x) * tension) / 3;
      const cp2y = p2.y - ((p3.y - p1.y) * tension) / 3;

      if (i === 0) {
        d.push(`M ${p1.x},${p1.y}`);
      }
      d.push(`C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`);
    }
    return d.join(' ');
  };

  // Build points with padding so lines don't touch edges
  const chartWidth = 320; // wider base for breathing room
  const chartHeight = 96;
  const horizontalPadding = 20; // px padding left/right inside viewBox
  const usableWidth = chartWidth - horizontalPadding * 2;
  const step = usableWidth / Math.max(1, temps.length - 1);

  const buildPoints = (values) => {
    const clean = values.map((v) => (typeof v === 'number' && !isNaN(v) ? v : 0));
    const min = Math.min(...clean);
    const max = Math.max(...clean);
    const range = max - min || 1;
    return clean.map((v, i) => {
      const x = horizontalPadding + i * step;
      const y = chartHeight - ((v - min) / range) * (chartHeight - 12) - 6; // 6px vertical padding
      return { x, y };
    });
  };

  const tempPointsArr = useMemo(() => buildPoints(temps), [temps]);
  const precipPointsArr = useMemo(() => buildPoints(precip), [precip]);

  const tempPath = useMemo(() => catmullRom2bezier(tempPointsArr, 0.22), [tempPointsArr]);
  const precipPath = useMemo(() => catmullRom2bezier(precipPointsArr, 0.22), [precipPointsArr]);

  const [tooltip, setTooltip] = useState(null);

  const handleTooltip = (e, i, label, value, pointsArr) => {
    const svg = e.target.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const cx = pointsArr[i].x;
    const cy = pointsArr[i].y;
    const scaleX = rect.width / svg.viewBox.baseVal.width;
    const scaleY = rect.height / svg.viewBox.baseVal.height;
    const screenX = rect.left + cx * scaleX;
    const screenY = rect.top + cy * scaleY;
    setTooltip({ x: screenX, y: screenY, label, value });
  };

  return (
    <section className="hourly-carousel" aria-label="Hourly forecast">
      <h3 className="carousel-title">Next Hours</h3>

      <div className="carousel-track" role="list">
        {hours.map((t, i) => (
          <div
            key={t}
            className="hour-card"
            style={{ '--i': i }}
            role="listitem"
            aria-label={`Hour ${new Date(t).toLocaleTimeString([], {
              hour: 'numeric',
              hour12: true,
            })}`}
          >
            <span className="hour-time">
              {new Date(t).toLocaleTimeString([], { hour: 'numeric', hour12: true })}
            </span>

            <span className="hour-temp" aria-hidden>
              {temps[i]}°{unit}
            </span>

            <div className="hour-meta" aria-hidden>
              <Icon name="Droplet" size={14} strokeWidth={3} />
              <span>{precip[i]}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="sparkline" aria-hidden>
        <h4 className="sparkline-title">Hourly Trends</h4>

        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Temperature and precipitation trends"
        >
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>

          {/* Temperature smooth path */}
          <path
            d={tempPath}
            fill="none"
            stroke="url(#tempGradient)"
            strokeWidth="7.5"
            className="chart-line temp-line"
            vectorEffect="non-scaling-stroke"
          />

          {/* Temperature points */}
          {tempPointsArr.map((pt, i) => (
            <circle
              key={`tpt-${i}`}
              cx={pt.x}
              cy={pt.y}
              r="3.5"
              className="chart-point"
              tabIndex={0}
              aria-label={`Temp ${temps[i]} degrees at ${new Date(hours[i]).toLocaleTimeString([], {
                hour: 'numeric',
                hour12: true,
              })}`}
              onMouseEnter={(e) =>
                handleTooltip(
                  e,
                  i,
                  new Date(hours[i]).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
                  `Temp: ${temps[i]}°`,
                  tempPointsArr
                )
              }
              onFocus={(e) =>
                handleTooltip(
                  e,
                  i,
                  new Date(hours[i]).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
                  `Temp: ${temps[i]}°`,
                  tempPointsArr
                )
              }
              onMouseLeave={() => setTooltip(null)}
              onBlur={() => setTooltip(null)}
            />
          ))}

          {/* Precipitation smooth path */}
          <path
            d={precipPath}
            fill="none"
            stroke="url(#precipGradient)"
            strokeWidth="7.5"
            className="chart-line precip-line"
            vectorEffect="non-scaling-stroke"
          />

          {/* Precip points */}
          {precipPointsArr.map((pt, i) => (
            <circle
              key={`ppt-${i}`}
              cx={pt.x}
              cy={pt.y}
              r="3"
              className="chart-point"
              tabIndex={0}
              aria-label={`Precip ${precip[i]} percent at ${new Date(hours[i]).toLocaleTimeString(
                [],
                {
                  hour: 'numeric',
                  hour12: true,
                }
              )}`}
              onMouseEnter={(e) =>
                handleTooltip(
                  e,
                  i,
                  new Date(hours[i]).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
                  `Rain: ${precip[i]}%`,
                  precipPointsArr
                )
              }
              onFocus={(e) =>
                handleTooltip(
                  e,
                  i,
                  new Date(hours[i]).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
                  `Rain: ${precip[i]}%`,
                  precipPointsArr
                )
              }
              onMouseLeave={() => setTooltip(null)}
              onBlur={() => setTooltip(null)}
            />
          ))}
        </svg>

        <div className="sparkline-meta">
          <span>
            Temp Min: <span className="meta-value"> {Math.min(...temps)}</span>° {unit}
          </span>
          <span>
            Temp Max: <span className="meta-value">{Math.max(...temps)}</span>° {unit}
          </span>
          <span>
            Rain Min: <span className="meta-value">{Math.min(...precip)}</span>%
          </span>
          <span>
            Rain Max: <span className="meta-value">{Math.max(...precip)}</span>%
          </span>
        </div>

        {tooltip && (
          <div
            className="custom-tooltip"
            style={{ left: `${tooltip.x}px`, top: `${tooltip.y - 18}px` }}
            role="status"
            aria-live="polite"
          >
            <span className="tooltip-label">{tooltip.label}</span>
            <span className="tooltip-value">{tooltip.value}</span>
          </div>
        )}

        <div className="sparkline-legend">
          <span className="legend-item temp">Temperature</span>
          <span className="legend-item precip">Precipitation</span>
        </div>
      </div>
    </section>
  );
}
