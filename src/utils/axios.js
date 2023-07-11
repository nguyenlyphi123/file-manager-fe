import axios from 'axios';
import { apiURL } from '../constants/constants';
import refreshToken from './refreshToken';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = apiURL;

export const axiosPrivate = axios.create({
  baseURL: `${apiURL}`,
  withCredentials: true,
});

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;

    if (error?.response?.status === 403 && !config?.sent) {
      config.sent = true;

      const refreshResponse = await refreshToken();

      if (!refreshResponse) {
        window.location.href = '/expired';
        return Promise.reject(error);
      }

      return axiosPrivate(config);
    }
    return Promise.reject(error);
  },
);
