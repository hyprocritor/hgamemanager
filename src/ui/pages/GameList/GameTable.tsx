import { Game } from "@prisma/client";
import { Table } from "@mantine/core";
import { useTranslation } from "react-i18next";

export const GameTable = ({
  games
}: {
  games: Game[]
}) => {
  const { t } = useTranslation();
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>{t('gameList.table.name')}</Table.Th>
          <Table.Th>{t('gameList.table.type')}</Table.Th>
          <Table.Th>{t('gameList.table.releaseDate')}</Table.Th>
          <Table.Th>{t('gameList.table.description')}</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {games.map((game) => (
          <Table.Tr key={game.id}>
            <Table.Td>{game.originalName}</Table.Td>
            <Table.Td>{game.type}</Table.Td>
            <Table.Td>{game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : 'N/A'}</Table.Td>
            <Table.Td className="max-w-md truncate">{game.description}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};