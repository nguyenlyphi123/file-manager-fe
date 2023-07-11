import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tab: '',
  items: [],
};

const location = createSlice({
  name: 'location',
  initialState: initialState,
  reducers: {
    pushLocation: (state, action) => {
      const locationIndex = state.items.findIndex(
        (location) => location._id === action.payload._id,
      );

      if (locationIndex !== -1) {
        return {
          ...state,
          items: state.items.slice(0, locationIndex + 1),
        };
      } else {
        state.items.push(action.payload);
      }
    },

    removeLocation: (state) => {
      return { ...state, items: [] };
    },

    pushTab: (state, action) => {
      state.tab = action.payload;
    },
  },
});

// Selector
export const locationSelector = (state) => state.location;

// Export action
export const { pushLocation, removeLocation, pushTab } = location.actions;

// Export reducer
export default location.reducer;
