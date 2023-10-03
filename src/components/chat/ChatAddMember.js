import { MenuItem, MenuList, Paper } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';
import useDebounce from 'hooks/useDebounce';
import React, { useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { addMember } from 'services/chatController';
import { searchUser } from 'services/userController';

export default function ChatAddMember() {
  const chat = useSelector((state) => state.chat);

  const queryClient = useQueryClient();
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

  // handle add member
  const handleAdd = useMutation({
    mutationFn: (member) =>
      addMember({ id: chat.id, member: member.account_id }),
    onSuccess: () => {
      setSearch('');
      setSearchInput('');
      SuccessToast({ message: 'New member has been added successfully' });
      queryClient.invalidateQueries(['chats']);
    },
    onError: (error) => {
      ErrorToast({ message: error?.response?.data?.message });
    },
  });

  return (
    <div className='h-full w-full'>
      <Paper
        sx={{
          marginTop: '1.5rem',
          paddingY: '7px',
          paddingX: '15px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '5px',
          boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
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
                <MenuItem key={user._id} onClick={() => handleAdd.mutate(user)}>
                  {user.email}
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        )}
      </Paper>
    </div>
  );
}
