import React, { useCallback, useEffect, useState } from 'react';
import { ImSpinner } from 'react-icons/im';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { DangerAlert } from 'parts/AlertPopup';
import { loadUser, logIn } from 'redux/slices/user';
import { unwrapResult } from '@reduxjs/toolkit';

export default function LoginPage() {
  // redirect if user logged in
  const location = useLocation();
  const from = location.state?.from?.pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user.isAuthenticated && location.state?.action !== 'LOGOUT') {
      if (from) {
        navigate(from, { replace: true });
      }
      navigate('/');
    }
  }, [user.isAuthenticated, navigate, from, location.state?.action]);

  // login data
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const handleSetLoginData = (e) => {
    if (e.key === 'Enter') return handleLoginSubmit(loginData);
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = useCallback(
    async (loginData) => {
      if (loginData.username === '' || loginData.password === '') {
        AlertFail('Username or password is missing !!!');
        return;
      }

      setIsLoading(true);

      try {
        const response = await dispatch(logIn(loginData));

        const unwrappedResponse = unwrapResult(response);

        if (!unwrappedResponse.id) {
          setIsLoading(false);
          AlertFail('Username or password is incorrect !!!');
          return;
        }

        if (from) {
          navigate(from, { replace: true });
        }
        navigate('/');
      } catch (error) {
        setIsLoading(false);
        AlertFail('Username or password is incorrect !!!');
      }
    },
    [dispatch, from, navigate],
  );

  useEffect(() => {
    if (location.state?.action === 'LOGOUT') {
      return;
    }
    if (!user.isAuthenticated && !location.state?.action !== 'LOGOUT') {
      dispatch(loadUser());
    }
    // eslint-disable-next-line
  }, [dispatch]);

  // loading
  const [isLoading, setIsLoading] = useState(false);

  // alert
  const [isAlert, setIsAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const AlertFail = (message) => {
    setIsAlert(true);
    setMessage(message);
    setIsSuccess(false);
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
              {isAlert ? (
                isSuccess ? (
                  ''
                ) : (
                  <DangerAlert className='mb-4' message={message} />
                )
              ) : (
                ''
              )}
              <form>
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
                    onKeyDown={handleSetLoginData}
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
              onClick={() => handleLoginSubmit(loginData)}
              className={`bg-blue-600 text-white py-2 px-2 w-[100px] h-[40px] rounded-md cursor-pointer hover:bg-blue-700 duration-300 flex justify-center items-center`}
            >
              {isLoading ? <ImSpinner className='animate-spin' /> : 'Login'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
