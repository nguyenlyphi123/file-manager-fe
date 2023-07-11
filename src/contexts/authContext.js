import { createContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { apiURL } from '../constants/constants';
import { authReducer } from '../reducer/authReducer';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    authLoading: true,
    isAuthenticated: false,
    infomation: null,
    isLecturers: false,
  });

  // const loadUser = async () => {
  //   try {
  //     const response = await axios.get(`${apiURL}/authentication`, {
  //       withCredentials: true,
  //     });

  //     if (response.data.success) {
  //       dispatch({
  //         type: 'SET_AUTH',
  //         payload: {
  //           infomation: {
  //             id: response.data.data.id,
  //             name: response.data.data.name,
  //             email: response.data.data.email,
  //           },
  //           isLecturers: response.data.data.lecturers,
  //         },
  //       });
  //     }

  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //     dispatch({
  //       type: 'REMOVE_AUTH',
  //     });
  //     if (error.response.data) return error.response.data;
  //     else return { success: false, message: error.message };
  //   }
  // };

  // useEffect(() => {
  //   loadUser();
  // }, []);

  const userLogin = async (loginData) => {
    try {
      const response = await axios.post(
        `${apiURL}/authentication/login`,
        loginData,
        { withCredentials: true },
      );

      if (response.data.success) {
        dispatch({
          type: 'SET_AUTH',
          payload: {
            infomation: {
              id: response.data.data.id,
              name: response.data.data.name,
              email: response.data.data.email,
            },
            isLecturers: response.data.data.lecturers,
          },
        });
      }

      return response.data;
    } catch (error) {
      if (error.response.data) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const userLogout = () => {
    dispatch({
      type: 'REMOVE_AUTH',
    });
  };

  // context   data
  const authContextData = {
    state,
    userLogin,
    userLogout,
  };

  // return provider
  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
