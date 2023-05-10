import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { LECTURERS_URL, PUPIL_URL } from '../../constants/constants';
import Cookies from 'js-cookie';

export default function LoginPage() {
  // context
  const { state, userLogin } = useContext(AuthContext);

  // redirect if user logged in
  const navigate = useNavigate();

  useEffect(() => {
    console.log('my cookie', Cookies.get('accessToken'));
    if (state.isAuthenticated) {
      state.isLecturers ? navigate(LECTURERS_URL) : navigate(PUPIL_URL);
    }
  }, [state.isAuthenticated]);

  // login data
  const [loginData, setLoginData] = useState({});
  const handleSetLoginData = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async () => {
    try {
      const response = await userLogin(loginData);

      if (response.success) {
        console.log('Logged in');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className='w-screen h-screen flex items-center justify-center'>
        <div className='border rounded-md bg-white flex justify-between flex-col w-[40%] py-12 px-8'>
          <div>
            <div className='text-3xl text-center tracking-wider'>
              Welcome to BanaFile
            </div>
            <div className='text-center text-2xl text-gray-700 font-medium mt-6 tracking-wider'>
              Login
            </div>

            <div className='px-6 mt-10'>
              <form onSubmit={handleLoginSubmit}>
                <div className='border rounded-md'>
                  <input
                    onChange={handleSetLoginData}
                    type='text'
                    name='username'
                    value={loginData.username}
                    placeholder='Username'
                    className='w-full h-[50px] outline-none indent-3 rounded-md'
                  />
                </div>

                <div className='border rounded-md px-3 mt-2'>
                  <input
                    onChange={handleSetLoginData}
                    type='password'
                    name='password'
                    value={loginData.password}
                    placeholder='Password'
                    className='w-full h-[50px] outline-none'
                  />
                </div>
              </form>

              <div className='flex justify-between items-center mt-2 text-sm text-gray-500 font-medium'>
                <p>First time stay here ?</p>
                <p className='hover:text-blue-500 cursor-pointer'>
                  Register Now
                </p>
              </div>
            </div>
          </div>

          <div className='flex justify-center w-full mt-[150px]'>
            <div
              onClick={handleLoginSubmit}
              className='bg-blue-600 text-white py-2 px-10 rounded-md cursor-pointer hover:bg-blue-700 duration-300'
            >
              Login
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
