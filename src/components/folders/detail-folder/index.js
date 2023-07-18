import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Loading from '../../../parts/Loading';
import { pushLocation } from '../../../redux/slices/location';
import { getFolderDetail } from '../../../services/folderController';
import MediumFileCard from '../../cards/MediumFileCard';
import { setCurrentFolder } from '../../../redux/slices/curentFolder';

export default function DetailFolder() {
  // fetch folder and file data
  const location = useLocation();
  const folder = location.state.folder;

  const {
    data: folders,
    isLoading: folderLoading,
    refetch,
  } = useQuery({
    queryKey: ['folder', { id: folder._id }],
    queryFn: async () => await getFolderDetail({ id: folder._id }),
  });

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
  };

  useEffect(() => {
    dispatch(setCurrentFolder(folder));
  }, [location]);

  if (folderLoading) return <Loading />;

  return (
    <>
      <div>
        {folders && folders?.data?.length > 0 && (
          <div>
            <p className='text-gray-700 font-medium'>Folders</p>
            <div className='grid grid-cols-4 gap-4 mt-2'>
              {folders?.data?.map((folder) => {
                return (
                  <MediumFileCard
                    onClick={handleCardSelect}
                    key={folder._id}
                    data={folder}
                    refetch={refetch}
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className='mt-4'>
          <p className='text-gray-700 font-medium'>Files</p>
          {/* <MediumFileCard /> */}
        </div>
      </div>
    </>
  );
}
