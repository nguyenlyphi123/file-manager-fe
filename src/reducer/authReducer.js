export const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        authLoading: false,
        isAuthenticated: true,
        infomation: action.payload.infomation,
        isLecturers: action.payload.isLecturers,
      };

    default:
      break;
  }
};
