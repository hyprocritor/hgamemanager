import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'node:path';
import { gameService } from './backend/gameService';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string | undefined;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;

// Initialize game management IPC handlers
function setupGameHandlers() {
  ipcMain.handle('game:create', async (_, data) => {
    try {
      return await gameService.createGame(data);
    } catch (error) {
      console.error('Failed to create game:', error);
      throw error;
    }
  });

  ipcMain.handle('game:update', async (_, id, data) => {
    try {
      return await gameService.updateGame(id, data);
    } catch (error) {
      console.error(`Failed to update game ${id}:`, error);
      throw error;
    }
  });

  ipcMain.handle('game:delete', async (_, id) => {
    try {
      return await gameService.deleteGame(id);
    } catch (error) {
      console.error(`Failed to delete game ${id}:`, error);
      throw error;
    }
  });

  ipcMain.handle('game:get', async (_, id) => {
    try {
      return await gameService.getGame(id);
    } catch (error) {
      console.error(`Failed to get game ${id}:`, error);
      throw error;
    }
  });

  ipcMain.handle('game:list', async (_, params) => {
    try {
      return await gameService.listGames(params);
    } catch (error) {
      console.error('Failed to list games:', error);
      throw error;
    }
  });

  ipcMain.handle('game:import', async (_, data) => {
    try {
      return await gameService.importGame(data);
    } catch (error) {
      console.error('Failed to import game:', error);
      throw error;
    }
  });
}

// Initialize dialog handlers
function setupDialogHandlers() {
  ipcMain.handle('dialog:showOpen', async (_, options) => {
    if (!mainWindow) {
      throw new Error('Main window is not available');
    }
    try {
      return await dialog.showOpenDialog(mainWindow, options);
    } catch (error) {
      console.error('Failed to show open dialog:', error);
      throw error;
    }
  });
}

// Set up all IPC handlers before creating the window
// Initialize window control handlers
function setupWindowHandlers() {
  ipcMain.handle('window:minimize', () => {
    mainWindow?.minimize();
  });

  ipcMain.handle('window:maximize', () => {
    if (!mainWindow) return;
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.handle('window:close', () => {
    mainWindow?.close();
  });
}

setupGameHandlers();
setupDialogHandlers();
setupWindowHandlers();

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Remove the menu bar
  mainWindow.removeMenu();

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
