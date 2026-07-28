import SearchBar from '@/features/search/components/SearchBar';
import Icon from '@/shared/components/Icons';
import React from 'react';

export default function Header({ onSelect }) {
  return (
    <header className="app-header">
      <div className="brand">
        <Icon name="CloudSun" size={28} className="brand-icon" ariaLabel="AeroCast logo" />
        <span className="brand-name">AeroCast</span>
      </div>
      <SearchBar onSelect={onSelect} />
      <div className="controls">
        <button className="unit-toggle">°C / °F</button>
        <Icon name="Settings" size={22} className="settings-icon" ariaLabel="Settings" />
      </div>
    </header>
  );
}
