import { Box, Modal } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';
import { PERMISSION_WRITE } from 'constants/constants';
import { useState } from 'react';
import { ImSpinner } from 'react-icons/im';
import { useSelector } from 'react-redux';
import { createFolder } from 'services/folderController';
import { hasFFPermission, isAuthor } from 'utils/helpers/Helper';

export const NewFolder = ({ handleClose, open }) => {
  const { _id, author, permission } = useSelector(
    (state) => state.curentFolder,
  );
  const user = useSelector((state) => state.user);

  const queryClient = useQueryClient();

  // folder
  const [folder, setFolder] = useState('Untitled folder');

  const handleCreate = useMutation({
    mutationFn: () => createFolder({ name: folder, parent_folder: _id }),
    onSuccess: () => {
      handleClose();
      setFolder('Untitled folder');
      SuccessToast({ message: 'Folder was created successfully' });
      queryClient.invalidateQueries('folders');
      queryClient.invalidateQueries('folder');
    },
    onError: () => {
      ErrorToast({
        message: 'Oops! Something went wrong. Please try again later',
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
      <Box className='bg-white shadow-md rounded-lg w-[30%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-6'>
        <div>
          <p className='text-2xl text-gray-700 font-medium'>New Folder</p>
        </div>

        {(() => {
          if (
            !hasFFPermission(
              permission,
              PERMISSION_WRITE,
              isAuthor(user.id, author),
            ) &&
            _id !== null
          ) {
            return (
              <div className='flex items-center justify-center mt-6'>
                <p className='text-gray-500 text-[0.9em] font-medium'>
                  You don't have permission to create folder in this folder
                </p>
              </div>
            );
          } else {
            return (
              <div className='border-2 border-blue-600 rounded-md py-2 px-4 mt-6'>
                <input
                  onChange={(e) => setFolder(e.target.value)}
                  type='text'
                  value={folder}
                  placeholder='Untitled folder'
                  className='w-full outline-none text-gray-700 font-medium'
                  autoFocus
                />
              </div>
            );
          }
        })()}

        <div className='flex items-center justify-end mt-12'>
          <div
            onClick={() => handleClose()}
            className='text-blue-600/80 font-medium cursor-pointer py-2 px-6 hover:text-blue-600'
          >
            Cancel
          </div>
          <div
            className='bg-blue-600/80 text-white font-medium rounded-md cursor-pointer flex justify-center items-center w-[100px] h-[40px] py-2 ml-2 hover:bg-blue-600'
            onClick={() => handleCreate.mutate()}
          >
            {handleCreate.isLoading ? (
              <ImSpinner className='animate-spin' />
            ) : (
              'Create'
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
};
