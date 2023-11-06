import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useDispatch } from 'react-redux';

import Loading from 'parts/Loading';

import { setCurrentFolder } from 'redux/slices/curentFolder';
import { pushLocation } from 'redux/slices/location';

import { getFileList } from 'services/fileController';
import { getFolderList, getQuickAccessFolder } from 'services/folderController';

import LargeCard from 'components/cards/LargeCard';
import MediumCard from 'components/cards/MediumCard';
import { NewFolder, UploadFile } from 'components/popups/ModelPopups';
import Sort from 'components/Sort';
import { Link } from 'react-router-dom';

export default function Home() {
  // sort
  const [sortKey, setSortKey] = useState('lastOpened');

  const handleSort = (val) => {
    setSortKey(val);
  };

  // fetch quick access folder
  const { data: quickAccess } = useQuery({
    queryKey: ['quickAccess'],
    queryFn: async () => {
      return await getQuickAccessFolder({
        page: 1,
      });
    },
    refetchOnWindowFocus: false,
  });

  // fetch folder data
  const { data: folders, isLoading: folderLoading } = useQuery({
    queryKey: ['folders', { sortKey }],
    queryFn: async ({ queryKey }) => {
      return await getFolderList({ page: 1, sortKey: queryKey[1].sortKey });
    },
    refetchOnWindowFocus: false,
  });

  // fetch file data
  const { data: files, isLoading: fileLoading } = useQuery({
    queryKey: ['files', { sortKey }],
    queryFn: async ({ queryKey }) => {
      return await getFileList({ page: 1, sortKey: queryKey[1].sortKey });
    },
    refetchOnWindowFocus: false,
  });

  // open/close upload file
  const [isUploadFileOpen, setIsUploadFileOpen] = useState(false);

  const handleOpenUploadFile = () => {
    setIsUploadFileOpen(true);
  };

  const handleCloseUploadFile = () => {
    setIsUploadFileOpen(false);
  };

  // dispatch action redux
  const dispatch = useDispatch();

  const handleCardSelect = (val) => {
    const data = {
      parent: val.parent_folder ? val.parent_folder._id : '',
      name: val.name,
      _id: val._id,
      href: val.href,
    };
    dispatch(setCurrentFolder(val));
    dispatch(pushLocation(data));
  };

  return (
    <>
      <div className='py-5 px-7 tracking-wide'>
        <UploadFile
          handleClose={handleCloseUploadFile}
          open={isUploadFileOpen}
        />

        <div className='text-[20px] text-gray-600 font-bold'>Home</div>

        <div className='mt-5'>
          <p className='text-md text-gray-600 font-bold mb-3'>Quick Access</p>
          <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4'>
            {quickAccess?.data?.map((folder) => {
              return (
                <LargeCard
                  onClick={handleCardSelect}
                  key={folder._id}
                  data={folder}
                />
              );
            })}
            <NewFolder title='New Quick Access' quickAccess>
              <div className='group bg-white border rounded-md p-4 h-[179px] flex justify-center items-center cursor-pointer hover:shadow-sm hover:scale-105 duration-200'>
                <AiOutlinePlusCircle className='text-4xl text-gray-400 group-hover:text-gray-500 duration-200' />
              </div>
            </NewFolder>
          </div>
        </div>

        <div className='mt-5'>
          <p className='text-md text-gray-600 font-bold mb-2'>Recent</p>
          <div className='mt-4 relative'>
            <div className='mb-7'>
              <Sort onSort={handleSort} />
            </div>

            {folderLoading || fileLoading ? (
              <Loading />
            ) : (
              <>
                <div className='border-t pt-3'>
                  <Link
                    to='/folders'
                    className='text-[0.8em] text-gray-600 font-bold uppercase tracking-wide'
                  >
                    Folder
                  </Link>
                  <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4 mt-3'>
                    {folders?.data?.map((folder) => {
                      return (
                        <MediumCard
                          onClick={handleCardSelect}
                          key={folder._id}
                          data={folder}
                        />
                      );
                    })}

                    <NewFolder title='New Folder'>
                      <div className='group bg-white border rounded-md p-4 h-[90px] flex justify-center items-center cursor-pointer hover:shadow-sm hover:scale-105 duration-200'>
                        <AiOutlinePlusCircle className='text-3xl text-gray-400 group-hover:text-gray-500 duration-200' />
                      </div>
                    </NewFolder>
                  </div>
                </div>

                <div className='border-t pt-3 mt-7'>
                  <Link
                    to='/files'
                    className='text-[0.8em] text-gray-600 font-bold uppercase'
                  >
                    Files
                  </Link>
                  <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4 mt-3'>
                    {files?.data?.map((file) => (
                      <MediumCard key={file._id} data={file} isFolder={false} />
                    ))}

                    <div
                      onClick={handleOpenUploadFile}
                      className='group bg-white border rounded-md p-4 h-[90px] flex justify-center items-center cursor-pointer hover:shadow-sm hover:scale-105 duration-200'
                    >
                      <AiOutlinePlusCircle className='text-3xl text-gray-400 group-hover:text-gray-500 duration-200' />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
