import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { TiArrowSortedDown } from 'react-icons/ti';
import { useDispatch } from 'react-redux';

import Loading from '../../parts/Loading';
import { setCurrentFolder } from '../../redux/slices/curentFolder';
import { pushLocation } from '../../redux/slices/location';

import { getFileList } from '../../services/fileController';
import { getFolderList } from '../../services/folderController';

import LargeCard from '../cards/LargeCard';
import MediumCard from '../cards/MediumCard';
import { NewFolder, UploadFile } from '../popups/ModelPopups';

export default function Home() {
  // fetch folder data
  const { data: folders, isLoading: folderLoading } = useQuery({
    queryKey: ['folders'],
    queryFn: () => getFolderList(),
  });

  // fetch file data
  const { data: files, isLoading: fileLoading } = useQuery({
    queryKey: ['files'],
    queryFn: () => getFileList(),
  });

  // open/close new folder
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);

  const handleOpenNewFolder = () => {
    setIsNewFolderOpen(true);
  };

  const handleCloseNewFolder = () => {
    setIsNewFolderOpen(false);
  };

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

  if (folderLoading || fileLoading) return <Loading />;

  return (
    <>
      <div className='h-[200vh] py-5 px-7 tracking-wide'>
        <NewFolder handleClose={handleCloseNewFolder} open={isNewFolderOpen} />
        <UploadFile
          handleClose={handleCloseUploadFile}
          open={isUploadFileOpen}
        />

        <div className='text-[20px] text-gray-600 font-bold'>Home</div>

        <div className='mt-5'>
          <p className='text-md text-gray-600 font-bold mb-2'>Quick Access</p>
          <div className='grid lg:grid-cols-4 gap-4 md:grid-cols-3'>
            {folders?.data.map((folder) => {
              return (
                <LargeCard
                  onClick={handleCardSelect}
                  key={folder._id}
                  data={folder}
                />
              );
            })}
          </div>
        </div>

        <div className='mt-5'>
          <p className='text-md text-gray-600 font-bold mb-2'>Recent Files</p>
          <div className='mt-4'>
            <div className='flex items-center mb-4'>
              <p className='text-sm text-gray-500 font-semibold mr-2'>
                Last Opened
              </p>
              <TiArrowSortedDown className='text-gray-500' />
            </div>

            <div className='border-t pt-3'>
              <p className='text-[0.8em] text-gray-600 font-bold uppercase tracking-wide'>
                Folder
              </p>
              <div className='grid grid-cols-4 gap-4 mt-3 '>
                {folders?.data.map((folder) => {
                  return (
                    <MediumCard
                      onClick={handleCardSelect}
                      key={folder._id}
                      data={folder}
                    />
                  );
                })}

                <div
                  onClick={handleOpenNewFolder}
                  className='group bg-white border rounded-md p-4 h-[90px] flex justify-center items-center cursor-pointer hover:shadow-sm hover:scale-105 duration-200'
                >
                  <AiOutlinePlusCircle className='text-3xl text-gray-400 group-hover:text-gray-500 duration-200' />
                </div>
              </div>
            </div>

            <div className='border-t pt-3 mt-10'>
              <p className='text-[0.8em] text-gray-600 font-bold uppercase'>
                Files
              </p>
              <div className='grid grid-cols-4 gap-4 mt-3 '>
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
          </div>
        </div>
      </div>
    </>
  );
}
