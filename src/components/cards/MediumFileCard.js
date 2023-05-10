import React from 'react';

import FileIconHelper from '../../utils/FileIconHelper';
import { BsDot, BsThreeDots } from 'react-icons/bs';
import { AiFillStar } from 'react-icons/ai';

export default function MediumFileCard({ name, type }) {
  return (
    <div className='bg-white border rounded-md p-4 cursor-pointer group/card'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center'>
          <FileIconHelper className='text-3xl mr-3' type={type} />
          <p className='text-[0.9em] text-gray-600 font-semibold'>{name}</p>

          <div className='relative'>
            <p className='text-[0.9em] text-gray-600 font-semibold'>{name}</p>
            <AiFillStar className='text-gray-400 text-lg font-semibold absolute top-0 right-0 translate-x-[25px] hidden group-hover/card:block hover/card:text-[#8AA3FF] duration-200' />
          </div>
        </div>

        <div className='flex group/threedots'>
          <div className='bg-[#E5E9F2] h-[20px] w-[20px] rounded-full opacity-0 translate-x-[20px] group-hover/threedots:scale-150 group-hover/threedots:opacity-100 duration-300'></div>
          <BsThreeDots className='text-gray-600 text-xl z-10' />
        </div>
      </div>

      <div className='mt-2'>
        <p className='flex items-center text-[0.8em] text-gray-400'>
          Today <BsDot className='text-xl' /> 4.5 MB
        </p>
      </div>
    </div>
  );
}
