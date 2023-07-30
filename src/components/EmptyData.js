import React from 'react';
import nullDataImage from 'assets/images/data-not-found.png';

export default function EmptyData({ message }) {
  return (
    <div className='w-full h-full flex flex-col justify-center items-center absolute top-0 left-0'>
      <img src={nullDataImage} alt='empty' className='max-h-[300px]' />
      <p className='text-gray-500 text-xl font-semibold mt-5'>{message}!</p>
    </div>
  );
}
