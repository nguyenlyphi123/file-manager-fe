import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

export default function TokenExpired() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from;

  useEffect(() => {
    user.isAuthenticated && navigate(from ? from : '/', { replace: true });
  }, [from, location.state.from, navigate, user.isAuthenticated]);

  const handleClick = () => {
    navigate('/login', { state: { action: 'LOGOUT', from: from } });
  };

  return (
    <div className='w-screen h-screen relative'>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[50%] w-[50%] flex items-center justify-center flex-col'>
        <img src='cookie.png' alt='token-expired' className='w-[200px]' />

        <p className='text-center text-3xl text-gray-600 font-bold mt-5'>
          Your Session Has Expired
        </p>
        <p className='text-gray-600 mt-5'>
          Please login again to continute. Don't worry, we kept all of your work
          in place
        </p>

        <button
          onClick={handleClick}
          className='bg-gray-400 rounded py-2 px-10 text-white uppercase mt-5 cursor-pointer hover:bg-gray-700 duration-200'
        >
          Login
        </button>
      </div>
    </div>
  );
}
