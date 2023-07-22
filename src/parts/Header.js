import React from 'react';
import { FiFolder } from 'react-icons/fi';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logOut } from '../redux/slices/user';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <div className='bg-white flex justify-between items-center border-b border-gray-300 border-solid p-5 pl-6 pr-6 h-[80px] sticky top-0 z-10'>
      <Link to='' className='flex items-center cursor-pointer'>
        <div className='bg-[#efecff] p-2 rounded-full flex items-center content-center'>
          <FiFolder className='text-[#816bff] text-2xl' />
        </div>

        <p className='font-bold ml-2 text-gray-600'>File Manager</p>
      </Link>

      <div className='flex items-center'>
        <div className='group relative mr-5 p-1 cursor-pointer hover:bg-[#E5E9F2] rounded-full transition duration-300 ease-in-out'>
          <IoMdNotificationsOutline className='text-3xl text-gray-600 group-hover:text-blue-600 duration-300 ease-in-out' />
          <div className='absolute top-[6px] right-[5px] p-[2px] bg-white rounded-full'>
            <div className='w-2 h-2 bg-blue-400 rounded-full '></div>
          </div>
        </div>

        <div onClick={handleLogout} className='cursor-pointer'>
          <img
            src='https://firebasestorage.googleapis.com/v0/b/banahub.appspot.com/o/images%2Fuser.png?alt=media&token=3f002655-c97b-4022-b601-b24c6e5b901b'
            alt=''
            className='w-9 h-9 rounded-full'
          />
        </div>
      </div>
    </div>
  );
}
