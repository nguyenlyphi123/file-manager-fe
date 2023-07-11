import * as React from 'react';
import '../stylesheet/PageLoading.css';

export default function PageLoading() {
  return (
    <div className='flex justify-center items-center h-full'>
      <div className='wrapper'>
        <div className='circle'></div>
        <div className='circle'></div>
        <div className='circle'></div>
        <div className='shadow'></div>
        <div className='shadow'></div>
        <div className='shadow'></div>
        <span>Loading</span>
      </div>
    </div>
  );
}
