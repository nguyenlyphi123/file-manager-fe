import { combineReducers, configureStore } from '@reduxjs/toolkit';
import folder from './slices/folder';
import user from './slices/user';
import location from './slices/location';
import curentFolder from './slices/curentFolder';
import chat from './slices/chat';

const reducers = combineReducers({
  user: user,
  location: location,
  folder: folder,
  curentFolder: curentFolder,
  chat: chat,
});

const store = configureStore({
  reducer: reducers,
});

export default store;
