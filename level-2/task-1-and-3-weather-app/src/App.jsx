import React, { useState } from 'react';
import SearchBar from './features/search/components/SearchBar';
import WeatherHero from './features/weather/components/WeatherHero';

const App = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <div className="container">
      <SearchBar onSelect={(loc) => setSelectedLocation(loc)} />

      {selectedLocation && <WeatherHero location={selectedLocation} />}
    </div>
  );
};

export default App;
