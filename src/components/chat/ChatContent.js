import { Avatar, IconButton } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ChatThreeDotsDropdown } from 'components/popups/ChatThreeDotsDropdown';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BiLeftArrowAlt } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import ChatAddMember from './ChatAddMember';
import ChatMember from './ChatMember';
import ChatMessages from './ChatMessages';

import { getMessages } from 'services/messageController';

import { FormattedDate } from 'utils/helpers/TypographyHelper';
import socket from 'utils/socket';

const ChatContent = () => {
  const chat = useSelector((state) => state.chat);
  const user = useSelector((state) => state.user);

  // ref
  const bottomRef = useRef(null);

  // Chat content options
  const CHAT_CONTENT_OPTIONS = useMemo(
    () => ({
      CHAT: 'chat',
      MEMBER: 'member',
      NEW_MEMBER: 'new-member',
    }),
    [],
  );

  const [option, setOption] = useState(CHAT_CONTENT_OPTIONS.CHAT);

  const handleSelectChatOption = (option) => {
    setOption(option);
  };

  useEffect(() => {
    setOption(CHAT_CONTENT_OPTIONS.CHAT);
  }, [chat, CHAT_CONTENT_OPTIONS]);

  // last sign in
  const lastSignIn = useMemo(() => {
    if (chat?.members.length > 2) return null;
    if (chat?.members) {
      const member = chat.members.filter((member) => member._id !== user.id)[0];
      return member?.lastSigned;
    }
  }, [user.id, chat?.members]);

  // Connect to socket room
  useEffect(() => {
    if (socket) {
      socket.emit('join-room', chat.id);
    }
  }, [chat]);

  // get messages
  const {
    data: messages,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['messages', { id: chat.id }],
    queryFn: ({ pageParam = 1 }) =>
      getMessages({ id: chat.id, page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages?.length + 1;
      return lastPage.data?.length !== 0 ? nextPage : undefined;
    },
    retry: 3,
    retryDelay: 3000,
  });

  const messagesData = useMemo(() => {
    if (messages?.pages) {
      return messages.pages
        .map((page) => page.data)
        .flat()
        .reverse();
    }
    return [];
  }, [messages]);

  // render chat content
  const renderChatContent = useMemo(() => {
    switch (option) {
      case CHAT_CONTENT_OPTIONS.CHAT:
        return (
          <ChatMessages
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            messagesData={messagesData}
            bottomRef={bottomRef}
            user={user}
            hasNextPage={hasNextPage}
            isFetching={isFetching}
            fetchNextPage={fetchNextPage}
          />
        );

      case CHAT_CONTENT_OPTIONS.MEMBER:
        return <ChatMember />;

      case CHAT_CONTENT_OPTIONS.NEW_MEMBER:
        return <ChatAddMember />;

      default:
        break;
    }
  }, [
    isLoading,
    isFetchingNextPage,
    messagesData,
    option,
    user,
    CHAT_CONTENT_OPTIONS,
    fetchNextPage,
    hasNextPage,
    isFetching,
  ]);

  return (
    <div className='py-5 px-3 h-full flex flex-col justify-between bg-white relative'>
      <div className='pb-4 mb-1 flex justify-between items-center border-b'>
        <div className='flex items-center'>
          <Avatar />
          <div className='flex flex-col'>
            <p className='text-md text-gray-500 font-semibold ml-3'>
              {chat?.name}
            </p>
            <p className='text-[13px] text-gray-500 ml-3'>
              Last active:{' '}
              {FormattedDate(chat?.isGroupChat ? chat?.lastActive : lastSignIn)}
            </p>
          </div>
        </div>
        {chat?.isGroupChat &&
          (option === CHAT_CONTENT_OPTIONS.CHAT ? (
            <ChatThreeDotsDropdown
              data={chat}
              onSelect={handleSelectChatOption}
            />
          ) : (
            <IconButton
              onClick={() => handleSelectChatOption(CHAT_CONTENT_OPTIONS.CHAT)}
            >
              <BiLeftArrowAlt />
            </IconButton>
          ))}
      </div>

      {renderChatContent}
    </div>
  );
};

export default ChatContent;
