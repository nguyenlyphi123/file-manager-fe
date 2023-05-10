import React from 'react';
import FileIconHelper from '../../utils/FileIconHelper';
import { AiFillStar } from 'react-icons/ai';
import { TbSquareRoundedCheckFilled } from 'react-icons/tb';

export default function Starred() {
  return (
    <div className='h-[200vh] py-5 px-7 tracking-wide'>
      <div className='text-2xl text-gray-600 font-bold'>Starred</div>

      <div className='mt-5'>
        <table className='w-full'>
          <thead>
            <tr className='text-[0.9em] text-gray-500'>
              <th className='text-left w-[50%] font-semibold pb-3'>Name</th>
              <th className='text-left font-semibold pb-3'>Last Opened</th>
              <th className='text-left font-semibold pb-3'>Size</th>
              <th></th>
            </tr>
          </thead>

          <tbody className='bg-white border rounded-md'>
            <tr>
              <td className='p-4'>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    name=''
                    value=''
                    className='h-4 w-4 mr-4'
                  />
                  <FileIconHelper className='text-3xl mr-3' type={'folder'} />
                  <p className='text-[0.9em] text-gray-700 font-semibold mr-3'>
                    My Folder
                  </p>
                  <AiFillStar className='text-[#8AA3FF] text-xl' />
                </div>
              </td>

              <td>
                <p className='text-[0.9em] text-gray-500 font-medium'>
                  Today, 08:09 AM
                </p>
              </td>

              <td>
                <p className='text-[0.9em] text-gray-500 font-semibold'>
                  4.5 KB
                </p>
              </td>

              <td className='w-[100px]'>
                <div className='text-center text-white py-1 px-4 bg-red-400 w-fit rounded-md cursor-pointer hover:bg-red-500'>
                  Unstar
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
