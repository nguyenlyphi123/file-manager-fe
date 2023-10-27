import { useState } from 'react';
import {
  AiFillMessage,
  AiOutlineCloudUpload,
  AiOutlinePlus,
} from 'react-icons/ai';
import { FiSearch } from 'react-icons/fi';
import { Outlet } from 'react-router-dom';

import socket from 'utils/socket';

import { NewFolder, UploadFile } from 'components/popups/ModelPopups';

import { Badge, Fab } from '@mui/material';
import ChatContainer from 'components/chat/ChatContainer';
import useNavigateParams from 'hooks/useNavigateParams';
import Header from 'parts/Header';
import SideMenu from 'parts/SideMenu';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeChat } from 'redux/slices/chat';
import { getUnseenMessages } from 'redux/slices/chatNotification';
import { getNewRequire } from 'redux/slices/notification';

export default function Home() {
  const user = useSelector((state) => state.user);
  const curentFolder = useSelector((state) => state.curentFolder);

  const navigate = useNavigateParams();

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
  const dispatch = useDispatch();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggeleChat = () => {
    setIsChatOpen(!isChatOpen);

    if (isChatOpen) {
      dispatch(removeChat());
      dispatch(getUnseenMessages());
    }
  };

  // search
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    if (e.keyCode === 'enter' || e.keyCode === 13) {
      navigate('/search', { name: search });
      setSearch('');
      return;
    }
    setSearch(e.target.value);
  };

  // get unseen messages
  const chatNotification = useSelector((state) => state.chatNotification);

  useEffect(() => {
    dispatch(getUnseenMessages());
    dispatch(getNewRequire());
  }, [dispatch]);

  // connect to socket
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket Connected With ID: ', socket.id);
    });

    socket.emit('setup', user);

    socket.on('receive-message', () => {
      dispatch(getUnseenMessages());
    });

    socket.on('receive-require', (data) => {
      console.log(data);
      dispatch(getNewRequire());
    });

    return () => {
      socket.off('connect');
      socket.off('receive-message');
      socket.off('receive-require');
    };
  }, [dispatch, user]);

  return (
    <>
      <Header />
      <div className='flex h-[calc(100vh-80px)]'>
        <SideMenu />
        <div className='sm:w-[100%] lg:w-10/12 relative'>
          <NewFolder
            open={isNewFolderOpen}
            handleClose={handleCloseNewFolder}
          />
          <UploadFile
            handleClose={handleCloseUploadFile}
            open={isUploadFileOpen}
          />
          <div className='bg-white flex justify-between items-center h-[62px] py-3 px-4 border'>
            <div className='flex items-center w-[50%]'>
              <FiSearch className='text-gray-600 cursor-pointer' />
              <input
                className='outline-none ml-3 text-[0.85em] h-7 w-[100%]'
                type='text'
                placeholder='Enter file or folder'
                value={search}
                onChange={handleSearch}
                onKeyDown={handleSearch}
              />
            </div>

            <div className='flex'>
              <button
                className='bg-[#d3d9e7] py-2 px-3 rounded-sm mx-2 flex items-center hover:bg-[#C3C6CE] hover:text-white hover:scale-105 duration-100'
                type='button'
                onClick={handleOpenNewFolder}
                disabled={curentFolder.isRequireFolder}
              >
                <AiOutlinePlus className='mr-3 font-bold' />
                <p className='text-xs font-semibold '>New Folder</p>
              </button>
              <button
                className='bg-[#5664D9] py-2 px-3 rounded-sm mx-2 text-white flex items-center hover:bg-[#2f40dd] hover:scale-105 duration-100'
                type='button'
                onClick={handleOpenUploadFile}
              >
                <AiOutlineCloudUpload className='mr-3 text-lg' />
                <p className='text-xs font-medium'>Upload File</p>
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
          <Badge
            badgeContent={
              chatNotification?.quantity ? chatNotification?.quantity : 0
            }
            color='error'
          >
            <AiFillMessage className='text-2xl' />
          </Badge>
        </Fab>
        <ChatContainer open={isChatOpen} handleToggleChat={handleToggeleChat} />
      </div>
    </>
  );
}
