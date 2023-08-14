import { Avatar, IconButton } from '@mui/material';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { ChatThreeDotsDropdown } from 'components/popups/ChatThreeDotsDropdown';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BiLeftArrowAlt } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { getMessages, sendMessage } from 'services/messageController';
import { FormattedDate } from 'utils/helpers/TypographyHelper';
import socket from 'utils/socket';
import ChatMessages from './ChatMessages';
import ChatMember from './ChatMember';
import ChatAddMember from './ChatAddMember';

const ChatContent = () => {
  const chat = useSelector((state) => state.chat);
  const user = useSelector((state) => state.user);

  const queryClient = useQueryClient();

  // ref
  const typingTimeoutRef = useRef(null);
  const bottomRef = useRef(null);
  const lastMessageRef = useRef(null);
  const chatContentRef = useRef(null);

  // Message input
  const [message, setMessage] = useState('');

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

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

  const sendMessageSocket = (message) => {
    socket.emit('send-message', message);
  };

  const stopTyping = () => {
    socket.emit('stop-typing', chat.id);
  };

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

  // get messages if last message
  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;

      if (lastMessageRef.current) lastMessageRef.current?.disconnect();
      lastMessageRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });

      if (node) lastMessageRef.current.observe(node);
    },
    [isLoading, hasNextPage, fetchNextPage, isFetching],
  );

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    if (messagesData.length > 20)
      if (chatContentRef.current) {
        chatContentRef.current.scrollTo(
          0,
          chatContentRef.current.offsetHeight + 100,
        );
        return;
      }
    bottomRef.current?.scrollIntoView();
  }, [messagesData, bottomRef]);

  // Send message
  const handleSendMessage = useMutation({
    mutationFn: () => {
      const newMessage = {
        receiver: chat?.members,
        roomId: chat?.id,
        content: message,
        sender: { _id: user.id },
      };

      sendMessageSocket(newMessage);

      stopTyping();

      setMessage('');

      const messageTmp = {
        sender: { _id: user.id },
        content: message,
        _id: Date.now(),
      };

      messagesData.push(messageTmp);

      bottomRef.current?.scrollIntoView();

      return sendMessage({ id: chat.id, content: message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chats']);
    },
  });

  // Connect to socket room and handle socket listeners
  useEffect(() => {
    if (socket) {
      socket.emit('join-room', chat.id);

      socket.on('receive-message', () => {
        queryClient.invalidateQueries(['messages']);
        queryClient.invalidateQueries(['chats']);
      });

      socket.on('typing', () => setIsTyping(true));
      socket.on('stop-typing', () => setIsTyping(false));
    }

    return () => {
      // Clean up the socket listener when the component unmounts
      socket.off('receive-message');
      socket.off('typing');
      socket.off('stop-typing');
    };
  }, [chat, queryClient]);

  // handle typing
  const handleTyping = useCallback(
    (e) => {
      setMessage(e.target.value);

      if (!typing) {
        setTyping(true);
        socket.emit('typing', chat.id);
      }

      const TYPING_TIMER_LENGTH = 3000;

      clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop-typing', chat.id);
        setTyping(false);
      }, TYPING_TIMER_LENGTH);
    },
    [chat.id, typing],
  );

  // render chat content
  const renderChatContent = useMemo(() => {
    switch (option) {
      case CHAT_CONTENT_OPTIONS.CHAT:
        return (
          <ChatMessages
            ref={chatContentRef}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            isTyping={isTyping}
            messagesData={messagesData}
            bottomRef={bottomRef}
            lastElementRef={lastElementRef}
            user={user}
            message={message}
            handleSendMessage={handleSendMessage}
            handleTyping={handleTyping}
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
    isTyping,
    messagesData,
    option,
    user,
    message,
    handleSendMessage,
    handleTyping,
    lastElementRef,
    CHAT_CONTENT_OPTIONS,
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
