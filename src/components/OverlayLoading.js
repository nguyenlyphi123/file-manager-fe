import { CircularProgress } from '@mui/material';
import React from 'react';

export default function OverlayLoading() {
  return (
    <div className='absolute top-0 left-0 w-full h-full bg-gray-500/10 flex justify-center items-center'>
      <CircularProgress color='primary' />
    </div>
  );
}
