import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useScriptStore from '../store/scriptStore';

const PreviewThemeToggle: React.FC = () => {
  const { previewTheme, setPreviewTheme } = useScriptStore();

  return (
    <button
      onClick={() => setPreviewTheme(previewTheme === 'light' ? 'dark' : 'light')}
      className={`
        relative inline-flex items-center justify-center p-2
        rounded-lg text-sm font-medium
        transition-colors duration-200
        ${previewTheme === 'light' 
          ? 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100' 
          : 'bg-gray-800 hover:bg-gray-700 text-gray-100 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900'
        }
      `}
      title={`Switch preview to ${previewTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="sr-only">
        Switch preview to {previewTheme === 'light' ? 'dark' : 'light'} mode
      </span>
      {previewTheme === 'light' ? (
        <Sun size={18} className="text-gray-600 dark:text-gray-300" />
      ) : (
        <Moon size={18} className="text-gray-300 dark:text-gray-600" />
      )}
    </button>
  );
};

export default PreviewThemeToggle; 