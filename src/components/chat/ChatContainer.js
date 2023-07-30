import { Grid } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import React, { useState } from 'react';

import ChatContent from './ChatContent';
import ChatList from './ChatList';
import { useDispatch, useSelector } from 'react-redux';
import { selectChat } from 'redux/slices/chat';

export default function ChatContainer({ socket, open, handleToggleChat }) {
  const chat = useSelector((state) => state.chat);

  const dispatch = useDispatch();

  // selected chat
  const [chatSelected, setChatSelected] = useState();

  const handleSelectChat = (chat) => {
    setChatSelected(chat);
    dispatch(selectChat(chat));
  };

  return (
    <div>
      <React.Fragment>
        <Drawer
          anchor={'right'}
          open={open}
          onClose={() => {
            handleToggleChat();
            setChatSelected();
          }}
        >
          <Grid
            container
            sx={{ minWidth: chatSelected ? '60vw' : 350, height: '100vh' }}
          >
            <Grid
              item
              xs={12}
              md={chatSelected ? 3 : 12}
              lg={chatSelected ? 4 : 12}
              sx={{ height: '100%' }}
            >
              <ChatList handleSelectChat={handleSelectChat} />
            </Grid>

            {chatSelected && chat.id && (
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
