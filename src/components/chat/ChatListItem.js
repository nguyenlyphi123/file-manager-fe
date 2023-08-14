import { Avatar, Box, IconButton, Modal, Paper } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';
import { useMemo, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { ImSpinner } from 'react-icons/im';
import { useDispatch, useSelector } from 'react-redux';
import { removeChat } from 'redux/slices/chat';
import { leaveChat } from 'services/chatController';
import { FormattedChatDate, Truncate } from 'utils/helpers/TypographyHelper';
import { isSameChatRoom, isSender } from './helpers/chatHelpers';

function ChatListItem({ data, handleSelectChat }) {
  const user = useSelector((state) => state.user);
  const chat = useSelector((state) => state.chat);

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const chatTitle = useMemo(() => {
    if (data?.name) return data.name;

    const memberInfo = data?.member?.filter(
      (member) => member._id !== user.id,
    )[0];

    return memberInfo?.name;
  }, [data.member, data.name, user.id]);

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
    mutationFn: () => leaveChat({ id: data._id }),
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
                Confirm Leave Chat
              </p>

              <IconButton onClick={handleCloseChatDelete} size='small'>
                <AiOutlineClose />
              </IconButton>
            </div>
          </div>

          <div className='min-h-[200px] px-8 py-4'>
            <p className='text-[0.9em] text-gray-700 font-medium'>
              Are you sure you want to leave this chat? If you leave, you will
              not be able to see the chat history.
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
                'Leave'
              )}
            </div>
          </div>
        </Box>
      </Modal>
      <div
        onClick={() => handleSelectChat({ ...data, name: chatTitle })}
        className={`flex items-center cursor-pointer py-3 px-5 group/chat-item ${
          data._id === chat.id && 'bg-white shadow-sm'
        } hover:bg-white duration-200`}
      >
        <Avatar />
        <div className='ml-2 w-full'>
          <div className='flex items-center justify-between translate-y-1'>
            <p className='font-semibold text-[#5145E5] text-[0.9em]'>
              {chatTitle}
            </p>
            <p className='text-[0.8em] text-gray-500'>
              {FormattedChatDate(data?.lastMessage?.createAt)}
            </p>
          </div>

          <div className='flex items-center justify-between min-h-[30px]'>
            <div className='flex items-center'>
              <p className='text-gray-600 text-[0.8em]'>
                {Truncate(data?.lastMessage?.content, 25)}
              </p>
              {!isSender(user.id, data?.lastMessage?.sender) &&
                !isSameChatRoom(chat.id, data._id) &&
                data?.lastMessage &&
                !data?.lastMessage?.seen && (
                  <Paper
                    sx={{
                      height: '10px',
                      width: '10px',
                      borderRadius: '50%',
                      boxShadow: 'none',
                      bgcolor: '#D32F2F',
                      marginLeft: '10px',
                    }}
                  ></Paper>
                )}
            </div>
            {!data?.isGroupChat && (
              <IconButton
                sx={{ display: 'none' }}
                className='group-hover/chat-item:block'
                size='small'
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenChatDelete();
                }}
              >
                <BsTrash color='#D10000' />
              </IconButton>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatListItem;
