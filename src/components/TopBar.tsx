import React from 'react';
import { FileText, Users, MapPin, BookOpen, Archive, Settings, Type, Download, Save, HelpCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import Button from './shared/Button';

interface TopBarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onShowBackup: () => void;
  onShowShortcuts: () => void;
}

const views = [
  { id: 'title', label: 'Title Page', icon: Type },
  { id: 'editor', label: 'Script Editor', icon: FileText },
  { id: 'scenes', label: 'Scenes', icon: BookOpen },
  { id: 'characters', label: 'Characters', icon: Users },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'drafts', label: 'Drafts', icon: Archive },
];

const TopBar: React.FC<TopBarProps> = ({ currentView, onViewChange, onShowBackup, onShowShortcuts }) => {
  return (
    <div className="bg-white dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800/50">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Screenplay</h1>
            
            <nav className="flex items-center space-x-1 px-2 py-1 bg-gray-100/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-full">
              {views.map((view) => {
                const Icon = view.icon;
                return (
                  <button
                    key={view.id}
                    onClick={() => onViewChange(view.id)}
                    className={`nav-item ${
                      currentView === view.id ? 'nav-item-active' : 'nav-item-inactive'
                    }`}
                  >
                    <Icon size={18} />
                    {view.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onShowShortcuts}
              className="nav-item nav-item-inactive"
              title="Keyboard Shortcuts (Press ?)"
            >
              <HelpCircle size={18} />
              <span className="hidden sm:inline">Help</span>
            </button>
            <Button
              variant="secondary"
              icon={<Save size={18} />}
              onClick={onShowBackup}
              title="Create Backup (Ctrl+B)"
            >
              <span className="hidden sm:inline">Backup</span>
            </Button>
            <Button 
              variant="primary"
              onClick={() => onViewChange('export')}
            >
              Export
            </Button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-2" />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;