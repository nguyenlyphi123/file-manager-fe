import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosPrivate } from 'utils/axios';

export const getNewRequire = createAsyncThunk(
  'require/getNewRequire',
  async () => {
    try {
      const response = await axiosPrivate.get('/require/new');

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
);

// export const getRequires = createAsyncThunk(
//   'require/getRequire',
//   async (_, { dispatch }) => {
//     try {
//       const response = await getRequire();

//       console.log(response);

//       const { data } = response;

//       dispatch(setRequire(data));

//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
// );

const initialState = {
  loading: false,
  requirement: {
    hasData: false,
    new: [],
    waiting: [],
    processing: [],
    done: [],
  },
  hasData: false,
};

const notifiSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // setRequire: (state, { payload }) => {
    //   const { waiting, processing, done } = payload;
    //   state.requirement.hasData = true;
    //   state.requirement.waiting = waiting;
    //   state.requirement.processing = processing;
    //   state.requirement.done = done;
    // },
    // reset: (state) => {
    //   state.requirement.hasData = false;
    //   state.requirement.new = [];
    //   state.requirement.waiting = [];
    //   state.requirement.processing = [];
    //   state.requirement.done = [];
    //   state.isNew = false;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNewRequire.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNewRequire.fulfilled, (state, { payload }) => {
        state.hasData = state.hasData ? true : payload.length > 0;
        state.loading = false;
        state.requirement.new = payload;
        state.requirement.hasData = payload.length > 0;
      })
      .addCase(getNewRequire.rejected, (state) => {
        state.loading = false;
      });
  },
});

// export const { setRequire, reset } = notifiSlice.actions;

export default notifiSlice.reducer;
