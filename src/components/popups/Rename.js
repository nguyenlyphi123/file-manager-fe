import { Box, Modal } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';
import { useState } from 'react';
import { ImSpinner } from 'react-icons/im';
import { renameFile } from 'services/fileController';
import { renameFolder } from 'services/folderController';

export const Rename = ({ handleClose, data, open }) => {
  const queryClient = useQueryClient();

  // folder data
  const [destName, setDestName] = useState();

  // dispatch
  const renameMutation = data.type ? renameFile : renameFolder;
  const handleSubmit = useMutation({
    mutationFn: () => {
      if (!destName) {
        ErrorToast({ message: 'Please enter a name!' });
        throw new Error('Please enter a name!');
      }
      return renameMutation(
        data.type ? { data, name: destName } : { id: data._id, name: destName },
      );
    },
    onSuccess: () => {
      handleClose();
      SuccessToast({
        message: `${
          data.type ? 'File' : 'Folder'
        } has been renamed successfully!`,
      });
      if (data.type) {
        queryClient.invalidateQueries(['files']);
        queryClient.invalidateQueries(['file']);
        queryClient.invalidateQueries(['file-shared']);
      }
      queryClient.invalidateQueries(['folders']);
      queryClient.invalidateQueries(['folder']);
      queryClient.invalidateQueries(['folder-shared']);
    },
    onError: (err) => {
      handleClose();
      ErrorToast({
        message: err.response.data.message,
      });
    },
  });

  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby='keep-mounted-modal-title'
      aria-describedby='keep-mounted-modal-description'
    >
      <Box className='bg-white p-6 shadow-md rounded-lg w-[40%] absolute top-[50%] left-[50%] translate-x-[-50%]  translate-y-[-50%] overflow-hidden'>
        <div>
          <p className='text-2xl text-gray-700 font-medium'>Rename</p>
        </div>

        <div className='border-2 border-blue-600 rounded-md py-2 px-4 mt-6'>
          <input
            type='text'
            placeholder='Untitled folder'
            className='w-full outline-none text-gray-700 font-medium'
            autoFocus
            value={destName ? destName : data.name}
            onChange={(e) => setDestName(e.target.value)}
          />
        </div>

        <div className='flex items-center justify-end mt-12'>
          <div
            onClick={handleClose}
            className='text-blue-600/80 font-medium cursor-pointer py-2 px-6 hover:text-blue-600 duration-200'
          >
            Cancel
          </div>
          <div
            className='bg-blue-600/80 text-white font-medium rounded-md cursor-pointer flex justify-center items-center w-[100px] h-[40px] py-2 ml-2 hover:bg-blue-600 duration-200'
            onClick={() => handleSubmit.mutate()}
          >
            {handleSubmit.isLoading ? (
              <ImSpinner className='animate-spin' />
            ) : (
              'Rename'
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
};
