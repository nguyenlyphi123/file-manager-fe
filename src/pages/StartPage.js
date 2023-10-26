import React from 'react';
import StartingLogo from 'assets/images/starting.png';

function StartPage() {
  return (
    <div className='h-screen flex justify-center items-center'>
      <div className='w-[70%] flex justify-center items-center'>
        <img src={StartingLogo} alt='logo' className='w-1/2' />
      </div>
    </div>
  );
}

export default StartPage;
