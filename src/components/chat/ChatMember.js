import { Avatar, Grid, IconButton } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import SuccessToast from 'components/toasts/SuccessToast';
import { LECTURERS, MANAGER, PUPIL } from 'constants/constants';
import React, { useMemo } from 'react';
import { BiExit } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { removeChatMember } from 'redux/slices/chat';
import { removeMember } from 'services/chatController';
import { Truncate } from 'utils/helpers/TypographyHelper';

const PermissionGroup = ({
  title,
  members,
  handleRemoveMember,
  chat,
  user,
}) => {
  return (
    <>
      <p className='text-sm text-gray-600 font-semibold mb-0 mt-5'>{title}</p>
      <Grid container spacing={1}>
        {members.map((member) => (
          <Grid item xs={12} md={4} key={member._id}>
            <div className='flex items-center justify-between border rounded-md mt-3 p-2 group min-h-[47px]'>
              <div className='flex items-center'>
                <Avatar sx={{ width: 25, height: 25 }} />
                <p className='text-sm ml-3'>{Truncate(member.name, 20)}</p>
              </div>
              {chat?.isGroupChat && chat?.author?._id === user.id && (
                <IconButton
                  onClick={() => handleRemoveMember.mutate(member)}
                  size='small'
                  sx={{ display: 'none' }}
                  className='group-hover:block'
                >
                  <BiExit className='hover:text-red-700' />
                </IconButton>
              )}
            </div>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default function ChatMember() {
  const chat = useSelector((state) => state.chat);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // handle remove member
  const handleRemoveMember = useMutation({
    mutationFn: (member) => {
      dispatch(removeChatMember(member._id));

      return removeMember({ id: chat.id, member: member._id });
    },
    onSuccess: () => {
      SuccessToast({ message: 'Member has been remove successfully' });
      queryClient.invalidateQueries(['chats']);
    },
  });

  const memberGroups = useMemo(() => {
    return {
      [MANAGER]: chat?.members?.filter(
        (member) => member.permission === MANAGER && member._id !== user.id,
      ),
      [LECTURERS]: chat?.members?.filter(
        (member) => member.permission === LECTURERS && member._id !== user.id,
      ),
      [PUPIL]: chat?.members?.filter(
        (member) => member.permission === PUPIL && member._id !== user.id,
      ),
    };
  }, [chat, user]);

  return (
    <div className='h-full px-5'>
      {Object.entries(memberGroups).map(([permission, members]) =>
        members.length > 0 ? (
          <PermissionGroup
            key={permission}
            title={
              permission === MANAGER
                ? 'Manager'
                : permission === LECTURERS
                ? 'Lecturers'
                : 'Pupil'
            }
            members={members}
            handleRemoveMember={handleRemoveMember}
            chat={chat}
            user={user}
          />
        ) : null,
      )}
    </div>
  );
}
