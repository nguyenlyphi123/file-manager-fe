import React from 'react';
import { Link } from 'react-router-dom';

import { AiOutlineHome } from 'react-icons/ai';
import { FiFile, FiFolder, FiSettings, FiStar, FiTrash } from 'react-icons/fi';

export default function SideMenu() {
  return (
    <div className='p-3 w-2/12 bg-white border-r border-gray-300 border-solid sticky top-16'>
      <Link
        to=''
        className='cursor-pointer flex items-center p-2 pl-4 my-2 rounded-md hover:bg-[#EFF1FF] duration-200'
      >
        <div className='text-[#8094AE] text-2xl font-bold mr-4'>
          <AiOutlineHome />
        </div>

        <div className='text-[#526484] text-sm font-medium'>Home</div>
      </Link>

      <Link
        to='files'
        className='cursor-pointer flex items-center p-2 pl-4 my-2 rounded-md hover:bg-[#EFF1FF] duration-200'
      >
        <div className='text-[#8094AE] text-2xl font-bold mr-4'>
          <FiFile />
        </div>

        <div className='text-[#526484] text-sm font-medium'>Files</div>
      </Link>

      <Link
        to='folders'
        className='cursor-pointer flex items-center p-2 pl-4 my-2 rounded-md hover:bg-[#EFF1FF] duration-200'
      >
        <div className='text-[#8094AE] text-2xl font-bold mr-4'>
          <FiFolder />
        </div>

        <div className='text-[#526484] text-sm font-medium'>Folders</div>
      </Link>

      <Link
        to='starred'
        className='cursor-pointer flex items-center p-2 pl-4 my-2 rounded-md hover:bg-[#EFF1FF] duration-200'
      >
        <div className='text-[#8094AE] text-2xl font-bold mr-4'>
          <FiStar />
        </div>

        <div className='text-[#526484] text-sm font-medium'>Starred</div>
      </Link>

      <Link
        to='recovery'
        className='cursor-pointer flex items-center p-2 pl-4 my-2 rounded-md hover:bg-[#EFF1FF] duration-200'
      >
        <div className='text-[#8094AE] text-2xl font-bold mr-4'>
          <FiTrash />
        </div>

        <div className='text-[#526484] text-sm font-medium'>Recovery</div>
      </Link>

      <Link
        to='settings'
        className='cursor-pointer flex items-center p-2 pl-4 my-2 rounded-md hover:bg-[#EFF1FF] duration-200'
      >
        <div className='text-[#8094AE] text-2xl font-bold mr-4'>
          <FiSettings />
        </div>

        <div className='text-[#526484] text-sm font-medium'>Settings</div>
      </Link>
    </div>
  );
}
