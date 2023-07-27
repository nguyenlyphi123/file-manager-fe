import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';
import { ImSpinner } from 'react-icons/im';
import { removeFileToTrash } from 'services/fileController';
import { removeFolderToTrash } from 'services/folderController';

export const DeleteConfirm = ({ open, handleClose, data }) => {
  const queryClient = useQueryClient();

  const deleteMutation = data.type ? removeFileToTrash : removeFolderToTrash;
  const handleDelete = useMutation({
    mutationFn: (data) => deleteMutation({ id: data._id }),
    onSuccess: () => {
      handleClose();
      SuccessToast({
        message: `${
          data.type ? 'File' : 'Folder'
        } has been deleted successfully`,
      });
      if (data.type) {
        queryClient.invalidateQueries(['files']);
        queryClient.invalidateQueries(['file']);
        queryClient.invalidateQueries(['file-shared']);

        return;
      }
      queryClient.invalidateQueries(['folders']);
      queryClient.invalidateQueries(['folder']);
      queryClient.invalidateQueries(['folder-shared']);
    },
    onError: (err) => {
      console.log(err);
      handleClose();
      ErrorToast({
        message: err.response.data.message,
      });
    },
  });

  return (
    <Dialog
      open={open}
      keepMounted
      aria-describedby='alert-dialog-slide-description'
    >
      <DialogTitle>{`Are you sure want to delete this ${
        data.type ? 'file' : 'folder'
      }?`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {data.type
            ? 'If you delete this file, you can restore it recovery!'
            : 'If you delete this folder, all files and sub folders in this folder will be deleted!'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <div
          onClick={handleClose}
          className='text-blue-600/80 font-medium cursor-pointer py-2 px-6 hover:text-blue-600 duration-200'
        >
          Cancel
        </div>
        <div
          onClick={() => handleDelete.mutate(data)}
          className='bg-blue-600/80 text-white font-medium rounded-md cursor-pointer flex justify-center items-center w-[100px] h-[35px] py-2 ml-2 hover:bg-blue-600 duration-200'
        >
          {handleDelete.isLoading ? (
            <ImSpinner className='animate-spin' />
          ) : (
            'Delete'
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
};
