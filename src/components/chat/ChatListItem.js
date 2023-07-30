import { Avatar, Paper } from '@mui/material';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FormattedChatDate, Truncate } from 'utils/helpers/TypographyHelper';

function ChatListItem({ data, handleSelectChat }) {
  const user = useSelector((state) => state.user);

  const chatTitle = useMemo(() => {
    const memberInfo = data?.member?.filter(
      (member) => member._id !== user.id,
    )[0];

    return memberInfo.name;
  }, [data.member, user.id]);

  return (
    <div
      onClick={() => handleSelectChat({ ...data, name: chatTitle })}
      className='flex items-center cursor-pointer py-3 px-5 hover:bg-white duration-200'
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
          <Paper
            sx={{
              height: '10px',
              width: '10px',
              borderRadius: '50%',
              boxShadow: 'none',
              bgcolor: '#5145E5',
            }}
          ></Paper>
        </div>
      </div>
    </div>
  );
}

export default ChatListItem;
