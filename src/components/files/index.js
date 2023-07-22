import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { TiArrowSortedDown } from 'react-icons/ti';

import { getFileList } from '../../services/fileController';
import LargeCard from '../cards/LargeCard';
import Loading from '../../parts/Loading';

export default function Files() {
  const { data: files, isLoading } = useQuery({
    queryKey: ['files'],
    queryFn: () => getFileList(),
    retry: 3,
  });

  if (isLoading) return <Loading />;

  return (
    <div className='h-[200vh] py-5 px-7 tracking-wide'>
      <div className='text-[20px] text-gray-600 font-bold'>Files</div>

      <div className='mt-5'>
        <div className='flex items-center mb-4'>
          <p className='text-sm text-gray-500 font-semibold mr-2'>
            Last Opened
          </p>
          <TiArrowSortedDown className='text-gray-500' />
        </div>

        <div className='grid grid-cols-4 gap-4'>
          {files?.data?.map((file) => (
            <LargeCard key={file._id} data={file} isFolder={false} />
          ))}
        </div>
      </div>
    </div>
  );
}
