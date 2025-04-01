interface ElectronAPI {
  saveFile: (content: string, defaultPath?: string) => Promise<string | null>;
  openFile: () => Promise<{ content: string; filePath: string } | null>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {}; 