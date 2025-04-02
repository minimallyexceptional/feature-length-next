import React from 'react';
import useScriptStore from '../store/scriptStore';
import Button from './shared/Button';
import { X } from 'lucide-react';
import { Character } from '../types';

interface CharacterEditorProps {
  characterId: string;
  onClose: () => void;
}

const CharacterEditor: React.FC<CharacterEditorProps> = ({ characterId, onClose }) => {
  const { characters, updateCharacter } = useScriptStore();
  const character = characters.find(c => c.id === characterId);

  if (!character) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCharacter(characterId, { name: e.target.value } as any);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCharacter(characterId, { bio: e.target.value } as any);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Edit Character</h2>
          <Button
            variant="ghost"
            size="sm"
            icon={<X size={18} />}
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          />
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={character.name}
              onChange={handleNameChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Character name"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Biography
            </label>
            <textarea
              id="bio"
              value={character.bio}
              onChange={handleBioChange}
              rows={8}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Write a brief biography of the character..."
            />
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end">
          <Button
            variant="primary"
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CharacterEditor;