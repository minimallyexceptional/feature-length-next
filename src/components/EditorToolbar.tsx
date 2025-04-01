import React from 'react';
import {
  Bold,
  Italic,
  ArrowUpRight,
  MessageSquare,
  User,
  Parentheses,
  AlignCenter,
  Info,
  Timer,
  Maximize2,
  Minimize2,
  Moon,
  Sun
} from 'lucide-react';
import useThemeStore from '../store/themeStore';

interface ToolbarProps {
  onInsert: (text: string) => void;
  disabled?: boolean;
  isZenMode: boolean;
  onToggleZenMode: () => void;
}

const EditorToolbar: React.FC<ToolbarProps> = ({ onInsert, disabled, isZenMode, onToggleZenMode }) => {
  const { theme, toggleTheme } = useThemeStore();
  
  const tools = [
    {
      icon: <User size={18} />,
      label: 'Character',
      action: () => onInsert('\nJOHN DOE\n'),
      tooltip: 'Insert character name'
    },
    {
      icon: <MessageSquare size={18} />,
      label: 'Dialogue',
      action: () => onInsert('\nHello, world.\n'),
      tooltip: 'Insert dialogue'
    },
    {
      icon: <Parentheses size={18} />,
      label: 'Parenthetical',
      action: () => onInsert('\n(beat)\n'),
      tooltip: 'Insert parenthetical'
    },
    {
      icon: <ArrowUpRight size={18} />,
      label: 'Transition',
      action: () => onInsert('\nCUT TO:\n'),
      tooltip: 'Insert transition'
    },
    {
      icon: <AlignCenter size={18} />,
      label: 'Centered',
      action: () => onInsert('\n> THE END <\n'),
      tooltip: 'Insert centered text'
    },
    {
      icon: <Info size={18} />,
      label: 'Note',
      action: () => onInsert('\n[[Note: Add more detail here]]\n'),
      tooltip: 'Insert note'
    },
    {
      icon: <Timer size={18} />,
      label: 'Scene Duration',
      action: () => onInsert('\n[[Duration: 2 mins]]\n'),
      tooltip: 'Insert estimated scene duration'
    }
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-1">
          {tools.map((tool, index) => (
            <React.Fragment key={tool.label}>
              <button
                onClick={tool.action}
                disabled={disabled}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  text-gray-700 dark:text-gray-300`}
                title={tool.tooltip}
              >
                {tool.icon}
                <span className="sr-only">{tool.label}</span>
              </button>
              {index < tools.length - 1 && (
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-800" />
              )}
            </React.Fragment>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
              text-gray-700 dark:text-gray-300"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-800" />
          
          <button
            onClick={onToggleZenMode}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
              text-gray-700 dark:text-gray-300"
            title={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
          >
            {isZenMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;