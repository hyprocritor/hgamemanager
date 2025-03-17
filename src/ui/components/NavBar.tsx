import { IconBook2, IconSettings } from '@tabler/icons-react';
import { NavLink, Stack, Text,Button } from '@mantine/core';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function NavBar() {
  const location = useLocation();
  const { t } = useTranslation();
  
  return (
    <Stack
      justify="space-between"
      h="100%"
      className=""
    >
      <Stack gap="md">
        <Text
          c='dimmed'
          className="text-xl font-semibold flex gap-2 items-center px-2"
        >
          {t('navBar.gameList')}
        </Text>
        <NavLink
          label={t('navBar.gameList')}
          leftSection={<IconBook2 size="1.3rem" stroke={1.5} />}
          active={location.pathname === '/'}
          href="/"
          variant={location.pathname === '/' ? "filled" : "light"}
          className="rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/50"
        />
      </Stack>
      <NavLink
        label={t('navBar.settings')}
        leftSection={<IconSettings size="1.3rem" stroke={1.5} />}
        active={location.pathname === '/settings'}
        href="/settings"
        variant={location.pathname === '/settings' ? "filled" : "light"}
        className="rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/50"
      />

    </Stack>
  );
}