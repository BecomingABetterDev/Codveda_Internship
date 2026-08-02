import SearchBar from '@/features/search/components/SearchBar';
import Icon from '@/shared/components/Icons';
import { useState } from 'react';

export default function Header({ onSelect, unit, onToggleUnit, onThemeToggle, theme }) {
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
            <div className="settings-header">
              <h4>Preferences</h4>
              <button
                className="close-btn"
                aria-label="Close settings"
                onClick={() => setSettingsOpen(false)}
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="settings-section">
              <span className="section-label">Default Unit</span>
              <div className="chip-group">
                <button
                  className={`chip ${unit === 'C' ? 'active' : ''}`}
                  onClick={() => onToggleUnit('C')}
                >
                  °C
                </button>
                <button
                  className={`chip ${unit === 'F' ? 'active' : ''}`}
                  onClick={() => onToggleUnit('F')}
                >
                  °F
                </button>
              </div>
            </div>

            <div className="settings-section">
              <span className="section-label">Theme</span>
              <button className="theme-toggle" onClick={onThemeToggle} aria-label="Toggle theme">
                {theme === 'light' ? (
                  <Icon name="Sun" size={22} strokeWidth={2} />
                ) : (
                  <Icon name="Moon" size={22} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
