import { Avatar, Box, Chip, Grid, Modal } from '@mui/material';
import { UploadFile } from 'components/popups/UploadFile';
import moment from 'moment';
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { pushLocation } from 'redux/slices/location';
import { isAuthor } from 'utils/helpers/Helper';
import { FormattedDateTime } from 'utils/helpers/TypographyHelper';
import RequireModal from 'components/popups/Require';

const RenderRows = ({ label, value, folderData, clickable = false }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

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

  return (
    <div className='flex items-center flex-wrap py-2'>
      <span className='w-[100px] text-[0.9em] text-gray-400 font-medium'>
        {label}:
      </span>
      {clickable ? (
        <p
          className='text-gray-500 text-[0.9em] font-medium cursor-pointer hover:text-blue-700'
          onClick={() =>
            handleFolderClick({
              ...folderData,
              href: `/folders/${folderData?._id}`,
            })
          }
        >
          {value}
        </p>
      ) : (
        <p className='text-gray-500 text-[0.9em] font-medium'>{value}</p>
      )}
    </div>
  );
};

function Details({ open, handleClose, data }) {
  const user = useSelector((state) => state.user);

  const [openUploadFile, setOpenUploadFile] = useState(false);
  const [openEditRequire, setOpenEditRequire] = useState(false);

  const handleOpenUploadFile = () => {
    setOpenUploadFile(true);
  };

  const handleCloseUploadFile = () => {
    setOpenUploadFile(false);
  };

  const handleOpenEditRequire = () => {
    setOpenEditRequire(true);
  };

  const handleCloseEditRequire = () => {
    setOpenEditRequire(false);
  };

  const countProcess = (require) => {
    return require?.to?.reduce((acc, cur) => {
      if (cur.sent === true) return acc + 1;

      return acc;
    }, 0);
  };

  return (
    <>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby='detail-modal-title'
        aria-describedby='detail-modal-description'
      >
        <Box className='bg-white shadow-md rounded-lg w-[50%] absolute top-[50%] left-[50%] translate-x-[-50%]  translate-y-[-50%] overflow-hidden'>
          <div className='border-b'>
            <div className='flex justify-between items-center py-4 px-8'>
              <p className='text-[0.9em] text-gray-700 font-medium'>
                {data?.title}
              </p>

              <div onClick={handleClose} className='cursor-pointer'>
                <AiOutlineClose className='text-gray-700 text-lg' />
              </div>
            </div>
          </div>

          <div className='py-6 px-8'>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <RenderRows
                  label={'Author'}
                  value={
                    data?.author._id === user.id
                      ? 'Me'
                      : data?.author?.info?.name
                  }
                />

                <RenderRows
                  label={'Folder'}
                  value={data?.folder.name}
                  folderData={data?.folder}
                  clickable
                />

                <RenderRows label={'File Type'} value={data?.file_type} />

                <RenderRows label={'Max Size'} value={`${data?.max_size} MB`} />

                <RenderRows
                  label={'Process'}
                  value={`${countProcess(data)}/${data?.to?.length}`}
                />

                {isAuthor(user.id, data?.author?._id) && (
                  <Box>
                    {data?.to?.map((mem) => (
                      <Chip
                        key={mem._id}
                        avatar={<Avatar />}
                        label={mem.info.info.name}
                        className='my-1 mr-1'
                        color={mem.sent ? 'success' : 'error'}
                        variant='outlined'
                      />
                    ))}
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <RenderRows label={'Message'} value={data?.message} />

                <RenderRows label={'Note'} value={data?.note} />

                <RenderRows
                  label={'Start'}
                  value={moment(data?.startDate).format('DD-MM-YYYY HH:mm')}
                />

                <RenderRows
                  label={'End'}
                  value={moment(data?.endDate).format('DD-MM-YYYY HH:mm')}
                />

                <RenderRows
                  label={'Modified'}
                  value={FormattedDateTime(data?.modifiedAt)}
                />
              </Grid>
            </Grid>
          </div>

          <div className='flex justify-end items-center py-3 px-8 bg-[#E5E9F2]'>
            {isAuthor(user.id, data?.author?._id) && (
              <div
                onClick={handleOpenEditRequire}
                className='bg-gray-700/60 py-2 px-5 mr-2 rounded-md text-white text-[13px] font-medium cursor-pointer hover:bg-gray-700/80'
              >
                Edit
              </div>
            )}

            <div
              onClick={handleOpenUploadFile}
              className='bg-blue-700/60 py-2 px-5 rounded-md text-white text-[13px] font-medium cursor-pointer hover:bg-blue-700/80'
            >
              Upload File
            </div>
            <UploadFile
              open={openUploadFile}
              handleClose={handleCloseUploadFile}
            />
            {openEditRequire && (
              <RequireModal
                open={openEditRequire}
                handleClose={handleCloseEditRequire}
                data={data}
              />
            )}
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default Details;
