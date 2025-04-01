import React, { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import SceneNavigator from './components/SceneNavigator';
import SceneEditor from './components/SceneEditor';
import ScriptPreview from './components/ScriptPreview';
import TopBar from './components/TopBar';
import ScenesView from './components/ScenesView';
import CharactersView from './components/CharactersView';
import LocationsView from './components/LocationsView';
import FullScriptView from './components/FullScriptView';
import DraftsView from './components/DraftsView';
import TitlePageEditor from './components/TitlePageEditor';
import ExportView from './components/ExportView';
import BackupDialog from './components/BackupDialog';
import useThemeStore from './store/themeStore';
import useScriptStore from './store/scriptStore';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';

function App() {
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);
  const [isNavigatorCollapsed, setIsNavigatorCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('editor');
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { 
    scenes, 
    currentSceneId, 
    setCurrentScene,
    saveDraft
  } = useScriptStore();

  useEffect(() => {
    // Update the document class when theme changes
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Show keyboard shortcuts
      if (e.key === '?') {
        e.preventDefault();
        setShowShortcutsModal(true);
        return;
      }

      // General shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            saveDraft('Auto-saved draft');
            break;
          case '/':
            e.preventDefault();
            toggleTheme();
            break;
          case 'b':
            e.preventDefault();
            setShowBackupDialog(true);
            break;
          case 'e':
            e.preventDefault();
            setCurrentView('export');
            break;
          // Navigation shortcuts
          case '1':
            e.preventDefault();
            setCurrentView('title');
            break;
          case '2':
            e.preventDefault();
            setCurrentView('editor');
            break;
          case '3':
            e.preventDefault();
            setCurrentView('scenes');
            break;
          case '4':
            e.preventDefault();
            setCurrentView('characters');
            break;
          case '5':
            e.preventDefault();
            setCurrentView('locations');
            break;
          case '6':
            e.preventDefault();
            setCurrentView('drafts');
            break;
          case '\\':
            e.preventDefault();
            setIsPreviewCollapsed(!isPreviewCollapsed);
            break;
        }
      }

      // Alt + Arrow keys for scene navigation
      if (e.altKey) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const currentIndex = scenes.findIndex(scene => scene.id === currentSceneId);
          if (currentIndex > 0) {
            setCurrentScene(scenes[currentIndex - 1].id);
          }
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          const currentIndex = scenes.findIndex(scene => scene.id === currentSceneId);
          if (currentIndex < scenes.length - 1) {
            setCurrentScene(scenes[currentIndex + 1].id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    toggleTheme, 
    isPreviewCollapsed, 
    scenes, 
    currentSceneId, 
    setCurrentScene,
    saveDraft
  ]);

  const renderView = () => {
    switch (currentView) {
      case 'editor':
        return (
          <PanelGroup direction="horizontal" className="h-full">
            <Panel 
              defaultSize={isNavigatorCollapsed ? 5 : 30}
              minSize={isNavigatorCollapsed ? 5 : 15}
              maxSize={isNavigatorCollapsed ? 5 : 30}
            >
              <SceneNavigator 
                isCollapsed={isNavigatorCollapsed} 
                onCollapse={() => setIsNavigatorCollapsed(!isNavigatorCollapsed)} 
              />
            </Panel>
            
            <PanelResizeHandle className="w-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors" />
            
            <Panel 
              defaultSize={isPreviewCollapsed ? 95 : 40}
              minSize={30}
              className="relative"
            >
              <SceneEditor />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20">
                <div className="relative right-[-11px]">
                  <button
                    onClick={() => setIsPreviewCollapsed(!isPreviewCollapsed)}
                    className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border dark:border-gray-700 
                      hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    aria-label={isPreviewCollapsed ? "Expand preview" : "Collapse preview"}
                  >
                    {isPreviewCollapsed ? (
                      <ChevronLeft size={16} className="text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </Panel>
            
            {!isPreviewCollapsed && (
              <>
                <PanelResizeHandle className="w-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors" />
                <Panel defaultSize={30} minSize={20}>
                  <ScriptPreview />
                </Panel>
              </>
            )}
          </PanelGroup>
        );
      case 'title':
        return <TitlePageEditor />;
      case 'scenes':
        return <ScenesView />;
      case 'characters':
        return <CharactersView />;
      case 'locations':
        return <LocationsView />;
      case 'drafts':
        return <DraftsView onViewChange={setCurrentView} />;
      case 'export':
        return <ExportView />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <TopBar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onShowBackup={() => setShowBackupDialog(true)}
        onShowShortcuts={() => setShowShortcutsModal(true)}
      />
      
      <main className="flex-1 overflow-hidden">
        {renderView()}
      </main>

      {showBackupDialog && (
        <BackupDialog onClose={() => setShowBackupDialog(false)} />
      )}
      <KeyboardShortcutsModal 
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />
    </div>
  );
}

export default App;