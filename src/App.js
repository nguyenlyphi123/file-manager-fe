import { Route, Routes } from 'react-router-dom';
import ScrollToTop from './utils/ScrollToTop';

import LoginPage from './pages/auth/LoginPage';

import WelcomePage from './pages';
import PupilPage from './pages/pupil';
import LecturersPage from './pages/lecturers';
import ManagerPage from './pages/manager';
import BlankPage from './pages/BlankPage';

import Files from './components/files';
import Folders from './components/folders';
import Home from './components/home';
import Recovery from './components/recovery';
import Settings from './components/settings';
import Starred from './components/starred';
import AuthContextProvider from './contexts/authContext';

function App() {
  return (
    <ScrollToTop>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/pupil' element={<PupilPage />} />
        <Route path='/lecturers' element={<LecturersPage />}>
          <Route index element={<Home />} />
          <Route path='files' element={<Files />} />
          <Route path='folders' element={<Folders />} />
          <Route path='recovery' element={<Recovery />} />
          <Route path='settings' element={<Settings />} />
          <Route path='starred' element={<Starred />} />
        </Route>
        <Route path='/manager' element={<ManagerPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='*' element={<BlankPage />} />
      </Routes>
    </ScrollToTop>
  );
}

export default App;
