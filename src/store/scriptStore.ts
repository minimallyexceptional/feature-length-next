import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Scene, Character, Location, Draft, ScriptState, TitlePage } from '../types';

const defaultScene: Omit<Scene, 'id'> = {
  heading: 'INT./EXT. BLOOM HOUSE - (PRESENT) DAY',
  content: `The front door opens to reveal Will and Josephine on the porch with their bags.  REVERSE to Will's mother Sandra (53), surprised and a little annoyed. 

SANDRA
How did you get here?

WILL
We swam.  The Atlantic, it's not that big really.`,
  order: 0,
};

const defaultCharacter: Omit<Character, 'id'> = {
  name: 'Will',
  bio: 'A charming and witty protagonist with a penchant for sarcasm.',
  order: 0,
};

const defaultLocation: Omit<Location, 'id'> = {
  name: 'Bloom House',
  description: 'A charming Victorian home with wraparound porch, slightly weathered but well-maintained.',
  order: 0,
};

const defaultTitlePage: TitlePage = {
  title: 'Untitled Screenplay',
  author: '',
  contact: '',
  copyright: `© ${new Date().getFullYear()}`,
  notes: '',
  date: new Date().toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }),
};

export interface ScriptState {
  scenes: Scene[];
  characters: Character[];
  locations: Location[];
  drafts: Draft[];
  titlePage: TitlePage;
  currentSceneId: string | null;
  currentCharacterId: string;
  currentLocationId: string;
  currentDraftId: string;
  previewTheme: 'light' | 'dark';
  setPreviewTheme: (theme: 'light' | 'dark') => void;
  addScene: (scene: Scene) => void;
  updateScene: (id: string, updatedScene: Scene) => void;
  reorderScenes: (scenes: Scene[]) => void;
  setCurrentScene: (id: string) => void;
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

const useScriptStore = create<ScriptState>((set) => {
  // Create initial scene, character, and location with UUIDs
  const initialScene = { ...defaultScene, id: uuidv4() };
  const initialCharacter = { ...defaultCharacter, id: uuidv4() };
  const initialLocation = { ...defaultLocation, id: uuidv4() };

  // Create initial draft
  const initialDraft: Draft = {
    id: uuidv4(),
    name: 'Initial Draft',
    createdAt: new Date().toISOString(),
    scenes: [initialScene],
    characters: [initialCharacter],
    locations: [initialLocation],
    titlePage: defaultTitlePage,
  };

  return {
    scenes: [initialScene],
    characters: [initialCharacter],
    locations: [initialLocation],
    drafts: [initialDraft],
    titlePage: defaultTitlePage,
    currentSceneId: initialScene.id,
    currentCharacterId: initialCharacter.id,
    currentLocationId: initialLocation.id,
    currentDraftId: initialDraft.id,
    previewTheme: 'light' as const,
    setPreviewTheme: (theme: 'light' | 'dark') => set({ previewTheme: theme }),
    
    addScene: (scene) => set((state) => {
      const newScene = { ...scene, id: uuidv4() };
      const newScenes = [...state.scenes, newScene];
      
      // Update current draft if one is selected
      const updatedDrafts = state.currentDraftId 
        ? state.drafts.map(draft => 
            draft.id === state.currentDraftId 
              ? { ...draft, scenes: newScenes, createdAt: new Date() }
              : draft
          )
        : state.drafts;

      return {
        scenes: newScenes,
        drafts: updatedDrafts,
        currentSceneId: newScene.id,
      };
    }),
    
    updateScene: (id, updatedScene) => set((state) => {
      const newScenes = state.scenes.map((scene) =>
        scene.id === id ? { ...scene, ...updatedScene } : scene
      );

      // Update current draft if one is selected
      const updatedDrafts = state.currentDraftId 
        ? state.drafts.map(draft => 
            draft.id === state.currentDraftId 
              ? { ...draft, scenes: newScenes, createdAt: new Date() }
              : draft
          )
        : state.drafts;

      return {
        scenes: newScenes,
        drafts: updatedDrafts,
      };
    }),
    
    reorderScenes: (scenes) => set((state) => {
      const newScenes = scenes.map((scene) => ({
        ...scene,
        ...state.scenes.find((s) => s.id === scene.id),
        order: scene.order,
      }));

      // Update current draft if one is selected
      const updatedDrafts = state.currentDraftId 
        ? state.drafts.map(draft => 
            draft.id === state.currentDraftId 
              ? { ...draft, scenes: newScenes, createdAt: new Date() }
              : draft
          )
        : state.drafts;

      return {
        scenes: newScenes,
        drafts: updatedDrafts,
      };
    }),
    
    setCurrentScene: (id) => set({ currentSceneId: id }),

    deleteScene: (id: string) => set((state) => {
      const newScenes = state.scenes.filter(scene => scene.id !== id);
      
      // Update current draft if one is selected
      const updatedDrafts = state.currentDraftId 
        ? state.drafts.map(draft => 
            draft.id === state.currentDraftId 
              ? { ...draft, scenes: newScenes, createdAt: new Date() }
              : draft
          )
        : state.drafts;

      return {
        scenes: newScenes,
        drafts: updatedDrafts,
        // If we're deleting the current scene, select the first available scene
        currentSceneId: state.currentSceneId === id 
          ? newScenes[0]?.id || null 
          : state.currentSceneId,
      };
    }),

    addCharacter: (character) => set((state) => {
      const newCharacter = { ...character, id: uuidv4() };
      const newCharacters = [...state.characters, newCharacter];

      // Update current draft if one is selected
      const updatedDrafts = state.currentDraftId 
        ? state.drafts.map(draft => 
            draft.id === state.currentDraftId 
              ? { ...draft, characters: newCharacters, createdAt: new Date() }
              : draft
          )
        : state.drafts;

      return {
        characters: newCharacters,
        drafts: updatedDrafts,
        currentCharacterId: newCharacter.id,
      };
    }),
    
    updateCharacter: (id, updatedCharacter) => set((state) => {
      const newCharacters = state.characters.map((character) =>
        character.id === id ? { ...character, ...updatedCharacter } : character
      );

      // Update current draft if one is selected
      const updatedDrafts = state.currentDraftId 
        ? state.drafts.map(draft => 
            draft.id === state.currentDraftId 
              ? { ...draft, characters: newCharacters, createdAt: new Date() }
              : draft
          )
        : state.drafts;

      return {
        characters: newCharacters,
        drafts: updatedDrafts,
      };
    }),
    
    reorderCharacters: (characters) => set((state) => {
      const newCharacters = characters.map((character) => ({
        ...character,
        ...state.characters.find((c) => c.id === character.id),
        order: character.order,
      }));

      // Update current draft if one is selected
      const updatedDrafts = state.currentDraftId 
        ? state.drafts.map(draft => 
            draft.id === state.currentDraftId 
              ? { ...draft, characters: newCharacters, createdAt: new Date() }
              : draft
          )
        : state.drafts;

      return {
        characters: newCharacters,
        drafts: updatedDrafts,
      };
    }),
    
    setCurrentCharacter: (id) => set({ currentCharacterId: id }),

    addLocation: (location) => set((state) => {
      const newLocation = { ...location, id: uuidv4() };
      const newLocations = [...state.locations, newLocation];

      // Update current draft if one is selected
      const updatedDrafts = state.currentDraftId 
        ? state.drafts.map(draft => 
            draft.id === state.currentDraftId 
              ? { ...draft, locations: newLocations, createdAt: new Date() }
              : draft
          )
        : state.drafts;

      return {
        locations: newLocations,
        drafts: updatedDrafts,
        currentLocationId: newLocation.id,
      };
    }),
    
    updateLocation: (id, updatedLocation) => set((state) => {
      const newLocations = state.locations.map((location) =>
        location.id === id ? { ...location, ...updatedLocation } : location
      );

      // Update current draft if one is selected
      const updatedDrafts = state.currentDraftId 
        ? state.drafts.map(draft => 
            draft.id === state.currentDraftId 
              ? { ...draft, locations: newLocations, createdAt: new Date() }
              : draft
          )
        : state.drafts;

      return {
        locations: newLocations,
        drafts: updatedDrafts,
      };
    }),
    
    reorderLocations: (locations) => set((state) => {
      const newLocations = locations.map((location) => ({
        ...location,
        ...state.locations.find((l) => l.id === location.id),
        order: location.order,
      }));

      // Update current draft if one is selected
      const updatedDrafts = state.currentDraftId 
        ? state.drafts.map(draft => 
            draft.id === state.currentDraftId 
              ? { ...draft, locations: newLocations, createdAt: new Date() }
              : draft
          )
        : state.drafts;

      return {
        locations: newLocations,
        drafts: updatedDrafts,
      };
    }),
    
    setCurrentLocation: (id) => set({ currentLocationId: id }),

    saveDraft: (name) => set((state) => {
      const newDraft: Draft = {
        id: uuidv4(),
        name,
        createdAt: new Date().toISOString(),
        scenes: [...state.scenes],
        characters: [...state.characters],
        locations: [...state.locations],
        titlePage: { ...state.titlePage },
      };
      return {
        drafts: [...state.drafts, newDraft],
        currentDraftId: newDraft.id,
      };
    }),

    loadDraft: (id) => set((state) => {
      const draft = state.drafts.find(d => d.id === id);
      if (!draft) return state;

      return {
        scenes: [...draft.scenes],
        characters: [...draft.characters],
        locations: [...draft.locations],
        titlePage: { ...draft.titlePage },
        currentDraftId: draft.id,
        currentSceneId: draft.scenes[0]?.id || null,
      };
    }),

    deleteDraft: (id) => set((state) => ({
      drafts: state.drafts.filter(d => d.id !== id),
      currentDraftId: state.currentDraftId === id ? state.drafts[0]?.id || null : state.currentDraftId,
    })),

    duplicateDraft: (id: string) => set((state) => {
      const draftToDuplicate = state.drafts.find(d => d.id === id);
      if (!draftToDuplicate) return state;

      const newDraft: Draft = {
        ...draftToDuplicate,
        id: uuidv4(),
        name: `${draftToDuplicate.name} (Copy)`,
        createdAt: new Date().toISOString(),
      };

      return {
        drafts: [...state.drafts, newDraft],
      };
    }),

    renameDraft: (id: string, newName: string) => set((state) => {
      const updatedDrafts = state.drafts.map(draft =>
        draft.id === id ? { ...draft, name: newName } : draft
      );
      return { drafts: updatedDrafts };
    }),

    updateTitlePage: (titlePage) => set((state) => {
      const newTitlePage = { ...state.titlePage, ...titlePage };

      // Update current draft if one is selected
      const updatedDrafts = state.currentDraftId 
        ? state.drafts.map(draft => 
            draft.id === state.currentDraftId 
              ? { ...draft, titlePage: newTitlePage, createdAt: new Date() }
              : draft
          )
        : state.drafts;

      return {
        titlePage: newTitlePage,
        drafts: updatedDrafts,
      };
    }),

    loadBackup: (backup) => set(() => ({
      scenes: [...backup.scenes],
      characters: [...backup.characters],
      locations: [...backup.locations],
      drafts: [...backup.drafts],
      titlePage: { ...backup.titlePage },
      currentSceneId: backup.currentSceneId,
      currentCharacterId: backup.currentCharacterId,
      currentLocationId: backup.currentLocationId,
      currentDraftId: backup.currentDraftId,
    })),
  };
});

export default useScriptStore;