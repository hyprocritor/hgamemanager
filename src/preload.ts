import { contextBridge, ipcRenderer } from 'electron';

// Game management types
export interface GameCreateInput {
  originalName: string;
  description: string;
  type: string;
  releaseDate?: Date;
}

export interface GameUpdateInput {
  originalName?: string;
  description?: string;
  type?: string;
  releaseDate?: Date | null;
}

export interface GameListParams {
  skip?: number;
  take?: number;
  search?: string;
  type?: string;
}

export interface GameImportInput {
  originalName: string;
  description: string;
  type: string;
  installPath: string;
}

// API interface exposed to renderer
const gameAPI = {
  createGame: (data: any) => 
    ipcRenderer.invoke('game:create', data),
  
  updateGame: (id: string, data: any) => 
    ipcRenderer.invoke('game:update', id, data),
  
  deleteGame: (id: string) => 
    ipcRenderer.invoke('game:delete', id),
  
  getGame: (id: string) => 
    ipcRenderer.invoke('game:get', id),
  
  listGames: (params: any) => 
    ipcRenderer.invoke('game:list', params),

  importGame: (data: any) =>
    ipcRenderer.invoke('game:import', data),
    
  listTags: (params?: { search?: string }) =>
    ipcRenderer.invoke('game:listTags', params),
};

const dialog = {
  showOpenDialog: (options: {
    properties: Array<'openFile' | 'openDirectory' | 'multiSelections'>;
  }) =>
    ipcRenderer.invoke('dialog:showOpen', options),
};

// Window control API
const window = {
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
};

// Expose protected APIs to renderer via contextBridge
contextBridge.exposeInMainWorld('electron', {
  gameAPI,
  dialog,
  window
});
