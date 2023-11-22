import {
  Button,
  Card,
  CardActions,
  Modal,
  Slider,
  Typography,
} from '@mui/material';
import { cloneElement, memo, useState } from 'react';
import Cropper from 'react-easy-crop';

function ImageCropper({
  imageSrc,
  croppedImage,
  children,
  handleChangeImage,
  handleCropImage,
  handleCropComplete,
}) {
  const [show, setShow] = useState(() => {
    return imageSrc ? true : false;
  });
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const handleZoom = (e, zoom) => {
    setZoom(zoom);
  };

  const handleChange = (e) => {
    handleChangeImage(e);
    handleShow();
  };

  return (
    <>
      {cloneElement(children, { onChange: handleChange })}
      {imageSrc && (
        <Modal
          open={show}
          onClose={handleClose}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Card sx={{ width: '50%', minHeight: '50%' }}>
            <div className='h-[400px] w-full relative'>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={handleCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <CardActions sx={{ my: 2, flexDirection: 'column' }}>
              <div className='w-full flex px-5'>
                <Typography variant='overline' sx={{ mr: 4 }}>
                  Zoom
                </Typography>
                <Slider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby='Zoom'
                  onChange={handleZoom}
                />
              </div>
              <div className='w-full flex justify-end gap-2 px-5 mt-3'>
                <Button
                  size='small'
                  variant='contained'
                  color='error'
                  sx={{ textTransform: 'none' }}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  size='small'
                  variant='contained'
                  sx={{ textTransform: 'none' }}
                  onClick={() => {
                    handleCropImage();
                    handleClose();
                  }}
                >
                  Accept
                </Button>
              </div>
            </CardActions>
          </Card>
        </Modal>
      )}
    </>
  );
}

export default memo(ImageCropper);
