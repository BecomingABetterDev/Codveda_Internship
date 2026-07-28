// src/shared/components/Icon.jsx
import React from 'react';
import * as Lucide from 'lucide-react';

export default function Icon({
  name,
  size = 20,
  className = '',
  ariaLabel = null,
  strokeWidth = 1.5,
}) {
  const IconComponent = Lucide[name];
  if (!IconComponent) return 'No such Icon found';
  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
    />
  );
}
