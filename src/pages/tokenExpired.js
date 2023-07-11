import React from 'react';
import { Link } from 'react-router-dom';

export default function TokenExpired() {
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

        <Link
          to='/login'
          className='bg-gray-400 rounded py-2 px-10 text-white uppercase mt-5 cursor-pointer hover:bg-gray-700 duration-200'
        >
          Login
        </Link>
      </div>
    </div>
  );
}
