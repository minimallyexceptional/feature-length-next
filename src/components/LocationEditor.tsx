import React from 'react';
import useScriptStore from '../store/scriptStore';
import Button from './shared/Button';
import { X } from 'lucide-react';
import { Location } from '../types';

interface LocationEditorProps {
  locationId: string;
  onClose: () => void;
}

const LocationEditor: React.FC<LocationEditorProps> = ({ locationId, onClose }) => {
  const { locations, updateLocation } = useScriptStore();
  const location = locations.find(l => l.id === locationId);

  if (!location) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateLocation(locationId, { name: e.target.value } as any);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateLocation(locationId, { description: e.target.value } as any);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Edit Location</h2>
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
              Location Name
            </label>
            <input
              id="name"
              type="text"
              value={location.name}
              onChange={handleNameChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Location name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={location.description}
              onChange={handleDescriptionChange}
              rows={8}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Describe the location..."
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

export default LocationEditor;