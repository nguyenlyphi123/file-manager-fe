import { useCallback, useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { ImSpinner } from 'react-icons/im';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { Divider } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { DangerAlert } from 'parts/AlertPopup';
import { loadUser, logIn } from 'redux/slices/user';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector((state) => state.user);

  // redirect if user logged in
  const from = location.state?.from?.pathname;

  useEffect(() => {
    if (user.isAuthenticated && location.state?.action !== 'LOGOUT') {
      from ? navigate(from, { replace: true }) : navigate('/');
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
    if (!user.isAuthenticated) {
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

  const handleGoogleLogin = () => {
    window.open(
      `${process.env.REACT_APP_API_URL}/authentication/google`,
      '_self',
    );
  };

  return (
    <div>
      <div className='w-screen h-screen flex items-center justify-center'>
        <div className='border rounded-md bg-white flex justify-between flex-col lg:w-[40%] md:w-[50%] sm:w-[60%] py-12 px-8'>
          <div>
            <div className='text-3xl text-center tracking-wider'>
              Welcome to BanaFile
            </div>
            <div className='text-center text-2xl text-gray-700 font-medium mt-6 tracking-wider'>
              Login
            </div>

            <div className='lg:px-6 md:px-3 mt-10'>
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

          <div className='flex flex-col justify-center w-full mt-[100px]'>
            <div className='flex justify-center'>
              <LoadingButton
                variant='contained'
                onClick={() => handleLoginSubmit(loginData)}
                loading={isLoading}
                loadingIndicator={<ImSpinner className='animate-spin' />}
                sx={{ width: '300px' }}
                // className='lg:w-[40%] md:w-[50%] sm:w-[60%]'
              >
                Login
              </LoadingButton>
            </div>

            <Divider sx={{ m: 3, color: 'GrayText' }}>Or</Divider>

            <div className='flex justify-center'>
              <button
                className='px-4 py-2 min-w-[300px] flex justify-center items-center border gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150'
                onClick={handleGoogleLogin}
              >
                <FcGoogle className='text-2xl' />
                <span>Login with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
