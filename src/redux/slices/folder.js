import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const folderAdapter = createEntityAdapter({
  selectId: (folder) => folder._id,
});

const folder = createSlice({
  name: 'folder',
  initialState: folderAdapter.getInitialState(),
  reducers: {},
});

export default folder.reducer;
