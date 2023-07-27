import { Box, Modal } from '@mui/material';
import { AiOutlineClose } from 'react-icons/ai';
import FileIconHelper from 'utils/helpers/FileIconHelper';
import {
  FormattedDateTime,
  convertBytesToReadableSize,
} from 'utils/helpers/TypographyHelper';

export const Detail = ({ handleClose, data, open }) => {
  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby='keep-mounted-modal-title'
      aria-describedby='keep-mounted-modal-description'
    >
      <Box className='bg-white shadow-md rounded-lg w-[40%] absolute top-[50%] left-[50%] translate-x-[-50%]  translate-y-[-50%] overflow-hidden'>
        <div className='border-b'>
          <div className='flex justify-between items-center py-4 px-8'>
            <div className='flex items-center'>
              <FileIconHelper className='mr-4 text-3xl' type={data.type} />
              <p className='text-[0.9em] text-gray-700 font-medium'>
                {data.name}
              </p>
            </div>

            <div onClick={handleClose} className='cursor-pointer'>
              <AiOutlineClose className='text-gray-700 text-lg' />
            </div>
          </div>
        </div>

        <div className='py-6 px-8'>
          <div className='flex items-center py-2'>
            <span className='w-[100px] text-[0.9em] text-gray-400 font-medium'>
              Type
            </span>
            <p className='text-gray-500 text-[0.9em] uppercase font-medium'>
              {data.type ? data.type : 'folder'}
            </p>
          </div>

          <div className='flex items-center py-2'>
            <span className='w-[100px] text-[0.9em] text-gray-400 font-medium'>
              Size
            </span>
            <p className='text-gray-500 text-[0.9em] font-medium'>
              {convertBytesToReadableSize(data.size)}
            </p>
          </div>

          <div className='flex items-center py-2'>
            <span className='w-[100px] text-[0.9em] text-gray-400 font-medium'>
              Location
            </span>
            <p className='text-gray-500 text-[0.9em] font-medium'>
              {data.parent_folder ? data.parent_folder.name : 'Root'}
            </p>
          </div>

          <div className='flex items-center py-2'>
            <span className='w-[100px] text-[0.9em] text-gray-400 font-medium'>
              Owner
            </span>
            <p className='text-gray-500 text-[0.9em] font-medium'>Me</p>
          </div>

          <div className='flex items-center py-2'>
            <span className='w-[100px] text-[0.9em] text-gray-400 font-medium'>
              Modified
            </span>
            <p className='text-gray-500 text-[0.9em] font-medium'>
              {FormattedDateTime(data.modifiedAt)}
            </p>
          </div>

          <div className='flex items-center py-2'>
            <span className='w-[100px] text-[0.9em] text-gray-400 font-medium'>
              Opened
            </span>
            <p className='text-gray-500 text-[0.9em] font-medium'>
              {FormattedDateTime(data.lastOpened)}
            </p>
          </div>

          <div className='flex items-center py-2'>
            <span className='w-[100px] text-[0.9em] text-gray-400 font-medium'>
              Created
            </span>
            <p className='text-gray-500 text-[0.9em] font-medium'>
              {FormattedDateTime(data.createAt)}
            </p>
          </div>
        </div>

        <div className='flex justify-end items-center py-3 px-8 bg-[#E5E9F2]'>
          <div className='bg-white py-2 px-5 rounded-md text-gray-500 text-[0.9em] font-medium mr-4 shadow-sm cursor-pointer hover:text-white hover:bg-gray-600 duration-200'>
            Share
          </div>

          <div
            onClick={() => window.open(data.link, '_blank')}
            className='bg-blue-700/60 py-2 px-5 rounded-md text-white font-medium cursor-pointer hover:bg-blue-700/80 duration-200'
          >
            Download
          </div>
        </div>
      </Box>
    </Modal>
  );
};
