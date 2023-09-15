import { createSlice } from '@reduxjs/toolkit';
// import { calcTimeRemain } from 'utils/helpers/TypographyHelper';

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
        expired: false,
      };
    },
    resetCurrentFolder: (state) => {
      return (state = initialState);
    },
  },
});

export const { setCurrentFolder, resetCurrentFolder } = currentFolder.actions;

export default currentFolder.reducer;
