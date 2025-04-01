const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    saveFile: (content: string, defaultPath?: string) => 
      ipcRenderer.invoke('save-file', content, defaultPath),
    openFile: (defaultPath?: string) => ipcRenderer.invoke('open-file', defaultPath),
  }
); 