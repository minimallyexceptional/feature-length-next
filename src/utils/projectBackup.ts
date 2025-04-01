import { Scene, Character, Location, Draft, TitlePage } from '../types';

interface ProjectBackup {
  version: string;
  timestamp: string;
  metadata: {
    projectName: string;
    exportDate: string;
    scenes: number;
    characters: number;
    locations: number;
    drafts: number;
  };
  data: {
    scenes: Scene[];
    characters: Character[];
    locations: Location[];
    drafts: Draft[];
    titlePage: TitlePage;
    currentSceneId: string | null;
    currentCharacterId: string | null;
    currentLocationId: string | null;
    currentDraftId: string | null;
  };
}

interface ValidationError {
  path: string;
  message: string;
}

export const exportProjectBackup = (
  scenes: Scene[],
  characters: Character[],
  locations: Location[],
  drafts: Draft[],
  titlePage: TitlePage,
  currentSceneId: string | null,
  currentCharacterId: string | null,
  currentLocationId: string | null,
  currentDraftId: string | null
): ProjectBackup => {
  const timestamp = new Date().toISOString();
  const [datePart] = timestamp.split('T');

  const backup: ProjectBackup = {
    version: '1.0.0',
    timestamp,
    metadata: {
      projectName: titlePage.title || 'Untitled Project',
      exportDate: datePart,
      scenes: scenes.length,
      characters: characters.length,
      locations: locations.length,
      drafts: drafts.length,
    },
    data: {
      scenes,
      characters,
      locations,
      drafts,
      titlePage,
      currentSceneId,
      currentCharacterId,
      currentLocationId,
      currentDraftId,
    },
  };

  return backup;
};

export const validateBackup = (backup: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Version check
  if (!backup.version || backup.version !== '1.0.0') {
    errors.push({
      path: 'version',
      message: 'Unsupported backup version',
    });
  }

  // Required fields
  const requiredFields = ['timestamp', 'metadata', 'data'];
  requiredFields.forEach(field => {
    if (!backup[field]) {
      errors.push({
        path: field,
        message: `Missing required field: ${field}`,
      });
    }
  });

  // Metadata validation
  const requiredMetadata = ['projectName', 'exportDate', 'scenes', 'characters', 'locations', 'drafts'];
  requiredMetadata.forEach(field => {
    if (!backup.metadata?.[field]) {
      errors.push({
        path: `metadata.${field}`,
        message: `Missing required metadata: ${field}`,
      });
    }
  });

  // Data validation
  const requiredData = ['scenes', 'characters', 'locations', 'drafts', 'titlePage'];
  requiredData.forEach(field => {
    if (!backup.data?.[field]) {
      errors.push({
        path: `data.${field}`,
        message: `Missing required data: ${field}`,
      });
    }
  });

  // Validate arrays
  if (backup.data?.scenes && !Array.isArray(backup.data.scenes)) {
    errors.push({
      path: 'data.scenes',
      message: 'Scenes must be an array',
    });
  }

  if (backup.data?.characters && !Array.isArray(backup.data.characters)) {
    errors.push({
      path: 'data.characters',
      message: 'Characters must be an array',
    });
  }

  if (backup.data?.locations && !Array.isArray(backup.data.locations)) {
    errors.push({
      path: 'data.locations',
      message: 'Locations must be an array',
    });
  }

  if (backup.data?.drafts && !Array.isArray(backup.data.drafts)) {
    errors.push({
      path: 'data.drafts',
      message: 'Drafts must be an array',
    });
  }

  // Validate relationships
  if (backup.data?.currentSceneId && 
      !backup.data.scenes.some(scene => scene.id === backup.data.currentSceneId)) {
    errors.push({
      path: 'data.currentSceneId',
      message: 'Current scene ID references non-existent scene',
    });
  }

  if (backup.data?.currentCharacterId && 
      !backup.data.characters.some(char => char.id === backup.data.currentCharacterId)) {
    errors.push({
      path: 'data.currentCharacterId',
      message: 'Current character ID references non-existent character',
    });
  }

  if (backup.data?.currentLocationId && 
      !backup.data.locations.some(loc => loc.id === backup.data.currentLocationId)) {
    errors.push({
      path: 'data.currentLocationId',
      message: 'Current location ID references non-existent location',
    });
  }

  if (backup.data?.currentDraftId && 
      !backup.data.drafts.some(draft => draft.id === backup.data.currentDraftId)) {
    errors.push({
      path: 'data.currentDraftId',
      message: 'Current draft ID references non-existent draft',
    });
  }

  return errors;
};

export const generateBackupFilename = (projectName: string): string => {
  const sanitizedName = projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const date = new Date().toISOString().split('T')[0];
  return `${sanitizedName}_backup_${date}.json`;
};