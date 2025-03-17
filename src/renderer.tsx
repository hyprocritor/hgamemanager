import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {App} from './ui/App';
import { Layout } from './ui/Layout';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import './i18n';
import {

  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
const queryClient = new QueryClient()
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
     <QueryClientProvider client={queryClient}>
    <MantineProvider>
      <Router>
        <App/>
      </Router>
    </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);