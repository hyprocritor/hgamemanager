import { Stack, MultiSelect, Table, Button, Modal, Drawer, TextInput, Select, ActionIcon, TagsInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form/lib/types";
import { CreatorType, Tag } from "@prisma/client";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { useState, useEffect } from "react";
import { GameFormValues } from "../../types/game";
import { useQuery } from "@tanstack/react-query";

interface CreatorFormData {
  name: string;
  type: CreatorType;
  website?: string;
  role: string;
}
function loadTags(search?: string) {
  return window.electron.gameAPI.listTags({ search });
}
export const MetadataInfo = ({ form }: { form: UseFormReturnType<GameFormValues> }) => {
  const { t } = useTranslation();
  const [creatorDrawerOpened, { open: openCreatorDrawer, close: closeCreatorDrawer }] = useDisclosure(false);

  // Creator management 
  const [newCreator, setNewCreator] = useState<CreatorFormData>({
    name: '',
    type: 'STUDIO',
    role: 'Developer'
  });

  // Tag management
  const [availableTags, setAvailableTags] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const tagQuery = useQuery({
    queryKey: ['tags', tagSearch],
    queryFn: () => loadTags(tagSearch),
  })


  return (
    <Stack gap="xl">
      {/* Creator Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{t('game.fields.creators.label')}</h3>
          <Button onClick={openCreatorDrawer} leftSection={<IconPlus size={16} />}>
            {t('game.fields.creators.add')}
          </Button>
        </div>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('game.fields.creators.table.name')}</Table.Th>
              <Table.Th>{t('game.fields.creators.table.type')}</Table.Th>
              <Table.Th>{t('game.fields.creators.table.role')}</Table.Th>
              <Table.Th style={{ width: 80 }}>{t('common.actions')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {form.values.creators.map((creator, index) => (
              <Table.Tr key={creator.id}>
                <Table.Td>{creator.name}</Table.Td>
                <Table.Td>{t(`game.fields.creators.types.${creator.type.toLowerCase()}`)}</Table.Td>
                <Table.Td>{creator.role}</Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => {
                      const creators = [...form.values.creators];
                      creators.splice(index, 1);
                      form.setFieldValue('creators', creators);
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>

      {/* Tag Section */}
      <div>
        <TagsInput
          label={t('game.fields.tags.label')}
          description={t('game.fields.tags.description')}
          data={tagQuery.data?.tags?.map((tag: Tag) => ({ value: tag.id, label: tag.name })) || []}
          value={form.values.tags}
          onChange={(value) => form.setFieldValue('tags', value)}
          onSearchChange={(v) => setTagSearch(v)}
          clearable
          disabled={isLoadingTags}
        />
      </div>

      {/* Versions Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{t('game.fields.versions.label')}</h3>
          <Button
            onClick={() => {
              const versions = [...form.values.versions];
              versions.push({
                id: '',
                gameId: form.values.id,
                version: '',
                releaseDate: new Date(),
                changelog: '',
                isActive: false
              });
              form.setFieldValue('versions', versions);
            }}
            leftSection={<IconPlus size={16} />}
          >
            {t('game.fields.versions.add')}
          </Button>
        </div>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('game.fields.versions.table.version')}</Table.Th>
              <Table.Th>{t('game.fields.versions.table.releaseDate')}</Table.Th>
              <Table.Th>{t('game.fields.versions.table.changelog')}</Table.Th>
              <Table.Th style={{ width: 80 }}>{t('common.actions')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {form.values.versions.map((version, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <TextInput
                    {...form.getInputProps(`versions.${index}.version`)}
                  />
                </Table.Td>
                <Table.Td>
                  <DateInput
                    {...form.getInputProps(`versions.${index}.releaseDate`)}
                  />
                </Table.Td>
                <Table.Td>
                  <TextInput
                    {...form.getInputProps(`versions.${index}.changelog`)}
                  />
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => {
                      const versions = [...form.values.versions];
                      versions.splice(index, 1);
                      form.setFieldValue('versions', versions);
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>

      {/* Localizations Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{t('game.fields.localizations.label')}</h3>
          <Button
            onClick={() => {
              const localizations = [...form.values.localizations];
              localizations.push({
                id: '',
                gameId: form.values.id,
                language: '',
                name: '',
                description: ''
              });
              form.setFieldValue('localizations', localizations);
            }}
            leftSection={<IconPlus size={16} />}
          >
            {t('game.fields.localizations.add')}
          </Button>
        </div>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('game.fields.localizations.table.language')}</Table.Th>
              <Table.Th>{t('game.fields.localizations.table.name')}</Table.Th>
              <Table.Th>{t('game.fields.localizations.table.description')}</Table.Th>
              <Table.Th style={{ width: 80 }}>{t('common.actions')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {form.values.localizations.map((localization, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <Select
                    data={[
                      { value: 'en', label: t('languages.en') },
                      { value: 'zh-CN', label: t('languages.zh-CN') },
                      { value: 'ja', label: t('languages.ja') }
                    ]}
                    {...form.getInputProps(`localizations.${index}.language`)}
                  />
                </Table.Td>
                <Table.Td>
                  <TextInput
                    {...form.getInputProps(`localizations.${index}.name`)}
                  />
                </Table.Td>
                <Table.Td>
                  <TextInput
                    {...form.getInputProps(`localizations.${index}.description`)}
                  />
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => {
                      const localizations = [...form.values.localizations];
                      localizations.splice(index, 1);
                      form.setFieldValue('localizations', localizations);
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>

      {/* Creator Drawer */}
      <Drawer
        opened={creatorDrawerOpened}
        onClose={closeCreatorDrawer}
        title={t('game.fields.creators.new')}
        position="right"
        classNames={{
          body:'pt-4'
        }}

      >
        <Stack>
          <TextInput
            label={t('game.fields.creators.form.name')}
            value={newCreator.name}
            onChange={(e) => setNewCreator({ ...newCreator, name: e.target.value })}
          />
          <Select
            label={t('game.fields.creators.form.type')}
            data={[
              { value: 'STUDIO', label: t('game.fields.creators.types.studio') },
              { value: 'INDIVIDUAL', label: t('game.fields.creators.types.individual') },
              { value: 'PUBLISHER', label: t('game.fields.creators.types.publisher') },
              { value: 'CIRCLE', label: t('game.fields.creators.types.circle') }
            ]}
            value={newCreator.type}
            onChange={(value: string) => setNewCreator({ ...newCreator, type: value as CreatorType })}
          />
          <TextInput
            label={t('game.fields.creators.form.website')}
            value={newCreator.website}
            onChange={(e) => setNewCreator({ ...newCreator, website: e.target.value })}
          />
          <Select
            label={t('game.fields.creators.form.role')}
            data={[
              { value: 'Developer', label: t('game.fields.creators.roles.developer') },
              { value: 'Publisher', label: t('game.fields.creators.roles.publisher') },
              { value: 'Artist', label: t('game.fields.creators.roles.artist') },
              { value: 'Writer', label: t('game.fields.creators.roles.writer') }
            ]}
            value={newCreator.role}
            onChange={(value: string) => setNewCreator({ ...newCreator, role: value || 'Developer' })}
          />
          <Button
            onClick={() => {
              const creator = {
                ...newCreator,
                id: Date.now().toString()
              };
              form.setFieldValue('creators', [...form.values.creators, creator]);
              setNewCreator({ name: '', type: 'STUDIO', role: 'Developer' });
              closeCreatorDrawer();
            }}
          >
            {t('common.add')}
          </Button>
        </Stack>
      </Drawer>
    </Stack>
  );
};
