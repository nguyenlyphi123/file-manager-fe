import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { TiArrowSortedDown } from 'react-icons/ti';
import { useDispatch } from 'react-redux';
import Loading from '../../parts/Loading';
import { setCurrentFolder } from '../../redux/slices/curentFolder';
import { pushLocation } from '../../redux/slices/location';
import { getFolderList } from '../../services/folderController';
import LargeFileCard from '../cards/LargeFileCard';
import MediumFileCard from '../cards/MediumFileCard';
import { NewFolder } from '../popups/ModelPopups';

export default function Home() {
  // fetch folder data
  const {
    data: folders,
    isLoading: folderLoading,
    refetch,
  } = useQuery({
    queryKey: ['folderHome'],
    queryFn: async () => await getFolderList(),
  });

  // open/close new folder
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);

  const handleOpenNewFolder = () => {
    setIsNewFolderOpen(true);
  };

  const handleCloseNewFolder = () => {
    setIsNewFolderOpen(false);
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

  if (folderLoading) return <Loading />;

  return (
    <>
      <div className='h-[200vh] py-5 px-7 tracking-wide'>
        <NewFolder handleClose={handleCloseNewFolder} open={isNewFolderOpen} />

        <div className='text-[20px] text-gray-600 font-bold'>Home</div>

        <div className='mt-5'>
          <p className='text-lg text-gray-600 font-bold mb-2'>Quick Access</p>
          <div className='grid lg:grid-cols-4 gap-4 md:grid-cols-3'>
            {folders?.data.map((folder) => {
              return (
                <LargeFileCard
                  onClick={handleCardSelect}
                  key={folder._id}
                  data={folder}
                  refetch={refetch}
                />
              );
            })}
          </div>
        </div>

        <div className='mt-5'>
          <p className='text-lg text-gray-600 font-bold mb-2'>Recent Files</p>
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
                    <MediumFileCard
                      onClick={handleCardSelect}
                      key={folder._id}
                      data={folder}
                      refetch={refetch}
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
                {/* <MediumFileCard name={'My File'} type={'doc'} />
                <MediumFileCard name={'My File'} type={'ppt'} />
                <MediumFileCard name={'My File'} type={'xlsx'} />
                <MediumFileCard name={'My File'} type={'zip'} />
                <MediumFileCard name={'My File'} type={'mp4'} /> */}

                <div className='bg-white border rounded-md p-4 h-[90px] flex justify-center items-center'>
                  <AiOutlinePlusCircle className='text-3xl text-gray-400' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
