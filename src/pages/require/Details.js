import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Modal,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import RequireModal from 'components/popups/Require';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';
import { REQ_STATUS_DONE, REQ_STATUS_EXPIRED } from 'constants/constants';
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AiOutlineClose, AiOutlineCloudUpload } from 'react-icons/ai';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { uploadFile } from 'services/gcController';
import { deleteRequire, getRequireDetails } from 'services/requireController';
import FileIconHelper from 'utils/helpers/FileIconHelper';
import { isAuthor, isOwner, renderBottomColor } from 'utils/helpers/Helper';
import { Truncate, calcTimeRemain } from 'utils/helpers/TypographyHelper';
import DetailsSkeleton from './DetailsSkeleton';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { pushLocation } from 'redux/slices/location';
import CustomAvatar from 'components/CustomAvatar';

// const RenderRows = ({ label, value, folderData, clickable = false }) => {
//   const dispatch = useDispatch();

//   const navigate = useNavigate();

//   const handleFolderClick = (val) => {
//     const data = {
//       parent: val.parent_folder ? val.parent_folder._id : '',
//       name: val.name,
//       _id: val._id,
//       href: val.href,
//     };
//     dispatch(pushLocation(data));
//     navigate(val.href, { state: { folder: val } });
//   };

//   return (
//     <div className='flex items-center flex-wrap py-2'>
//       <span className='w-[100px] text-[0.9em] text-gray-400 font-medium'>
//         {label}:
//       </span>
//       {clickable ? (
//         <p
//           className='text-gray-500 text-[0.9em] font-medium cursor-pointer hover:text-blue-700'
//           onClick={() =>
//             handleFolderClick({
//               ...folderData,
//               href: `/folders/${folderData?._id}`,
//             })
//           }
//         >
//           {value}
//         </p>
//       ) : (
//         <p className='text-gray-500 text-[0.9em] font-medium'>{value}</p>
//       )}
//     </div>
//   );
// };

