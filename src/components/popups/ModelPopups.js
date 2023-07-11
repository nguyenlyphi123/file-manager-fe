import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Modal,
} from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import {
  AiOutlineClose,
  AiOutlineCopy,
  AiOutlineDownload,
  AiOutlineEye,
  AiOutlineShareAlt,
} from 'react-icons/ai';
import { BiRightArrow } from 'react-icons/bi';
import {
  BsBoxArrowRight,
  BsPencil,
  BsThreeDots,
  BsTrash,
} from 'react-icons/bs';
import { ImSpinner } from 'react-icons/im';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiURL } from '../../constants/constants';
import {
  COPY,
  DELETE,
  DETAILS,
  DOWNLOAD,
  MOVE,
  RENAME,
  SHARE,
} from '../../constants/option';
import { AuthContext } from '../../contexts/authContext';
import useGetData from '../../hooks/useGetData';
import { pushLocation } from '../../redux/slices/location';
import { deleteFolder, renameFolder } from '../../services/folderController';
import FileIconHelper from '../../utils/helpers/FileIconHelper';
import ErrorToast from '../toasts/ErrorToast';
import SuccessToast from '../toasts/SuccessToast';

export const NewFolder = ({ handleClose, open }) => {
  const { _id } = useSelector((state) => state.curentFolder);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // folder
  const [loading, setLoading] = useState(false);
  const [folder, setFolder] = useState('Untitled folder');

  const handleCreate = async () => {
    setLoading(true);

    const data = {
      name: folder,
      parent_folder: _id,
    };

    try {
      const response = await axios.post(`${apiURL}/folder`, data, {
        withCredentials: true,
      });

      if (response.data.success) {
        handleClose();
        setLoading(false);
        setFolder('Untitled folder');
        SuccessToast({ message: 'Folder was created successfully' });
        navigate(`folders/${response.data.data._id}`, {
          state: { folder: response.data.data },
        });
        dispatch(
          pushLocation({
            ...response.data.data,
            parent: response.data.data.parent_folder
              ? response.data.data.parent_folder._id
              : '',
          }),
        );
      }
    } catch (error) {
      setLoading(false);
      ErrorToast({
        message: 'Oops! Something went wrong. Please try again later',
      });
    }
  };

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

        <div className='flex items-center justify-end mt-12'>
          <div
            onClick={handleClose}
            className='text-blue-600/80 font-medium cursor-pointer py-2 px-6 hover:text-blue-600'
          >
            Cancel
          </div>
          <div
            className='bg-blue-600/80 text-white font-medium rounded-md cursor-pointer flex justify-center items-center w-[100px] h-[40px] py-2 ml-2 hover:bg-blue-600'
            onClick={handleCreate}
          >
            {loading ? <ImSpinner className='animate-spin' /> : 'Create'}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export const ThreeDotsDropDown = ({
  handleSelectOption,
  className,
  handleShowDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
            onClick={() => handleSelectOption(DETAILS)}
            className='group/drop-items flex items-center px-4 py-3 hover:bg-blue-100/30 '
          >
            <AiOutlineEye className='mr-4 text-xl text-blue-300 group-hover/drop-items:text-blue-400' />
            <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
              Details
            </p>
          </MenuItem>
          <MenuItem
            onClick={() => handleSelectOption(SHARE)}
            className='group/drop-items flex items-center px-4 py-3 hover:bg-blue-100/30'
          >
            <AiOutlineShareAlt className='mr-4 text-xl text-blue-300 group-hover/drop-items:text-blue-400' />
            <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
              Share
            </p>
          </MenuItem>
          <MenuItem
            onClick={() => handleSelectOption(COPY)}
            className='group/drop-items flex items-center px-4 py-3 hover:bg-blue-100/30'
          >
            <AiOutlineCopy className='mr-4 text-xl text-blue-300 group-hover/drop-items:text-blue-400' />
            <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
              Copy
            </p>
          </MenuItem>
          <MenuItem
            onClick={() => handleSelectOption(MOVE)}
            className='group/drop-items flex items-center px-4 py-3 hover:bg-blue-100/30'
          >
            <BsBoxArrowRight className='mr-4 text-xl text-blue-300 group-hover/drop-items:text-blue-400' />
            <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
              Move
            </p>
          </MenuItem>
          <MenuItem
            onClick={() => handleSelectOption(DOWNLOAD)}
            className='group/drop-items flex items-center px-4 py-3 hover:bg-blue-100/30'
          >
            <AiOutlineDownload className='mr-4 text-xl text-blue-300 group-hover/drop-items:text-blue-400' />
            <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
              Download
            </p>
          </MenuItem>
          <MenuItem
            onClick={() => handleSelectOption(RENAME)}
            className='group/drop-items flex items-center px-4 py-3 hover:bg-blue-100/30'
          >
            <BsPencil className='mr-4 text-xl text-blue-300 group-hover/drop-items:text-blue-400' />
            <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
              Rename
            </p>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleSelectOption(DELETE);
              handleShowDelete();
            }}
            className='group/drop-items flex items-center px-4 py-3 hover:bg-blue-100/30'
          >
            <BsTrash className='mr-4 text-xl text-blue-300 group-hover/drop-items:text-blue-400' />
            <p className='text-gray-500 text-[0.9em] font-medium group-hover/drop-items:text-gray-600'>
              Delete
            </p>
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};

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
              <FileIconHelper className='mr-4 text-3xl' />
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
            <p className='text-gray-500 text-[0.9em] font-medium'>
              {data.type ? data.type : 'folder'}
            </p>
          </div>

          <div className='flex items-center py-2'>
            <span className='w-[100px] text-[0.9em] text-gray-400 font-medium'>
              Size
            </span>
            <p className='text-gray-500 text-[0.9em] font-medium'>42 kb</p>
          </div>

          <div className='flex items-center py-2'>
            <span className='w-[100px] text-[0.9em] text-gray-400 font-medium'>
              Location
            </span>
            <p className='text-gray-500 text-[0.9em] font-medium'>
              {data.parent_folder ? data.parent_folder.name : ''}
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
              {moment(data.modifiedAt).format('LL')}
            </p>
          </div>

          <div className='flex items-center py-2'>
            <span className='w-[100px] text-[0.9em] text-gray-400 font-medium'>
              Opened
            </span>
            <p className='text-gray-500 text-[0.9em] font-medium'>
              {moment(data.lastOpened).format('LL')}
            </p>
          </div>

          <div className='flex items-center py-2'>
            <span className='w-[100px] text-[0.9em] text-gray-400 font-medium'>
              Created
            </span>
            <p className='text-gray-500 text-[0.9em] font-medium'>
              {moment(data.createAt).format('LL')}
            </p>
          </div>
        </div>

        <div className='flex justify-end items-center py-3 px-8 bg-[#E5E9F2]'>
          <div className='bg-white py-2 px-5 rounded-md text-gray-500 text-[0.9em] font-medium mr-4 shadow-sm cursor-pointer hover:text-white hover:bg-gray-600 duration-200'>
            Share
          </div>

          <div className='bg-blue-700/60 py-2 px-5 rounded-md text-white font-medium cursor-pointer hover:bg-blue-700/80 duration-200'>
            Download
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export const Share = ({ handleClose, data, open }) => {
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
              <FileIconHelper className='mr-4 text-3xl' />
              <p className='text-[0.9em] text-gray-700 font-medium'>
                {data.name}
              </p>
            </div>

            <div onClick={handleClose} className='cursor-pointer'>
              <AiOutlineClose className='text-gray-700 text-lg' />
            </div>
          </div>
        </div>

        <div className='py-2 px-8 border-b'>
          <div className='flex items-center py-2'>
            <span className='text-[0.9em] text-gray-400 font-medium mr-4'>
              To
            </span>
            <input
              type='text'
              name=''
              value=''
              placeholder='Email or Name'
              autoFocus
              className='p-1 w-full outline-none'
            />
          </div>
        </div>

        <div className='px-8 py-4'>
          <textarea
            rows=''
            cols=''
            placeholder='Add a Message'
            className='w-full min-h-[200px] outline-none'
          />
        </div>

        <div className='flex justify-end items-center py-3 px-8 bg-[#E5E9F2]'>
          <div
            onClick={handleClose}
            className='bg-white py-2 px-5 rounded-md text-gray-500 text-[0.9em] font-medium mr-4 shadow-sm cursor-pointer hover:text-white hover:bg-gray-600 duration-200'
          >
            Cancel
          </div>

          <div className='bg-blue-700/60 py-2 px-5 rounded-md text-white font-medium cursor-pointer hover:bg-blue-700/80 duration-200'>
            Share
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export const Copy = ({ handleClose, data, open }) => {
  const {
    state: { infomation },
  } = useContext(AuthContext);
  const { data: folders } = useGetData(
    `${apiURL}/folder/user/${infomation.id}`,
  );

  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby='keep-mounted-modal-title'
      aria-describedby='keep-mounted-modal-description'
    >
      <Box className='bg-white shadow-md rounded-lg w-[40%] absolute top-[50%] left-[50%] translate-x-[-50%]  translate-y-[-50%] overflow-hidden'>
        <div className='px-8 py-4'>
          <div className='flex justify-between items-center'>
            <p className='text-xl text-gray-700 font-medium'>
              Copy "{data.name}" to
            </p>

            <div onClick={handleClose} className='cursor-pointer'>
              <AiOutlineClose className='text-gray-700 text-lg' />
            </div>
          </div>
          <p className='mt-2 text-[0.8em] text-gray-500 font-medium'>
            My Folder {'>'} My sub_folder
          </p>
        </div>

        <div className='px-8'>
          <div className='border rounded-md min-h-[150px]'>
            {folders?.map((folder) => {
              return (
                <div className='flex justify-between items-center py-3 px-4 border-b cursor-pointer hover:bg-blue-800/10 duration-200'>
                  <p className='text-[0.9em] text-gray-700 font-medium'>
                    {folder.name}
                  </p>
                  <div className='group/arrow relative p-2'>
                    <span className='bg-blue-400/20 rounded-full absolute top-0 left-0 h-full w-full scale-0 group-hover/arrow:scale-100 duration-200'></span>
                    <BiRightArrow className='text-gray-700 text-sm' />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className='flex justify-end items-center py-3 mt-6 px-8 bg-[#E5E9F2]'>
          <div
            onClick={handleClose}
            className='bg-white py-2 px-5 rounded-md text-gray-500 text-[0.9em] font-medium mr-4 shadow-sm cursor-pointer hover:text-white hover:bg-gray-600 duration-200'
          >
            Cancel
          </div>

          <div className='bg-blue-700/60 py-2 px-5 rounded-md text-white font-medium cursor-pointer hover:bg-blue-700/80 duration-200'>
            Share
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export const Move = ({ handleClose, data, open }) => {
  const {
    state: { infomation },
  } = useContext(AuthContext);
  const { data: folders } = useGetData(
    `${apiURL}/folder/user/${infomation.id}`,
  );

  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby='keep-mounted-modal-title'
      aria-describedby='keep-mounted-modal-description'
    >
      <Box className='bg-white shadow-md rounded-lg w-[40%] absolute top-[50%] left-[50%] translate-x-[-50%]  translate-y-[-50%] overflow-hidden'>
        <div className='px-8 py-4'>
          <div className='flex justify-between items-center'>
            <p className='text-xl text-gray-700 font-medium'>
              Move "{data.name}" to
            </p>

            <div onClick={handleClose} className='cursor-pointer'>
              <AiOutlineClose className='text-gray-700 text-lg' />
            </div>
          </div>
          <p className='mt-2 text-[0.8em] text-gray-500 font-medium'>
            My Folder {'>'} My sub_folder
          </p>
        </div>

        <div className='px-8'>
          <div className='border rounded-md min-h-[150px]'>
            {folders?.map((folder) => {
              return (
                <div className='flex justify-between items-center py-3 px-4 border-b cursor-pointer hover:bg-blue-800/10 duration-200'>
                  <p className='text-[0.9em] text-gray-700 font-medium'>
                    {folder.name}
                  </p>
                  <div className='group/arrow relative p-2'>
                    <span className='bg-blue-400/20 rounded-full absolute top-0 left-0 h-full w-full scale-0 group-hover/arrow:scale-100 duration-200'></span>
                    <BiRightArrow className='text-gray-700 text-sm' />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className='flex justify-end items-center py-3 mt-6 px-8 bg-[#E5E9F2]'>
          <div
            onClick={handleClose}
            className='bg-white py-2 px-5 rounded-md text-gray-500 text-[0.9em] font-medium mr-4 shadow-sm cursor-pointer hover:text-white hover:bg-gray-600 duration-200'
          >
            Cancel
          </div>

          <div className='bg-blue-700/60 py-2 px-5 rounded-md text-white font-medium cursor-pointer hover:bg-blue-700/80 duration-200'>
            Share
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export const Rename = ({ handleClose, data, open, refetch }) => {
  // folder data
  const [folder, setFolder] = useState(data);
  const [loading, setLoading] = useState(false);

  // dispatch
  const handleSubmit = async (data) => {
    const { _id, name } = data;
    setLoading(true);
    try {
      await renameFolder({ id: _id, name });

      refetch();
      setLoading(false);
      handleClose();
      SuccessToast({ message: 'Folder has been renamed successfully' });
    } catch (error) {
      setLoading(false);
      handleClose();
      ErrorToast({
        message: 'Opps! Something went wrong. Please try again later',
      });
    }
  };

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
            value={folder.name}
            onChange={(e) => setFolder({ ...folder, name: e.target.value })}
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
            onClick={() => handleSubmit(folder)}
          >
            {loading ? <ImSpinner className='animate-spin' /> : 'Rename'}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export const FolderDeleteConfirm = ({ open, handleClose, data, refetch }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteFolder({ id: data._id });
      handleClose();
      refetch();
      setLoading(false);
      SuccessToast({ message: 'Folder has been deleted successfully' });
    } catch (error) {
      handleClose();
      setLoading(false);
      ErrorToast({
        message: 'Opps! Something went wrong. Please try again later',
      });
    }
  };

  return (
    <Dialog
      open={open}
      keepMounted
      aria-describedby='alert-dialog-slide-description'
    >
      <DialogTitle>
        {'Are you sure you want to delete this folder?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          If you delete this folder, all files and sub folders in this folder
          will be deleted!
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
          onClick={handleDelete}
          className='bg-blue-600/80 text-white font-medium rounded-md cursor-pointer flex justify-center items-center w-[100px] h-[35px] py-2 ml-2 hover:bg-blue-600 duration-200'
        >
          {loading ? <ImSpinner className='animate-spin' /> : 'Delete'}
        </div>
      </DialogActions>
    </Dialog>
  );
};
