import { Box, Button, LinearProgress, Modal } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';
import { PERMISSION_WRITE } from 'constants/constants';
import { useCallback, useState } from 'react';
import { AiOutlineClose, AiOutlineCloudUpload } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { uploadFile } from 'services/gcController';
import FileIconHelper from 'utils/helpers/FileIconHelper';
import { hasFFPermission, isAuthor } from 'utils/helpers/Helper';

export const UploadFile = ({ handleClose, open }) => {
  const { _id, author, permission } = useSelector(
    (state) => state.curentFolder,
  );

  const user = useSelector((state) => state.user);

  const queryClient = useQueryClient();

  const [file, setFile] = useState();

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const [loading, setLoading] = useState(false);

  const handleUpload = useCallback(async () => {
    if (!file) return ErrorToast({ message: 'Please select a file' });

    setLoading(true);

    const blob = new Blob([file], { type: file.type });

    const formData = new FormData();
    formData.append('file', blob, file.name);
    _id !== null && formData.append('folderId', _id);

    try {
      await uploadFile(formData);
      SuccessToast({ message: 'File was uploaded successfully' });
      queryClient.invalidateQueries('files');
      queryClient.invalidateQueries('file');
      setFile();
      setLoading(false);
      handleClose();
    } catch (error) {
      console.error(error);
      ErrorToast({
        message: 'Oop! Some thing went wrong! Please try again later',
      });
      setLoading(false);
      setFile();
    }
  }, [_id, file, handleClose, queryClient]);

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
            <p className='text-[0.9em] text-gray-700 font-medium'>
              Upload File
            </p>

            <div onClick={handleClose} className='cursor-pointer'>
              <AiOutlineClose className='text-gray-700 text-lg' />
            </div>
          </div>
        </div>

        <div className='py-6 px-8'>
          <Button
            component='label'
            style={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
            }}
            className='rounded-md p-4 w-full h-[200px] flex flex-col justify-center items-center'
          >
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
                    <p className='text-gray-500 text-md font-medium'>
                      You don't have permission to upload file in this folder
                    </p>
                  </div>
                );
              } else {
                return (
                  <>
                    <AiOutlineCloudUpload className='text-[5em] text-gray-400 mb-5' />

                    <span className='text-lg text-gray-400'>
                      Drag and drop a file here or click
                    </span>
                    <input hidden type='file' onChange={handleChange} />
                  </>
                );
              }
            })()}
          </Button>

          {file && (
            <div>
              <div className='flex justify-between items-center mt-5'>
                <div className='flex items-center'>
                  <FileIconHelper
                    type={
                      file &&
                      file.name.substring(file.name.lastIndexOf('.') + 1)
                    }
                    className='text-2xl'
                  />
                  <p className='text-[0.9em] text-gray-600 ml-3'>{file.name}</p>
                </div>
                <div onClick={() => setFile(null)} className='cursor-pointer'>
                  <AiOutlineClose className='text-md text-orange-700' />
                </div>
              </div>

              {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1, mt: 2 }}>
                    <LinearProgress />
                  </Box>
                </Box>
              )}
            </div>
          )}
        </div>

        <div className='flex justify-end items-center py-3 px-8 bg-[#E5E9F2]'>
          <div
            onClick={handleClose}
            className='bg-white py-2 px-5 rounded-md text-gray-500 text-[0.9em] font-medium mr-4 shadow-sm cursor-pointer hover:text-white hover:bg-gray-600'
          >
            Cancel
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
                <div
                  onClick={() => handleClose()}
                  className='bg-blue-700/60 py-2 px-5 rounded-md text-white text-[0.9em] font-medium cursor-pointer hover:bg-blue-700/80'
                >
                  Upload
                </div>
              );
            } else {
              return (
                <div
                  onClick={() => handleUpload()}
                  className='bg-blue-700/60 py-2 px-5 rounded-md text-white text-[0.9em] font-medium cursor-pointer hover:bg-blue-700/80'
                >
                  Upload
                </div>
              );
            }
          })()}
        </div>
      </Box>
    </Modal>
  );
};
