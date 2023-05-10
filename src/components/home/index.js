import React from 'react';

import { TiArrowSortedDown } from 'react-icons/ti';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import LargeFileCard from '../cards/LargeFileCard';
import MediumFileCard from '../cards/MediumFileCard';

export default function Home() {
  return (
    <div className='h-[200vh] py-5 px-7 tracking-wide'>
      <div className='text-2xl text-gray-600 font-bold'>Home</div>

      <div className='mt-5'>
        <p className='text-lg text-gray-600 font-bold mb-2'>Quick Access</p>
        <div className='grid grid-cols-4 gap-4'>
          <LargeFileCard name={'My Folder'} />
          <LargeFileCard name={'My Folder'} />
          <LargeFileCard name={'My Folder'} />
          <LargeFileCard name={'My Folder'} />
          <LargeFileCard name={'My Folder'} />
          <LargeFileCard name={'My Folder'} />
          <LargeFileCard name={'My Folder'} />
        </div>
      </div>

      <div className='mt-5'>
        <p className='text-lg text-gray-600 font-bold mb-2'>Recent Files</p>
        <div className='mt-4'>
          <div className='flex items-center mb-4'>
            <p className='text-sm text-gray-500 font-semibold mr-2'>
              Last Opened
            </p>
            <TiArrowSortedDown className='text-gray-500' />
          </div>

          <div className='border-t pt-3'>
            <p className='text-[0.8em] text-gray-600 font-bold uppercase tracking-wide'>
              Folder
            </p>
            <div className='grid grid-cols-4 gap-4 mt-3 '>
              <MediumFileCard name={'My Folder'} />
              <MediumFileCard name={'My Folder'} />
              <MediumFileCard name={'My Folder'} />
              <MediumFileCard name={'My Folder'} />
              <MediumFileCard name={'My Folder'} />
              <MediumFileCard name={'My Folder'} />
              <MediumFileCard name={'My Folder'} />

              <div className='bg-white border rounded-md p-4 h-[90px] flex justify-center items-center'>
                <AiOutlinePlusCircle className='text-3xl text-gray-400' />
              </div>
            </div>
          </div>

          <div className='border-t pt-3 mt-10'>
            <p className='text-[0.8em] text-gray-600 font-bold uppercase'>
              Files
            </p>
            <div className='grid grid-cols-4 gap-4 mt-3 '>
              <MediumFileCard name={'My File'} type={'doc'} />
              <MediumFileCard name={'My File'} type={'ppt'} />
              <MediumFileCard name={'My File'} type={'xlsx'} />
              <MediumFileCard name={'My File'} type={'zip'} />
              <MediumFileCard name={'My File'} type={'mp4'} />

              <div className='bg-white border rounded-md p-4 h-[90px] flex justify-center items-center'>
                <AiOutlinePlusCircle className='text-3xl text-gray-400' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
