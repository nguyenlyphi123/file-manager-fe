import { combineReducers, configureStore } from '@reduxjs/toolkit';
import folder from 'redux/slices/folder';
import user from 'redux/slices/user';
import location from 'redux/slices/location';
import curentFolder from 'redux/slices/curentFolder';

const reducers = combineReducers({
  user: user,
  location: location,
  folder: folder,
  curentFolder: curentFolder,
});

const store = configureStore({
  reducer: reducers,
});

export default store;
