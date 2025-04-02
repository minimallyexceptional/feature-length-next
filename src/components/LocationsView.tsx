import React from 'react';
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
import useScriptStore from '../store/scriptStore';
import { Location } from '../types';
import LocationEditor from './LocationEditor';
import { v4 as uuidv4 } from 'uuid';
import Button from './shared/Button';
import SearchBar from './shared/SearchBar';

interface SortableLocationItemProps {
  location: Location;
  isCurrentLocation: boolean;
  onSelect: () => void;
  onEdit: () => void;
  viewMode: 'list' | 'grid';
}

const SortableLocationItem: React.FC<SortableLocationItemProps> = React.memo(({ 
  location, 
  isCurrentLocation, 
  onSelect,
  onEdit,
  viewMode 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: location.id,
    transition: {
      duration: 200,
      easing: 'cubic-bezier(0.2, 0, 0, 1)'
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition,
    zIndex: isDragging ? 10 : 0,
    scale: isDragging ? 1.02 : 1,
  } : undefined;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  if (viewMode === 'grid') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`
          group flex flex-col bg-white dark:bg-gray-800 rounded-lg border transition-all h-[240px]
          ${isCurrentLocation 
            ? 'border-blue-500 shadow-md' 
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500'}
          ${isDragging ? 'shadow-lg' : ''}
        `}
        onClick={onSelect}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              {...attributes}
              {...listeners}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-grab active:cursor-grabbing"
            >
              <GripVertical size={18} />
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 select-none">#{location.order + 1}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-gray-400 dark:text-gray-500" />
            <Button
              variant="ghost"
              size="sm"
              icon={<Pencil size={16} />}
              onClick={handleEdit}
              title="Edit location"
              className="p-1"
            />
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-hidden">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 line-clamp-1 select-none">
            {location.name || 'Unnamed Location'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-5 select-none">
            {location.description || 'No description yet'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group flex items-start gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg border transition-all
        ${isCurrentLocation 
          ? 'border-blue-500 shadow-md' 
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500'}
        ${isDragging ? 'shadow-lg' : ''}
      `}
      onClick={onSelect}
    >
      <div
        {...attributes}
        {...listeners}
        className="mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={20} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white select-none">
              {location.name || 'Unnamed Location'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 select-none">
              {location.description || 'No description yet'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-gray-400 dark:text-gray-500" />
            <Button
              variant="ghost"
              size="sm"
              icon={<Pencil size={18} />}
              onClick={handleEdit}
              title="Edit location"
              className="p-1"
            />
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-4 text-sm select-none">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 dark:text-gray-400">Order:</span>
            <span className="font-medium text-gray-900 dark:text-white">#{location.order + 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
        delay: 0
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = locations.findIndex((location) => location.id === active.id);
      const newIndex = locations.findIndex((location) => location.id === over.id);
      
      const updatedLocations = arrayMove(locations, oldIndex, newIndex).map((location, index) => ({
        ...location,
        order: index,
      }));
      
      reorderLocations(updatedLocations);
    }
  };

  const filteredLocations = React.useMemo(() => {
    if (!searchQuery) return locations;
    const query = searchQuery.toLowerCase();
    return locations.filter(location => 
      location.name.toLowerCase().includes(query) ||
      location.description.toLowerCase().includes(query)
    );
  }, [locations, searchQuery]);

  const sortedLocations = React.useMemo(() => {
    return [...filteredLocations].sort((a, b) => a.order - b.order);
  }, [filteredLocations]);

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

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-screen-xl mx-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedLocations.map(location => location.id)}
              strategy={viewMode === 'grid' ? rectSortingStrategy : verticalListSortingStrategy}
            >
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-4'
              }>
                {sortedLocations.map((location) => (
                  <SortableLocationItem
                    key={location.id}
                    location={location}
                    isCurrentLocation={currentLocationId === location.id}
                    onSelect={() => setCurrentLocation(location.id)}
                    onEdit={() => setEditingLocationId(location.id)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {editingLocationId && (
        <LocationEditor
          locationId={editingLocationId}
          onClose={() => setEditingLocationId(null)}
        />
      )}
    </div>
  );
};

export default LocationsView;