import axios from 'axios';
import { apiURL } from '../constants/constants';
import refreshToken from './refreshToken';
import history from '../utils/lib/history';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = apiURL;

export const axiosPrivate = axios.create({
  baseURL: `${apiURL}`,
  withCredentials: true,
});

// let isRefreshing = false;
// let refreshPromise = null;

// axiosPrivate.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const config = error?.config;

//     if (error?.response?.status === 403 && !config?.sent) {
//       config.sent = true;

//       const refreshResponse = await refreshToken();

//       if (!refreshResponse) {
//         history.push('/expired');
//         return Promise.reject(error);
//       }

//       return axiosPrivate(config);
//     }
//     return Promise.reject(error);
//   },
// );
