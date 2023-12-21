import { Fab, IconButton, MenuItem, MenuList, Paper } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CustomAvatar from 'components/CustomAvatar';
import ErrorToast from 'components/toasts/ErrorToast';
import useDebounce from 'hooks/useDebounce';
import { memo, useCallback, useState } from 'react';
import { BsPencil, BsPlus, BsSearch } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { selectChat } from 'redux/slices/chat';
import { createSingleChat, getChatList } from 'services/chatController';
import { searchUser } from 'services/userController';
import ChatListItem from './ChatListItem';
import ChatListLoading from './ChatListLoading';

const ChatList = memo(({ handleOpenNewGroupChat }) => {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  // get chat list
  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: () => getChatList(),
    retry: 3,
    refetchOnWindowFocus: false,
  });

  // search user
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const searchDebounce = useDebounce(search, 500);

  const { data: searchResult } = useQuery({
    queryKey: ['user-search', searchDebounce],
    queryFn: () => searchUser(searchDebounce),
    enabled: Boolean(searchDebounce),
    retry: 3,
    retryDelay: 2000,
  });

  // select chat
  const handleSelectChat = (chat) => {
    dispatch(selectChat(chat));
  };

  // create chat
  const handleCreateChat = useMutation({
    mutationFn: (receiver) => {
      const data = [user.id, receiver.account_id];
      return createSingleChat({ member: data });
    },
    onSuccess: (res) => {
      console.log(res);
      queryClient.invalidateQueries(['chats']);
      setSearch('');
      setSearchInput('');
      dispatch(selectChat(res.data));
    },
    onError: (error) => {
      ErrorToast({ message: error.message });
    },
  });

  // handle select search user
  const handleSelectSearchUser = (user) => {
    const chatExist = chats?.data?.find((chat) =>
      chat?.member?.find((member) => member._id === user.account_id),
    );

    if (chatExist && !chatExist?.isGroupChat) {
      setSearch('');
      setSearchInput('');
      return handleSelectChat({ ...chatExist, name: chatTitle(chatExist) });
    }

    return handleCreateChat.mutate(user);
  };

  const chatTitle = useCallback(
    (data) => {
      if (data?.name) return data.name;

      const memberInfo = data?.member?.filter(
        (member) => member._id !== user.id,
      )[0];

      return memberInfo?.info?.name;
    },
    [user.id],
  );

  return (
    <div className='py-5 h-full bg-[#323439] relative'>
      <div className='px-5 flex items-center justify-between w-full'>
        <div className='flex items-center'>
          <CustomAvatar
            width={50}
            height={50}
            text={user.name}
            fontSize={20}
            image={user.image}
          />
          <p className='ml-3 font-semibold text-[#ffffff] text-lg'>
            {user.name}
          </p>
        </div>

        <IconButton size='small'>
          <BsPencil className='text-sm text-[#fff]' />
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
            position: 'relative',
          }}
        >
          <BsSearch className='text-sm text-gray-500 mr-2' />
          <input
            type='text'
            placeholder='Enter email'
            className='border-0 outline-none w-full'
            value={searchInput}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchInput(e.target.value);
            }}
          />
          {searchResult?.data?.length > 0 && (
            <Paper
              sx={{
                position: 'absolute',
                top: 40,
                left: 0,
                width: '100%',
                zIndex: 10,
              }}
            >
              <MenuList>
                {searchResult?.data?.map((user) => (
                  <MenuItem
                    key={user._id}
                    onClick={() => handleSelectSearchUser(user)}
                  >
                    {user.email}
                  </MenuItem>
                ))}
              </MenuList>
            </Paper>
          )}
        </Paper>
      </div>
      {isLoading ? (
        <ChatListLoading repeat={5} />
      ) : (
        <div className='mt-[1rem]'>
          {chats?.data
            ?.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt))
            .map((chat) => (
              <ChatListItem key={chat._id} data={chat} />
            ))}
        </div>
      )}

      <Fab
        size='small'
        color='error'
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
        }}
        back
        onClick={handleOpenNewGroupChat}
      >
        <BsPlus className='text-3xl' />
      </Fab>
    </div>
  );
});

export default ChatList;
