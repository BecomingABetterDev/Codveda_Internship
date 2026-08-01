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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C');

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
      setUnit(next); // from <select>
    } else {
      setUnit((u) => (u === 'C' ? 'F' : 'C')); // from button
    }
  };

  return (
    <>
      <Header onSelect={setSelectedLocation} unit={unit} onToggleUnit={toggleUnit} />
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
