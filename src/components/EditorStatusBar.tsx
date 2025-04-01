import React from 'react';
import { Timer, Type, Hash, AlignJustify } from 'lucide-react';

interface StatusBarProps {
  content: string;
}

const EditorStatusBar: React.FC<StatusBarProps> = ({ content }) => {
  const calculateStats = (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const characters = text.length;
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    // Estimate scene duration (1 page ≈ 500 words ≈ 1 minute)
    const durationMinutes = Math.max(0.5, Math.ceil((words.length / 500) * 60) / 60);
    
    return {
      words: words.length,
      characters,
      lines: lines.length,
      duration: durationMinutes.toFixed(1)
    };
  };

  const stats = calculateStats(content);

  const items = [
    {
      icon: <Type size={14} />,
      label: 'Words',
      value: stats.words.toLocaleString()
    },
    {
      icon: <Hash size={14} />,
      label: 'Characters',
      value: stats.characters.toLocaleString()
    },
    {
      icon: <AlignJustify size={14} />,
      label: 'Lines',
      value: stats.lines.toLocaleString()
    },
    {
      icon: <Timer size={14} />,
      label: 'Duration',
      value: `${stats.duration} min${Number(stats.duration) !== 1 ? 's' : ''}`
    }
  ];

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-2">
      <div className="flex items-center justify-end gap-6">
        {items.map((item, index) => (
          <div
            key={item.label}
            className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400"
          >
            {item.icon}
            <span className="font-medium text-gray-700 dark:text-gray-300">{item.value}</span>
            <span className="text-gray-500 dark:text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorStatusBar;