import { Badge, Divider, IconButton, Menu } from '@mui/material';
import React, { memo, useMemo } from 'react';

import { IoMdNotificationsOutline } from 'react-icons/io';
import { useSelector } from 'react-redux';
import NotificationCard from './NotificationCard';
import { useNavigate } from 'react-router-dom';

function Notification() {
  const notifications = useSelector((state) => state.notification);

  const navigate = useNavigate();

  const requirement = useMemo(
    () => notifications.requirement,
    [notifications.requirement],
  );

  // card click
  const handleCardClick = (des) => {
    navigate(des);
  };

  // dropdown
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <Badge
          color='primary'
          overlap='circular'
          variant='dot'
          invisible={!notifications.hasData}
        >
          <IoMdNotificationsOutline />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            minWidth: 300,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {!notifications.hasData && (
          <p className='text-center text-[12px] text-gray-400 italic'>
            No new notifications
          </p>
        )}

        {requirement.hasData && (
          <>
            <Divider
              textAlign='left'
              className='text-[10px] text-gray-400'
              sx={{ mx: 2, letterSpacing: '0.5px' }}
            >
              Requirements
            </Divider>
            {requirement.new.length > 0 &&
              requirement.new.map((item) => (
                <NotificationCard
                  data={item}
                  type={'requirement'}
                  onClick={() => handleCardClick('/require')}
                />
              ))}
          </>
        )}
      </Menu>
    </>
  );
}

export default memo(Notification);
