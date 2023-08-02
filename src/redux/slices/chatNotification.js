import { axiosPrivate } from 'utils/axios';

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

export const getUnseenMessages = createAsyncThunk(
  'chatNotification/getUnseenMessages',
  async () => {
    try {
      const response = await axiosPrivate.get('/message/unseen');

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
);

const initialState = {
  hasUnseenMessages: false,
  quantity: 0,
};

const chatNotification = createSlice({
  name: 'chatNotification',
  initialState: initialState,
  extraReducers: (builder) => {
    builder.addCase(getUnseenMessages.fulfilled, (state, { payload }) => {
      return {
        ...state,
        hasUnseenMessages: payload?.hasUnseenMessages,
        quantity: payload?.quantity,
      };
    });
  },
});

export default chatNotification.reducer;
