import React, { useState } from 'react';
import {
  AiFillMessage,
  AiOutlineCloudUpload,
  AiOutlinePlus,
} from 'react-icons/ai';
import { FiSearch } from 'react-icons/fi';
import { Outlet } from 'react-router-dom';
import io from 'socket.io-client';

import { NewFolder, UploadFile } from 'components/popups/ModelPopups';

import Header from 'parts/Header';
import SideMenu from 'parts/SideMenu';
import { Fab } from '@mui/material';
import ChatContainer from 'components/chat/ChatContainer';
import { useEffect } from 'react';
import { host } from 'constants/constants';
import { useSelector } from 'react-redux';

export default function Home() {
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

  // open/close chat
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggeleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // connect to socket
  const user = useSelector((state) => state.user);
  const socket = io(host, { withCredentials: true });

  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.id);
    });

    socket.emit('setup', user);

    return () => {
      socket.disconnect();
    };
  }, [user, socket]);

  return (
    <>
      <Header />
      <div className='flex h-[calc(100vh-80px)]'>
        <SideMenu />
        <div className='w-10/12 relative'>
          <NewFolder
            open={isNewFolderOpen}
            handleClose={handleCloseNewFolder}
          />

          <UploadFile
            handleClose={handleCloseUploadFile}
            open={isUploadFileOpen}
          />
          <div className='bg-white flex justify-between items-center h-[62px] py-3 px-4 border'>
            <div className='flex items-center w-fit'>
              <FiSearch className='text-gray-600 cursor-pointer' />
              <input
                className='outline-none ml-3 text-[0.85em] h-7 w-[300px]'
                type=''
                name=''
                value=''
                placeholder='Search files, folders'
              />
            </div>

            <div className='flex'>
              <button
                className='bg-[#d3d9e7] py-2 px-5 rounded-sm mx-2 flex items-center hover:bg-[#C3C6CE] hover:text-white hover:scale-105 duration-100'
                type='button'
                onClick={handleOpenNewFolder}
              >
                <AiOutlinePlus className='mr-3 font-bold' />
                <p className='text-sm font-semibold '>Create</p>
              </button>
              <button
                className='bg-[#5664D9] py-2 px-5 rounded-sm mx-2 text-white flex items-center hover:bg-[#2f40dd] hover:scale-105 duration-100'
                type='button'
                onClick={handleOpenUploadFile}
              >
                <AiOutlineCloudUpload className='mr-3 text-lg' />
                <p className='text-sm font-medium'>Upload</p>
              </button>
            </div>
          </div>

          <div className='h-[calc(100vh-142px)] overflow-y-scroll'>
            <Outlet />
          </div>
        </div>
        <Fab
          color='primary'
          aria-label='message'
          size='medium'
          sx={{ position: 'absolute', bottom: 20, right: 20 }}
          onClick={() => {
            setIsChatOpen(true);
          }}
        >
          <AiFillMessage className='text-2xl' />
        </Fab>
        <ChatContainer
          socket={socket}
          open={isChatOpen}
          handleToggleChat={handleToggeleChat}
        />
      </div>
    </>
  );
}
