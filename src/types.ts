export interface TitlePage {
  title: string;
  author: string;
  contact: string;
  copyright: string;
  notes: string;
  date: string;
}

export interface Scene {
  id: string;
  heading: string;
  content: string;
  order: number;
  estimatedDuration?: number;
}

export interface Character {
  id: string;
  name: string;
  bio: string;
  order: number;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface Draft {
  id: string;
  name: string;
  createdAt: Date;
  scenes: Scene[];
  characters: Character[];
  locations: Location[];
  titlePage: TitlePage;
}

export interface ScriptState {
  scenes: Scene[];
  characters: Character[];
  locations: Location[];
  drafts: Draft[];
  titlePage: TitlePage;
  currentSceneId: string | null;
  currentCharacterId: string;
  currentLocationId: string;
  currentDraftId: string | null;
  previewTheme: 'light' | 'dark';
  setPreviewTheme: (theme: 'light' | 'dark') => void;
  addScene: (scene: Scene) => void;
  updateScene: (id: string, updatedScene: Scene) => void;
  reorderScenes: (scenes: Scene[]) => void;
  setCurrentScene: (id: string | null) => void;
  deleteScene: (id: string) => void;
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, updatedCharacter: Character) => void;
  reorderCharacters: (characters: Character[]) => void;
  setCurrentCharacter: (id: string) => void;
  addLocation: (location: Location) => void;
  updateLocation: (id: string, updatedLocation: Location) => void;
  reorderLocations: (locations: Location[]) => void;
  setCurrentLocation: (id: string) => void;
  saveDraft: (name: string) => void;
  loadDraft: (id: string) => void;
  deleteDraft: (id: string) => void;
  duplicateDraft: (id: string) => void;
  renameDraft: (id: string, newName: string) => void;
  updateTitlePage: (titlePage: TitlePage) => void;
  loadBackup: (backup: ScriptState) => void;
}