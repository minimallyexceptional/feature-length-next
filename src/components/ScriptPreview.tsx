import React from 'react';
import useScriptStore from '../store/scriptStore';
import { FileDown, Sun, Moon } from 'lucide-react';
// @ts-ignore - fountain-js doesn't have proper type definitions
import { Fountain } from 'fountain-js';
import { exportSceneToPDF } from '../utils/pdfExport';

const ScriptPreview: React.FC = () => {
  const { scenes, currentSceneId, previewTheme, setPreviewTheme } = useScriptStore();
  const currentScene = scenes.find(scene => scene.id === currentSceneId);

  if (!currentScene) {
    return (
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900">
          <h2 className="font-medium text-gray-800 dark:text-gray-200">Preview</h2>
          <button 
            disabled 
            className="flex items-center gap-2 px-3 py-1 text-sm text-gray-400 dark:text-gray-600 cursor-not-allowed"
          >
            <FileDown size={16} />
            Export PDF
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No scene selected</p>
        </div>
      </div>
    );
  }

  // Format the current scene in fountain syntax
  const sceneContent = `${currentScene.heading}\n\n${currentScene.content}`;

  // Parse the scene using fountain-js
  const fountain = new Fountain();
  const parsed = fountain.parse(sceneContent);

  // Create a container element and set its innerHTML to the parsed HTML
  const createMarkup = () => {
    return { __html: parsed.html.script };
  };

  const handleExport = () => {
    exportSceneToPDF(currentScene);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900">
        <h2 className="font-medium text-black dark:text-gray-200">Scene Preview</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewTheme(previewTheme === 'light' ? 'dark' : 'light')}
            className={`
              relative inline-flex items-center justify-center p-2
              rounded-lg text-sm font-medium
              transition-colors duration-200
              ${previewTheme === 'light' 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-800' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-100 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900'
              }
            `}
            title={`Switch preview to ${previewTheme === 'light' ? 'dark' : 'light'} mode`}
          >
            {previewTheme === 'light' ? (
              <Moon size={16} className="text-black dark:text-gray-300" />
            ) : (
              <Sun size={16} className="text-gray-300 dark:text-gray-600" />
            )}
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1 text-sm text-black dark:text-gray-300 
              hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          >
            <FileDown size={16} />
            Export Scene
          </button>
        </div>
      </div>
      
      <div 
        className={`flex-1 overflow-y-auto p-8 transition-colors duration-200 ${
          previewTheme === 'dark' 
            ? 'bg-[#1a1b26]' 
            : 'bg-white'
        }`}
        style={{ 
          color: previewTheme === 'dark' ? '#e5e7eb' : '#000000'
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="font-mono leading-relaxed">
            <h2 
              className="text-lg font-bold mb-4"
              style={{ 
                color: previewTheme === 'dark' ? '#93c5fd' : '#000000'
              }}
            >
              {currentScene.heading}
            </h2>
            <div 
              className="whitespace-pre-wrap"
              style={{ 
                color: previewTheme === 'dark' ? '#e5e7eb' : '#000000'
              }}
            >
              {currentScene.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptPreview;