import { Avatar, IconButton, Paper } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Loading from 'parts/Loading';
import { useEffect, useRef, useState } from 'react';
import { BiSend } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { getMessages, sendMessage } from 'services/messageController';
import { isSender } from './helpers/chatHelpers';

// Message Component for rendering individual messages
const Message = ({ message, isCurrentUser }) => {
  const messageClass = isCurrentUser ? 'bg-[#5145E5]' : 'bg-[#949494]';

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`${messageClass} rounded-3xl py-2 px-3 mt-1 w-max max-w-[50%]`}
      >
        <p className='text-white text-sm m-0'>{message.content}</p>
      </div>
    </div>
  );
};

const ChatContent = ({ socket }) => {
  const chat = useSelector((state) => state.chat);
  const user = useSelector((state) => state.user);

  const bottomRef = useRef(null);
  const queryClient = useQueryClient();

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Connect to socket room
  useEffect(() => {
    if (socket) {
      socket.emit('join-room', chat.id);
    }
  }, [socket, chat]);

  const sendMessageSocket = (message) => {
    socket.emit('send-message', message);
  };

  // Get messages from the server
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      if (chat.id) {
        try {
          const response = await getMessages({ id: chat.id });
          setMessages(response.data);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching messages:', error);
          setIsLoading(false);
        }
      }
    };

    fetchMessages();
  }, [chat.id]);

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

      setMessages((prev) => [...prev, newMessage]);

      setMessage('');
      return sendMessage({ id: chat.id, content: message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('messages');
    },
  });

  // Receive message
  useEffect(() => {
    if (socket) {
      const receiveMessage = (message) => {
        setMessages((prev) => [...prev, message]);
      };

      socket.on('receive-message', receiveMessage);

      // Return a cleanup function to unsubscribe from the event when the component unmounts
      return () => {
        socket.off('receive-message', receiveMessage);
      };
    }
  }, [socket]);

  return (
    <div className='py-5 px-3 h-full flex flex-col justify-between bg-white relative'>
      <div className='pb-4 mb-1 flex items-center border-b'>
        <Avatar />
        <p className='text-md text-gray-500 font-semibold ml-3'>{chat?.name}</p>
      </div>

      <div className='relative h-full overflow-y-scroll py-3'>
        {isLoading ? (
          <Loading />
        ) : (
          <div className='absolute bottom-0 left-0 w-full max-h-full'>
            {messages?.map((msg, index) => (
              <Message
                key={index}
                message={msg}
                isCurrentUser={isSender(user.id, msg.sender?._id)}
              />
            ))}
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
            onChange={(e) => setMessage(e.target.value)}
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
