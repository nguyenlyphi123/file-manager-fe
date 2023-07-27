import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import OverlayLoading from 'components/OverlayLoading';
import ErrorToast from 'components/toasts/ErrorToast';
import { useCallback, useState } from 'react';
import { downloadFile } from 'services/fileController';
import { downloadFolder } from 'services/folderController';

export const DownloadConfirm = ({ open, handleClose, data }) => {
  const [loading, setLoading] = useState(false);

  const downloadMutation = useCallback(async (fn, data, params) => {
    setLoading(true);
    try {
      const response = await fn(params);

      const contentType =
        response?.headers?.get('content-type') || 'application/octet-stream';

      // Create a blob from the response
      const blob = new Blob([response], {
        type: contentType,
      });

      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const linkName = data.type
        ? `${data.name}.${data.type}`
        : `${data.name}.zip`;
      const link = document.createElement('a');
      link.href = url;
      link.download = linkName;
      document.body.appendChild(link);

      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      setLoading(false);
      handleClose();
    } catch (error) {
      console.log(error);
      ErrorToast({
        message:
          'Data preparation for download failed, or you do not have permission to download. Please contact your manager for more information.',
      });
      setLoading(false);
    }
  }, []);

  const handleDownloadFile = () => {
    downloadMutation(downloadFile, data, {
      data: data,
    });
  };
  const handleDownloadFolder = () => {
    downloadMutation(downloadFolder, data, {
      id: data._id,
    });
  };

  return (
    <Dialog
      open={open}
      keepMounted
      aria-describedby='alert-dialog-slide-description'
    >
      {loading && <OverlayLoading />}
      <DialogTitle>Confirm download</DialogTitle>
      <DialogContent>
        <DialogContentText>
          The preparation for loading the directory will take some time, do you
          want to proceed?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: '15px 20px' }}>
        <div
          onClick={handleClose}
          className='text-blue-600/80 font-medium text-[0.9em] cursor-pointer py-2 px-6 hover:text-blue-600 duration-200'
        >
          Cancel
        </div>
        <div
          onClick={() =>
            data.type ? handleDownloadFile() : handleDownloadFolder()
          }
          className='bg-blue-600/80 text-white text-[0.9em] font-medium rounded-md cursor-pointer flex justify-center items-center w-[100px] h-[35px] py-2 ml-2 hover:bg-blue-600 duration-200'
        >
          Download
        </div>
      </DialogActions>
    </Dialog>
  );
};
