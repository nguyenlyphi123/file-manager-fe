import React, { useCallback, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { BsDot } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { starFolder, unstarFolder } from 'services/folderController';
import { downloadFile, starFile, unstarFile } from 'services/fileController';

import FileIconHelper from 'utils/helpers/FileIconHelper';
import OptionHelper from 'utils/helpers/OptionHelper';
import {
  FormattedDate,
  Truncate,
  convertBytesToReadableSize,
} from 'utils/helpers/TypographyHelper';

import { ThreeDotsDropdown } from '../popups/ModelPopups';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';

import { Tooltip } from '@mui/material';

const LargeCard = ({ data, onClick, isFolder = true }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isModal, setIsModal] = useState(false);
  const [option, setOption] = useState('');
  const [isDeleteShow, setIsDeleteShow] = useState(false);

  const handleSelectOption = (option) => {
    setOption(option);
    setIsModal(true);
  };

  const handleClose = () => {
    setOption('');
    setIsModal(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteShow(false);
  };

  const handleShowDelete = () => {
    setIsDeleteShow(true);
  };

  const handleStarAction = isFolder ? starFolder : starFile;
  const handleUnstarAction = isFolder ? unstarFolder : unstarFile;

  const handleStar = useMutation({
    mutationFn: (id) => handleStarAction({ id }),
    onSuccess: () => {
      SuccessToast({
        message: `${
          isFolder ? 'Folder' : 'File'
        } has been starred successfully`,
      });
      if (isFolder) {
        queryClient.invalidateQueries(['folders']);
        queryClient.invalidateQueries(['folder']);
        return;
      }
      queryClient.invalidateQueries(['file']);
      queryClient.invalidateQueries(['files']);
    },
    onError: () => {
      ErrorToast({
        message: 'Opps! Something went wrong. Please try again later',
      });
    },
  });

  const handleUnstar = useMutation({
    mutationFn: (id) => handleUnstarAction({ id }),
    onSuccess: () => {
      SuccessToast({
        message: `${
          isFolder ? 'Folder' : 'File'
        } has been unstarred successfully`,
      });
      if (isFolder) {
        queryClient.invalidateQueries(['folders']);
        queryClient.invalidateQueries(['folder']);
        return;
      }
      queryClient.invalidateQueries(['files']);
      queryClient.invalidateQueries(['file']);
    },
    onError: () => {
      ErrorToast({
        message: 'Opps! Something went wrong. Please try again later',
      });
    },
  });

  // handle download
  const handleFileClick = useCallback(async () => {
    try {
      const response = await downloadFile({ data });

      const contentType =
        response?.headers?.get('content-type') || 'application/octet-stream';

      // Create a blob from the response
      const blob = new Blob([response], {
        type: contentType,
      });

      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');

      link.href = url;
      link.download = `${data.name}.${data.type}`;
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      ErrorToast({
        message:
          'Opps! Something went wrong while preparing data for download folder. Please try again later!',
      });
    }
  }, [data]);

  return (
    <>
      <OptionHelper
        type={option}
        handleClose={handleClose}
        data={data}
        open={isModal}
        deleteShow={isDeleteShow}
        handleCancelDelete={handleCancelDelete}
      />

      <Tooltip title={data.name} placement='top'>
        <div className='group/card flex-col bg-white h-[180px] border rounded-md relative cursor-pointer'>
          <div className='absolute top-2 right-2 p-2 flex justify-center items-center group/threedots'>
            <ThreeDotsDropdown
              handleSelectOption={handleSelectOption}
              handleShowDelete={handleShowDelete}
              className='rounded-[50%] h-[18px] text-gray-600'
              data={data}
            />
          </div>

          <div
            onClick={() => {
              if (isFolder) {
                onClick({ ...data, href: `/folders/${data._id}` });
                navigate(`/folders/${data._id}`, { state: { folder: data } });
              } else {
                handleFileClick();
              }
            }}
            className='w-full h-full flex items-center justify-center flex-col'
          >
            <FileIconHelper className='text-6xl mb-4' type={data.type} />

            <div className='relative'>
              <p className='text-[0.9em] text-gray-600 font-semibold'>
                {Truncate(data.name, 20)}
              </p>
              {data.isStar ? (
                <AiFillStar
                  className='text-[#8AA3FF] text-xl font-semibold absolute top-0 right-0 translate-x-[35px]'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnstar.mutate(data._id);
                  }}
                />
              ) : (
                <AiFillStar
                  className='text-gray-400 text-xl font-semibold absolute top-0 right-0 translate-x-[35px] hidden group-hover/card:block hover/card:text-[#8AA3FF] duration-200'
                  onClick={(event) => {
                    event.stopPropagation();
                    handleStar.mutate(data._id);
                  }}
                />
              )}
            </div>

            <p className='flex items-center text-[0.8em] text-gray-400 mt-1'>
              {isFolder ? (
                <>
                  Last open <BsDot className='text-xl' />{' '}
                  {FormattedDate(data.lastOpened)}
                </>
              ) : (
                <>
                  {FormattedDate(data.createAt)} <BsDot className='text-xl' />{' '}
                  {convertBytesToReadableSize(data.size)}
                </>
              )}
            </p>
          </div>
        </div>
      </Tooltip>
    </>
  );
};

export default LargeCard;
