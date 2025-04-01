import React from 'react';
import { Download } from 'lucide-react';
import useScriptStore from '../store/scriptStore';
import PreviewThemeToggle from './PreviewThemeToggle';

const ExportView: React.FC = () => {
  const { scenes, titlePage, previewTheme } = useScriptStore();

  const handleExport = () => {
    // Export logic here
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-black dark:text-white">Export Preview</h1>
        <div className="flex items-center gap-2">
          <PreviewThemeToggle />
          <button
            onClick={handleExport}
            className="btn btn-primary flex items-center gap-2"
          >
            <Download size={18} />
            <span>Export PDF</span>
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
        <div className="max-w-[8.5in] mx-auto">
          {/* Title Page */}
          <div className="mb-12 text-center">
            <h1 
              className="text-4xl font-bold mb-8"
              style={{ 
                color: previewTheme === 'dark' ? '#93c5fd' : '#000000'
              }}
            >
              {titlePage.title || 'Untitled Script'}
            </h1>
            <div className="space-y-4">
              <p style={{ color: previewTheme === 'dark' ? '#e5e7eb' : '#000000' }}>by</p>
              <p className="font-medium" style={{ color: previewTheme === 'dark' ? '#e5e7eb' : '#000000' }}>
                {titlePage.author || 'Anonymous'}
              </p>
              {titlePage.contact && (
                <p className="text-sm" style={{ color: previewTheme === 'dark' ? '#d1d5db' : '#000000' }}>
                  {titlePage.contact}
                </p>
              )}
              <div className="mt-8">
                {titlePage.date && (
                  <p className="text-sm" style={{ color: previewTheme === 'dark' ? '#d1d5db' : '#000000' }}>
                    {titlePage.date}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Scenes */}
          <div className="space-y-8">
            {scenes.map((scene) => (
              <div key={scene.id} className="space-y-4">
                <h2 
                  className="font-bold"
                  style={{ 
                    color: previewTheme === 'dark' ? '#93c5fd' : '#000000'
                  }}
                >
                  {scene.heading}
                </h2>
                <div 
                  className="whitespace-pre-wrap font-mono"
                  style={{ 
                    color: previewTheme === 'dark' ? '#e5e7eb' : '#000000'
                  }}
                >
                  {scene.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportView; 