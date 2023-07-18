import React from 'react';

import { DatePicker } from 'rsuite';
import FileIconHelper from '../../utils/helpers/FileIconHelper';

import { useQuery } from '@tanstack/react-query';
import 'rsuite/dist/rsuite-no-reset.min.css';
import Loading from '../../parts/Loading';
import { getRemovedFolder } from '../../services/folderController';
import { FormattedDateTime } from '../../utils/helpers/TypographyHelper';
import EmptyData from '../EmptyData';
import { RemovedThreeDotsDropDown } from '../popups/ModelPopups';

export default function Recovery() {
  const { data: folders, isLoading } = useQuery({
    queryKey: ['recovery'],
    queryFn: () => getRemovedFolder(),
    retry: 3,
  });

  if (isLoading) return <Loading />;

  return (
    <div className='h-[200vh] py-5 px-7 tracking-wide'>
      <div className='text-[20px] text-gray-600 font-bold'>Recovery</div>

      {folders?.data?.length > 0 ? (
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
                  <th className='text-left font-semibold pb-1 pl-7'>Name</th>
                  <th className='text-left font-semibold pb-1'>Size</th>
                  <th className='text-left font-semibold pb-1'>Deleted At</th>
                  <th className=''></th>
                </tr>
              </thead>

              {folders?.data?.map((folder) => {
                return (
                  <tbody className='bg-white'>
                    <tr className='cursor-pointer border'>
                      <td className='p-4 pl-7'>
                        <div className='flex items-center'>
                          <FileIconHelper
                            className='text-3xl mr-3'
                            type={'folder'}
                          />
                          <div className='relative'>
                            <p className='text-[0.9em] text-gray-700 font-semibold mr-3'>
                              {folder.name}
                            </p>
                            <p className='text-[0.7em] text-gray-500 font-semibold mr-3 '>
                              {folder.parent_folder
                                ? folder.parent_folder?.name
                                : 'Root'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <p className='text-[0.9em] text-gray-500'>4.5 KB</p>
                      </td>

                      <td>
                        <p className='text-[0.9em] text-gray-500'>
                          {FormattedDateTime(folder.modifiedAt)}
                        </p>
                      </td>

                      <td>
                        <div className='p-2 flex group/threedots'>
                          <RemovedThreeDotsDropDown data={folder} />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
        </div>
      ) : (
        <EmptyData message='No folders have been deleted' />
      )}
    </div>
  );
}
