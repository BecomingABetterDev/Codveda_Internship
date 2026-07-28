import Icon from '@/shared/components/Icons';
import React from 'react';

export default function EmptyState() {
  return (
    <div className="empty-state">
      <Icon name="Search" size={48} className="empty-icon" ariaLabel="Search icon" />
      <h2 className="empty-title">Search for a location</h2>
      <p className="empty-text">Start by typing a city name above to see the forecast.</p>
    </div>
  );
}
