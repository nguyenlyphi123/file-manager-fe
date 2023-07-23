import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { BsDot } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

import { starFolder, unstarFolder } from '../../services/folderController';
import {
  downloadFile,
  starFile,
  unstarFile,
} from '../../services/fileController';

import FileIconHelper from '../../utils/helpers/FileIconHelper';
import OptionHelper from '../../utils/helpers/OptionHelper';
import { ThreeDotsDropDown } from '../popups/ModelPopups';
import {
  FormattedDate,
  Truncate,
  convertBytesToReadableSize,
} from '../../utils/helpers/TypographyHelper';

import SuccessToast from '../toasts/SuccessToast';
import ErrorToast from '../toasts/SuccessToast';
import { Tooltip } from '@mui/material';

export default function MediumCard({ data, onClick, isFolder = true }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // handle show threedots dropdown
  const [isModal, setIsModal] = useState(false);

  // handle select option
  const [option, setOption] = useState('');

  const handleSelectOption = (option) => {
    setOption(option);
    setIsModal(true);
  };

  const handleClose = () => {
    setOption('');
    setIsModal(false);
  };

  // delete confirm
  const [isDeleteShow, setIsDeleteShow] = useState(false);

  const handleCancelDelete = () => {
    setIsDeleteShow(false);
  };

  const handleShowDelete = () => {
    setIsDeleteShow(true);
  };

  // star folder
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
      queryClient.invalidateQueries(['files']);
      queryClient.invalidateQueries(['file']);
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
        <div className='flex-col relative bg-white border rounded-md p-4 cursor-pointer group/card'>
          <div className='absolute top-2 right-2 p-2 flex justify-center items-center group/threedots'>
            <ThreeDotsDropDown
              handleSelectOption={handleSelectOption}
              handleShowDelete={handleShowDelete}
              className='rounded-[50%] h-[18px] text-gray-600'
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
            className='h-full w-full'
          >
            <div className='flex flex-col'>
              <div className='flex items-center'>
                <FileIconHelper
                  className='text-3xl mr-3'
                  type={data.type ? data.type : null}
                />

                <div className='relative'>
                  <p className='text-[0.9em] text-gray-600 font-semibold'>
                    {Truncate(data.name, 15)}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStar.mutate(data._id);
                      }}
                    />
                  )}
                </div>
              </div>

              <div className='mt-1'>
                <p className='flex items-center text-[0.7em] text-gray-400'>
                  {isFolder ? (
                    <>
                      Last open <BsDot className='text-xl' />{' '}
                      {FormattedDate(data.lastOpened)}{' '}
                    </>
                  ) : (
                    <>
                      {FormattedDate(data.createAt)}{' '}
                      <BsDot className='text-xl' />{' '}
                      {convertBytesToReadableSize(data.size)}
                      <BsDot className='text-xl' />{' '}
                      {data.parent_folder
                        ? Truncate(data.parent_folder?.name, 10)
                        : 'Root'}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Tooltip>
    </>
  );
}
