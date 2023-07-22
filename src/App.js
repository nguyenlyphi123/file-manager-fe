import React, { Suspense, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import ErrorBoundary from './pages/ErrorBoundary';
import LoginPage from './pages/LoginPage';
import RestrictedRoute from './utils/RestrictedRoute';

import HomePage from './pages';
import BlankPage from './pages/BlankPage';
import TokenExpired from './pages/tokenExpired';
import PageLoading from './parts/PageLoading';

const Files = React.lazy(() => import('./components/files'));
const Folders = React.lazy(() => import('./components/folders'));
const Home = React.lazy(() => import('./components/home'));
const Recovery = React.lazy(() => import('./components/recovery'));
const Settings = React.lazy(() => import('./components/settings'));
const Starred = React.lazy(() => import('./components/starred'));

const MyFolder = React.lazy(() => import('./components/folders/my-folder'));
const DetailFolder = React.lazy(() =>
  import('./components/folders/detail-folder'),
);

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<RestrictedRoute />}>
          <Route path='/' element={<HomePage />}>
            <Route
              index
              element={
                <Suspense fallback={<PageLoading />}>
                  <Home />
                </Suspense>
              }
            />
            <Route
              path='files'
              element={
                <Suspense fallback={<PageLoading />}>
                  <Files />
                </Suspense>
              }
            />
            <Route
              path='folders'
              element={
                <Suspense fallback={<PageLoading />}>
                  <Folders />
                </Suspense>
              }
            >
              <Route index element={<MyFolder />} />
              <Route path=':folderId' element={<DetailFolder />} />
            </Route>
            <Route
              path='recovery'
              element={
                <Suspense fallback={<PageLoading />}>
                  <Recovery />
                </Suspense>
              }
            />
            <Route
              path='settings'
              element={
                <Suspense fallback={<PageLoading />}>
                  <Settings />
                </Suspense>
              }
            />
            <Route
              path='starred'
              element={
                <Suspense fallback={<PageLoading />}>
                  <Starred />
                </Suspense>
              }
            />
          </Route>
        </Route>

        <Route path='/expired' element={<TokenExpired />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='*' element={<BlankPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
