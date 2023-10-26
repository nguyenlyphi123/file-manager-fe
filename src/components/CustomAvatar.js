import React, { memo } from 'react';
import { Avatar } from '@mui/material';
import { renderAvatarColor, renderAvatarName } from 'utils/helpers/Helper';

function CustomAvatar({ width, height, fontSize, text, color, image }) {
  return (
    <Avatar
      sx={{
        width: width || 25,
        height: height || 25,
        bgcolor: renderAvatarColor(color),
        fontSize: fontSize || '14px',
      }}
      src={image ? image : null}
    >
      {renderAvatarName(text)}
    </Avatar>
  );
}

export default memo(CustomAvatar);
