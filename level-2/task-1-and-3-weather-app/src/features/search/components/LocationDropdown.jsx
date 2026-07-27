// src/features/search/components/LocationDropdown.jsx
import './dropdown.css';
export default function LocationDropdown({ results, loading, error, onSelect }) {
  if (loading) return <div className="dropdown">Loading...</div>;
  if (error) return <div className="dropdown error">{error}</div>;
  if (!results || results.length === 0) return null;

  return (
    <ul className="dropdown">
      {results.map((loc) => (
        <li
          key={`${loc.name}-${loc.lat}-${loc.lon}`}
          onClick={() => onSelect(loc)}
          className="dropdown-item"
        >
          <span className="dropdown-city">{loc.name}</span>
          <span className="dropdown-country">{loc.country}</span>
        </li>
      ))}
    </ul>
  );
}
