const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
  id: null,
  name: null,
  isGroupChat: false,
  members: [],
  lastMessage: {},
};

const chat = createSlice({
  name: 'chat',
  initialState: initialState,
  reducers: {
    selectChat: (state, action) => {
      const chatChoosed = state.id === action.payload._id;

      if (chatChoosed) {
        return (state = initialState);
      }

      return {
        ...state,
        id: action.payload._id,
        name: action.payload.name,
        isGroupChat: action.payload.isGroupChat,
        members: action.payload.member,
        lastMessage: action.payload.lastMessage,
      };
    },
  },
});

export const { selectChat } = chat.actions;

export default chat.reducer;
