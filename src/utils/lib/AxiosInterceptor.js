import { axiosPrivate } from 'utils/axios';
import history from 'utils/lib/history';
import refreshToken from 'utils/refreshToken';
import { useDispatch } from 'react-redux';
import { logOut } from 'redux/slices/user';

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

        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshToken()
            .then(() => {
              isRefreshing = false;
              refreshPromise = null;
              return axiosPrivate(config);
            })
            .catch((error) => {
              dispatch(logOut());
              history.push('/expired');
              isRefreshing = false;
              refreshPromise = null;
              return Promise.reject(error);
            });
        }

        return refreshPromise;
      }

      return Promise.reject(error);
    },
  );
}
