import React from 'react';

import { BsThreeDots } from 'react-icons/bs';
import { DatePicker } from 'rsuite';
import FileIconHelper from '../../utils/helpers/FileIconHelper';

import 'rsuite/dist/rsuite-no-reset.min.css';

export default function Recovery() {
  return (
    <div className='h-[200vh] py-5 px-7 tracking-wide'>
      <div className='text-[20px] text-gray-600 font-bold'>Recovery</div>

      <div className='mt-5 flex'>
        <div className='w-3/12'>
          <div className='p-2'>
            <div>
              <p className='text-[0.9em] text-gray-500 font-medium'>From</p>
              <DatePicker
                className='w-full mt-1'
                // value=''
                placeholder='Select Date'
                format='dd/MMM/yyyy'
              />
            </div>

            <div className='mt-3'>
              <p className='text-[0.9em] text-gray-500 font-medium'>To</p>
              <DatePicker
                className='w-full mt-1'
                // value=''
                placeholder='Select Date'
                format='dd/MMM/yyyy'
              />
            </div>

            <div className='mt-3'>
              <p className='text-[0.8em] text-blue-500 font-medium cursor-pointer'>
                Reset Filter
              </p>
            </div>
          </div>
        </div>

        <div className='w-9/12 p-2'>
          <table className='w-full'>
            <thead>
              <tr className='text-[0.9em] text-gray-500'>
                <th className='text-left w-[60%] font-semibold pb-1'>Name</th>
                <th className='text-left font-semibold pb-1'>Size</th>
                <th className='text-left font-semibold pb-1'>Deleted At</th>
                <th className='w-[70px]'></th>
              </tr>
            </thead>

            <tbody className='bg-white'>
              <tr className='cursor-pointer border'>
                <td className='p-4 pl-7'>
                  <div className='flex items-center'>
                    <FileIconHelper className='text-3xl mr-3' type={'folder'} />
                    <p className='text-[0.9em] text-gray-700 font-semibold mr-3'>
                      My Folder
                    </p>
                  </div>
                </td>

                <td>
                  <p className='text-[0.9em] text-gray-500 font-medium'>
                    4.5 KB
                  </p>
                </td>

                <td>
                  <p className='text-[0.9em] text-gray-500 font-medium'>
                    Today, 08:09 AM
                  </p>
                </td>

                <td>
                  <div className='p-2 flex group/threedots'>
                    <div className='bg-[#E5E9F2] h-[20px] w-[20px] rounded-full opacity-0 translate-x-[20px] group-hover/threedots:scale-150 group-hover/threedots:opacity-100 duration-300'></div>
                    <BsThreeDots className='text-gray-600 text-xl z-10' />
                  </div>
                </td>
              </tr>

              <tr className='cursor-pointer border'>
                <td className='p-4 pl-7'>
                  <div className='flex items-center'>
                    <FileIconHelper className='text-3xl mr-3' type={'folder'} />
                    <p className='text-[0.9em] text-gray-700 font-semibold mr-3'>
                      My Folder
                    </p>
                  </div>
                </td>

                <td>
                  <p className='text-[0.9em] text-gray-500 font-medium'>
                    4.5 KB
                  </p>
                </td>

                <td>
                  <p className='text-[0.9em] text-gray-500 font-medium'>
                    Today, 08:09 AM
                  </p>
                </td>

                <td>
                  <div className='p-2 flex group/threedots'>
                    <div className='bg-[#E5E9F2] h-[20px] w-[20px] rounded-full opacity-0 translate-x-[20px] group-hover/threedots:scale-150 group-hover/threedots:opacity-100 duration-300'></div>
                    <BsThreeDots className='text-gray-600 text-xl z-10' />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
