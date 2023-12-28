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
import { unShareFile } from 'services/fileController';
import { unShareFolder } from 'services/folderController';

function UnShareConfirm({ open, handleClose, data }) {
  const queryClient = useQueryClient();

  const shareMutation = data.type ? unShareFile : unShareFolder;

  // handle share
  const handleUnShare = useMutation({
    mutationFn: () => {
      return shareMutation({ id: data._id });
    },
    onSuccess: () => {
      SuccessToast({
        message: `${data.type ? 'File' : 'Folder'} was unshared successfully`,
      });
      queryClient.invalidateQueries([
        data.type ? 'file-shared-bm' : 'folder-shared-bm',
      ]);
      handleClose();
    },
    onError: () => {
      ErrorToast({
        message: 'Oops! Something went wrong. Please try again later',
      });
    },
  });

  return (
    <Dialog
      open={open}
      keepMounted
      aria-describedby='alert-dialog-slide-description'
    >
      <DialogTitle>{`Are you sure want to unshare this ${
        data.type ? 'file' : 'folder'
      }?`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`If you unshare this ${
            data.type ? 'file' : 'folder'
          }, the shared user will not be able to access this ${
            data.type ? 'file' : 'folder'
          } anymore.`}
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
          onClick={() => handleUnShare.mutate()}
          className='bg-blue-600/80 text-white font-medium rounded-md cursor-pointer flex justify-center items-center w-[100px] h-[35px] py-2 ml-2 hover:bg-blue-600 duration-200'
        >
          {handleUnShare.isPending ? (
            <ImSpinner className='animate-spin' />
          ) : (
            'Unshare'
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default UnShareConfirm;
