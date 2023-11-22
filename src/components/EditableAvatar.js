import { ButtonBase } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MdEdit } from 'react-icons/md';

import DefaultUserImage from 'assets/images/default-user.png';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    width: '100% !important',
    height: 100,
  },
  '& .MuiImageBackdrop-root': {
    opacity: 0,
  },
  '& .MuiTypography-root': {
    opacity: 0,
    transition: 0.2 + 's ease-in-out',
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.15,
    },
    '& .MuiTypography-root': {
      opacity: 1,
    },
  },
}));

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create('opacity'),
}));

export default function EditableAvatar({ image, width, height, onChange }) {
  return (
    <ImageButton
      component='label'
      focusRipple
      key={image}
      style={{
        width: width || 200,
        height: height || 200,
        borderRadius: '50%',
        overflow: 'hidden',
      }}
      id='avatar-button'
    >
      <ImageSrc
        style={{
          backgroundImage: `url(${image ?? DefaultUserImage})`,
          transform: `scale(${image ? 1 : 1.55})`,
        }}
      />
      <ImageBackdrop className='MuiImageBackdrop-root' />
      <Image className='MuiTypography-root'>
        <MdEdit size={width / 7} />
      </Image>
      <VisuallyHiddenInput type='file' onChange={onChange} />
    </ImageButton>
  );
}
