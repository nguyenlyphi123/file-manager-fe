const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
  id: null,
  name: null,
  isGroupChat: false,
  members: [],
  lastMessage: {},
  lastActive: null,
  author: null,
  image: null,
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
        author: action.payload.author,
        image: action.payload.image,
      };
    },
    removeChat: (state) => {
      return (state = initialState);
    },
    removeChatMember: (state, action) => {
      const newMembers = state.members.filter(
        (member) => member._id !== action.payload,
      );

      return {
        ...state,
        members: newMembers,
      };
    },
  },
});

export const { selectChat, removeChat, removeChatMember } = chat.actions;

export default chat.reducer;
