import React from 'react';

import { FaFolder } from 'react-icons/fa';
import { TiArrowSortedDown } from 'react-icons/ti';
import { BsDot, BsThreeDots } from 'react-icons/bs';
import { AiFillStar } from 'react-icons/ai';
import LargeFileCard from '../cards/LargeFileCard';

export default function Files() {
  return (
    <div className='h-[200vh] py-5 px-7 tracking-wide'>
      <div className='text-2xl text-gray-600 font-bold'>Files</div>

      <div className='mt-5'>
        <div className='flex items-center mb-4'>
          <p className='text-sm text-gray-500 font-semibold mr-2'>
            Last Opened
          </p>
          <TiArrowSortedDown className='text-gray-500' />
        </div>

        <div className='grid grid-cols-4 gap-4'>
          <LargeFileCard name={'My File'} type={'doc'} />
          <LargeFileCard name={'My File'} type={'ppt'} />
          <LargeFileCard name={'My File'} type={'xlsx'} />
          <LargeFileCard name={'My File'} type={'zip'} />
          <LargeFileCard name={'My File'} type={'mp4'} />
        </div>
      </div>
    </div>
  );
}
