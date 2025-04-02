import React, { useEffect, useRef, useState } from 'react';
import useScriptStore from '../store/scriptStore';
import EditorToolbar from './EditorToolbar';
import EditorStatusBar from './EditorStatusBar';
import CharacterAutocomplete from './CharacterAutocomplete';
import LocationAutocomplete from './LocationAutocomplete';
import ZenModeEditor from './ZenModeEditor';
import PreviewThemeToggle from './PreviewThemeToggle';
import { X } from 'lucide-react';

const SCENE_INDICATORS = ['INT', 'EXT', 'INT.', 'EXT.', 'I/E', 'EST'];
const AUTO_SAVE_INTERVAL = 3000; // 3 seconds

interface ModalSceneEditorProps {
  sceneId: string;
  onClose: () => void;
}

const ModalSceneEditor: React.FC<ModalSceneEditorProps> = ({ sceneId, onClose }) => {
  const { scenes, currentSceneId, updateScene, addScene, previewTheme } = useScriptStore();
  const currentScene = scenes.find(scene => scene.id === sceneId);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isZenMode, setIsZenMode] = useState(false);
  const [characterAutocomplete, setCharacterAutocomplete] = useState<{
    show: boolean;
    query: string;
    position: { top: number; left: number };
  }>({
    show: false,
    query: '',
    position: { top: 0, left: 0 }
  });
  const [locationAutocomplete, setLocationAutocomplete] = useState<{
    show: boolean;
    query: string;
    position: { top: number; left: number };
  }>({
    show: false,
    query: '',
    position: { top: 0, left: 0 }
  });

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.height = 'auto';
      editorRef.current.style.height = editorRef.current.scrollHeight + 'px';
    }
  }, [currentScene?.content]);

  useEffect(() => {
    if (editorRef.current && currentScene && !isZenMode) {
      editorRef.current.focus();
    }
  }, [currentSceneId, isZenMode]);

  // Auto-save functionality
  useEffect(() => {
    if (!currentScene) return;

    const autoSaveTimer = setInterval(() => {
      updateScene(currentScene.id, {
        ...currentScene,
        content: currentScene.content
      } as any);
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(autoSaveTimer);
  }, [currentScene, updateScene]);

  const calculateCaretPosition = () => {
    const textarea = editorRef.current;
    const container = containerRef.current;
    if (!textarea || !container) return { top: 0, left: 0 };

    const { selectionStart } = textarea;
    const text = textarea.value.substring(0, selectionStart);
    const lines = text.split('\n');
    const currentLine = lines[lines.length - 1];

    const measureDiv = document.createElement('div');
    measureDiv.style.cssText = window.getComputedStyle(textarea).cssText;
    measureDiv.style.height = 'auto';
    measureDiv.style.width = textarea.offsetWidth + 'px';
    measureDiv.style.position = 'absolute';
    measureDiv.style.visibility = 'hidden';
    measureDiv.style.whiteSpace = 'pre-wrap';
    measureDiv.style.wordWrap = 'break-word';
    measureDiv.textContent = text;

    document.body.appendChild(measureDiv);
    
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight || '20');
    const caretTop = measureDiv.offsetHeight;
    const caretLeft = currentLine.length * 8;

    document.body.removeChild(measureDiv);

    const containerRect = container.getBoundingClientRect();
    const textareaRect = textarea.getBoundingClientRect();

    return {
      top: textareaRect.top - containerRect.top + caretTop - textarea.scrollTop,
      left: textareaRect.left - containerRect.left + caretLeft - textarea.scrollLeft + 8
    };
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!editorRef.current) return;

    if (e.key === '@') {
      const position = calculateCaretPosition();
      setCharacterAutocomplete({
        show: true,
        query: '',
        position
      });
    }

    if (e.key === '#') {
      const position = calculateCaretPosition();
      setLocationAutocomplete({
        show: true,
        query: '',
        position
      });
    }

    if (e.key === 'Escape') {
      if (characterAutocomplete.show) {
        e.preventDefault();
        setCharacterAutocomplete(prev => ({ ...prev, show: false }));
      }
      if (locationAutocomplete.show) {
        e.preventDefault();
        setLocationAutocomplete(prev => ({ ...prev, show: false }));
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    if (!currentScene) return;
    
    updateScene(currentScene.id, { 
      ...currentScene,
      content: newContent 
    } as any);

    const textBeforeCursor = newContent.slice(0, cursorPosition);
    const currentLine = textBeforeCursor.split('\n').pop() || '';

    const matchingIndicator = SCENE_INDICATORS.find(indicator => 
      currentLine.trim().toUpperCase() === indicator ||
      currentLine.trim().toUpperCase().startsWith(indicator + ' ')
    );

    if (matchingIndicator) {
      const query = currentLine.trim().slice(matchingIndicator.length).trim();
      const position = calculateCaretPosition();
      setLocationAutocomplete({
        show: true,
        query,
        position
      });
    } else if (!currentLine.includes(' ')) {
      setLocationAutocomplete(prev => ({ ...prev, show: false }));
    }

    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtSymbol >= 0 && cursorPosition > lastAtSymbol) {
      const query = textBeforeCursor.slice(lastAtSymbol + 1);
      const position = calculateCaretPosition();
      setCharacterAutocomplete({
        show: true,
        query,
        position
      });
    } else {
      setCharacterAutocomplete(prev => ({ ...prev, show: false }));
    }

    const lastHashSymbol = textBeforeCursor.lastIndexOf('#');
    
    if (lastHashSymbol >= 0 && cursorPosition > lastHashSymbol) {
      const query = textBeforeCursor.slice(lastHashSymbol + 1);
      const position = calculateCaretPosition();
      setLocationAutocomplete({
        show: true,
        query,
        position
      });
    }

    if (editorRef.current) {
      editorRef.current.style.height = 'auto';
      editorRef.current.style.height = editorRef.current.scrollHeight + 'px';
    }
  };

  const handleCharacterSelect = (name: string) => {
    if (!editorRef.current || !currentScene) return;

    const textarea = editorRef.current;
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = textarea.value.slice(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtSymbol >= 0) {
      const newContent = 
        textarea.value.slice(0, lastAtSymbol) +
        name +
        '\n' +
        textarea.value.slice(cursorPosition);
      
      updateScene(currentScene.id, { 
        ...currentScene!,
        content: newContent 
      } as any);
      
      setTimeout(() => {
        const newPosition = lastAtSymbol + name.length + 1;
        textarea.setSelectionRange(newPosition, newPosition);
        textarea.focus();
      }, 0);
    }

    setCharacterAutocomplete(prev => ({ ...prev, show: false }));
  };

  const handleLocationSelect = (name: string) => {
    if (!editorRef.current || !currentScene) return;

    const textarea = editorRef.current;
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = textarea.value.slice(0, cursorPosition);
    const currentLine = textBeforeCursor.split('\n').pop() || '';
    
    const matchingIndicator = SCENE_INDICATORS.find(indicator => 
      currentLine.trim().toUpperCase().startsWith(indicator)
    );

    if (matchingIndicator) {
      const sceneHeading = `${matchingIndicator} ${name}`;
      addScene({
        id: crypto.randomUUID(),
        heading: sceneHeading,
        content: '',
        order: scenes.length,
      });
    } else {
      const lastHashSymbol = textBeforeCursor.lastIndexOf('#');
      if (lastHashSymbol >= 0) {
        const newContent = 
          textarea.value.slice(0, lastHashSymbol) +
          name +
          '\n' +
          textarea.value.slice(cursorPosition);
        
        updateScene(currentScene.id, { 
          ...currentScene!,
          content: newContent 
        } as any);
        
        setTimeout(() => {
          const newPosition = lastHashSymbol + name.length + 1;
          textarea.setSelectionRange(newPosition, newPosition);
          textarea.focus();
        }, 0);
      }
    }

    setLocationAutocomplete(prev => ({ ...prev, show: false }));
  };

  if (!currentScene) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        Select a scene to start editing
      </div>
    );
  }

  const handleHeadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentScene) return;
    
    updateScene(currentScene.id, {
      ...currentScene,
      heading: e.target.value
    } as any);
  };

  const handleToolbarInsert = (text: string) => {
    if (!editorRef.current) return;
    const { selectionStart, selectionEnd } = editorRef.current;
    const newContent = currentScene.content.slice(0, selectionStart) + text + currentScene.content.slice(selectionEnd);
    updateScene(currentScene.id, { ...currentScene, content: newContent } as any);
  };

  if (isZenMode) {
    return (
      <ZenModeEditor
        scene={currentScene}
        onUpdate={(content) => {
          if (!currentScene) return;
          updateScene(currentScene.id, {
            ...currentScene,
            content
          } as any);
        }}
        onExit={() => setIsZenMode(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={containerRef} className="w-full max-w-4xl h-[90vh] bg-white dark:bg-gray-900 rounded-lg shadow-xl flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <input
            type="text"
            value={currentScene.heading}
            onChange={e => updateScene(currentScene.id, { ...currentScene, heading: e.target.value } as any)}
            className="bg-transparent text-xl font-semibold w-full focus:outline-none text-black dark:text-white"
            placeholder="Scene Heading"
          />
          <div className="flex items-center space-x-2">
            <PreviewThemeToggle />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <EditorToolbar 
          onInsert={handleToolbarInsert}
          isZenMode={isZenMode}
          onToggleZenMode={() => setIsZenMode(true)}
        />
        
        <div className="flex-1 relative">
          <textarea
            ref={editorRef}
            value={currentScene.content}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            className="w-full h-full p-4 bg-transparent resize-none focus:outline-none font-mono text-black dark:text-white"
            placeholder="Start writing your scene..."
          />
          
          {characterAutocomplete.show && (
            <CharacterAutocomplete
              query={characterAutocomplete.query}
              position={characterAutocomplete.position}
              onSelect={handleCharacterSelect}
              onClose={() => setCharacterAutocomplete(prev => ({ ...prev, show: false }))}
            />
          )}
          
          {locationAutocomplete.show && (
            <LocationAutocomplete
              query={locationAutocomplete.query}
              position={locationAutocomplete.position}
              onSelect={handleLocationSelect}
              onClose={() => setLocationAutocomplete(prev => ({ ...prev, show: false }))}
            />
          )}
        </div>
        
        <EditorStatusBar content={currentScene.content} />
      </div>
    </div>
  );
};

export default ModalSceneEditor;