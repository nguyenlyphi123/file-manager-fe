import { Grid, Hidden } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import React, { useCallback, useState } from 'react';

import NewGroupChat from 'components/popups/NewGroupChat';
import { useSelector } from 'react-redux';
import ChatContent from './ChatContent';
import ChatList from './ChatList';

export default function ChatContainer({ open, handleToggleChat }) {
  const chat = useSelector((state) => state.chat);

  // new group chat
  const [openNewGroupChat, setOpenNewGroupChat] = useState(false);

  const handleOpenNewGroupChat = useCallback(() => {
    setOpenNewGroupChat(true);
  }, []);

  const handleCloseNewGroupChat = () => {
    setOpenNewGroupChat(false);
  };

  return (
    <div>
      {openNewGroupChat && (
        <NewGroupChat
          open={openNewGroupChat}
          handleClose={handleCloseNewGroupChat}
        />
      )}
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
            <Hidden lgDown={chat.id ? true : false}>
              <Grid
                item
                xs={12}
                md={chat?.id ? 3 : 12}
                lg={chat?.id ? 4 : 12}
                sx={{ height: '100%' }}
              >
                <ChatList handleOpenNewGroupChat={handleOpenNewGroupChat} />
              </Grid>
            </Hidden>

            {chat.id && (
              <Grid item xs={12} md={12} lg={8} sx={{ height: '100vh' }}>
                <ChatContent />
              </Grid>
            )}
          </Grid>
        </Drawer>
      </React.Fragment>
    </div>
  );
}
