import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Logout } from 'redux/slices/user';
import { axiosPrivate } from 'utils/axios';
import refreshToken from 'utils/refreshToken';

function useAxiosPrivate() {
  const dispatch = useDispatch();
  const refresh = refreshToken();

  useEffect(() => {
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error?.config;

        if (error?.response?.status === 403 && !config?.sent) {
          config.sent = true;

          const refreshResponse = await refreshToken();

          if (!refreshResponse) {
            dispatch(Logout());

            return Promise.reject(error);
          }

          return axiosPrivate(config);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [dispatch, refresh]);

  return axiosPrivate;
}

export default useAxiosPrivate;
