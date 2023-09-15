import { Tooltip } from '@mui/material';
import React from 'react';
import FileIconHelper from 'utils/helpers/FileIconHelper';
import {
  Truncate,
  convertBytesToReadableSize,
} from 'utils/helpers/TypographyHelper';

function SmallFolderCard({ folder, handleClick }) {
  return (
    <Tooltip title={folder.name} placement='top'>
      <div
        className='border rounded-sm cursor-pointer w-full'
        onClick={() => handleClick(folder)}
      >
        <div className='flex my-1 mx-2'>
          <FileIconHelper className={'text-[20px] mr-2'} />
          <div className='flex flex-col'>
            <p className='text-[12px] text-gray-700'>
              {Truncate(folder.name, 20)}
            </p>
            <p className='text-[10px] text-gray-400'>
              Size: {convertBytesToReadableSize(folder.size)}
            </p>
          </div>
        </div>
      </div>
    </Tooltip>
  );
}

export default SmallFolderCard;
