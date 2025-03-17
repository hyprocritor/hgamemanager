import { PrismaClient } from '@prisma/client';
import * as fs from 'fs/promises';

const prisma = new PrismaClient();

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

export interface GameImportInput {
  originalName: string;
  description: string;
  type: string;
  installPath: string;
  releaseDate?: Date;
  creators?: Array<{
    name: string;
    type: string;
    role: string;
    website?: string;
  }>;
  storeLinks?: Array<{
    store: string;
    url: string;
    price?: number;
    currency?: string;
  }>;
  covers?: Array<{
    url: string;
    type: string;
    width: number;
    height: number;
    size: number;
    primary: boolean;
  }>;
  localizations?: Array<{
    language: string;
    name: string;
    description?: string;
  }>;
  saveLocations?: Array<{
    path: string;
    type: string;
    cloudSync: boolean;
  }>;
  tags?: string[];
}

export class GameService {
  async createGame(data: GameCreateInput) {
    return prisma.game.create({
      data: {
        ...data,
        type: data.type as any
      },
      include: {
        creators: {
          include: {
            creator: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        ratings: true,
        storeLinks: true,
        versions: true,
        localizations: true,
        installations: true,
        covers: true
      }
    });
  }

  async updateGame(id: string, data: GameUpdateInput) {
    return prisma.game.update({
      where: { id },
      data: {
        ...data,
        type: data.type as any
      },
      include: {
        creators: {
          include: {
            creator: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        ratings: true,
        storeLinks: true,
        versions: true,
        localizations: true,
        installations: true,
        covers: true
      }
    });
  }

  async deleteGame(id: string) {
    return prisma.game.delete({
      where: { id }
    });
  }

  async getGame(id: string) {
    return prisma.game.findUnique({
      where: { id },
      include: {
        creators: {
          include: {
            creator: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        ratings: true,
        storeLinks: true,
        versions: true,
        localizations: true,
        installations: true,
        covers: true
      }
    });
  }

  async listGames(params: {
    skip?: number;
    take?: number;
    search?: string;
    type?: string;
  }) {
    const { skip = 0, take = 50, search, type } = params;

    const where = {
      ...(search && {
        OR: [
          { originalName: { contains: search } },
          { description: { contains: search } },
        ]
      }),
      ...(type && { type: type as any })
    };

    const [total, games] = await Promise.all([
      prisma.game.count({ where }),
      prisma.game.findMany({
        skip,
        take,
        where,
        include: {
          creators: {
            include: {
              creator: true
            }
          },
          tags: {
            include: {
              tag: true
            }
          },
          ratings: true,
          storeLinks: true,
          versions: true,
          localizations: true,
          installations: true,
          covers: true
        },
        orderBy: { updatedAt: 'desc' }
      })
    ]);

    return { total, games };
  }

  async importGame(data: GameImportInput) {
    // Verify the installation path exists
    try {
      await fs.access(data.installPath);
    } catch (error) {
      throw new Error(`Installation path does not exist: ${data.installPath}`);
    }

    // Get directory size
    const getDirectorySize = async (directoryPath: string): Promise<bigint> => {
      let size = BigInt(0);
      const files = await fs.readdir(directoryPath, { withFileTypes: true });
      
      for (const file of files) {
        const filePath = `${directoryPath}/${file.name}`;
        if (file.isDirectory()) {
          size += await getDirectorySize(filePath);
        } else {
          const stat = await fs.stat(filePath);
          size += BigInt(stat.size);
        }
      }
      
      return size;
    };

    const installSize = await getDirectorySize(data.installPath);

    // Handle creators - create them if they don't exist
    const creatorConnections = await Promise.all(
      (data.creators || []).map(async (creatorData) => {
        // Find or create creator by name and type
        const creator = await prisma.creator.findFirst({
          where: {
            name: creatorData.name,
            type: creatorData.type as any
          }
        });

        if (creator) {
          // Update website if provided
          if (creatorData.website && creator.website !== creatorData.website) {
            await prisma.creator.update({
              where: { id: creator.id },
              data: { website: creatorData.website }
            });
          }
          return {
            creatorId: creator.id,
            role: creatorData.role
          };
        }

        // Create new creator
        const newCreator = await prisma.creator.create({
          data: {
            name: creatorData.name,
            type: creatorData.type as any,
            website: creatorData.website
          }
        });

        return {
          creatorId: newCreator.id,
          role: creatorData.role
        };
      })
    );

    // Handle tags
    const tagConnections = await Promise.all(
      (data.tags || []).map(async (tagName) => {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          create: { name: tagName },
          update: {}
        });

        return { tagId: tag.id };
      })
    );

    // Create the game with all its relationships
    return prisma.game.create({
      data: {
        originalName: data.originalName,
        description: data.description,
        type: data.type as any,
        releaseDate: data.releaseDate,
        
        // Create installations
        installations: {
          create: {
            path: data.installPath,
            size: installSize,
            installed: new Date(),
            content: {} // Empty JSON object for now
          }
        },

        // Connect creators
        creators: {
          create: creatorConnections
        },

        // Connect tags
        tags: {
          create: tagConnections
        },

        // Create store links
        storeLinks: data.storeLinks ? {
          create: data.storeLinks.map(link => ({
            store: link.store as any,
            url: link.url,
            price: link.price,
            currency: link.currency
          }))
        } : undefined,

        // Create covers
        covers: data.covers ? {
          create: data.covers.map(cover => ({
            url: cover.url,
            type: cover.type as any,
            width: cover.width,
            height: cover.height,
            size: cover.size,
            primary: cover.primary
          }))
        } : undefined,

        // Create localizations
        localizations: data.localizations ? {
          create: data.localizations.map(loc => ({
            language: loc.language,
            name: loc.name,
            description: loc.description
          }))
        } : undefined,

        // Create save locations
        saveLocations: data.saveLocations ? {
          create: data.saveLocations.map(loc => ({
            path: loc.path,
            type: loc.type as any,
            cloudSync: loc.cloudSync
          }))
        } : undefined
      },
      include: {
        creators: {
          include: {
            creator: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        ratings: true,
        storeLinks: true,
        versions: true,
        localizations: true,
        installations: true,
        covers: true,
        saveLocations: true
      }
    });
  }
}

export const gameService = new GameService();