import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, useLocation, useParams } from 'react-router-dom';

import Loading from 'parts/Loading';

import MediumCard from 'components/cards/MediumCard';

import { setCurrentFolder } from 'redux/slices/curentFolder';
import { pushLocation } from 'redux/slices/location';

import EmptyData from 'components/EmptyData';
import Sort from 'components/Sort';
import { getFileByFolder } from 'services/fileController';
import { getFolderDetail } from 'services/folderController';

export default function DetailFolder() {
  // fetch folder and file data
  const location = useLocation();
  const folder = location.state?.folder;
  const { folderId } = useParams();

  const [sortKey, setSortKey] = useState('lastOpened');

  const handleSort = (val) => {
    setSortKey(val);
  };

  const {
    data: folders,
    isLoading: folderLoading,
    isLoadingError: folderErr,
  } = useQuery({
    queryKey: ['folder', { id: folderId }],
    queryFn: () => getFolderDetail({ id: folderId }),
    refetchOnWindowFocus: false,
    retry: 0,
  });

  const {
    data: files,
    isLoading: fileLoading,
    isLoadingError: fileErr,
  } = useQuery({
    queryKey: ['file', { id: folderId }],
    queryFn: () => getFileByFolder({ id: folderId }),
    refetchOnWindowFocus: false,
    retry: 0,
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
    !folder &&
      folders?.location &&
      folders.location.map((item) =>
        dispatch(pushLocation({ ...item, href: `/folders/${item._id}` })),
      );

    dispatch(
      setCurrentFolder(
        folder ? folder : folders?.location[folders?.location.length - 1],
      ),
    );
  }, [dispatch, folder, folders]);

  if (folderErr || fileErr) return <Navigate to='/folders' replace />;

  if (folderLoading || fileLoading) return <Loading />;

  if (folders?.data?.length === 0 && files.data?.length === 0)
    return <EmptyData message='There are no folders or files yet' />;

  return (
    <>
      <div className='mb-4'>
        <Sort onSort={handleSort} />
      </div>
      <div>
        {folders && folders?.data?.length > 0 && (
          <>
            <p className='text-gray-700 font-medium'>Folders</p>
            <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4 mt-2'>
              {folders?.data
                ?.sort(
                  (a, b) => Date.parse(b[sortKey]) - Date.parse(a[sortKey]),
                )
                .map((folder) => {
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
              <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4 mt-2'>
                {files?.data
                  ?.sort(
                    (a, b) => Date.parse(b[sortKey]) - Date.parse(a[sortKey]),
                  )
                  .map((file) => {
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
