import { ActionIcon, Burger, Group, Text, useMantineTheme } from '@mantine/core';
import { X, Minus, Square, ArrowLeft, ArrowRight } from 'lucide-react';
import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

// Extending WindowStyle to include webkit properties
interface CustomCSS extends CSSProperties {
  WebkitAppRegion?: 'drag' | 'no-drag';
}

export function TitleBar({navBarCollapsed, toggleNavBar}: {
  navBarCollapsed: boolean;
  toggleNavBar: () => void;
}) {
  const theme = useMantineTheme();
  const { t } = useTranslation();
  
  const handleMinimize = () => {
    window.electron?.window.minimize?.();
  };

  const handleMaximize = () => {
    window.electron?.window.maximize?.();
  };

  const handleClose = () => {
    window.electron?.window.close?.();
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleForward = () => {
    window.history.forward();
  };

  return (
    <div
      style={{
        height: '32px',
        backgroundColor: theme.colors.dark[8],
        WebkitAppRegion: 'drag',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        userSelect: 'none',
      } as CustomCSS}
    >
      <Group gap={4} style={{ WebkitAppRegion: 'no-drag' } as CustomCSS}>
        <Burger color={'white'} size={'xs'} opened={navBarCollapsed} onClick={toggleNavBar}/>
        <Text size="sm" c="dimmed">{t('titleBar.title')}</Text>
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={handleBack}
          size="sm"
        >
          <ArrowLeft size={14} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={handleForward}
          size="sm"
        >
          <ArrowRight size={14} />
        </ActionIcon>
      </Group>

      <Group gap={4} style={{ WebkitAppRegion: 'no-drag' } as CustomCSS}>
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={handleMinimize}
          size="sm"
        >
          <Minus size={14} />
        </ActionIcon>

        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={handleMaximize}
          size="sm"
        >
          <Square size={14} />
        </ActionIcon>

        <ActionIcon
          variant="subtle"
          color="red"
          onClick={handleClose}
          size="sm"
        >
          <X size={14} />
        </ActionIcon>
      </Group>
    </div>
  );
}