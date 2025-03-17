import { Route, Routes } from 'react-router-dom';
import './index.css';
import '@mantine/dates/styles.css'
import { GameList } from './pages/GameList';
import { ImportGame } from './pages/ImportGame';
import { Layout } from './Layout';



export function App() {
  return (

      <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<GameList />} />
            <Route path="/import/game" element={<ImportGame />} />
          </Route>
        </Routes>

  )
}