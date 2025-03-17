import { Game, Creator, CreatorType, GameLocalization, GameVersion } from "@prisma/client";

export type GameFormValues = Game & { 
    creators: (Omit<Creator, 'website'> & { website?: string; role: string })[];
    tags: string[];
    versions: GameVersion[];
    localizations: GameLocalization[];
}