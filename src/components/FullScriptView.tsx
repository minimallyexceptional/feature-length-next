import React, { useState } from 'react';
import { FileText, Clock, FileDown, Download } from 'lucide-react';
import useScriptStore from '../store/scriptStore';
// @ts-ignore - fountain-js doesn't have proper type definitions
import { Fountain } from 'fountain-js';
import { exportFullScriptToPDF } from '../utils/pdfExport';
import { generateFountainScript } from '../utils/fountainExport';

const FullScriptView: React.FC = () => {
  const { scenes, titlePage } = useScriptStore();
  const [showTitlePage, setShowTitlePage] = useState(true);
  const [showSceneNumbers, setShowSceneNumbers] = useState(false);
  const [doubleSpaceBetweenScenes, setDoubleSpaceBetweenScenes] = useState(false);

  // Combine all scenes into a single script with proper fountain syntax
  const fullScript = scenes
    .sort((a, b) => a.order - b.order)
    .map((scene, index) => {
      // Format scene heading according to fountain syntax
      const heading = scene.heading.trim();
      // Scene headings in Fountain must start with INT, EXT, EST, INT./EXT, I/E
      const formattedHeading = heading.match(/^(INT|EXT|EST|INT\.\/EXT|I\/E)/i) 
        ? heading 
        : `INT. ${heading}`;
      
      // Add scene number if enabled
      const sceneNumber = showSceneNumbers ? ` #${index + 1}` : '';
      
      // Add proper spacing for fountain parsing
      const content = `${formattedHeading}${sceneNumber}\n\n${scene.content}`;
      
      // Add extra newline if double spacing is enabled
      return doubleSpaceBetweenScenes ? `${content}\n` : content;
    })
    .join('\n\n');

  // Parse the script using fountain-js
  const fountain = new Fountain();
  const parsed = fountain.parse(fullScript);

  // Calculate script statistics
  const words = fullScript.trim().split(/\s+/).filter(word => word.length > 0).length;
  const pages = Math.ceil(words / 250); // Approximate: 250 words per page
  const estimatedDuration = Math.ceil((words / 500) * 60); // Approximate: 500 words per minute

  const handleExportPDF = () => {
    exportFullScriptToPDF(scenes, {
      includeTitlePage: showTitlePage,
      includeSceneNumbers: showSceneNumbers,
      doubleSpaceBetweenScenes: doubleSpaceBetweenScenes,
    });
  };

  const handleExportFountain = () => {
    const fountainContent = generateFountainScript(scenes, {
      includeTitlePage: showTitlePage,
      includeSceneNumbers: showSceneNumbers,
      doubleSpaceBetweenScenes: doubleSpaceBetweenScenes,
    });
    const blob = new Blob([fountainContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'screenplay.fountain';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex">
      {/* Script Preview */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="max-w-screen-xl mx-auto flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Full Script</h2>
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span>{pages} pages</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{estimatedDuration} mins</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-screen-xl mx-auto p-8">
            <div className="max-w-2xl mx-auto">
              {/* Title Page Preview */}
              {showTitlePage && (
                <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow-sm font-mono mb-8">
                  <div className="text-center space-y-8">
                    <h1 className="text-3xl font-bold uppercase text-gray-900 dark:text-white">{titlePage.title}</h1>
                    {titlePage.author && (
                      <p className="text-lg text-gray-800 dark:text-gray-200">by<br />{titlePage.author}</p>
                    )}
                    {titlePage.contact && (
                      <p className="text-sm text-gray-700 dark:text-gray-300">{titlePage.contact}</p>
                    )}
                    <div className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                      {titlePage.copyright && <p>{titlePage.copyright}</p>}
                      {titlePage.date && <p>{titlePage.date}</p>}
                    </div>
                    {titlePage.notes && (
                      <p className="text-sm italic text-gray-600 dark:text-gray-400">{titlePage.notes}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Script Content Preview */}
              <div 
                className={`bg-white dark:bg-gray-800 p-12 rounded-lg shadow-sm font-mono leading-relaxed screenplay-preview ${
                  doubleSpaceBetweenScenes ? 'space-y-8' : 'space-y-4'
                }`}
                dangerouslySetInnerHTML={{ __html: parsed.html.script }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Export Panel */}
      <div className="w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-medium text-gray-800 dark:text-white">Export Options</h3>
        </div>
        
        <div className="p-4 space-y-4">
          <button 
            onClick={handleExportPDF}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileDown size={18} />
              <span>Export as PDF</span>
            </div>
            <span className="text-sm opacity-80">.pdf</span>
          </button>

          <button 
            onClick={handleExportFountain}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 
              border border-gray-200 dark:border-gray-700 rounded-lg 
              hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
              text-gray-900 dark:text-white"
          >
            <div className="flex items-center gap-2">
              <Download size={18} />
              <span>Download Fountain</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">.fountain</span>
          </button>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Export Settings</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={showTitlePage}
                  onChange={(e) => setShowTitlePage(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 
                    focus:ring-blue-500 dark:bg-gray-700"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Include title page</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={showSceneNumbers}
                  onChange={(e) => setShowSceneNumbers(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 
                    focus:ring-blue-500 dark:bg-gray-700"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Include scene numbers</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={doubleSpaceBetweenScenes}
                  onChange={(e) => setDoubleSpaceBetweenScenes(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 
                    focus:ring-blue-500 dark:bg-gray-700"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Double space between scenes</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScriptView;