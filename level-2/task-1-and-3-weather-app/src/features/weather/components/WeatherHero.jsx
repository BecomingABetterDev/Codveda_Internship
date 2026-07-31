import Icon from '@/shared/components/Icons';
import React from 'react';
import './weatherHero.css';
// import '@/shared/styles/variable.css';

export default function WeatherHero({ location, weather, unit = 'C' }) {
  if (!location || !weather) return null;
  const { current, hourly, daily } = weather;

  // Weather code ranges
  const codeMap = [
    { range: [0, 3], label: 'Clear', icon: 'Sun', accent: 'var(--accent-clear)' },
    { range: [45, 48], label: 'Fog', icon: 'CloudFog', accent: 'var(--accent-cloud)' },
    { range: [51, 57], label: 'Drizzle', icon: 'CloudDrizzle', accent: 'var(--accent-rain)' },
    { range: [61, 67], label: 'Rain', icon: 'CloudRain', accent: 'var(--accent-rain)' },
    { range: [71, 77], label: 'Snow', icon: 'Snowflake', accent: 'var(--accent-sunset)' },
    { range: [80, 82], label: 'Showers', icon: 'CloudRain', accent: 'var(--accent-rain)' },
    {
      range: [95, 99],
      label: 'Thunderstorm',
      icon: 'CloudLightning',
      accent: 'var(--accent-rain)',
    },
  ];

  const meta = codeMap.find(
    ({ range }) => current.weathercode >= range[0] && current.weathercode <= range[1]
  ) || { label: 'Unknown', icon: 'Cloud', accent: 'var(--color-accent)' };

  // Current index
  const currentIndex = hourly.time.indexOf(current.time.split(':', 1) + ':00');
  const precipProb = currentIndex !== -1 ? hourly.precipitation_probability[currentIndex] : null;
  const precipVol = currentIndex !== -1 ? hourly.precipitation[currentIndex] : null;
  const apparentTemp =
    currentIndex !== -1 ? hourly.apparent_temperature[currentIndex] : current.temperature;

  // Advisory logic
  // let advisory = '';

  // if (precipProb >= 70) {
  //   advisory =
  //     'High probability of precipitation (≥70%): Rain is very likely due to atmospheric moisture saturation and frontal activity. Carry an umbrella and waterproof gear to protect against sustained rainfall.';
  // } else if (daily.uv_index_max?.[0] >= 8) {
  //   advisory =
  //     'Very high UV Index (≥8): Solar ultraviolet radiation is intense, capable of causing rapid skin damage and erythema via high-energy UV-B photons. Apply broad-spectrum SPF 30+ sunscreen, wear UV-blocking sunglasses, and limit direct midday sun exposure.';
  // } else if (apparentTemp < current.temperature - 3) {
  //   advisory =
  //     'Elevated wind chill or humidity effect (Apparent temperature >3°C below actual): Environmental factors like wind speed or low humidity increase convective heat loss from the skin, making it feel significantly colder than the ambient thermometer reading. Dress in insulating, layered clothing.';
  // } else {
  //   advisory =
  //     'Stable meteorological conditions: Atmospheric pressure and thermal gradients remain balanced, indicating low risk for sudden severe weather changes. Standard daily routines can proceed comfortably.';
  // }

  let advisory = '';

  if (precipProb >= 70) {
    advisory =
      'High chance of rain (≥70%). Carry an umbrella and waterproof gear to stay comfortable.';
  } else if (daily.uv_index_max?.[0] >= 8) {
    advisory =
      'UV Index is very high (≥8). Use SPF 30+, wear protective clothing, and limit midday sun exposure.';
  } else if (apparentTemp < current.temperature - 3) {
    advisory = 'Feels colder than actual temperature due to wind chill. Dress warmly in layers.';
  } else {
    advisory = 'Stable weather conditions. No major risks expected — enjoy your day comfortably.';
  }

  return (
    <aside className="hero-wrap">
      <section
        className="weather-hero card-hero"
        style={{
          background: `linear-gradient(180deg, ${meta.accent}20, var(--bg-surface))`,
          borderColor: meta.accent,
        }}
      >
        <div className="hero-top">
          <div className="hero-brand">
            <h3 className="hero-location">{location.name}</h3>
            <span className="hero-country">{location.country}</span>
          </div>
          <div className="hero-now-badge">Now</div>
        </div>

        <div className="hero-body">
          <div className="hero-left">
            <div className="temp-row">
              <span className="temp-value">{Math.round(current.temperature)}</span>
              <span className="temp-unit">°{unit}</span>
            </div>

            <div className="condition-row">
              <Icon name={meta.icon} size={28} className="condition-icon" />
              <span className="condition-label">{meta.label}</span>
            </div>

            <div className="hero-sub">
              <div className="sub-item">
                <span className="sub-value">{Math.round(apparentTemp)}°</span>
                <span className="sub-label">Feels like</span>
              </div>
              <div className="sub-item">
                <span className="sub-value">
                  {precipProb != null
                    ? `${precipProb}%`
                    : precipVol != null
                    ? `${precipVol} mm`
                    : '—'}
                </span>
                <span className="sub-label">Precip</span>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <Icon name={meta.icon} size={160} className="hero-graphic" />
          </div>
        </div>

        <div className="hero-footer">
          <p className="hero-advisory">{advisory}</p>
        </div>
      </section>
    </aside>
  );
}
