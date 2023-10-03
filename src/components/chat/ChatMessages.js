import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, IconButton, Paper, Tooltip } from '@mui/material';
import { BiSend } from 'react-icons/bi';

import TypingLoading from 'components/TypingLoading';
import Loading from 'parts/Loading';

import { isLastMessage, isSameSender, isSender } from './helpers/chatHelpers';
import socket from 'utils/socket';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendMessage } from 'services/messageController';

// Message Component for rendering individual messages
const Message = React.forwardRef(
  ({ message, isCurrentUser, isSameSender, isLastMessage }, ref) => {
    const messageClass = isCurrentUser ? 'bg-[#5145E5]' : 'bg-[#949494]';

    return (
      <div
        ref={ref}
        className={`flex items-center ${
          isCurrentUser ? 'justify-end' : 'justify-start'
        }`}
      >
        {isCurrentUser
          ? null
          : (isLastMessage || isSameSender) && (
              <Tooltip title={message?.sender?.info?.name}>
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
  },
);

export default function ChatMessages({
  isLoading,
  isFetchingNextPage,
  messagesData,
  bottomRef,
  hasNextPage,
  isFetching,
  fetchNextPage,
}) {
  const chat = useSelector((state) => state.chat);
  const user = useSelector((state) => state.user);

  const queryClient = useQueryClient();

  // ref
  const lastMessageRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const chatContentRef = useRef(null);

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
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData, bottomRef]);

  // Message input
  const [message, setMessage] = useState('');

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

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

  // Connect to socket room and handle socket listeners
  const sendMessageSocket = (message) => {
    socket.emit('send-message', message);
  };

  const stopTyping = () => {
    socket.emit('stop-typing', chat.id);
  };

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

  return (
    <>
      <div
        ref={chatContentRef}
        className='relative h-full overflow-y-scroll py-3'
      >
        {isLoading ? (
          <Loading />
        ) : (
          <div className='absolute bottom-0 left-0 w-full max-h-full'>
            {isFetchingNextPage && (
              <div className='w-full flex justify-center'>
                <TypingLoading className={'ml-[2.3rem]'} />
              </div>
            )}
            {messagesData?.map((msg, index) => (
              <Message
                ref={
                  index === 0 && messagesData.length >= 20
                    ? lastElementRef
                    : null
                }
                key={index}
                message={msg}
                isCurrentUser={isSender(user.id, msg.sender?._id)}
                isLastMessage={isLastMessage(messagesData, index, user.id)}
                isSameSender={isSameSender(messagesData, msg, index, user.id)}
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

        <IconButton
          onClick={() => handleSendMessage.mutate()}
          color='primary'
          sx={{ marginLeft: 1 }}
        >
          <BiSend />
        </IconButton>
      </div>
    </>
  );
}
