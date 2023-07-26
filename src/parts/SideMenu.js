import React from 'react';

import { AiOutlineHome, AiOutlineShareAlt } from 'react-icons/ai';
import { FiFile, FiFolder, FiSettings, FiStar, FiTrash } from 'react-icons/fi';
import { useDispatch } from 'react-redux';

import { removeLocation } from 'redux/slices/location';
import { resetCurrentFolder } from 'redux/slices/curentFolder';
import SideMenuItem from 'parts/SideMenuItem';

export default function SideMenu() {
  // dispatch action redux
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(removeLocation());
    dispatch(resetCurrentFolder());
  };

  return (
    <div className='p-3 w-2/12 bg-white border-r border-gray-300 border-solid sticky top-16'>
      <SideMenuItem
        onClick={handleClick}
        to=''
        className='cursor-pointer flex items-center p-2 pl-4 my-2 rounded-md hover:bg-[#EFF1FF] duration-200'
      >
        <div className='text-[#8094AE] text-xl font-bold mr-4'>
          <AiOutlineHome />
        </div>

        <div className='text-[#526484] text-md font-medium'>Home</div>
      </SideMenuItem>

      <SideMenuItem
        onClick={handleClick}
        to='files'
        className='cursor-pointer flex items-center p-2 pl-4 my-2 rounded-md hover:bg-[#EFF1FF] duration-200'
      >
        <div className='text-[#8094AE] text-xl font-bold mr-4'>
          <FiFile />
        </div>

        <div className='text-[#526484] text-md font-medium'>Files</div>
      </SideMenuItem>

      <SideMenuItem
        onClick={handleClick}
        to='folders'
        className='cursor-pointer flex items-center p-2 pl-4 my-2 rounded-md hover:bg-[#EFF1FF] duration-200'
      >
        <div className='text-[#8094AE] text-xl font-bold mr-4'>
          <FiFolder />
        </div>

        <div className='text-[#526484] text-md font-medium'>Folders</div>
      </SideMenuItem>

      <SideMenuItem
        onClick={handleClick}
        to='starred'
        className='cursor-pointer flex items-center p-2 pl-4 my-2 rounded-md hover:bg-[#EFF1FF] duration-200'
      >
        <div className='text-[#8094AE] text-xl font-bold mr-4'>
          <FiStar />
        </div>

        <div className='text-[#526484] text-md font-medium'>Starred</div>
      </SideMenuItem>

      <SideMenuItem
        onClick={handleClick}
        to='shared'
        className='cursor-pointer flex items-center p-2 pl-4 my-2 rounded-md hover:bg-[#EFF1FF] duration-200'
      >
        <div className='text-[#8094AE] text-xl font-bold mr-4'>
          <AiOutlineShareAlt />
        </div>

        <div className='text-[#526484] text-md font-medium'>Shared with me</div>
      </SideMenuItem>

      <SideMenuItem
        onClick={handleClick}
        to='recovery'
        className='cursor-pointer flex items-center p-2 pl-4 my-2 rounded-md hover:bg-[#EFF1FF] duration-200'
      >
        <div className='text-[#8094AE] text-xl font-bold mr-4'>
          <FiTrash />
        </div>

        <div className='text-[#526484] text-md font-medium'>Recovery</div>
      </SideMenuItem>

      <SideMenuItem
        onClick={handleClick}
        to='settings'
        className='cursor-pointer flex items-center p-2 pl-4 my-2 rounded-md hover:bg-[#EFF1FF] duration-200'
      >
        <div className='text-[#8094AE] text-xl font-bold mr-4'>
          <FiSettings />
        </div>

        <div className='text-[#526484] text-md font-medium'>Settings</div>
      </SideMenuItem>
    </div>
  );
}
