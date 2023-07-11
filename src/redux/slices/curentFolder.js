import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  _id: null,
  name: null,
};

const currentFolder = createSlice({
  name: 'currentFolder',
  initialState: initialState,
  reducers: {
    setCurrentFolder: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetCurrentFolder: (state) => {
      return (state = initialState);
    },
  },
});

export const { setCurrentFolder, resetCurrentFolder } = currentFolder.actions;

export default currentFolder.reducer;
