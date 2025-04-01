const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs/promises');

let mainWindow: Electron.BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (process.env.NODE_ENV === 'development') {
    if (mainWindow) {
      mainWindow.loadURL('http://localhost:5173');
      mainWindow.webContents.openDevTools();
    }
  } else {
    if (mainWindow) {
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
  }

  if (mainWindow) {
    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }
}

async function saveFile(content: string, defaultPath?: string): Promise<string | null> {
  if (!mainWindow) return null;
  
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    defaultPath,
    filters: [
      { name: 'Fountain Files', extensions: ['fountain'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!filePath) return null;

  await fs.writeFile(filePath, content, 'utf8');
  return filePath;
}

async function openFile(defaultPath?: string): Promise<{ content: string; filePath: string } | null> {
  if (!mainWindow) return null;

  const { filePaths } = await dialog.showOpenDialog(mainWindow, {
    defaultPath,
    filters: [
      { name: 'Fountain Files', extensions: ['fountain'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['openFile']
  });

  if (!filePaths || filePaths.length === 0) return null;

  const content = await fs.readFile(filePaths[0], 'utf8');
  return { content, filePath: filePaths[0] };
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('save-file', async (_: Electron.IpcMainInvokeEvent, content: string, defaultPath?: string) => {
  return saveFile(content, defaultPath);
});

ipcMain.handle('open-file', async (_: Electron.IpcMainInvokeEvent, defaultPath?: string) => {
  return openFile(defaultPath);
}); 