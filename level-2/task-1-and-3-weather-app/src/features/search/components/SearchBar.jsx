import { useState } from 'react';
import { useGeocoding } from '../hooks/useGeocoding';
import LocationDropdown from './LocationDropdown';
import './search.css';

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false); // 👈 new state
  const { data, loading, error } = useGeocoding(query);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setShowDropdown(true); // show dropdown when typing
  };

  const handleSelect = (loc) => {
    setQuery(`${loc.name}, ${loc.country}`);
    setShowDropdown(false); // hide dropdown after selection
    onSelect(loc);
  };

  return (
    <div className="search-bar">
      <label className="search-label">LOCATION</label>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search city..."
        className="search-input"
      />
      {showDropdown && query.trim().length > 1 && (
        <LocationDropdown results={data} loading={loading} error={error} onSelect={handleSelect} />
      )}
    </div>
  );
}
