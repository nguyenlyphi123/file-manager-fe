import { Box, Modal } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RQK_FOLDER, RQK_FOLDERS } from 'apis/folder.api';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';
import { PERMISSION_WRITE } from 'constants/constants';
import { cloneElement, useCallback, useState } from 'react';
import { ImSpinner } from 'react-icons/im';
import { useSelector } from 'react-redux';
import {
  createFolder,
  createQuickAccessFolder,
} from 'services/folderController';
import { hasFFPermission, isAuthor } from 'utils/helpers/Helper';

export const NewFolder = ({ title, children, quickAccess = false }) => {
  const curentFolder = useSelector((state) => state.curentFolder);
  const user = useSelector((state) => state.user);

  const queryClient = useQueryClient();

  // show modal
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // folder
  const [folder, setFolder] = useState('Untitled folder');

  const createMutation = useCallback(
    async ({ name, parent_folder }) => {
      return quickAccess
        ? await createQuickAccessFolder({ name, parent_folder })
        : await createFolder({ name, parent_folder });
    },
    [quickAccess],
  );

  const handleCreate = useMutation({
    mutationFn: () =>
      createMutation({
        name: folder,
        parent_folder: curentFolder,
      }),
    onSuccess: () => {
      handleClose();
      setFolder('Untitled folder');
      SuccessToast({ message: 'Folder was created successfully' });
      queryClient.invalidateQueries([RQK_FOLDERS]);
      queryClient.invalidateQueries([RQK_FOLDER]);
    },
    onError: () => {
      ErrorToast({
        message: 'Oops! Something went wrong. Please try again later',
      });
    },
  });

  return (
    <>
      {cloneElement(children, { onClick: handleOpen })}
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby='keep-mounted-modal-title'
        aria-describedby='keep-mounted-modal-description'
      >
        <Box className='bg-white shadow-md rounded-lg w-[30%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-6'>
          <div>
            <p className='text-2xl text-gray-700 font-medium'>{title}</p>
          </div>

          {(() => {
            if (
              !hasFFPermission(
                curentFolder.permission,
                PERMISSION_WRITE,
                isAuthor(user.id, curentFolder?.author?._id),
              ) &&
              curentFolder._id !== null
            ) {
              return (
                <>
                  <div className='flex items-center justify-center mt-6'>
                    <p className='text-gray-600 text-xl'>
                      You don't have permission to create folder in this folder
                    </p>
                  </div>
                  <div className='flex items-center justify-end mt-12'>
                    <div
                      onClick={() => handleClose()}
                      className='text-blue-600/80 font-medium cursor-pointer text-[0.9em py-2 px-6 hover:text-blue-600'
                    >
                      Cancel
                    </div>
                    <div
                      className='bg-blue-600/80 text-white text-[0.9em] font-medium rounded-md cursor-pointer flex justify-center items-center w-[100px] h-[40px] py-2 ml-2 hover:bg-blue-600'
                      onClick={() => handleClose()}
                    >
                      Create
                    </div>
                  </div>
                </>
              );
            } else {
              return (
                <>
                  <div className='border-2 border-blue-600 rounded-md py-2 px-4 mt-6'>
                    <input
                      onChange={(e) => setFolder(e.target.value)}
                      type='text'
                      value={folder ? folder : ''}
                      placeholder='Untitled folder'
                      className='w-full outline-none text-gray-700 font-medium'
                      autoFocus
                    />
                  </div>
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
                </>
              );
            }
          })()}
        </Box>
      </Modal>
    </>
  );
};
