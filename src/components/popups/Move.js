import { Box, Modal } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RQK_FOLDER, RQK_FOLDERS } from 'apis/folder.api';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';
import Loading from 'parts/Loading';
import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BiRightArrow } from 'react-icons/bi';
import { ImSpinner } from 'react-icons/im';
import { useSelector } from 'react-redux';
import { moveFile } from 'services/fileController';
import {
  getFolderDetail,
  getFolderList,
  moveFolder,
} from 'services/folderController';

export const Move = ({ handleClose, data, open }) => {
  const curentFolder = useSelector((state) => state.curentFolder);

  const queryClient = useQueryClient();

  // selected folder
  const [selectedFolder, setSelectedFolder] = useState();

  const handleSelectedFolder = (folder) => {
    if (!folder) return setSelectedFolder();
    if (selectedFolder?._id === folder._id) {
      if (folder.parent_folder) {
        handleLocation(folder.parent_folder);
        return setSelectedFolder(folder.parent_folder);
      }
      return setSelectedFolder(null);
    }
    setSelectedFolder(folder);
    handleLocation(folder);
  };

  // expand folder
  const [expandFolder, setExpandFolder] = useState();
  const handleExpand = (folder) => {
    if (!folder) {
      setExpandFolder();
      return handleSelectedFolder();
    }
    handleSelectedFolder(folder);
    setExpandFolder(folder);
  };

  // get folder list
  const [isLoading, setIsLoading] = useState(false);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const getFolders = async () => {
      try {
        setIsLoading(true);
        const res = expandFolder
          ? await getFolderDetail({ id: expandFolder._id })
          : await getFolderList({
              limit: 50,
              page: 1,
            });
        setFolders(res.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    getFolders();
  }, [expandFolder]);

  // breadcrumb
  const [location, setLocation] = useState([]);

  const handleLocation = (folder) => {
    if (!folder) return setLocation([]);
    const index = location.findIndex((item) => item._id === folder._id);
    if (index !== -1) return setLocation(location.slice(0, index + 1));
    if (!folder.parent_folder) return setLocation([folder]);
    if (
      location.find(
        (item) => item.parent_folder?._id === folder.parent_folder?._id,
      )
    ) {
      const filteredLocation = location.filter(
        (item) => item.parent_folder?._id !== folder.parent_folder?._id,
      );
      return setLocation([...filteredLocation, folder]);
    }

    setLocation([...location, folder]);
  };

  // move
  const moveMutation = data.type ? moveFile : moveFolder;
  const handleMove = useMutation({
    mutationFn: () =>
      moveMutation({
        data: { ...data, parent_folder: curentFolder },
        desData: selectedFolder ? selectedFolder : null,
      }),
    onSuccess: () => {
      handleClose();
      SuccessToast({ message: 'Folder has been moved successfully!' });
      if (data.type) {
        queryClient.invalidateQueries(['file']);
        queryClient.invalidateQueries(['files']);
      }
      queryClient.invalidateQueries([RQK_FOLDER]);
      queryClient.invalidateQueries([RQK_FOLDERS]);
    },
    onError: () =>
      ErrorToast({
        message: 'Oops! Something went wrong. Please try again later!',
      }),
  });

  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby='keep-mounted-modal-title'
      aria-describedby='keep-mounted-modal-description'
    >
      <Box className='bg-white shadow-md rounded-lg w-[40%] absolute top-[50%] left-[50%] translate-x-[-50%]  translate-y-[-50%] overflow-hidden'>
        <div className='px-8 py-4'>
          <div className='flex justify-between items-center'>
            <p className='text-xl text-gray-700 font-medium'>
              Move "{data.name}" To{' '}
              {selectedFolder ? `"${selectedFolder.name}"` : 'Root'}
            </p>

            <div onClick={handleClose} className='cursor-pointer'>
              <AiOutlineClose className='text-gray-700 text-lg' />
            </div>
          </div>
          <p className='mt-2 text-[0.8em] text-gray-500 font-medium'>
            <span className='cursor-pointer' onClick={() => handleExpand()}>
              Root
            </span>
            {location.length !== 0 &&
              location.map((item, index) => (
                <React.Fragment key={item._id}>
                  {' > '}
                  <span
                    className='cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExpand(item);
                    }}
                  >
                    {item.name}
                  </span>
                </React.Fragment>
              ))}
          </p>
        </div>

        <div className='px-8'>
          <div className='border rounded-md '>
            {isLoading ? (
              <Loading />
            ) : (
              folders
                ?.filter((folder) => folder._id !== data._id)
                .map((folder) => {
                  return (
                    <div
                      onClick={() => {
                        handleSelectedFolder(folder);
                      }}
                      className={`flex justify-between items-center py-3 px-4 border-b cursor-pointer ${
                        selectedFolder?._id === folder._id && 'bg-blue-800/10 '
                      } hover:bg-blue-800/10 duration-200`}
                    >
                      <p className='text-[0.9em] text-gray-700 font-medium'>
                        {folder.name}
                      </p>
                      <div
                        className='group/arrow relative p-2'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExpand(folder);
                        }}
                      >
                        <span className='bg-blue-400/20 rounded-full absolute top-0 left-0 h-full w-full scale-0 group-hover/arrow:scale-100 duration-200'></span>
                        <BiRightArrow className='text-gray-700 text-sm' />
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        <div className='flex justify-end items-center py-3 mt-6 px-8 bg-[#E5E9F2]'>
          <div
            onClick={handleClose}
            className='bg-white py-2 px-5 rounded-md text-gray-500 text-[0.9em] font-medium mr-4 shadow-sm cursor-pointer hover:text-white hover:bg-gray-600 duration-200'
          >
            Cancel
          </div>

          <div
            onClick={() => handleMove.mutate()}
            className='bg-blue-700/60 min-w-[80px] h-[37px] flex justify-center items-center py-2 px-5 rounded-md text-white text-[0.9em] font-medium cursor-pointer hover:bg-blue-700/80 duration-200'
          >
            {handleMove.isPending ? (
              <ImSpinner className='animate-spin' />
            ) : (
              'Move'
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
};
