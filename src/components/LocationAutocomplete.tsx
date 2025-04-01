import React, { useState, useEffect, useRef } from 'react';
import useScriptStore from '../store/scriptStore';
import { MapPin } from 'lucide-react';

interface LocationAutocompleteProps {
  position: { top: number; left: number };
  query: string;
  onSelect: (name: string) => void;
  onClose: () => void;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  position,
  query,
  onSelect,
  onClose,
}) => {
  const { locations } = useScriptStore();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredLocations = locations
    .filter(loc => loc.name.toLowerCase().startsWith(query.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredLocations.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === 'Enter' && filteredLocations.length > 0) {
        e.preventDefault();
        onSelect(filteredLocations[selectedIndex].name.toUpperCase());
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        if (filteredLocations.length > 0) {
          onSelect(filteredLocations[selectedIndex].name.toUpperCase());
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredLocations, selectedIndex, onSelect, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (filteredLocations.length === 0) {
    return (
      <div
        ref={containerRef}
        className="absolute z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          minWidth: '200px'
        }}
      >
        <div className="text-sm text-gray-500 dark:text-gray-400">
          No locations found. Type a name to create a new location.
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        minWidth: '240px'
      }}
    >
      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
          <span>Select a location</span>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400 text-xs">↑↓</kbd>
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400 text-xs">Tab</kbd>
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400 text-xs">Enter</kbd>
          </div>
        </div>
      </div>
      
      <div className="max-h-64 overflow-y-auto py-1">
        {filteredLocations.map((location, index) => (
          <button
            key={location.id}
            className={`w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors ${
              index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => onSelect(location.name.toUpperCase())}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="flex items-center gap-2">
              <MapPin size={16} className={index === selectedIndex ? 'text-blue-500' : 'text-gray-400'} />
              <div>
                <div className="font-medium">{location.name}</div>
                {location.description && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5 max-w-sm">
                    {location.description}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationAutocomplete;