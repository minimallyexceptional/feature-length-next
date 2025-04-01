import { Scene } from '../types';
import useScriptStore from '../store/scriptStore';

interface ExportOptions {
  includeTitlePage?: boolean;
  includeSceneNumbers?: boolean;
  doubleSpaceBetweenScenes?: boolean;
}

export const generateFountainScript = (scenes: Scene[], options: ExportOptions = {}) => {
  const { titlePage } = useScriptStore.getState();
  const {
    includeTitlePage = true,
    includeSceneNumbers = false,
    doubleSpaceBetweenScenes = false,
  } = options;

  // Add title page metadata if included
  const titlePageMetadata = includeTitlePage
    ? [
        'Title: ' + titlePage.title,
        'Author: ' + titlePage.author,
        'Contact: ' + titlePage.contact,
        'Copyright: ' + titlePage.copyright,
        'Notes: ' + titlePage.notes,
        'Date: ' + titlePage.date,
        '\n',
      ].join('\n')
    : '';

  // Format scenes according to Fountain syntax
  const formattedScenes = scenes
    .sort((a, b) => a.order - b.order)
    .map((scene, index) => {
      // Ensure scene heading starts with proper prefix
      const heading = scene.heading.trim();
      const formattedHeading = heading.match(/^(INT|EXT|EST|INT\.\/EXT|I\/E)/i)
        ? heading.toUpperCase()
        : `INT. ${heading.toUpperCase()}`;

      // Add scene number if enabled
      const sceneNumber = includeSceneNumbers ? ` #${index + 1}` : '';
      
      const content = [
        '', // Empty line before scene
        formattedHeading + sceneNumber,
        '',
        scene.content,
        '', // Empty line after scene
      ];

      // Add extra newline if double spacing is enabled
      if (doubleSpaceBetweenScenes) {
        content.push('');
      }

      return content.join('\n');
    })
    .join('\n');

  return titlePageMetadata + formattedScenes;
};