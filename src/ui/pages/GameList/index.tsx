import { Game } from "@prisma/client";
import { GameCard } from "./GameCard";
import { GameTable } from "./GameTable";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Input, SegmentedControl, Select, Title } from "@mantine/core";
import { IconAd, IconBooks, IconLayoutGrid, IconList, IconPlus, IconSearch } from '@tabler/icons-react';
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type ViewMode = 'grid' | 'table';

async function getGameList(params: { search?: string; type?: string }) {
  const result = await window.electron.gameAPI.listGames(params);
  // TypeScript type safety for the included relations
  return {
    ...result,
    games: result.games.map((game: any) => ({
      ...game,
      creators: game.creators?.map((c: any) => ({
        creator: c.creator,
        role: c.role
      })),
      tags: game.tags?.map((t: any) => ({
        tag: t.tag
      })),
      covers: game.covers?.map((c: any) => ({
        url: c.url,
        type: c.type,
        primary: c.primary
      }))
    }))
  };
}

export const GameList = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const GAME_TYPES = [
    { value: "", label: t('gameList.types.all') },
    { value: "RPG", label: t('gameList.types.rpg') },
    { value: "VISUAL_NOVEL", label: t('gameList.types.visualNovel') },
    { value: "ACTION", label: t('gameList.types.action') },
    { value: "SIMULATION", label: t('gameList.types.simulation') },
    { value: "STRATEGY", label: t('gameList.types.strategy') },
    { value: "OTHER", label: t('gameList.types.other') },
  ];

  // Debounce search input to avoid too many API calls
  const handleSearch = (value: string) => {
    setSearch(value);
    clearTimeout((window as any).searchTimeout);
    (window as any).searchTimeout = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
  };

  const query = useQuery({
    queryKey: ['gameList', debouncedSearch, selectedType],
    queryFn: () => getGameList({ search: debouncedSearch, type: selectedType || undefined })
  });

  const games = query?.data?.games;
  if (!games) return <div>{t('gameList.loading')}</div>;

  return (
    <div>
      <div className="flex justify-between items-center h-12">
        <div className="flex items-center gap-4">
          <Title order={4} className="text-2xl  flex gap-2 items-center">
            <IconBooks width={32} height={32} color="#adb5bd" /> {t('gameList.gameCenter')}
          </Title>
          <Link to="/import/game">
    
          <Button size="xs" color="blue" leftSection={<IconPlus/>} >{t('gameList.addGame')}</Button>
          </Link>
        </div>

        <SegmentedControl
          value={viewMode}
          onChange={(value) => setViewMode(value as ViewMode)}
          data={[
            {
              value: 'grid',
              label: (
                <div className="flex items-center gap-2">
                  <IconLayoutGrid size={16} />
                  <span>{t('gameList.viewMode.grid')}</span>
                </div>
              ),
            },
            {
              value: 'table',
              label: (
                <div className="flex items-center gap-2">
                  <IconList size={16} />
                  <span>{t('gameList.viewMode.table')}</span>
                </div>
              ),
            },
          ]}
        />
      </div>
      <Divider className="mt-4" />

      {/* Search and Filter Controls */}
      <div className="flex gap-4 mt-4 mb-6">
        <Input
          placeholder={t('gameList.search')}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1"
          leftSection={<IconSearch size={16} />}
        />
        <Select
          value={selectedType}
          onChange={(value) => setSelectedType(value || "")}
          data={GAME_TYPES}
          placeholder={t('gameList.filterByType')}
          clearable
          className="w-48"
        />
      </div>

      {/* Game List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game: Game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <GameTable games={games} />
      )}
    </div>
  );
};