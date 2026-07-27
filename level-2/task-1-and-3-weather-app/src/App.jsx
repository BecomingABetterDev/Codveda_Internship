import React, { useState, useEffect } from 'react';
import SearchBar from './features/search/components/SearchBar';
import DailyForecast from './features/weather/components/DailyForecast';
import HourlyCarousel from './features/weather/components/HourlyCarousel';
import MetricsGrid from './features/weather/components/MetricsGrid';
import WeatherHero from './features/weather/components/WeatherHero';
import { getWeather } from './shared/services/api';

const App = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedLocation) return;

    setLoading(true);
    setError(null);

    getWeather(selectedLocation.lat, selectedLocation.lon)
      .then((data) => setWeather(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedLocation]);

  return (
    <div className="container">
      <SearchBar onSelect={(loc) => setSelectedLocation(loc)} />

      {loading && <div className="hero-status">Loading weather...</div>}
      {error && <div className="hero-status error">{error}</div>}

      {selectedLocation && weather && (
        <>
          <WeatherHero location={selectedLocation} weather={weather} />
          <MetricsGrid weather={weather} />
          <HourlyCarousel weather={weather} />
          <DailyForecast weather={weather} />
        </>
      )}
    </div>
  );
};

export default App;
