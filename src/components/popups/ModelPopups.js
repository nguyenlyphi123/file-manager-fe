import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Modal,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react';
import {
  AiOutlineClose,
  AiOutlineCloudUpload,
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
import { TfiReload } from 'react-icons/tfi';
import { useSelector } from 'react-redux';
import {
  COPY,
  DELETE,
  DETAILS,
  DOWNLOAD,
  MOVE,
  RENAME,
  SHARE,
} from '../../constants/option';
import Loading from '../../parts/Loading';
import {
  copyFile,
  deleteFile,
  downloadFile,
  moveFile,
  removeFileToTrash,
  renameFile,
  restoreFile,
} from '../../services/fileController';
import {
  copyFolder,
  createFolder,
  deleteFolder,
  downloadFolder,
  getFolderDetail,
  getFolderList,
  moveFolder,
  removeFolderToTrash,
  renameFolder,
  restoreFolder,
} from '../../services/folderController';
import { uploadFile } from '../../services/gcController';
import FileIconHelper from '../../utils/helpers/FileIconHelper';
import {
  FormattedDateTime,
  convertBytesToReadableSize,
} from '../../utils/helpers/TypographyHelper';
import ErrorToast from '../toasts/ErrorToast';
import SuccessToast from '../toasts/SuccessToast';
import OverlayLoading from '../OverlayLoading';

export const NewFolder = ({ handleClose, open }) => {
  const { _id } = useSelector((state) => state.curentFolder);

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

export const UploadFile = ({ handleClose, open }) => {
  const { _id } = useSelector((state) => state.curentFolder);

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
    formData.append('folderId', _id);

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
  }, [_id, file]);

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
            <AiOutlineCloudUpload className='text-[5em] text-gray-400 mb-5' />

            <span className='text-lg text-gray-400'>
              Drag and drop a file here or click
            </span>
            <input hidden type='file' onChange={handleChange} />
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

          <div
            onClick={() => handleUpload()}
            className='bg-blue-700/60 py-2 px-5 rounded-md text-white text-[0.9em] font-medium cursor-pointer hover:bg-blue-700/80'
          >
            Upload
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
  const queryClient = useQueryClient();
  // selected folder
  const [selectedFolder, setSelectedFolder] = useState();

  const handleSelectedFolder = (folder) => {
    if (!folder) return setSelectedFolder();
    if (selectedFolder?._id === folder._id) {
      if (folder.parent_folder) {
        handleLocation(folder.parent_folder);
        return setSelectedFolder(folder.parent_folder);
      }
      return setSelectedFolder(null);
    }
    setSelectedFolder(folder);
    handleLocation(folder);
  };

  // expand folder
  const [expandFolder, setExpandFolder] = useState();
  const handleExpand = (folder) => {
    if (!folder) {
      setExpandFolder();
      return handleSelectedFolder();
    }
    handleSelectedFolder(folder);
    setExpandFolder(folder);
  };

  // get folder list
  const [isLoading, setIsLoading] = useState(false);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const getFolders = async () => {
      try {
        setIsLoading(true);
        const res = expandFolder
          ? await getFolderDetail({ id: expandFolder._id })
          : await getFolderList();
        setFolders(res.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    getFolders();
  }, [expandFolder]);

  // breadcrumb
  const [location, setLocation] = useState([]);

  const handleLocation = (folder) => {
    if (!folder) return setLocation([]);
    const index = location.findIndex((item) => item._id === folder._id);
    if (index !== -1) return setLocation(location.slice(0, index + 1));
    if (!folder.parent_folder) return setLocation([folder]);
    if (
      location.find(
        (item) => item.parent_folder?._id === folder.parent_folder?._id,
      )
    ) {
      const filteredLocation = location.filter(
        (item) => item.parent_folder?._id !== folder.parent_folder?._id,
      );
      return setLocation([...filteredLocation, folder]);
    }

    setLocation([...location, folder]);
  };

  // copy
  const copyMutation = data.type ? copyFile : copyFolder;

  const handleCopy = useMutation({
    mutationFn: () =>
      copyMutation({
        data,
        folderId: selectedFolder ? selectedFolder._id : null,
      }),
    onSuccess: () => {
      handleClose();
      SuccessToast({ message: 'Folder has been copied successfully!' });
      if (data.type) {
        queryClient.invalidateQueries(['Files']);
        queryClient.invalidateQueries(['File']);
        return;
      }
      queryClient.invalidateQueries(['Folders']);
      queryClient.invalidateQueries(['Folder']);
    },
    onError: () =>
      ErrorToast({
        message: 'Oops! Something went wrong. Please try again later!',
      }),
  });

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
              Copy "{data.name}" To{' '}
              {selectedFolder ? `"${selectedFolder.name}"` : 'Root'}
            </p>

            <div onClick={handleClose} className='cursor-pointer'>
              <AiOutlineClose className='text-gray-700 text-lg' />
            </div>
          </div>
          <p className='mt-2 text-[0.8em] text-gray-500 font-medium'>
            <span className='cursor-pointer' onClick={() => handleExpand()}>
              Root
            </span>
            {location.length !== 0 &&
              location.map((item, index) => (
                <React.Fragment key={item._id}>
                  {' > '}
                  <span
                    className='cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExpand(item);
                    }}
                  >
                    {item.name}
                  </span>
                </React.Fragment>
              ))}
          </p>
        </div>

        <div className='px-8'>
          <div className='border rounded-md '>
            {isLoading ? (
              <Loading />
            ) : (
              folders
                ?.filter((folder) => folder._id !== data._id)
                .map((folder) => {
                  return (
                    <div
                      onClick={() => {
                        handleSelectedFolder(folder);
                      }}
                      className={`flex justify-between items-center py-3 px-4 border-b cursor-pointer ${
                        selectedFolder?._id === folder._id && 'bg-blue-800/10 '
                      } hover:bg-blue-800/10 duration-200`}
                    >
                      <p className='text-[0.9em] text-gray-700 font-medium'>
                        {folder.name}
                      </p>
                      <div
                        className='group/arrow relative p-2'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExpand(folder);
                        }}
                      >
                        <span className='bg-blue-400/20 rounded-full absolute top-0 left-0 h-full w-full scale-0 group-hover/arrow:scale-100 duration-200'></span>
                        <BiRightArrow className='text-gray-700 text-sm' />
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        <div className='flex justify-end items-center py-3 mt-6 px-8 bg-[#E5E9F2]'>
          <div
            onClick={handleClose}
            className='bg-white py-2 px-5 rounded-md text-gray-500 text-[0.9em] font-medium mr-4 shadow-sm cursor-pointer hover:text-white hover:bg-gray-600 duration-200'
          >
            Cancel
          </div>

          <div
            onClick={() => handleCopy.mutate()}
            className='bg-blue-700/60 min-w-[80px] h-[37px] flex justify-center items-center py-2 px-5 rounded-md text-white text-[0.9em] font-medium cursor-pointer hover:bg-blue-700/80 duration-200'
          >
            {handleCopy.isLoading ? (
              <ImSpinner className='animate-spin' />
            ) : (
              'Copy'
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export const Move = ({ handleClose, data, open }) => {
  const queryClient = useQueryClient();

  // selected folder
  const [selectedFolder, setSelectedFolder] = useState();

  const handleSelectedFolder = (folder) => {
    if (!folder) return setSelectedFolder();
    if (selectedFolder?._id === folder._id) {
      if (folder.parent_folder) {
        handleLocation(folder.parent_folder);
        return setSelectedFolder(folder.parent_folder);
      }
      return setSelectedFolder(null);
    }
    setSelectedFolder(folder);
    handleLocation(folder);
  };

  // expand folder
  const [expandFolder, setExpandFolder] = useState();
  const handleExpand = (folder) => {
    if (!folder) {
      setExpandFolder();
      return handleSelectedFolder();
    }
    handleSelectedFolder(folder);
    setExpandFolder(folder);
  };

  // get folder list
  const [isLoading, setIsLoading] = useState(false);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const getFolders = async () => {
      try {
        setIsLoading(true);
        const res = expandFolder
          ? await getFolderDetail({ id: expandFolder._id })
          : await getFolderList();
        setFolders(res.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    getFolders();
  }, [expandFolder]);

  // breadcrumb
  const [location, setLocation] = useState([]);

  const handleLocation = (folder) => {
    if (!folder) return setLocation([]);
    const index = location.findIndex((item) => item._id === folder._id);
    if (index !== -1) return setLocation(location.slice(0, index + 1));
    if (!folder.parent_folder) return setLocation([folder]);
    if (
      location.find(
        (item) => item.parent_folder?._id === folder.parent_folder?._id,
      )
    ) {
      const filteredLocation = location.filter(
        (item) => item.parent_folder?._id !== folder.parent_folder?._id,
      );
      return setLocation([...filteredLocation, folder]);
    }

    setLocation([...location, folder]);
  };

  // move
  const moveMutation = data.type ? moveFile : moveFolder;
  const handleMove = useMutation({
    mutationFn: () =>
      moveMutation({
        data,
        folderId: selectedFolder ? selectedFolder._id : null,
      }),
    onSuccess: () => {
      handleClose();
      SuccessToast({ message: 'Folder has been moved successfully!' });
      if (data.type) {
        queryClient.invalidateQueries(['file']);
        queryClient.invalidateQueries(['files']);
      }
      queryClient.invalidateQueries(['folder']);
      queryClient.invalidateQueries(['folders']);
    },
    onError: () =>
      ErrorToast({
        message: 'Oops! Something went wrong. Please try again later!',
      }),
  });

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
              Move "{data.name}" To{' '}
              {selectedFolder ? `"${selectedFolder.name}"` : 'Root'}
            </p>

            <div onClick={handleClose} className='cursor-pointer'>
              <AiOutlineClose className='text-gray-700 text-lg' />
            </div>
          </div>
          <p className='mt-2 text-[0.8em] text-gray-500 font-medium'>
            <span className='cursor-pointer' onClick={() => handleExpand()}>
              Root
            </span>
            {location.length !== 0 &&
              location.map((item, index) => (
                <React.Fragment key={item._id}>
                  {' > '}
                  <span
                    className='cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExpand(item);
                    }}
                  >
                    {item.name}
                  </span>
                </React.Fragment>
              ))}
          </p>
        </div>

        <div className='px-8'>
          <div className='border rounded-md '>
            {isLoading ? (
              <Loading />
            ) : (
              folders
                ?.filter((folder) => folder._id !== data._id)
                .map((folder) => {
                  return (
                    <div
                      onClick={() => {
                        handleSelectedFolder(folder);
                      }}
                      className={`flex justify-between items-center py-3 px-4 border-b cursor-pointer ${
                        selectedFolder?._id === folder._id && 'bg-blue-800/10 '
                      } hover:bg-blue-800/10 duration-200`}
                    >
                      <p className='text-[0.9em] text-gray-700 font-medium'>
                        {folder.name}
                      </p>
                      <div
                        className='group/arrow relative p-2'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExpand(folder);
                        }}
                      >
                        <span className='bg-blue-400/20 rounded-full absolute top-0 left-0 h-full w-full scale-0 group-hover/arrow:scale-100 duration-200'></span>
                        <BiRightArrow className='text-gray-700 text-sm' />
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        <div className='flex justify-end items-center py-3 mt-6 px-8 bg-[#E5E9F2]'>
          <div
            onClick={handleClose}
            className='bg-white py-2 px-5 rounded-md text-gray-500 text-[0.9em] font-medium mr-4 shadow-sm cursor-pointer hover:text-white hover:bg-gray-600 duration-200'
          >
            Cancel
          </div>

          <div
            onClick={() => handleMove.mutate()}
            className='bg-blue-700/60 min-w-[80px] h-[37px] flex justify-center items-center py-2 px-5 rounded-md text-white text-[0.9em] font-medium cursor-pointer hover:bg-blue-700/80 duration-200'
          >
            {handleMove.isLoading ? (
              <ImSpinner className='animate-spin' />
            ) : (
              'Move'
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

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
      }
      queryClient.invalidateQueries(['folders']);
      queryClient.invalidateQueries(['folder']);
    },
    onError: () => {
      handleClose();
      ErrorToast({
        message: 'Opps! Something went wrong. Please try again later',
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

export const FolderDeleteConfirm = ({ open, handleClose, data }) => {
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
        return;
      }
      queryClient.invalidateQueries(['folders']);
      queryClient.invalidateQueries(['folder']);
    },
    onError: () => {
      handleClose();
      ErrorToast({
        message: 'Opps! Something went wrong. Please try again later',
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

export const RemovedThreeDotsDropDown = ({ className, data }) => {
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
      queryClient.invalidateQueries(['folder-recovery']);
      queryClient.invalidateQueries(['file-recovery']);
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
      queryClient.invalidateQueries(['folder-recovery']);
      queryClient.invalidateQueries(['file-recovery']);
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

export const FolderDownloadConfirm = ({ open, handleClose, data }) => {
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
          'Opps! Something went wrong while preparing data for download folder. Please try again later!',
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
