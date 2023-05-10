import React from 'react';
import FileIconHelper from '../../utils/FileIconHelper';

import { BsDot, BsThreeDots } from 'react-icons/bs';
import { AiFillStar } from 'react-icons/ai';

export default function LargeFileCard({ name, type }) {
  return (
    <div className='group/card flex items-center justify-center flex-col bg-white h-[180px] border rounded-md relative cursor-pointer'>
      <div className='absolute top-2 right-2 p-2 flex group/threedots'>
        <div className='bg-[#E5E9F2] h-[20px] w-[20px] rounded-full opacity-0 translate-x-[20px] group-hover/threedots:scale-150 group-hover/threedots:opacity-100 duration-300'></div>
        <BsThreeDots className='text-gray-600 text-xl z-10' />
      </div>

      <FileIconHelper className='text-6xl mb-4' type={type} />

      <div className='relative'>
        <p className='text-[0.9em] text-gray-600 font-semibold'>{name}</p>
        <AiFillStar className='text-gray-400 text-xl font-semibold absolute top-0 right-0 translate-x-[35px] hidden group-hover/card:block hover/card:text-[#8AA3FF] duration-200' />
      </div>

      <p className='flex items-center text-[0.8em] text-gray-400 mt-2'>
        Today <BsDot className='text-xl' /> 4.5 MB
      </p>
    </div>
  );
}
