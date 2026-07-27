// src/features/search/components/SearchBar.jsx
import { useState } from 'react';
import { useGeocoding } from '../hooks/useGeocoding';
import LocationDropdown from './LocationDropdown';
import './search.css';

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('');
  const { data, loading, error } = useGeocoding(query);

  return (
    <div className="search-bar">
      <label className="search-label">LOCATION</label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search city..."
        className="search-input"
      />
      <LocationDropdown results={data} loading={loading} error={error} onSelect={onSelect} />
    </div>
  );
}
