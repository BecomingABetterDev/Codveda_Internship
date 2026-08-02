import React, { useState, useEffect } from 'react';
import Header from './public/Layout/Header';
import Footer from './public/Layout/Footer';
import WeatherHero from './features/weather/components/WeatherHero';
import HourlyCarousel from './features/weather/components/HourlyCarousel';
import DailyForecast from './features/weather/components/DailyForecast';
import { getWeather } from './shared/services/api';
import EmptyState from './public/Layout/EmptyState';
import MetricsColumn from './features/weather/components/MetricsColumn';

const App = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [defaultLocation, setDefaultLocation] = useState(
    () => localStorage.getItem('location') || ''
  );
  const [unit, setUnit] = useState('C');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (defaultLocation) {
      localStorage.setItem('location', defaultLocation);
    }
  }, [defaultLocation]);

  useEffect(() => {
    if (defaultLocation && !selectedLocation) {
      // Call your geocoding API here to resolve lat/lon
      fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          defaultLocation
        )}&count=1&language=en&format=json`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            const loc = {
              name: data.results[0].name,
              lat: data.results[0].latitude,
              lon: data.results[0].longitude,
            };
            setSelectedLocation(loc);
          }
        })
        .catch((err) => console.error('Failed to resolve default location', err));
    }
  }, []);

  useEffect(() => {
    if (!selectedLocation) return;
    setLoading(true);
    setError(null);
    getWeather(selectedLocation.lat, selectedLocation.lon)
      .then((data) => setWeather(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedLocation]);

  const toggleUnit = (next) => {
    if (typeof next === 'string') {
      setUnit(next);
    } else {
      setUnit((u) => (u === 'C' ? 'F' : 'C'));
    }
  };

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <>
      <Header
        onSelect={setSelectedLocation}
        unit={unit}
        onToggleUnit={toggleUnit}
        theme={theme}
        onThemeToggle={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        defaultLocation={defaultLocation}
        onSetLocation={setDefaultLocation}
      />
      <div className="app-layout">
        <main className="app-main">
          {loading && <div className="hero-status">Loading weather...</div>}
          {error && <div className="hero-status error">{error}</div>}

          {!selectedLocation && <EmptyState />}

          {selectedLocation && weather && (
            <>
              <div className="top-grid">
                <WeatherHero location={selectedLocation} unit={unit} weather={weather} />
                <MetricsColumn weather={weather} unit={unit} />
              </div>

              <HourlyCarousel weather={weather} unit={unit} />
              <DailyForecast weather={weather} unit={unit} />
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default App;
