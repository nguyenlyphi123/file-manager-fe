const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
  id: null,
  name: null,
  isGroupChat: false,
  members: [],
  lastMessage: {},
  lastActive: null,
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
        id: action.payload._id,
        name: action.payload.name,
        isGroupChat: action.payload.isGroupChat,
        members: action.payload.member,
        lastMessage: action.payload.lastMessage,
        lastActive: action.payload.lastOpened,
      };
    },
    removeChat: (state) => {
      return (state = initialState);
    },
  },
});

export const { selectChat, removeChat } = chat.actions;

export default chat.reducer;
