import { IconButton, Menu, MenuItem } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RQK_REMOVED_FILES } from 'apis/file.api';
import { RQK_REMOVED_FOLDERS } from 'apis/folder.api';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';
import { useState } from 'react';
import { BsThreeDots, BsTrash } from 'react-icons/bs';
import { TfiReload } from 'react-icons/tfi';
import { deleteFile, restoreFile } from 'services/fileController';
import { deleteFolder, restoreFolder } from 'services/folderController';

export const RemovedThreeDotsDropdown = ({ className, data }) => {
  const queryClient = useQueryClient();

  // dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // handle restore
  const restoreMutation = data.type ? restoreFile : restoreFolder;
  const handleRestore = useMutation({
    mutationFn: (data) => restoreMutation({ id: data._id }),
    onSuccess: () => {
      handleClose();
      SuccessToast({
        message: `${
          data.type ? 'File' : 'Folder'
        } has been restored successfully`,
      });
      queryClient.invalidateQueries([RQK_REMOVED_FOLDERS]);
      queryClient.invalidateQueries([RQK_REMOVED_FILES]);
    },
    onError: () => {
      handleClose();
      ErrorToast({
        message: 'Opps! Something went wrong. Please try again later',
      });
    },
  });

  // handle delete
  const deleteMutation = data.type ? deleteFile : deleteFolder;
  const handleDelete = useMutation({
    mutationFn: (data) =>
      deleteMutation(data.type ? { data: data } : { id: data._id }),
    onSuccess: () => {
      handleClose();
      SuccessToast({
        message: `${
          data.type ? 'File' : 'Folder'
        } has been deleted successfully`,
      });
      queryClient.invalidateQueries([RQK_REMOVED_FOLDERS]);
      queryClient.invalidateQueries([RQK_REMOVED_FILES]);
    },
    onError: () => {
      handleClose();
      ErrorToast({
        message: 'Opps! Something went wrong. Please try again later',
      });
    },
  });

  return (
    <>
      <div className={className}>
        <IconButton
          id='threedots-btn'
          aria-haspopup='true'
          aria-controls={open ? 'threedots-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <BsThreeDots className='text-lg' />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id='threedots-menu'
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem
            onClick={() => handleRestore.mutate(data)}
            className='group/drop-items flex items-center px-4 py-3 hover:bg-blue-100/30 '
          >
            <TfiReload className='mr-4 text-lg text-blue-300 group-hover/drop-items:text-blue-400' />
            <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
              Restore
            </p>
          </MenuItem>
          <MenuItem
            onClick={() => handleDelete.mutate(data)}
            className='group/drop-items flex items-center px-4 py-3 hover:bg-blue-100/30'
          >
            <BsTrash className='mr-4 text-lg text-blue-300 group-hover/drop-items:text-blue-400' />
            <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
              Permanently Delete
            </p>
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};
