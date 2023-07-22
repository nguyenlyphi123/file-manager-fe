import axios from 'axios';
import { apiURL } from '../constants/constants';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = apiURL;

export const axiosPrivate = axios.create({
  baseURL: `${apiURL}`,
  withCredentials: true,
});