function Details({ open, handleClose, data }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const { _id, expired, owner } = useSelector((state) => state.curentFolder);

  const [openEditRequire, setOpenEditRequire] = useState(false);
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const handleOpenEditRequire = () => {
    setOpenEditRequire(true);
  };

  const handleCloseEditRequire = () => {
    setOpenEditRequire(false);
  };

  const isExpired = useCallback(
    (time) => calcTimeRemain(time) === 'Expired',
    [],
  );

  const processStatus = useCallback(
    (arr) => {
      if (arr?.status === REQ_STATUS_DONE) return REQ_STATUS_DONE;

      if (isExpired(arr?.endDate)) return REQ_STATUS_EXPIRED;

      if (user.id === arr?.author._id) return arr?.status;

      const mem = arr?.to?.find((mem) => mem.info._id === user.id);
      return mem?.status;
    },
    [user.id, isExpired],
  );

  const isDone = useMemo(() => {
    const isMember = data?.to?.find((mem) => mem.info._id === user.id);

    if (!isMember) return false;

    return isMember.sent;
  }, [data, user]);

  // handle upload file
  const handleUpload = useCallback(
    async (file) => {
      if (!file) return ErrorToast({ message: 'Please select file' });

      if (!isOwner(user.id, owner) && expired)
        return ErrorToast({ message: 'This folder has expired' });

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
          message:
            error.response?.data?.message ||
            'Something went wrong, please try again',
        });
        setLoading(false);
        setFile();
      }
    },
    [_id, handleClose, queryClient, user.id, owner, expired],
  );

  // handle folder click
  const handleFolderClick = (val) => {
    const data = {
      parent: val.parent_folder ? val.parent_folder._id : '',
      name: val.name,
      _id: val._id,
      href: val.href,
    };
    dispatch(pushLocation(data));
    navigate(val.href, { state: { folder: val } });
  };

  const deleteRequireMutation = useMutation({
    mutationFn: () => deleteRequire(data?._id),
    onSuccess: () => {
      handleClose();
      queryClient.invalidateQueries('requires');
      SuccessToast({ message: 'Delete require successfully' });
    },
    onError: (error) => {
      ErrorToast({
        message:
          error.response?.data?.message ||
          'Something went wrong, please try again',
      });
    },
  });

  // handle drop
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFile(acceptedFiles[0]);

      handleUpload(acceptedFiles[0]);
    },
    [handleUpload],
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // get require details
  const { data: require, isLoading: loadingRequireDetails } = useQuery({
    queryKey: ['require', { id: data?._id }],
    queryFn: (params) => {
      const { id } = params.queryKey[1];

      if (!id) return;

      return getRequireDetails(id);
    },
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: 3000,
  });

  return (
    <>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby='detail-modal-title'
        aria-describedby='detail-modal-description'
      >
        <Box className='bg-white shadow-md rounded-lg w-[60%] min-h-[400px] absolute top-[50%] left-[50%] translate-x-[-50%]  translate-y-[-50%] overflow-hidden py-5 px-7'>
          <div className='flex justify-end items-center'>
            <div onClick={() => handleClose()} className='cursor-pointer z-10'>
              <AiOutlineClose className='text-gray-700 text-lg' />
            </div>
          </div>

          {loadingRequireDetails ? (
            <DetailsSkeleton />
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={7}>
                  <Typography
                    variant='p'
                    className='uppercase text-gray-800 text-xl font-semibold'
                    sx={{ whiteSpace: 'pre-wrap' }}
                  >
                    {require?.data?.title}
                  </Typography>
                  <div className='mt-5 mb-3 flex flex-col'>
                    <Typography
                      variant='p'
                      className='text-sm text-gray-800 font-semibold'
                    >
                      Message
                    </Typography>
                    <Typography
                      variant='p'
                      className='text-gray-700 text-[14px]'
                    >
                      {require?.data?.message}
                    </Typography>
                  </div>
                  <div className='mb-3 flex flex-col'>
                    <Typography
                      variant='p'
                      className='text-sm text-gray-800 font-semibold'
                    >
                      Note
                    </Typography>
                    <Typography
                      variant='p'
                      className='text-gray-700 text-[14px] mt-1'
                    >
                      {require?.data?.note ? require?.data?.note : 'No note'}
                    </Typography>
                  </div>
                  <Divider
                    textAlign='left'
                    className='text-[13px] text-gray-500'
                    sx={{ my: 2 }}
                  >
                    File Requiments
                  </Divider>
                  <div className='mb-3 flex items-center'>
                    <Typography
                      variant='p'
                      className='text-sm text-gray-800 font-semibold w-[60px]'
                    >
                      Location
                    </Typography>
                    <Link
                      to={`/folders/${require?.data?.folder?._id}`}
                      className='text-blue-600 text-[14px] mt-1 ml-1'
                    >
                      {require?.data?.folder?.name}
                    </Link>
                  </div>
                  <div className='mb-2 flex'>
                    <Typography
                      variant='p'
                      className='text-sm text-gray-800 font-semibold w-[60px]'
                    >
                      File Type
                    </Typography>

                    <FileIconHelper
                      type={require?.data?.file_type}
                      className='text-2xl ml-2'
                    />
                  </div>
                  <div className='mb-2'>
                    <Typography
                      variant='p'
                      className='text-sm text-gray-800 font-semibold'
                    >
                      Max Size
                    </Typography>
                    <Typography
                      variant='p'
                      className='text-gray-700 text-[14px] mt-1'
                      sx={{ ml: 1 }}
                    >
                      {require?.data?.max_size} MB
                    </Typography>
                  </div>

                  {isAuthor(user.id, require?.data?.author?._id) && (
                    <>
                      <Divider
                        textAlign='left'
                        className='text-[13px] text-gray-500'
                        sx={{ my: 2 }}
                      >
                        Process
                      </Divider>
                      <Box>
                        {require?.data?.to?.map((mem) => (
                          <Chip
                            key={mem.info._id}
                            avatar={
                              <CustomAvatar
                                height={25}
                                width={25}
                                text={mem?.info?.name}
                                image={mem?.info?.image}
                              />
                            }
                            label={mem.info.name}
                            className='my-1 mr-1'
                            color={mem.sent ? 'success' : 'error'}
                            variant='outlined'
                            sx={{ cursor: 'pointer', pl: 0.5 }}
                          />
                        ))}
                      </Box>
                    </>
                  )}
                </Grid>

                <Grid item xs={12} sm={5}>
                  <div className='mb-2'>
                    <Typography
                      variant='p'
                      className='text-sm text-gray-800 font-semibold'
                    >
                      Status
                    </Typography>
                    <Typography
                      variant='p'
                      className={`uppercase text-[14px] mt-1`}
                      sx={{
                        ml: 1,
                        color: `${renderBottomColor(
                          processStatus(require?.data),
                        )}`,
                      }}
                    >
                      {processStatus(require?.data)}
                    </Typography>
                  </div>

                  <div>
                    <Accordion
                      sx={{
                        border: '1px solid #E5E9F2',
                        boxShadow: 'none',
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<MdKeyboardArrowDown />}
                        aria-controls='panel1a-content'
                        id='panel1a-header'
                      >
                        <Typography
                          variant='p'
                          className='text-md text-gray-800 font-semibold'
                        >
                          Details
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container className='mb-3'>
                          <Grid item xs={12} sm={4}>
                            <Typography
                              variant='p'
                              className='text-sm text-gray-700 font-semibold'
                            >
                              Assignee
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={8}>
                            {require?.data?.to?.map((mem) => (
                              <div
                                key={mem._id}
                                className='flex items-center my-2'
                              >
                                <CustomAvatar
                                  height={25}
                                  width={25}
                                  text={mem?.info?.name}
                                  image={mem?.info?.image}
                                />
                                <Typography
                                  variant='p'
                                  className='text-gray-700 text-[14px]'
                                  sx={{ ml: 1 }}
                                >
                                  {mem?.info?.name}
                                </Typography>
                              </div>
                            ))}
                          </Grid>
                        </Grid>

                        <Grid container className='mb-3'>
                          <Grid item xs={12} sm={4}>
                            <Typography
                              variant='p'
                              className='text-sm text-gray-700 font-semibold'
                            >
                              Reporter
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={8}>
                            {isAuthor(user.id, require?.data?.author?._id) ? (
                              <Typography
                                variant='p'
                                className='text-gray-700 text-[14px]'
                              >
                                Me
                              </Typography>
                            ) : (
                              <div className='flex items-center'>
                                <Avatar sx={{ height: 25, width: 25, mr: 1 }} />
                                <Typography
                                  variant='p'
                                  className='text-gray-700 text-[14px]'
                                >
                                  {require?.data?.author?.info?.name}
                                </Typography>
                              </div>
                            )}
                          </Grid>
                        </Grid>

                        <Grid container className='mb-3'>
                          <Grid item xs={12} sm={4}>
                            <Typography
                              variant='p'
                              className='text-sm text-gray-700 font-semibold'
                            >
                              Folder
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={8}>
                            <Typography
                              variant='p'
                              className='text-gray-700 text-[14px] cursor-pointer hover:text-blue-700'
                              onClick={() =>
                                handleFolderClick({
                                  ...require?.data?.folder,
                                  href: `/folders/${require?.data?.folder?._id}`,
                                })
                              }
                            >
                              {require?.data?.folder?.name}
                            </Typography>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </div>

                  <div className='flex flex-col mt-3'>
                    <Typography
                      variant='p'
                      className='text-gray-600 text-[13px]'
                    >
                      Begin at{' '}
                      {moment(require?.data?.startDate).format(
                        'DD/MM/YYYY HH:mm',
                      )}
                    </Typography>

                    <Typography
                      variant='p'
                      className='text-gray-600 text-[13px]'
                    >
                      End at{' '}
                      {moment(require?.data?.endDate).format(
                        'DD/MM/YYYY HH:mm',
                      )}
                    </Typography>
                  </div>

                  {!isExpired(require?.data?.endDate) &&
                    (!isDone ||
                      isOwner(user.id, require?.owner?.info?._id)) && (
                      <div className='py-3'>
                        <Button
                          component='label'
                          sx={{
                            backgroundColor: '#fff',
                            border: '2px dotted #ababab',
                            px: 4,
                          }}
                          className='rounded-md w-full h-[150px] flex flex-col justify-center items-center'
                          {...getRootProps()}
                        >
                          <AiOutlineCloudUpload className='text-[3em] text-gray-400 mb-3' />

                          <span className='text-center text-md text-gray-400'>
                            Drag and drop a file here or click
                          </span>
                        </Button>
                        <input
                          hidden
                          type='file'
                          accept={`.${require?.data?.file_type}`}
                          {...getInputProps()}
                        />
                        {file && (
                          <>
                            <div className='flex justify-between items-center mt-5 relative'>
                              <div className='flex items-center w-full'>
                                <FileIconHelper
                                  type={
                                    file &&
                                    file.name?.substring(
                                      file.name?.lastIndexOf('.') + 1,
                                    )
                                  }
                                  className='text-2xl'
                                />
                                <p className='text-[0.9em] text-gray-600 ml-3 whitespace-pre-wrap'>
                                  {Truncate(file.name, 35)}
                                </p>
                              </div>
                              <div
                                onClick={() => setFile(null)}
                                className='cursor-pointer'
                              >
                                <AiOutlineClose className='text-md text-orange-700' />
                              </div>
                            </div>

                            {loading && (
                              <Box
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <Box sx={{ width: '100%', mr: 1, mt: 2 }}>
                                  <LinearProgress />
                                </Box>
                              </Box>
                            )}
                          </>
                        )}
                      </div>
                    )}
                </Grid>
              </Grid>

              <div className='flex justify-end items-center gap-2 mt-5'>
                {isAuthor(user.id, require?.data?.author?._id) && (
                  <>
                    <Button
                      variant='contained'
                      color='error'
                      size='small'
                      sx={{ textTransform: 'none' }}
                      disabled={deleteRequireMutation.isLoading}
                      onClick={() => deleteRequireMutation.mutate()}
                    >
                      Delete
                    </Button>
                    <Button
                      variant='contained'
                      size='small'
                      sx={{ textTransform: 'none' }}
                      onClick={handleOpenEditRequire}
                    >
                      Edit
                    </Button>
                  </>
                )}

                {openEditRequire && (
                  <RequireModal
                    open={openEditRequire}
                    handleClose={handleCloseEditRequire}
                    data={require?.data}
                    type='edit'
                  />
                )}
              </div>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default Details;
