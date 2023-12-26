import React from 'react';
import { ToastContainer as Container } from 'react-toastify';

function ToastContainer() {
  return (
    <Container
      position='top-right'
      autoClose={2000}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      pauseOnHover={false}
      draggable
      theme='light'
      style={{ width: 'fit-content' }}
      toastStyle={{
        padding: 0,
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
      }}
    />
  );
}

export default ToastContainer;
