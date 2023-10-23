import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosPrivate } from '../../utils/axios';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import {
  LOCAL_STORAGE_ACCESS_TOKEN,
  LOCAL_STORAGE_REFRESH_TOKEN,
  REACT_KEY,
} from 'constants/constants';

export const logIn = createAsyncThunk(
  'user/logIn',
  async (payload, { dispatch }) => {
    try {
      const response = await axiosPrivate.post(
        '/authentication/login',
        payload,
      );

      const jsonToken = JSON.stringify({
        [LOCAL_STORAGE_ACCESS_TOKEN]: response.data?.accessToken,
        [LOCAL_STORAGE_REFRESH_TOKEN]: response.data?.refreshToken,
      });

      const hashedToken = CryptoJS.AES.encrypt(jsonToken, REACT_KEY).toString();

      dispatch(Authenticate({ ...response.data.data, token: hashedToken }));
      return response.data.data;
    } catch (error) {
      localStorage.removeItem('fm-token');
      throw error;
    }
  },
);

export const loadUser = createAsyncThunk(
  'user/loadUser',
  async (_, { dispatch }) => {
    try {
      const response = await axios.get('/authentication/');

      const jsonToken = JSON.stringify({
        [LOCAL_STORAGE_ACCESS_TOKEN]: response.data?.accessToken,
        [LOCAL_STORAGE_REFRESH_TOKEN]: response.data?.refreshToken,
      });

      const hashedToken = CryptoJS.AES.encrypt(jsonToken, REACT_KEY).toString();

      dispatch(Authenticate({ ...response.data.data, token: hashedToken }));
      return response.data.data;
    } catch (error) {
      localStorage.removeItem('fm-token');
      throw error;
    }
  },
);

export const logOut = createAsyncThunk(
  'user/logOut',
  async (_, { dispatch }) => {
    localStorage.removeItem('fm-token');

    try {
      await axiosPrivate.post('/authentication/logout');
      dispatch(Logout());
    } catch (error) {
      throw error;
    }
  },
);

const initializeState = {
  id: null,
  name: null,
  email: null,
  permission: null,
  isAuthenticated: false,
  token: null,
  loading: false,
};

const user = createSlice({
  name: 'user',
  initialState: initializeState,
  reducers: {
    Authenticate: (state, { payload }) => {
      localStorage.setItem('fm-token', payload?.token);

      return {
        ...state,
        id: payload?.id,
        name: payload?.name,
        email: payload?.email,
        permission: payload?.permission,
        isAuthenticated: true,
      };
    },
    Logout: (state) => {
      localStorage.removeItem('fm-token');
      state = initializeState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, { payload }) => {
        return {
          ...state,
          id: payload?.id,
          name: payload?.name,
          email: payload?.email,
          permission: payload?.permission,
          isAuthenticated: payload?.id ? true : false,
          loading: false,
        };
      })
      .addCase(loadUser.rejected, (state) => {
        state = initializeState;
      })
      .addCase(logOut.fulfilled, (state) => (state = initializeState));
  },
});

export const { Authenticate, Logout } = user.actions;

export default user.reducer;
