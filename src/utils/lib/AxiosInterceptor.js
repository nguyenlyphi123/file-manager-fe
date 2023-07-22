import { useDispatch } from 'react-redux';
import { logOut } from '../../redux/slices/user';
import { axiosPrivate } from '../axios';
import refreshToken from '../refreshToken';
import history from './history';

export default function AxiosInterceptor() {
  const dispatch = useDispatch();

  let isRefreshing = false;
  let refreshPromise = null;

  axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error?.config;

      if (error?.response?.status === 403 && !config?.sent) {
        config.sent = true;

        // Check if a refresh is already in progress
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshToken()
            .then(() => {
              // Once the token is refreshed, reset the isRefreshing flag
              isRefreshing = false;
              refreshPromise = null;

              // Retry the original request
              return axiosPrivate(config);
            })
            .catch((error) => {
              // If the token refresh fails, redirect to an error page
              dispatch(logOut());
              history.push('/expired');
              isRefreshing = false;
              refreshPromise = null;
              return Promise.reject(error);
            });
        }

        // If a refresh is already in progress, return the promise of the ongoing refresh
        return refreshPromise;
      }

      return Promise.reject(error);
    },
  );
}
