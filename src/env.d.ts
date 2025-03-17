/// <reference types="vite/client" />

interface ImportedEnv {
  readonly MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
  readonly MAIN_WINDOW_VITE_NAME: string | undefined;
}


interface Window {
  electron: {
    gameAPI: {
      createGame: (data: any) => Promise<any>;
      updateGame: (id: string, data: any) => Promise<any>;
      deleteGame: (id: string) => Promise<any>;
      getGame: (id: string) => Promise<any>;
      listGames: (params: any) => Promise<{ games: Prisma.Game[]; total: number }>;
      importGame: (data: any) => Promise<any>;
    };
    dialog: {
      showOpenDialog: (options: {
        properties: Array<'openFile' | 'openDirectory' | 'multiSelections'>;
      }) => Promise<{
        canceled: boolean;
        filePaths: string[];
      }>;
    };
    window: {
      minimize: () => Promise<void>;
      maximize: () => Promise<void>;
      close: () => Promise<void>;
    };
  };
}