import React from 'react';
import Header from '../parts/Header';
import SideMenu from '../parts/SideMenu';
import { Outlet } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { AiOutlineCloudUpload, AiOutlinePlus } from 'react-icons/ai';

export default function LecturersPage() {
  return (
    <>
      <Header />
      <div className='flex h-[calc(100vh-80px)]'>
        <SideMenu />
        <div className='w-10/12'>
          <div className='bg-white flex justify-between items-center h-[62px] py-3 px-4 border'>
            <div className='flex items-center w-fit'>
              <FiSearch className='text-gray-600 cursor-pointer' />
              {/* <input
                className='outline-none ml-3 text-[0.85em] h-7 w-[300px]'
                type=''
                name=''
                value=''
                placeholder='Search files, folders'
              /> */}
            </div>

            <div className='flex'>
              <button
                className='bg-[#d3d9e7] py-2 px-5 rounded-sm mx-2 flex items-center hover:bg-[#C3C6CE] hover:text-white hover:scale-105 duration-100'
                type='button'
              >
                <AiOutlinePlus className='mr-3 font-bold' />
                <p className='text-sm font-semibold '>Create</p>
              </button>
              <button
                className='bg-[#5664D9] py-2 px-5 rounded-sm mx-2 text-white flex items-center hover:bg-[#2f40dd] hover:scale-105 duration-100'
                type='button'
              >
                <AiOutlineCloudUpload className='mr-3 text-lg' />
                <p className='text-sm font-medium'>Upload</p>
              </button>
            </div>
          </div>

          <div className='h-[calc(100vh-142px)] overflow-y-scroll'>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
