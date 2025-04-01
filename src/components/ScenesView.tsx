import React, { useState, useCallback } from 'react';
import { GripVertical, Plus, Search, LayoutGrid, LayoutList, Clock, MessageSquare, Trash2, Maximize2, Minimize2 } from 'lucide-react';
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
  defaultDropAnimation,
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
import { Scene } from '../types';
import ModalSceneEditor from './ModalSceneEditor';
import { v4 as uuidv4 } from 'uuid';

interface SortableSceneItemProps {
  scene: Scene;
  isCurrentScene: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  viewMode: 'list' | 'grid';
  cardSize: 'normal' | 'compact';
}

const SortableSceneItem: React.FC<SortableSceneItemProps> = React.memo(({ scene, isCurrentScene, onSelect, onDoubleClick, viewMode, cardSize }) => {
  const { deleteScene } = useScriptStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: scene.id,
    transition: {
      duration: 150,
      easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition,
    zIndex: isDragging ? 10 : 0,
    scale: isDragging ? 1.02 : 1,
    opacity: isDragging ? 0.9 : 1,
  } : undefined;

  const handleDelete = (sceneId: string) => {
    if (window.confirm('Are you sure you want to delete this scene?')) {
      deleteScene(sceneId);
    }
  };

  // Calculate estimated duration based on content length
  const words = scene.content.trim().split(/\s+/).length;
  const estimatedDuration = Math.max(0.5, Math.ceil((words / 500) * 60) / 60);

  if (viewMode === 'grid') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`
          group flex flex-col bg-white dark:bg-gray-800 rounded-lg border transition-all select-none
          ${cardSize === 'normal' ? 'h-[280px]' : 'h-[200px]'}
          ${isCurrentScene 
            ? 'border-blue-500 shadow-md' 
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500'}
          ${isDragging ? 'shadow-2xl ring-2 ring-blue-500/20 scale-[1.02]' : ''}
        `}
        onDoubleClick={onDoubleClick}
      >
        <div 
          {...attributes}
          {...listeners}
          className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-grab active:cursor-grabbing hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          onClick={onSelect}
        >
          <div className="flex items-center gap-2">
            <GripVertical size={16} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{scene.order + 1}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <Clock size={14} />
            <span>{estimatedDuration} min</span>
          </div>
        </div>
        
        <div className="flex-1 p-3 overflow-hidden" onClick={onSelect}>
          <h3 className="text-base font-medium text-black dark:text-white mb-1 line-clamp-1">
            {scene.heading || 'Untitled Scene'}
          </h3>
          <p className="text-sm text-black dark:text-gray-400 line-clamp-4">
            {scene.content || 'No content yet'}
          </p>
        </div>
        
        <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
          <span className="text-sm text-black dark:text-gray-400">{words} words</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(scene.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded transition-all"
            title="Delete scene"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group flex items-start gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg border transition-all select-none
        ${isCurrentScene 
          ? 'border-blue-500 shadow-md' 
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500'}
        ${isDragging ? 'shadow-2xl ring-2 ring-blue-500/20 scale-[1.02]' : ''}
      `}
      onDoubleClick={onDoubleClick}
    >
      <div
        {...attributes}
        {...listeners}
        className="mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing p-2 -m-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
      >
        <GripVertical size={20} />
      </div>
      
      <div className="flex-1 min-w-0" onClick={onSelect}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white">
              {scene.heading || 'Untitled Scene'}
            </h3>
            <p className="mt-1 text-sm text-black dark:text-gray-400 line-clamp-2">
              {scene.content || 'No content yet'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock size={14} />
            <span>{estimatedDuration} min</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-black dark:text-gray-400">Order:</span>
            <span className="font-medium text-black dark:text-white">#{scene.order + 1}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-black dark:text-gray-400">Words:</span>
            <span className="font-medium text-black dark:text-white">{words}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(scene.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded transition-all ml-auto"
            title="Delete scene"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
});

const ScenesView: React.FC = () => {
  const { scenes, currentSceneId, setCurrentScene, addScene, reorderScenes } = useScriptStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [cardSize, setCardSize] = useState<'normal' | 'compact'>('normal');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        delay: 0,
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !active) return;

    const activeScene = scenes.find(scene => scene.id === active.id);
    const overScene = scenes.find(scene => scene.id === over.id);

    if (!activeScene || !overScene || activeScene.id === overScene.id) return;

    const oldIndex = scenes.findIndex(scene => scene.id === active.id);
    const newIndex = scenes.findIndex(scene => scene.id === over.id);

    if (oldIndex !== newIndex) {
      const updatedScenes = arrayMove(scenes, oldIndex, newIndex).map((scene, index) => ({
        ...scene,
        order: index,
      }));
      reorderScenes(updatedScenes);
    }
  }, [scenes, reorderScenes]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    setIsDragging(false);
  }, []);

  const filteredScenes = React.useMemo(() => {
    if (!searchQuery) return scenes;
    const query = searchQuery.toLowerCase();
    return scenes.filter(scene => 
      scene.heading.toLowerCase().includes(query) ||
      scene.content.toLowerCase().includes(query)
    );
  }, [scenes, searchQuery]);

  const sortedScenes = React.useMemo(() => {
    return [...filteredScenes].sort((a, b) => a.order - b.order);
  }, [filteredScenes]);

  const handleAddScene = useCallback(() => {
    addScene({
      id: uuidv4(),
      heading: 'INT. NEW SCENE',
      content: '',
      order: scenes.length,
    });
  }, [scenes.length, addScene]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-screen-xl mx-auto p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search scenes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCardSize(prev => prev === 'normal' ? 'compact' : 'normal')}
                className="btn btn-secondary"
                title={cardSize === 'normal' ? 'Compact View' : 'Normal View'}
              >
                {cardSize === 'normal' ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button 
                onClick={handleAddScene}
                className="btn btn-primary"
              >
                <Plus size={20} />
                Add Scene
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scene Grid */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className={`grid gap-4 ${
              cardSize === 'normal' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            }`}>
              <SortableContext
                items={sortedScenes.map(scene => scene.id)}
                strategy={rectSortingStrategy}
              >
                {sortedScenes.map((scene) => (
                  <SortableSceneItem
                    key={scene.id}
                    scene={scene}
                    isCurrentScene={currentSceneId === scene.id}
                    onSelect={() => setCurrentScene(scene.id)}
                    onDoubleClick={() => setEditingSceneId(scene.id)}
                    viewMode={viewMode}
                    cardSize={cardSize}
                  />
                ))}
              </SortableContext>
            </div>
            <DragOverlay>
              {activeId && isDragging ? (
                <div className="opacity-50">
                  {/* Render a preview of the dragged item */}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Add SceneEditor modal */}
      {editingSceneId && (
        <ModalSceneEditor
          sceneId={editingSceneId}
          onClose={() => setEditingSceneId(null)}
        />
      )}
    </div>
  );
};

export default ScenesView;