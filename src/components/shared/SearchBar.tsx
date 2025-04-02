import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = 'Search...', 
  value, 
  onChange,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500
          bg-white dark:bg-gray-800 
          text-gray-900 dark:text-white
          placeholder-gray-500 dark:placeholder-gray-400"
      />
    </div>
  );
};

export default SearchBar; 