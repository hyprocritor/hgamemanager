import { Game } from "@prisma/client";
import { Badge, Card, Group, Image, Text, Tooltip } from "@mantine/core";
import { IconCalendar, IconCategory, IconTags, IconUser } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export const GameCard = ({
  game
}: {
  game: Game & {
    creators?: Array<{
      creator: { name: string; type: string };
      role: string;
    }>;
    tags?: Array<{ tag: { name: string } }>;
    covers?: Array<{
      url: string;
      type: string;
      primary: boolean;
    }>;
  }
}) => {
  const { t } = useTranslation();
  
  // Get primary cover or first available cover
  const coverImage = game.covers?.find(c => c.primary) || game.covers?.[0];
  
  // Get main creator (usually the developer)
  const mainCreator = game.creators?.find(c => c.role.toLowerCase() === 'developer');
  
  // Get all tags
  const tags = game.tags?.map(t => t.tag.name) || [];

  return (
    <Card withBorder radius="md" className="overflow-hidden">
      {/* Cover Image */}
      {coverImage && (
        <Card.Section>
          <Image
            src={coverImage.url}
            height={200}
            alt={game.originalName}
            fallbackSrc={`https://placehold.co/600x400?text=${t('gameList.card.noImage')}`}
          />
        </Card.Section>
      )}

      <Card.Section className="p-4">
        {/* Title and Type */}
        <Group justify="space-between" mb={8}>
          <Text size="lg" fw={500}>
            {game.originalName}
          </Text>
          <Badge variant="light" color="blue">
            {game.type}
          </Badge>
        </Group>

        {/* Description */}
        <Text size="sm" color="dimmed" lineClamp={2} mb={8}>
          {game.description}
        </Text>

        {/* Metadata */}
        <Group gap={8} mt={16}>
          {game.releaseDate && (
            <Tooltip label={t('gameList.card.releaseDate')}>
              <Group gap={4}>
                <IconCalendar size={16} />
                <Text size="sm">
                  {new Date(game.releaseDate).toLocaleDateString()}
                </Text>
              </Group>
            </Tooltip>
          )}

          {mainCreator && (
            <Tooltip label={t('gameList.card.developer')}>
              <Group gap={4}>
                <IconUser size={16} />
                <Text size="sm">
                  {mainCreator.creator.name}
                </Text>
              </Group>
            </Tooltip>
          )}
        </Group>

        {/* Tags */}
        {tags.length > 0 && (
          <Group gap={4} mt={8}>
            <IconTags size={16} />
            {tags.map(tag => (
              <Badge
                key={tag}
                size="sm"
                variant="outline"
                className="lowercase"
              >
                {tag}
              </Badge>
            ))}
          </Group>
        )}
      </Card.Section>
    </Card>
  );
};