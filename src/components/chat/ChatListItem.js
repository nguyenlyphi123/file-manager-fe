import { Avatar, Paper } from '@mui/material';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FormattedChatDate, Truncate } from 'utils/helpers/TypographyHelper';
import { isSameChatRoom, isSender } from './helpers/chatHelpers';

function ChatListItem({ data, handleSelectChat }) {
  const user = useSelector((state) => state.user);
  const chat = useSelector((state) => state.chat);

  const chatTitle = useMemo(() => {
    if (data?.name) return data.name;

    const memberInfo = data?.member?.filter(
      (member) => member._id !== user.id,
    )[0];

    return memberInfo?.name;
  }, [data.member, data.name, user.id]);

  return (
    <div
      onClick={() => handleSelectChat({ ...data, name: chatTitle })}
      className={`flex items-center cursor-pointer py-3 px-5 ${
        data._id === chat.id && 'bg-white shadow-sm'
      } hover:bg-white duration-200`}
    >
      <Avatar />
      <div className='ml-2 w-full'>
        <div className='flex items-center justify-between'>
          <p className='font-semibold text-[#5145E5] text-[0.9em]'>
            {chatTitle}
          </p>
          <p className='text-[0.8em] text-gray-500'>
            {FormattedChatDate(data?.lastMessage?.createAt)}
          </p>
        </div>

        <div className='flex items-center justify-between'>
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
                }}
              ></Paper>
            )}
        </div>
      </div>
    </div>
  );
}

export default ChatListItem;
