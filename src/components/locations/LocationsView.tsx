import React, { useState } from 'react';
import { GripVertical, Plus, Search, LayoutGrid, LayoutList, MapPin, Pencil } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import useScriptStore from '../../store/scriptStore';
import { Location } from '../../types';
import LocationEditor from './LocationEditor';
import { v4 as uuidv4 } from 'uuid';
import Button from '../shared/Button';
import SearchBar from '../shared/SearchBar';

const LocationsView: React.FC = () => {
  const { 
    locations, 
    currentLocationId, 
    setCurrentLocation, 
    addLocation, 
    reorderLocations 
  } = useScriptStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'list' | 'grid'>('grid');
  const [editingLocationId, setEditingLocationId] = React.useState<string | null>(null);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto p-4">
          <div className="flex items-center justify-between gap-4">
            <SearchBar
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 max-w-md"
            />
            
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-700 shadow text-gray-800 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                  }`}
                  title="List view"
                >
                  <LayoutList size={18} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-700 shadow text-gray-800 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid size={18} />
                </button>
              </div>
              
              <Button
                variant="primary"
                icon={<Plus size={18} />}
                onClick={() => addLocation({
                  id: uuidv4(),
                  name: 'New Location',
                  description: '',
                  order: locations.length,
                })}
              >
                Add Location
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ... rest of existing code ... */}
    </div>
  );
};

export default LocationsView; 