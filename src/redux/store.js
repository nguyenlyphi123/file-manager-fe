import { combineReducers, configureStore } from '@reduxjs/toolkit';
import folder from './slices/folder';
import user from './slices/user';
import location from './slices/location';
import curentFolder from './slices/curentFolder';

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
