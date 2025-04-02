import React, { useState } from 'react';
import { GripVertical, Plus, Search, LayoutGrid, LayoutList, User, Pencil } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
  AnimateLayoutChanges,
} from '@dnd-kit/sortable';
import useScriptStore from '../store/scriptStore';
import { Character } from '../types';
import CharacterEditor from './CharacterEditor';
import { v4 as uuidv4 } from 'uuid';
import Button from './shared/Button';
import SearchBar from './shared/SearchBar';

interface SortableCharacterItemProps {
  character: Character;
  isCurrentCharacter: boolean;
  onSelect: () => void;
  onEdit: () => void;
  viewMode: 'list' | 'grid';
  animateLayoutChanges: AnimateLayoutChanges;
}

const SortableCharacterItem: React.FC<SortableCharacterItemProps> = React.memo(({ 
  character, 
  isCurrentCharacter, 
  onSelect,
  onEdit,
  viewMode,
  animateLayoutChanges,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: character.id,
    transition: {
      duration: 150,
      easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
    },
    animateLayoutChanges,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition,
    zIndex: isDragging ? 10 : 0,
    scale: isDragging ? 1.02 : 1,
    opacity: isDragging ? 0.9 : 1,
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
          ${isCurrentCharacter 
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
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 select-none">#{character.order + 1}</span>
          </div>
          <div className="flex items-center gap-2">
            <User size={18} className="text-gray-400 dark:text-gray-500" />
            <Button
              variant="ghost"
              size="sm"
              icon={<Pencil size={16} />}
              onClick={handleEdit}
              title="Edit character"
              className="p-1"
            />
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-hidden">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 line-clamp-1 select-none">
            {character.name || 'Unnamed Character'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-5 select-none">
            {character.bio || 'No biography yet'}
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
        ${isCurrentCharacter 
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
              {character.name || 'Unnamed Character'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 select-none">
              {character.bio || 'No biography yet'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <User size={20} className="text-gray-400 dark:text-gray-500" />
            <Button
              variant="ghost"
              size="sm"
              icon={<Pencil size={18} />}
              onClick={handleEdit}
              title="Edit character"
              className="p-1"
            />
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-4 text-sm select-none">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 dark:text-gray-400">Order:</span>
            <span className="font-medium text-gray-900 dark:text-white select-none">#{character.order + 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

const CharactersView: React.FC = () => {
  const { 
    characters, 
    currentCharacterId, 
    setCurrentCharacter, 
    addCharacter, 
    reorderCharacters 
  } = useScriptStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'list' | 'grid'>('grid');
  const [editingCharacterId, setEditingCharacterId] = React.useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        delay: 0,
        tolerance: 5,
        pressure: 0,
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Custom animation configuration
  const animateLayoutChanges: AnimateLayoutChanges = (args) => {
    const { isSorting } = args;
    if (!isSorting) return true;
    return false;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeCharacter = characters.find(character => character.id === active.id);
    const overCharacter = characters.find(character => character.id === over.id);

    if (!activeCharacter || !overCharacter) return;

    const oldIndex = characters.findIndex(character => character.id === active.id);
    const newIndex = characters.findIndex(character => character.id === over.id);

    if (oldIndex !== newIndex) {
      const updatedCharacters = arrayMove(characters, oldIndex, newIndex).map((character, index) => ({
        ...character,
        order: index,
      }));
      reorderCharacters(updatedCharacters);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
  };

  const filteredCharacters = React.useMemo(() => {
    if (!searchQuery) return characters;
    const query = searchQuery.toLowerCase();
    return characters.filter(character => 
      character.name.toLowerCase().includes(query) ||
      character.bio.toLowerCase().includes(query)
    );
  }, [characters, searchQuery]);

  const sortedCharacters = React.useMemo(() => {
    return [...filteredCharacters].sort((a, b) => a.order - b.order);
  }, [filteredCharacters]);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto p-4">
          <div className="flex items-center justify-between gap-4">
            <SearchBar
              placeholder="Search characters..."
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
                onClick={() => addCharacter({
                  id: uuidv4(),
                  name: 'New Character',
                  bio: '',
                  order: characters.length,
                })}
              >
                Add Character
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
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedCharacters.map(character => character.id)}
              strategy={viewMode === 'grid' ? rectSortingStrategy : verticalListSortingStrategy}
            >
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-4'
              }>
                {sortedCharacters.map((character) => (
                  <SortableCharacterItem
                    key={character.id}
                    character={character}
                    isCurrentCharacter={currentCharacterId === character.id}
                    onSelect={() => setCurrentCharacter(character.id)}
                    onEdit={() => setEditingCharacterId(character.id)}
                    viewMode={viewMode}
                    animateLayoutChanges={animateLayoutChanges}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <div className="opacity-50">
                  {/* Render a preview of the dragged item */}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {editingCharacterId && (
        <CharacterEditor
          characterId={editingCharacterId}
          onClose={() => setEditingCharacterId(null)}
        />
      )}
    </div>
  );
};

export default CharactersView;