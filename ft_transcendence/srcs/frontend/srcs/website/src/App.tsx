import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Profil from './pages/Profil';
import GamePage from '../../game/pages/GamePage';
import GameTestPage from '../../game/pages/GameTestPage';
import Classement from './pages/Classement';
import Chat from './pages/Chat';
import GamePageCreate from '../../game/pages/GamePageCreate';
import GameMainPage from '../../game/pages/GameMainPage';
import GamePageTournament from '../../game/pages/GamePageTournament';
import AccountLogin from '../../account/pages/AccountLogin';
import AccountRegister from '../../account/pages/AccountRegister';
import AccountGestion from '../../account/pages/AccountGestion';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import GamePageCreateai from '../../game/pages/GamePageCreateAI';
import Historique from '../../account/pages/AccountHistorique';

// import GTA7 from '../../gta7/gataOnly';

import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/*format nested pcq c plus swag*/}
          <Route element={<PublicRoute />}> {/*PublicRoute.tsx check si user already logged in --> redirected to HOME si oui*/}
            <Route path="/account/login" element={<AccountLogin />} />
            <Route path="/account/register" element={<AccountRegister />} />
            {/* <Route path="/gata" element={<GTA7 />} /> */}
          </Route>

          {/*format nested pcq c big cock energy*/}
          <Route element={<ProtectedRoute />}> {/*gestion de l'auth dans ProtectedRoute.tsx*/}
            <Route path="/" element={<Home />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/profil/:username" element={<Profil />} />
            <Route path="/account/historique" element={<Historique />} />
            <Route path="/account/historique/:username" element={<Historique />} />
            <Route path="/leaderboard" element={<Classement />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/game/test" element={<GameTestPage />} />
            <Route path="/game/create" element={<GamePageCreate />} />
            <Route path="/game/createai" element={<GamePageCreateai />} />
            <Route path="/game/main" element={<GameMainPage />} />
            <Route path="/game/tournament" element={<GamePageTournament />} />
            <Route path="/account/gestion" element={<AccountGestion />} />
            <Route path="/chat" element={<Chat />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;