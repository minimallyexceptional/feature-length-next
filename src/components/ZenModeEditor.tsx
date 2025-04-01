import React, { useEffect, useRef } from 'react';
import { Scene } from '../types';
// @ts-ignore - fountain-js doesn't have proper type definitions
import { Fountain } from 'fountain-js';

interface ZenModeEditorProps {
  scene: Scene;
  onUpdate: (content: string) => void;
  onExit: () => void;
}

const ZenModeEditor: React.FC<ZenModeEditorProps> = ({ scene, onUpdate, onExit }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [wordCount, setWordCount] = React.useState(0);
  const [showPreview, setShowPreview] = React.useState(true);

  useEffect(() => {
    // Focus textarea and lock scroll when entering zen mode
    if (textareaRef.current) {
      textareaRef.current.focus();
      document.body.style.overflow = 'hidden';
    }

    // Cleanup when exiting zen mode
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Update word count
  useEffect(() => {
    const words = scene.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(words);
  }, [scene.content]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Escape to exit
    if (e.key === 'Escape') {
      onExit();
      return;
    }

    // Toggle preview with Cmd/Ctrl + P
    if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
      e.preventDefault();
      setShowPreview(prev => !prev);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(e.target.value);
  };

  // Parse the scene using fountain-js
  const fountain = new Fountain();
  const sceneContent = `${scene.heading}\n\n${scene.content}`;
  const parsed = fountain.parse(sceneContent);

  return (
    <>
      <div className="zen-mode-overlay" />
      <div className="zen-mode-container">
        <div className="relative flex-1 flex">
          <div className={`flex-1 transition-all duration-300 ${showPreview ? 'border-r border-white/10' : ''}`}>
            <textarea
              ref={textareaRef}
              value={scene.content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="w-full h-full resize-none focus:outline-none font-mono zen-mode"
              placeholder="Start writing your scene... (Press ESC to exit, Cmd/Ctrl + P to toggle preview)"
            />
          </div>

          {showPreview && (
            <div className="flex-1 overflow-y-auto">
              <div 
                className="zen-mode screenplay-preview px-12 py-32"
                dangerouslySetInnerHTML={{ __html: parsed.html.script }}
              />
            </div>
          )}

          <div className="fixed bottom-8 flex gap-4 left-1/2 -translate-x-1/2">
            <div className="zen-mode-status-pill">
              Press ESC to exit
            </div>
            <div className="zen-mode-status-pill">
              {wordCount} words
            </div>
            <div className="zen-mode-status-pill">
              Cmd/Ctrl + P to toggle preview
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ZenModeEditor;