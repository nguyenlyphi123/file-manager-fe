import { Box, Divider, IconButton, Menu, MenuItem, Modal } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';
import { useState } from 'react';
import { AiOutlineClose, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { BiExit } from 'react-icons/bi';
import { BsThreeDots, BsTrash } from 'react-icons/bs';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { ImSpinner } from 'react-icons/im';
import { useDispatch, useSelector } from 'react-redux';
import { removeChat, selectChat } from 'redux/slices/chat';
import { deleteGroupChat, leaveGroupChat } from 'services/chatController';

const CHAT_CONTENT_OPTIONS = {
  CHAT: 'chat',
  MEMBER: 'member',
  NEW_MEMBER: 'new-member',
};

export const ChatThreeDotsDropdown = ({ className, data, onSelect }) => {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  // dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // handle leave group chat
  const handleLeaveGroupChat = useMutation({
    mutationFn: () => leaveGroupChat({ id: data.id }),
    onSuccess: () => {
      dispatch(selectChat(data));
      handleClose();
      queryClient.invalidateQueries(['chats']);
    },
  });

  // confirm delete chat
  const [isChatDeleteOpen, setIsChatDeleteOpen] = useState(false);

  const handleOpenChatDelete = () => {
    setIsChatDeleteOpen(true);
  };

  const handleCloseChatDelete = () => {
    setIsChatDeleteOpen(false);
  };

  // handle leave chat
  const handleLeaveChat = useMutation({
    mutationFn: () => deleteGroupChat({ id: data.id }),
    onSuccess: () => {
      SuccessToast({ message: 'Chat has been delete successfully' });
      handleCloseChatDelete();
      dispatch(removeChat());
      queryClient.invalidateQueries(['chats']);
    },
    onError: (error) => {
      ErrorToast({ message: error.message });
    },
  });

  return (
    <>
      <Modal
        keepMounted
        open={isChatDeleteOpen}
        onClose={handleCloseChatDelete}
      >
        <Box className='bg-white shadow-md rounded-lg w-[30%] absolute top-[50%] left-[50%] translate-x-[-50%]  translate-y-[-50%] overflow-hidden'>
          <div className='border-b'>
            <div className='flex justify-between items-center py-4 px-8'>
              <p className='text-[0.9em] text-gray-700 font-medium'>
                Confirm Delete Group
              </p>

              <IconButton onClick={handleCloseChatDelete} size='small'>
                <AiOutlineClose />
              </IconButton>
            </div>
          </div>

          <div className='min-h-[200px] px-8 py-4'>
            <p className='text-[0.9em] text-gray-700 font-medium'>
              Are you sure you want to delete this group chat? If you delete,
              you will not be able to see the chat history.
            </p>
          </div>

          <div className='flex justify-end items-center py-3 px-8 bg-[#E5E9F2]'>
            <div
              onClick={handleCloseChatDelete}
              className='bg-white py-2 px-5 rounded-md text-gray-500 text-[0.9em] font-medium mr-4 shadow-sm cursor-pointer hover:text-white hover:bg-gray-600 duration-200'
            >
              Cancel
            </div>

            <div
              onClick={() => handleLeaveChat.mutate()}
              className='bg-blue-700/60 flex justify-center items-center py-2 px-5 min-w-[80px] h-[37px] rounded-md text-white text-[0.9em] font-medium cursor-pointer hover:bg-blue-700/80 duration-200'
            >
              {handleLeaveChat.isLoading ? (
                <ImSpinner className='animate-spin' />
              ) : (
                'Delete'
              )}
            </div>
          </div>
        </Box>
      </Modal>
      <div className={className}>
        <IconButton
          id='threedots-btn'
          aria-haspopup='true'
          aria-controls={open ? 'threedots-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <BsThreeDots className='text-lg' />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id='threedots-menu'
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem
            onClick={() => onSelect(CHAT_CONTENT_OPTIONS.NEW_MEMBER)}
            className='group/drop-items flex items-center px-4 py-3 hover:bg-blue-100/30 '
          >
            <AiOutlineUsergroupAdd className='mr-4 text-lg text-blue-300 group-hover/drop-items:text-blue-400' />
            <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
              Add Member
            </p>
          </MenuItem>
          <MenuItem
            onClick={() => onSelect(CHAT_CONTENT_OPTIONS.MEMBER)}
            className='group/drop-items flex items-center px-4 py-3 hover:bg-blue-100/30'
          >
            <HiOutlineUserGroup className='mr-4 text-lg text-blue-300 group-hover/drop-items:text-blue-400' />
            <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
              Member
            </p>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => handleLeaveGroupChat.mutate()}
            className='group/drop-items flex items-center px-4 py-3 hover:bg-blue-100/30'
          >
            <BiExit className='mr-4 text-lg text-blue-300 group-hover/drop-items:text-blue-400' />
            <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
              Leave Group
            </p>
          </MenuItem>
          {data?.isGroupChat && data?.author?._id === user.id && (
            <MenuItem
              onClick={handleOpenChatDelete}
              className='group/drop-items flex items-center px-4 py-3 hover:bg-blue-100/30'
            >
              <BsTrash className='mr-4 text-lg text-blue-300 group-hover/drop-items:text-blue-400' />
              <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
                Delete Group
              </p>
            </MenuItem>
          )}
        </Menu>
      </div>
    </>
  );
};
