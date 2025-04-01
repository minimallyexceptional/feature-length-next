import { ScriptState } from '../types';

export async function saveScriptToFile(state: ScriptState, defaultPath?: string): Promise<string | null> {
  try {
    // Convert the current state to Fountain format
    const fountainContent = convertToFountain(state);
    return await window.electron.saveFile(fountainContent, defaultPath);
  } catch (error) {
    console.error('Error saving file:', error);
    return null;
  }
}

export async function loadScriptFromFile(): Promise<{ content: string; filePath: string } | null> {
  try {
    return await window.electron.openFile();
  } catch (error) {
    console.error('Error loading file:', error);
    return null;
  }
}

function convertToFountain(state: ScriptState): string {
  // Convert the script state to Fountain format
  // This is a basic implementation - you might want to enhance it
  let fountain = '';

  // Add title page
  fountain += `Title: ${state.titlePage.title}\n`;
  fountain += `Author: ${state.titlePage.author}\n`;
  fountain += `Contact: ${state.titlePage.contact}\n`;
  fountain += `Copyright: ${state.titlePage.copyright}\n`;
  fountain += `Notes: ${state.titlePage.notes}\n`;
  fountain += `Date: ${state.titlePage.date}\n\n`;

  // Add scenes
  state.scenes.forEach(scene => {
    fountain += `${scene.heading}\n\n`;
    fountain += `${scene.content}\n\n`;
  });

  return fountain;
} 