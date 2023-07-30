import { Avatar, Fab, IconButton, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Loading from 'parts/Loading';
import { BsPencil, BsPlus, BsSearch } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { getChatList } from 'services/chatController';
import ChatListItem from './ChatListItem';

export default function ChatList({ handleSelectChat }) {
  const user = useSelector((state) => state.user);

  // get chat list
  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: () => getChatList(),
    retry: 3,
  });

  return (
    <div className='py-5 h-full bg-[#F5F6FA] relative'>
      <div className='px-5 flex items-center justify-between w-full'>
        <div className='flex items-center'>
          <Avatar sx={{ height: 50, width: 50 }} />
          <p className='ml-3 font-semibold text-[#5145E5] text-lg'>
            {user.name}
          </p>
        </div>

        <IconButton size='small'>
          <BsPencil className='text-sm' />
        </IconButton>
      </div>

      <div className='px-5'>
        <Paper
          sx={{
            marginTop: '1.5rem',
            paddingY: '5px',
            paddingX: '15px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '20px',
            boxShadow: 'none',
          }}
        >
          <BsSearch className='text-sm text-gray-500 mr-2' />
          <input
            type='text'
            placeholder='Search'
            className='border-0 outline-none w-full'
          />
        </Paper>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className='mt-[1rem]'>
          {chats?.data?.map((chat) => (
            <ChatListItem
              key={chat._id}
              data={chat}
              handleSelectChat={handleSelectChat}
            />
          ))}
        </div>
      )}

      <Fab
        size='small'
        color='info'
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
      >
        <BsPlus className='text-3xl' />
      </Fab>
    </div>
  );
}
