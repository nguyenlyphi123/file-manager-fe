import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import MediumCard from '../../cards/MediumCard';
import Loading from '../../../parts/Loading';

import { pushLocation } from '../../../redux/slices/location';
import { setCurrentFolder } from '../../../redux/slices/curentFolder';

import { getFileByFolder } from '../../../services/fileController';
import { getFolderDetail } from '../../../services/folderController';

export default function DetailFolder() {
  // fetch folder and file data
  const location = useLocation();
  const folder = location.state.folder;

  const { data: folders, isLoading: folderLoading } = useQuery({
    queryKey: ['folder', { id: folder._id }],
    queryFn: () => getFolderDetail({ id: folder._id }),
  });

  const { data: files, isLoading: fileLoading } = useQuery({
    queryKey: ['file', { id: folder._id }],
    queryFn: () => getFileByFolder({ id: folder._id }),
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

  if (folderLoading || fileLoading) return <Loading />;

  return (
    <>
      <div>
        {folders && folders?.data?.length > 0 && (
          <>
            <p className='text-gray-700 font-medium'>Folders</p>
            <div className='grid grid-cols-4 gap-4 mt-2'>
              {folders?.data?.map((folder) => {
                return (
                  <MediumCard
                    onClick={handleCardSelect}
                    key={folder._id}
                    data={folder}
                  />
                );
              })}
            </div>
          </>
        )}

        <div className='mt-4'>
          {files && files?.data?.length > 0 && (
            <>
              <p className='text-gray-700 font-medium'>Files</p>
              <div className='grid grid-cols-4 gap-4 mt-2'>
                {files?.data?.map((file) => {
                  return (
                    <MediumCard
                      onClick={handleCardSelect}
                      key={file._id}
                      data={file}
                      isFolder={false}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
