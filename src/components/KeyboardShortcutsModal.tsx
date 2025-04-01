import React from 'react';
import { X } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutSection {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

const shortcuts: ShortcutSection[] = [
  {
    title: 'General',
    shortcuts: [
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Ctrl', 'S'], description: 'Save current draft' },
      { keys: ['Ctrl', '/'], description: 'Toggle dark mode' },
      { keys: ['Ctrl', 'B'], description: 'Create backup' },
      { keys: ['Ctrl', 'E'], description: 'Export script' },
    ]
  },
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['Ctrl', '1'], description: 'Go to Title Page' },
      { keys: ['Ctrl', '2'], description: 'Go to Script Editor' },
      { keys: ['Ctrl', '3'], description: 'Go to Scenes' },
      { keys: ['Ctrl', '4'], description: 'Go to Characters' },
      { keys: ['Ctrl', '5'], description: 'Go to Locations' },
      { keys: ['Ctrl', '6'], description: 'Go to Drafts' },
      { keys: ['Alt', '←'], description: 'Previous scene' },
      { keys: ['Alt', '→'], description: 'Next scene' },
    ]
  },
  {
    title: 'Editor',
    shortcuts: [
      { keys: ['@'], description: 'Insert character' },
      { keys: ['#'], description: 'Insert location' },
      { keys: ['Ctrl', 'Z'], description: 'Undo' },
      { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo' },
      { keys: ['Ctrl', 'Enter'], description: 'New scene' },
      { keys: ['Ctrl', 'Backspace'], description: 'Delete scene' },
      { keys: ['Ctrl', '\\'], description: 'Toggle preview' },
      { keys: ['F11'], description: 'Toggle zen mode' },
    ]
  },
  {
    title: 'Scene Management',
    shortcuts: [
      { keys: ['Ctrl', 'Up'], description: 'Move scene up' },
      { keys: ['Ctrl', 'Down'], description: 'Move scene down' },
      { keys: ['Ctrl', 'N'], description: 'New scene' },
      { keys: ['Ctrl', 'D'], description: 'Duplicate scene' },
    ]
  }
];

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {shortcuts.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  {section.title}
                </h3>
                <div className="space-y-3">
                  {section.shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="px-2 py-1 text-sm font-semibold bg-gray-100 dark:bg-gray-700 
                              text-gray-800 dark:text-gray-200 rounded-md border border-gray-200 
                              dark:border-gray-600 shadow-sm">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-gray-400 dark:text-gray-500">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {shortcut.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal; 