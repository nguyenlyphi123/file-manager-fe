import React from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { toast } from 'react-toastify';

export default function SuccessToast({ message }) {
  return toast(
    <Alert
      variant='outlined'
      severity='success'
      onClose={() => toast.dismiss()}
    >
      <AlertTitle sx={{ fontWeight: '600', fontSize: '18', color: '#418944' }}>
        Success
      </AlertTitle>
      {message}
    </Alert>,
    {
      bodyClassName: () => 'p-0 text-xl',
      closeButton: false,
      progressClassName: 'Toastify__progress-bar--success',
    },
  );
}
