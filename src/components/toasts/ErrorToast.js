import React from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { toast } from 'react-toastify';

export default function ErrorToast({ message }) {
  return toast(
    <Alert variant='outlined' severity='error' onClose={() => toast.dismiss()}>
      <AlertTitle sx={{ fontWeight: '600', fontSize: '18', color: '#D74242' }}>
        Error
      </AlertTitle>
      {message}
    </Alert>,
    {
      bodyClassName: () => 'p-0 text-xl',
      closeButton: false,
      progressClassName: 'Toastify__progress-bar--error',
    },
  );
}
