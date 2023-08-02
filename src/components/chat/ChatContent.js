import { Avatar, IconButton, Paper, Tooltip } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import TypingLoading from 'components/TypingLoading';
import Loading from 'parts/Loading';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BiSend } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { getMessages, sendMessage } from 'services/messageController';
import socket from 'utils/socket';
import { isLastMessage, isSameSender, isSender } from './helpers/chatHelpers';
import { FormattedDate } from 'utils/helpers/TypographyHelper';

// Message Component for rendering individual messages
const Message = ({ message, isCurrentUser, isSameSender, isLastMessage }) => {
  const messageClass = isCurrentUser ? 'bg-[#5145E5]' : 'bg-[#949494]';

  return (
    <div
      className={`flex items-center ${
        isCurrentUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {isCurrentUser
        ? null
        : (isLastMessage || isSameSender) && (
            <Tooltip title={message?.sender?.name}>
              <Avatar sx={{ marginRight: '0.5rem', height: 30, width: 30 }} />
            </Tooltip>
          )}
      <div
        className={`${messageClass} items-center rounded-lg pt-[5px] pb-[7px] px-3 ${
          !isLastMessage && !isSameSender && 'ml-[2.4rem]'
        } mt-1 w-max max-w-[50%]`}
      >
        <p className='text-white text-sm m-0'>{message.content}</p>
      </div>
    </div>
  );
};

const ChatContent = () => {
  const chat = useSelector((state) => state.chat);
  const user = useSelector((state) => state.user);

  const queryClient = useQueryClient();

  const bottomRef = useRef(null);

  // Message input
  const [message, setMessage] = useState('');

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

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

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', { id: chat.id }],
    queryFn: () => getMessages({ id: chat.id }),
    retry: 3,
    retryDelay: 3000,
  });

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages]);

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
      return sendMessage({ id: chat.id, content: message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chats']);
      queryClient.invalidateQueries(['messages']);
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
  const typingTimeoutRef = useRef(null);

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
      </div>

      <div className='relative h-full overflow-y-scroll py-3'>
        {isLoading ? (
          <Loading />
        ) : (
          <div className='absolute bottom-0 left-0 w-full max-h-full'>
            {messages?.data?.map((msg, index) => (
              <Message
                key={index}
                message={msg}
                isCurrentUser={isSender(user.id, msg.sender?._id)}
                isLastMessage={isLastMessage(messages?.data, index, user.id)}
                isSameSender={isSameSender(messages?.data, msg, index, user.id)}
              />
            ))}
            {isTyping && <TypingLoading className={'ml-[2.3rem]'} />}
            <div ref={bottomRef}></div>
          </div>
        )}
      </div>

      <div className='flex items-center justify-between w-full mt-3'>
        <Paper
          sx={{
            paddingY: '8px',
            paddingX: '20px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '20px',
            boxShadow: 'none',
            bgcolor: '#F5F6FA',
            width: '100%',
          }}
        >
          <input
            type='text'
            placeholder='Write a message...'
            className='border-0 outline-none w-full bg-[#F5F6FA]'
            autoFocus
            value={message}
            onChange={handleTyping}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage.mutate();
              }
            }}
          />
        </Paper>

        <IconButton color='primary' sx={{ marginLeft: 1 }}>
          <BiSend />
        </IconButton>
      </div>
    </div>
  );
};

export default ChatContent;
