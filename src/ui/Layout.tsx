import { Outlet } from 'react-router-dom';
import { TitleBar } from './components/TitleBar';
import { NavBar } from './components/NavBar';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export function Layout() {
  const [collapsed, { toggle }] = useDisclosure(false);
  return (
    <AppShell
      header={{ height: 32 }}
      navbar={{
        width: 256,
        breakpoint: 'sm',
        collapsed: { desktop: collapsed },
      }}
      padding="sm"
    >
      <AppShell.Header>
        <TitleBar navBarCollapsed={!collapsed} toggleNavBar={toggle}/>
      </AppShell.Header>
      <AppShell.Navbar p="sm">
        <NavBar collapsed={collapsed} onToggleCollapse={toggle} />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}