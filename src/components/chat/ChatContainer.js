import { Grid } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import React, { useState } from 'react';

import ChatContent from './ChatContent';
import ChatList from './ChatList';
import { useDispatch, useSelector } from 'react-redux';
import { selectChat } from 'redux/slices/chat';
import NewGroupChat from 'components/popups/NewGroupChat';

export default function ChatContainer({ socket, open, handleToggleChat }) {
  const chat = useSelector((state) => state.chat);

  const dispatch = useDispatch();

  // selected chat
  const handleSelectChat = (chat) => {
    console.log(chat);
    dispatch(selectChat(chat));
  };

  // new group chat
  const [openNewGroupChat, setOpenNewGroupChat] = useState(false);

  const handleOpenNewGroupChat = () => {
    setOpenNewGroupChat(true);
  };

  const handleCloseNewGroupChat = () => {
    setOpenNewGroupChat(false);
  };

  return (
    <div>
      <NewGroupChat
        open={openNewGroupChat}
        handleClose={handleCloseNewGroupChat}
      />
      <React.Fragment>
        <Drawer
          anchor={'right'}
          open={open}
          onClose={() => {
            handleToggleChat();
          }}
        >
          <Grid
            container
            sx={{ minWidth: chat?.id ? '70vw' : 350, height: '100vh' }}
          >
            <Grid
              item
              xs={12}
              md={chat?.id ? 3 : 12}
              lg={chat?.id ? 4 : 12}
              sx={{ height: '100%' }}
            >
              <ChatList
                handleSelectChat={handleSelectChat}
                handleOpenNewGroupChat={handleOpenNewGroupChat}
              />
            </Grid>

            {chat.id && (
              <Grid item xs={12} md={9} lg={8} sx={{ height: '100vh' }}>
                <ChatContent socket={socket} />
              </Grid>
            )}
          </Grid>
        </Drawer>
      </React.Fragment>
    </div>
  );
}
