import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Loading from 'parts/Loading';

import { setCurrentFolder } from 'redux/slices/curentFolder';
import { pushLocation, removeLocation } from 'redux/slices/location';
import { getFolderList } from 'services/folderController';

import LargeCard from 'components/cards/LargeCard';
import EmptyData from 'components/EmptyData';
import { TiArrowSortedDown } from 'react-icons/ti';

export default function MyFolder() {
  // dispatch action redux
  const dispatch = useDispatch();

  const handleCardSelect = (val) => {
    const data = {
      parent: val.parent_folder ? val.parent_folder._id : '',
      name: val.name,
      _id: val._id,
      href: val.href,
    };
    dispatch(pushLocation(data));
    dispatch(setCurrentFolder(val));
  };

  useEffect(() => {
    dispatch(removeLocation());
  }, []);

  // folder data
  const { data: folders, isLoading: folderLoading } = useQuery({
    queryKey: ['folders'],
    queryFn: async () => await getFolderList(),
    retry: 3,
  });

  if (folders?.data?.length === 0)
    return <EmptyData message='There are no folders yet' />;

  if (folderLoading) return <Loading />;

  return (
    <>
      <div className='flex items-center mb-4 h-5'>
        <p className='text-sm text-gray-500 font-semibold mr-2'>Last Opened</p>
        <TiArrowSortedDown className='text-gray-500' />
      </div>
      <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4'>
        {folders &&
          folders?.data?.map((folder) => {
            return (
              <LargeCard
                onClick={handleCardSelect}
                key={folder._id}
                data={folder}
              />
            );
          })}
      </div>
    </>
  );
}
