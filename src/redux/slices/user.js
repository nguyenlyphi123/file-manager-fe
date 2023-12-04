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

      dispatch(Authenticate({ ...response.data.data }));
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

      dispatch(Authenticate({ ...response.data.data }));
      return response.data.data;
    } catch (error) {
      localStorage.removeItem('fm-token');
      throw error;
    }
  },
);

export const logOut = createAsyncThunk(
  'user/logOut',
  async (_, { dispatch, getState }) => {
    const { user } = getState();

    localStorage.removeItem('fm-token');

    try {
      await axiosPrivate.post('/authentication/logout', { id: user.id });
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
  image: null,
  isAuthenticated: false,
  token: null,
  loading: false,
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
        image: payload?.image,
        isAuthenticated: true,
      };
    },
    Logout: (state) => {
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
          image: payload?.image,
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
