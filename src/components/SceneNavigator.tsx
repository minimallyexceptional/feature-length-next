import React, { useState } from 'react';
import { GripVertical, Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
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
  AnimateLayoutChanges,
} from '@dnd-kit/sortable';
import useScriptStore from '../store/scriptStore';
import { Scene } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface SortableSceneProps {
  scene: Scene;
  isCurrentScene: boolean;
  onSelect: () => void;
  animateLayoutChanges: AnimateLayoutChanges;
}

interface SceneNavigatorProps {
  isCollapsed: boolean;
  onCollapse: () => void;
}

const SortableScene: React.FC<SortableSceneProps> = React.memo(({ scene, isCurrentScene, onSelect, animateLayoutChanges }) => {
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
    animateLayoutChanges,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition,
    zIndex: isDragging ? 10 : 0,
    scale: isDragging ? 1.02 : 1,
    opacity: isDragging ? 0.9 : 1,
  } : undefined;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this scene?')) {
      deleteScene(scene.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group flex items-center gap-2 p-2 cursor-pointer rounded-lg transition-all select-none
        ${isCurrentScene ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'}
        ${isDragging ? 'shadow-lg ring-2 ring-blue-500/20 scale-[1.02] bg-white dark:bg-gray-800' : ''}
      `}
      onClick={onSelect}
    >
      <div
        {...attributes}
        {...listeners}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing p-1 -m-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50"
      >
        <GripVertical size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">
          {scene.heading || 'Untitled Scene'}
        </div>
      </div>
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded transition-all"
        title="Delete scene"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
});

const SceneNavigator: React.FC<SceneNavigatorProps> = ({ isCollapsed, onCollapse }) => {
  const { scenes, currentSceneId, setCurrentScene, addScene, reorderScenes } = useScriptStore();
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

  const animateLayoutChanges: AnimateLayoutChanges = (args) => {
    const { isSorting } = args;
    if (!isSorting) return true;
    return false;
  };

  const handleAddScene = () => {
    addScene({
      id: uuidv4(),
      heading: 'INT. NEW SCENE',
      content: '',
      order: scenes.length,
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeScene = scenes.find(scene => scene.id === active.id);
    const overScene = scenes.find(scene => scene.id === over.id);

    if (!activeScene || !overScene) return;

    const oldIndex = scenes.findIndex(scene => scene.id === active.id);
    const newIndex = scenes.findIndex(scene => scene.id === over.id);

    if (oldIndex !== newIndex) {
      const updatedScenes = arrayMove(scenes, oldIndex, newIndex).map((scene, index) => ({
        ...scene,
        order: index,
      }));
      reorderScenes(updatedScenes);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
  };

  const sortedScenes = React.useMemo(() => {
    return [...scenes].sort((a, b) => a.order - b.order);
  }, [scenes]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 relative">
      <div className="absolute right-0 top-1/2 -translate-y-1/2">
        <button
          onClick={onCollapse}
          className="relative -right-3 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border dark:border-gray-700 
            hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label={isCollapsed ? "Expand scene list" : "Collapse scene list"}
        >
          {isCollapsed ? (
            <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronLeft size={16} className="text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      <div className={`p-4 border-b border-gray-200 dark:border-gray-800 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={handleAddScene}
          className={`
            group relative flex items-center justify-center gap-2 
            bg-blue-600 hover:bg-blue-700 active:bg-blue-800
            text-white font-medium
            rounded-lg shadow-sm hover:shadow
            transition-all duration-200 ease-in-out
            ${isCollapsed 
              ? 'w-10 h-10 p-0 mx-auto' 
              : 'w-full py-2.5 px-4'
            }
          `}
          title="Add new scene"
        >
          <Plus size={isCollapsed ? 20 : 16} />
          {!isCollapsed && <span>Add Scene</span>}
        </button>
      </div>
      
      {isCollapsed ? (
        <div className="flex-1 overflow-y-auto py-2 space-y-2 no-scrollbar">
          <div className="px-1.5">
            {sortedScenes.map((scene, index) => (
              <button
                key={scene.id}
                onClick={() => setCurrentScene(scene.id)}
                className={`
                  w-full aspect-square rounded-lg flex items-center justify-center transition-all select-none
                  text-sm font-medium relative group
                  ${currentSceneId === scene.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}
                  border border-gray-200 dark:border-gray-700
                `}
                title={scene.heading}
              >
                <span>{index + 1}</span>
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded 
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-10">
                  {scene.heading}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <SortableContext
              items={sortedScenes.map(scene => scene.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedScenes.map((scene) => (
                <SortableScene
                  key={scene.id}
                  scene={scene}
                  isCurrentScene={currentSceneId === scene.id}
                  onSelect={() => setCurrentScene(scene.id)}
                  animateLayoutChanges={animateLayoutChanges}
                />
              ))}
            </SortableContext>
          </div>
          <DragOverlay>
            {activeId ? (
              <div className="opacity-50">
                {/* Render a preview of the dragged item */}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

export default SceneNavigator;