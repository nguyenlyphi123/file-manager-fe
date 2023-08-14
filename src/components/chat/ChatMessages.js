import React from 'react';
import { Avatar, IconButton, Paper, Tooltip } from '@mui/material';
import { BiSend } from 'react-icons/bi';

import TypingLoading from 'components/TypingLoading';
import Loading from 'parts/Loading';

import { isLastMessage, isSameSender, isSender } from './helpers/chatHelpers';

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
  },
);

export default function ChatMessages({
  ref,
  isLoading,
  isFetchingNextPage,
  messagesData,
  isTyping,
  lastElementRef,
  bottomRef,
  user,
  message,
  handleTyping,
  handleSendMessage,
}) {
  return (
    <>
      <div ref={ref} className='relative h-full overflow-y-scroll py-3'>
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
                ref={index === 0 ? lastElementRef : null}
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
