import React from 'react';

export default function EmptyData({ message }) {
  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <img src={'null-data.png'} alt='empty' className='max-h-[400px]' />
      <p className='text-gray-500 text-xl font-semibold mt-5'>{message}!</p>
    </div>
  );
}
