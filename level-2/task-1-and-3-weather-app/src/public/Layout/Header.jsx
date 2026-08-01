import SearchBar from '@/features/search/components/SearchBar';
import Icon from '@/shared/components/Icons';
import { useState } from 'react';

// Header.jsx
export default function Header({ onSelect, unit, onToggleUnit, onThemeToggle }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="app-header">
        <div className="brand">
          <Icon name="CloudSun" size={28} className="brand-icon" ariaLabel="AeroCast logo" />
          <span className="brand-name">AeroCast</span>
        </div>
        <SearchBar onSelect={onSelect} />
        <div className="controls">
          <button
            className={`unit-toggle ${unit === 'C' ? 'active' : ''}`}
            onClick={() => onToggleUnit('C')}
            aria-pressed={unit === 'C'}
          >
            °C
          </button>
          <button
            className={`unit-toggle ${unit === 'F' ? 'active' : ''}`}
            onClick={() => onToggleUnit('F')}
            aria-pressed={unit === 'F'}
          >
            °F
          </button>
          <button
            className="settings-btn"
            aria-label="Open settings"
            onClick={() => setSettingsOpen(true)}
          >
            <Icon name="Settings" size={22} className="settings-icon" />
          </button>
        </div>
      </header>

      {settingsOpen && (
        <div className="settings-modal">
          <div className="settings-content">
            <h4>Preferences</h4>
            <label>
              Default Unit:
              <select value={unit} onChange={(e) => onToggleUnit(e.target.value)}>
                <option value="C">Celsius</option>
                <option value="F">Fahrenheit</option>
              </select>
            </label>
            <label>
              Theme:
              <button onClick={onThemeToggle}>Toggle Light/Dark</button>
            </label>
            <button onClick={() => setSettingsOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
