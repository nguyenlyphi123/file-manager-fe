import React, { Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import ErrorBoundary from './pages/ErrorBoundary';
import LoginPage from './pages/LoginPage';
import RestrictedRoute from './utils/RestrictedRoute';

import TokenExpired from 'pages/tokenExpired';
import { useDispatch } from 'react-redux';
import { loadUser } from 'redux/slices/user';
import PrivateRoute from 'utils/PrivateRoute';
import HomePage from './pages';
import BlankPage from './pages/BlankPage';
import PageLoading from './parts/PageLoading';
import StartPage from 'pages/StartPage';
import SearchPage from 'pages/SearchPage';

const Files = React.lazy(() => import('./pages/files'));
const Folders = React.lazy(() => import('./pages/folders'));
const Home = React.lazy(() => import('./pages/home'));
const Recovery = React.lazy(() => import('./pages/recovery'));
const Settings = React.lazy(() => import('./pages/settings'));
const Starred = React.lazy(() => import('./pages/starred'));
const Shared = React.lazy(() => import('./pages/shared'));
const Require = React.lazy(() => import('./pages/require'));

const MyFolder = React.lazy(() => import('./pages/folders/my-folder'));
const DetailFolder = React.lazy(() => import('./pages/folders/detail-folder'));

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const [appLoading, setAppLoading] = React.useState(true);

  useEffect(() => {
    const getUser = async () => {
      await dispatch(loadUser());

      setAppLoading(false);
    };

    getUser();
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [location.pathname]);

  if (appLoading) {
    return <StartPage />;
  }

  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path='/' element={<HomePage />}>
            <Route element={<RestrictedRoute />}>
              <Route
                index
                element={
                  <Suspense fallback={<PageLoading />}>
                    <Home />
                  </Suspense>
                }
              />
            </Route>
            <Route element={<RestrictedRoute />}>
              <Route
                path='files'
                element={
                  <Suspense fallback={<PageLoading />}>
                    <Files />
                  </Suspense>
                }
              />
            </Route>
            <Route element={<RestrictedRoute />}>
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
            </Route>
            <Route element={<RestrictedRoute />}>
              <Route
                path='recovery'
                element={
                  <Suspense fallback={<PageLoading />}>
                    <Recovery />
                  </Suspense>
                }
              />
            </Route>
            <Route element={<RestrictedRoute />}>
              <Route
                path='settings'
                element={
                  <Suspense fallback={<PageLoading />}>
                    <Settings />
                  </Suspense>
                }
              />
            </Route>
            <Route element={<RestrictedRoute />}>
              <Route
                path='starred'
                element={
                  <Suspense fallback={<PageLoading />}>
                    <Starred />
                  </Suspense>
                }
              />
            </Route>
            <Route element={<RestrictedRoute />}>
              <Route
                path='shared'
                element={
                  <Suspense fallback={<PageLoading />}>
                    <Shared />
                  </Suspense>
                }
              />
            </Route>
            <Route element={<RestrictedRoute />}>
              <Route
                path='require'
                element={
                  <Suspense fallback={<PageLoading />}>
                    <Require />
                  </Suspense>
                }
              />
            </Route>
            <Route element={<RestrictedRoute />}>
              <Route path='search' element={<SearchPage />} />
            </Route>
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
