import { jsPDF } from 'jspdf';
import { Scene, TitlePage } from '../types';
import useScriptStore from '../store/scriptStore';

const PAGE_WIDTH = 210; // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm
const MARGIN = 25; // margins in mm
const LINE_HEIGHT = 7; // line height in mm

interface ExportOptions {
  includeTitlePage?: boolean;
  includeSceneNumbers?: boolean;
  doubleSpaceBetweenScenes?: boolean;
}

export const exportSceneToPDF = (scene: Scene) => {
  const doc = new jsPDF();
  doc.setFont('Courier');
  doc.setFontSize(12);

  let y = MARGIN;

  // Add scene heading
  doc.setFont('Courier', 'bold');
  doc.text(scene.heading.toUpperCase(), MARGIN, y);
  y += LINE_HEIGHT * 2;

  // Add scene content
  doc.setFont('Courier', 'normal');
  const lines = scene.content.split('\n');

  lines.forEach(line => {
    const isCharacter = /^[A-Z\s]+$/.test(line.trim());
    const isParenthetical = line.trim().startsWith('(') && line.trim().endsWith(')');
    const isTransition = line.trim().endsWith('TO:');

    if (isCharacter) {
      y += LINE_HEIGHT;
      doc.setFont('Courier', 'bold');
      doc.text(line.trim(), PAGE_WIDTH / 2, y, { align: 'center' });
      doc.setFont('Courier', 'normal');
    } else if (isParenthetical) {
      y += LINE_HEIGHT;
      doc.text(line.trim(), PAGE_WIDTH / 2, y, { align: 'center' });
    } else if (isTransition) {
      y += LINE_HEIGHT;
      doc.text(line.trim(), PAGE_WIDTH - MARGIN, y, { align: 'right' });
    } else if (line.trim()) {
      y += LINE_HEIGHT;
      doc.text(line, MARGIN, y);
    } else {
      y += LINE_HEIGHT;
    }

    // Check if we need a new page
    if (y > PAGE_HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  });

  doc.save(`scene-${scene.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`);
};

export const exportFullScriptToPDF = (scenes: Scene[], options: ExportOptions = {}) => {
  const {
    includeTitlePage = true,
    includeSceneNumbers = false,
    doubleSpaceBetweenScenes = false,
  } = options;

  const doc = new jsPDF();
  doc.setFont('Courier');
  doc.setFontSize(12);

  let y = MARGIN;
  let pageNumber = 1;

  // Get title page data from store
  const { titlePage } = useScriptStore.getState();

  // Add title page if included
  if (includeTitlePage) {
    doc.setFontSize(24);
    doc.text(titlePage.title.toUpperCase(), PAGE_WIDTH / 2, PAGE_HEIGHT / 3, { align: 'center' });
    
    doc.setFontSize(14);
    if (titlePage.author) {
      doc.text('by', PAGE_WIDTH / 2, PAGE_HEIGHT / 3 + 20, { align: 'center' });
      doc.text(titlePage.author, PAGE_WIDTH / 2, PAGE_HEIGHT / 3 + 35, { align: 'center' });
    }

    doc.setFontSize(12);
    if (titlePage.contact) {
      doc.text(titlePage.contact, PAGE_WIDTH / 2, PAGE_HEIGHT / 3 + 60, { align: 'center' });
    }

    if (titlePage.copyright) {
      doc.text(titlePage.copyright, PAGE_WIDTH / 2, PAGE_HEIGHT - MARGIN - 20, { align: 'center' });
    }

    if (titlePage.date) {
      doc.text(titlePage.date, PAGE_WIDTH / 2, PAGE_HEIGHT - MARGIN, { align: 'center' });
    }

    doc.addPage();
  }

  scenes.forEach((scene, sceneIndex) => {
    // Add scene heading with optional scene number
    doc.setFont('Courier', 'bold');
    const heading = scene.heading.toUpperCase();
    const sceneNumber = includeSceneNumbers ? ` #${sceneIndex + 1}` : '';
    doc.text(heading + sceneNumber, MARGIN, y);
    y += LINE_HEIGHT * 2;

    // Add scene content
    doc.setFont('Courier', 'normal');
    const lines = scene.content.split('\n');

    lines.forEach(line => {
      const isCharacter = /^[A-Z\s]+$/.test(line.trim());
      const isParenthetical = line.trim().startsWith('(') && line.trim().endsWith(')');
      const isTransition = line.trim().endsWith('TO:');

      if (isCharacter) {
        y += LINE_HEIGHT;
        doc.setFont('Courier', 'bold');
        doc.text(line.trim(), PAGE_WIDTH / 2, y, { align: 'center' });
        doc.setFont('Courier', 'normal');
      } else if (isParenthetical) {
        y += LINE_HEIGHT;
        doc.text(line.trim(), PAGE_WIDTH / 2, y, { align: 'center' });
      } else if (isTransition) {
        y += LINE_HEIGHT;
        doc.text(line.trim(), PAGE_WIDTH - MARGIN, y, { align: 'right' });
      } else if (line.trim()) {
        y += LINE_HEIGHT;
        doc.text(line, MARGIN, y);
      } else {
        y += LINE_HEIGHT;
      }

      // Check if we need a new page
      if (y > PAGE_HEIGHT - MARGIN) {
        // Add page number at the bottom
        doc.setFont('Courier', 'normal');
        doc.setFontSize(10);
        doc.text(pageNumber.toString(), PAGE_WIDTH / 2, PAGE_HEIGHT - 10, { align: 'center' });
        pageNumber++;

        doc.addPage();
        y = MARGIN;
      }
    });

    // Add extra space between scenes
    y += doubleSpaceBetweenScenes ? LINE_HEIGHT * 3 : LINE_HEIGHT * 2;

    // If we're at the bottom of the page and there's another scene coming, start a new page
    if (y > PAGE_HEIGHT - MARGIN * 2 && sceneIndex < scenes.length - 1) {
      // Add page number at the bottom
      doc.setFont('Courier', 'normal');
      doc.setFontSize(10);
      doc.text(pageNumber.toString(), PAGE_WIDTH / 2, PAGE_HEIGHT - 10, { align: 'center' });
      pageNumber++;

      doc.addPage();
      y = MARGIN;
    }
  });

  // Add final page number
  doc.setFont('Courier', 'normal');
  doc.setFontSize(10);
  doc.text(pageNumber.toString(), PAGE_WIDTH / 2, PAGE_HEIGHT - 10, { align: 'center' });

  doc.save('screenplay.pdf');
};