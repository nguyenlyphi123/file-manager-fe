import { Modal } from '@mui/material';
import { cloneElement, useState } from 'react';

function ModalButton({ trigger, children }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {cloneElement(trigger, { onClick: handleOpen })}
      {open && (
        <Modal open={open} onClose={handleClose}>
          {typeof children === 'function' ? children(handleClose) : children}
        </Modal>
      )}
    </>
  );
}

export default ModalButton;
