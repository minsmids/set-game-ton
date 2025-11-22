import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import MainMenu from './pages/MainMenu';
import TrainingPage from './pages/TrainingPage';

import LobbyPage from './pages/LobbyPage';
import MultiplayerPage from './pages/MultiplayerPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/multiplayer" element={<MultiplayerPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;
