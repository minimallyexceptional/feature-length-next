import React, { useRef, useState } from 'react';
import { Download, Upload, AlertCircle, Check } from 'lucide-react';
import useScriptStore from '../store/scriptStore';
import { exportProjectBackup, validateBackup, generateBackupFilename } from '../utils/projectBackup';

interface BackupDialogProps {
  onClose: () => void;
}

const BackupDialog: React.FC<BackupDialogProps> = ({ onClose }) => {
  const {
    scenes,
    characters,
    locations,
    drafts,
    titlePage,
    currentSceneId,
    currentCharacterId,
    currentLocationId,
    currentDraftId,
    loadBackup,
  } = useScriptStore();

  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const backup = exportProjectBackup(
      scenes,
      characters,
      locations,
      drafts,
      titlePage,
      currentSceneId,
      currentCharacterId,
      currentLocationId,
      currentDraftId
    );

    const filename = generateBackupFilename(titlePage.title);
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(false);

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const backup = JSON.parse(text);
      
      const errors = validateBackup(backup);
      if (errors.length > 0) {
        setImportError(`Invalid backup file: ${errors[0].message}`);
        return;
      }

      loadBackup(backup.data);
      setImportSuccess(true);
      setTimeout(onClose, 1500);
    } catch (error) {
      setImportError('Failed to parse backup file');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Project Backup
          </h2>

          <div className="space-y-4">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 
                bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Download size={20} />
                <span>Export Project Backup</span>
              </div>
              <span className="text-sm opacity-80">.json</span>
            </button>

            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-between gap-3 px-4 py-3
                  border border-gray-200 dark:border-gray-700 rounded-lg
                  hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                  text-gray-900 dark:text-white"
              >
                <div className="flex items-center gap-2">
                  <Upload size={20} />
                  <span>Import Project Backup</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">.json</span>
              </button>
            </div>

            {importError && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle size={16} />
                {importError}
              </div>
            )}

            {importSuccess && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <Check size={16} />
                Project restored successfully
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 
              hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackupDialog;