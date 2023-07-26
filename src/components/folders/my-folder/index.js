import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Loading from 'parts/Loading';

import { setCurrentFolder } from 'redux/slices/curentFolder';
import { pushLocation, removeLocation } from 'redux/slices/location';
import { getFolderList } from 'services/folderController';

import LargeCard from 'components/cards/LargeCard';
import EmptyData from 'components/EmptyData';

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
    return <EmptyData message='You do not have any folders yet' />;

  if (folderLoading) return <Loading />;

  return (
    <>
      <div className='grid grid-cols-4 gap-4'>
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
