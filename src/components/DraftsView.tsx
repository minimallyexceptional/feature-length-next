import React, { useState } from 'react';
import { Clock, FileText, Trash2, Save, Copy, Pencil } from 'lucide-react';
import useScriptStore from '../store/scriptStore';
import Button from './shared/Button';

interface DraftsViewProps {
  onViewChange: (view: string) => void;
}

interface RenameDialogProps {
  draftId: string;
  currentName: string;
  onClose: () => void;
}

const RenameDialog: React.FC<RenameDialogProps> = ({ draftId, currentName, onClose }) => {
  const { renameDraft } = useScriptStore();
  const [newName, setNewName] = useState(currentName);

  const handleRename = () => {
    if (newName.trim() && newName !== currentName) {
      renameDraft(draftId, newName.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Rename Draft</h3>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new name"
          className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500
            bg-white dark:bg-gray-900 
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            mb-4"
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleRename}
            disabled={!newName.trim() || newName === currentName}
          >
            Rename
          </Button>
        </div>
      </div>
    </div>
  );
};

const DraftsView: React.FC<DraftsViewProps> = ({ onViewChange }) => {
  const { drafts, currentDraftId, saveDraft, loadDraft, deleteDraft, duplicateDraft } = useScriptStore();
  const [newDraftName, setNewDraftName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [renamingDraft, setRenamingDraft] = useState<{ id: string; name: string } | null>(null);

  const handleSaveDraft = () => {
    if (newDraftName.trim()) {
      saveDraft(newDraftName.trim());
      setNewDraftName('');
      setShowSaveDialog(false);
    }
  };

  const handleLoadDraft = (draftId: string) => {
    loadDraft(draftId);
    onViewChange('editor');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date));
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Script Drafts</h2>
            <Button
              variant="primary"
              icon={<Save size={18} />}
              onClick={() => setShowSaveDialog(true)}
            >
              Save Current as Draft
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid gap-4">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className={`
                  bg-white dark:bg-gray-800 rounded-lg border transition-all
                  ${currentDraftId === draft.id 
                    ? 'border-blue-500 shadow-md' 
                    : 'border-gray-200 dark:border-gray-700'}
                `}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{draft.name}</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Last modified: {formatDate(draft.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoadDraft(draft.id)}
                      >
                        Load Draft
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Pencil size={18} />}
                        onClick={() => setRenamingDraft({ id: draft.id, name: draft.name })}
                        title="Rename draft"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Copy size={18} />}
                        onClick={() => duplicateDraft(draft.id)}
                        title="Duplicate draft"
                      />
                      {drafts.length > 1 && (
                        <Button
                          variant="danger"
                          size="sm"
                          icon={<Trash2 size={18} />}
                          onClick={() => deleteDraft(draft.id)}
                          title="Delete draft"
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <FileText size={16} />
                      <span>{draft.scenes.length} scenes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>
                        {Math.ceil(
                          draft.scenes.reduce((acc, scene) => 
                            acc + scene.content.split(/\s+/).length, 0
                          ) / 500 * 60
                        )} mins
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Save New Draft</h3>
            <input
              type="text"
              value={newDraftName}
              onChange={(e) => setNewDraftName(e.target.value)}
              placeholder="Enter draft name"
              className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                bg-white dark:bg-gray-900 
                text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowSaveDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveDraft}
                disabled={!newDraftName.trim()}
              >
                Save Draft
              </Button>
            </div>
          </div>
        </div>
      )}

      {renamingDraft && (
        <RenameDialog
          draftId={renamingDraft.id}
          currentName={renamingDraft.name}
          onClose={() => setRenamingDraft(null)}
        />
      )}
    </div>
  );
};

export default DraftsView;