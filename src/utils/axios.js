import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export const axiosPrivate = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  withCredentials: true,
  headers: {
    'SameSite': 'None',
    'Secure': true,
    'Content-Type': 'application/json',
  },
});
