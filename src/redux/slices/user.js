import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosPrivate } from '../../utils/axios';
import axios from 'axios';

export const logIn = createAsyncThunk(
  'user/logIn',
  async (payload, { dispatch }) => {
    try {
      const response = await axiosPrivate.post(
        '/authentication/login',
        payload,
      );

      dispatch(Authenticate(response.data.data));
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
);

export const loadUser = createAsyncThunk(
  'user/loadUser',
  async (_, { dispatch }) => {
    try {
      const response = await axios.get('/authentication/');

      dispatch(Authenticate(response.data.data));
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
);

export const logOut = createAsyncThunk(
  'user/logOut',
  async (_, { dispatch }) => {
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
};

const user = createSlice({
  name: 'user',
  initialState: initializeState,
  reducers: {
    Authenticate: (state, { payload }) => {
      return {
        ...state,
        id: payload?.id,
        name: payload?.name,
        email: payload?.email,
        permission: payload?.permission,
        isAuthenticated: true,
      };
    },
    Logout: (state) => (state = initializeState),
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.fulfilled, (state, { payload }) => {
        return {
          ...state,
          id: payload?.id,
          name: payload?.name,
          email: payload?.email,
          permission: payload?.permission,
          isAuthenticated: payload?.id ? true : false,
        };
      })
      .addCase(logOut.fulfilled, (state) => (state = initializeState));
  },
});

export const { Authenticate, Logout } = user.actions;

export default user.reducer;
