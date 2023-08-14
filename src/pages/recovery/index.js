import React, { useMemo, useState } from 'react';

import { Checkbox, DatePicker } from 'rsuite';
import FileIconHelper from '../../utils/helpers/FileIconHelper';

import { Tooltip } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BsTrash } from 'react-icons/bs';
import { TfiReload } from 'react-icons/tfi';
import 'rsuite/dist/rsuite-no-reset.min.css';

import Loading from 'parts/Loading';

import {
  deleteMultipleFile,
  getRemovedFile,
  restoreMultipleFile,
} from 'services/fileController';
import {
  deleteMultipleFolder,
  getRemovedFolder,
  restoreMultipleFolder,
} from 'services/folderController';

import {
  FormattedDateTime,
  Truncate,
  convertBytesToReadableSize,
} from 'utils/helpers/TypographyHelper';

import EmptyData from 'components/EmptyData';
import { RemovedThreeDotsDropdown } from 'components/popups/ModelPopups';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';

export default function Recovery() {
  const queryClient = useQueryClient();

  const { data: folders, isLoading: folderLoading } = useQuery({
    queryKey: ['folder-recovery'],
    queryFn: () => getRemovedFolder(),
    retry: 3,
  });

  const { data: files, isLoading: fileLoading } = useQuery({
    queryKey: ['file-recovery'],
    queryFn: () => getRemovedFile(),
    retry: 3,
  });

  const isItems = useMemo(() => {
    return folders?.data?.length > 0 || files?.data?.length > 0
      ? {
          item: true,
          length: folders?.data?.length + files?.data?.length,
        }
      : {
          item: false,
          length: 0,
        };
  }, [folders, files]);

  // checked list item
  const [checkedListItem, setCheckedListItem] = useState([]);

  const handleCheckedListItem = (data) => {
    if (checkedListItem?.includes(data)) {
      setCheckedListItem(
        checkedListItem.filter((item) => item._id !== data._id),
      );
      return;
    }
    setCheckedListItem([...checkedListItem, data]);
  };

  const handleSelectAll = () => {
    if (checkedListItem.length === isItems.length) {
      setCheckedListItem([]);
      return;
    }
    setCheckedListItem([
      ...folders?.data?.map((folder) => folder),
      ...files?.data?.map((file) => file),
    ]);
  };

  // recovery
  const generateFolderAndFileLists = (items) => {
    const folderList = items
      .filter((item) => !item.type)
      .map((item) => ({
        ...item,
        parent_folder: item.parent_folder ? item.parent_folder._id : null,
      }));

    const fileList = items
      .filter((item) => !!item.type)
      .map((item) => ({
        ...item,
        parent_folder: item.parent_folder ? item.parent_folder._id : null,
      }));

    return { folderList, fileList };
  };

  const multipleRecoveryMutation = useMutation({
    mutationFn: async () => {
      const { folderList, fileList } =
        generateFolderAndFileLists(checkedListItem);

      return Promise.all([
        folderList.length > 0 && restoreMultipleFolder(folderList),
        fileList.length > 0 && restoreMultipleFile(fileList),
      ]);
    },
    onSuccess: () => {
      SuccessToast({ message: 'Items have been recovered successfully' });
      queryClient.invalidateQueries('folder-recovery');
      queryClient.invalidateQueries('file-recovery');
      setCheckedListItem([]);
    },
    onError: () => {
      ErrorToast({
        message: 'Opps! Something went wrong. Please try again later',
      });
    },
  });

  const multipleDeleteMutation = useMutation({
    mutationFn: async () => {
      const { folderList, fileList } =
        generateFolderAndFileLists(checkedListItem);

      return Promise.all([
        folderList.length > 0 && deleteMultipleFolder(folderList),
        fileList.length > 0 && deleteMultipleFile(fileList),
      ]);
    },
    onSuccess: () => {
      SuccessToast({ message: 'Items have been deleted successfully' });
      queryClient.invalidateQueries('folder-recovery');
      queryClient.invalidateQueries('file-recovery');
      setCheckedListItem([]);
    },
    onError: () => {
      ErrorToast({
        message: 'Opps! Something went wrong. Please try again later',
      });
    },
  });

  if (folderLoading || fileLoading) return <Loading />;

  return (
    <div className='min-h-[calc(100vh-142px)] py-5 px-7 tracking-wide'>
      <div className='text-[20px] text-gray-600 font-bold'>Recovery</div>

      {isItems.item ? (
        <div className='mt-5 flex'>
          <div className='w-3/12'>
            <div className='p-2'>
              <div>
                <p className='text-[0.9em] text-gray-500 font-medium'>From</p>
                <DatePicker
                  className='w-full mt-1'
                  // value=''
                  placeholder='Select Date'
                  format='dd/MMM/yyyy'
                />
              </div>

              <div className='mt-3'>
                <p className='text-[0.9em] text-gray-500 font-medium'>To</p>
                <DatePicker
                  className='w-full mt-1'
                  // value=''
                  placeholder='Select Date'
                  format='dd/MMM/yyyy'
                />
              </div>

              <div className='mt-3'>
                <p className='text-[0.8em] text-blue-500 font-medium cursor-pointer'>
                  Reset Filter
                </p>
              </div>
            </div>
          </div>

          <div className='w-9/12 p-2 pt-0'>
            <table className='w-full'>
              <thead>
                <tr className='text-[0.9em] text-gray-500'>
                  <th>
                    <Checkbox
                      checked={
                        checkedListItem.length === isItems.length ? true : false
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className='text-left font-semibold pb-1'>Name</th>
                  <th className='text-left font-semibold pb-1 w-[100px]'>
                    Size
                  </th>
                  <th className='text-left font-semibold pb-1 w-[200px]'>
                    Deleted At
                  </th>
                  <th className='flex justify-center w-full min-w-[80px]'>
                    {checkedListItem.length > 0 && (
                      <div className='flex justify-around w-[80px]'>
                        <Tooltip title='Delete' placement='top'>
                          <button
                            onClick={() => multipleDeleteMutation.mutate()}
                            className={`text-center flex justify-center items-center text-white h-[30px] px-2 bg-gray-600  rounded-md cursor-pointer ${'hover:bg-red-500'} duration-200`}
                          >
                            <BsTrash />
                          </button>
                        </Tooltip>

                        <Tooltip title='Recovery' placement='top'>
                          <button
                            onClick={() => multipleRecoveryMutation.mutate()}
                            className={`text-center flex justify-center items-center text-white h-[30px] px-2 bg-gray-600  rounded-md cursor-pointer ${'hover:bg-red-500'} duration-200`}
                          >
                            <TfiReload />
                          </button>
                        </Tooltip>
                      </div>
                    )}
                  </th>
                </tr>
              </thead>

              {folders?.data?.map((folder) => {
                return (
                  <tbody key={folder._id} className='bg-white'>
                    <tr className='cursor-pointer border'>
                      <td className='p-4 w-[65px] text-center'>
                        <Checkbox
                          checked={
                            checkedListItem.find(
                              (item) => item._id === folder._id,
                            )
                              ? true
                              : false
                          }
                          onChange={(_, checked) =>
                            checked
                              ? handleCheckedListItem(folder)
                              : handleCheckedListItem(folder)
                          }
                        />
                      </td>
                      <td className='p-4 pl-0'>
                        <div className='flex items-center'>
                          <FileIconHelper
                            className='text-3xl mr-3'
                            type={'folder'}
                          />
                          <div className='relative'>
                            <p className='text-[0.9em] text-gray-700 font-semibold mr-3'>
                              {Truncate(folder.name, 50)}
                            </p>
                            <p className='text-[0.7em] text-gray-500 font-semibold mr-3 '>
                              {folder.parent_folder
                                ? folder.parent_folder?.name
                                : 'Root'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <p className='text-[0.9em] text-gray-500'>
                          {convertBytesToReadableSize(folder.size)}
                        </p>
                      </td>

                      <td>
                        <p className='text-[0.9em] text-gray-500'>
                          {FormattedDateTime(folder.modifiedAt)}
                        </p>
                      </td>

                      <td>
                        <div className='p-2 flex justify-center group/threedots'>
                          <RemovedThreeDotsDropdown data={folder} />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                );
              })}

              {files?.data?.map((file) => {
                return (
                  <tbody key={file._id} className='bg-white'>
                    <tr className='cursor-pointer border'>
                      <td className='p-4 w-[65px] text-center'>
                        <Checkbox
                          checked={
                            checkedListItem.find(
                              (item) => item._id === file._id,
                            )
                              ? true
                              : false
                          }
                          onChange={(_, checked) =>
                            checked
                              ? handleCheckedListItem(file)
                              : handleCheckedListItem(file)
                          }
                        />
                      </td>
                      <td className='p-4 pl-0'>
                        <div className='flex items-center'>
                          <FileIconHelper
                            className='text-3xl mr-3'
                            type={file.type}
                          />
                          <div className='relative'>
                            <p className='text-[0.9em] text-gray-700 font-semibold mr-3'>
                              {Truncate(file.name, 30)}
                            </p>
                            <p className='text-[0.7em] text-gray-500 font-semibold mr-3 '>
                              {file.parent_folder
                                ? file.parent_folder?.name
                                : 'Root'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <p className='text-[0.9em] text-gray-500'>
                          {convertBytesToReadableSize(file.size)}
                        </p>
                      </td>

                      <td>
                        <p className='text-[0.9em] text-gray-500'>
                          {FormattedDateTime(file.modifiedAt)}
                        </p>
                      </td>

                      <td>
                        <div className='p-2 justify-center flex group/threedots'>
                          <RemovedThreeDotsDropdown data={file} />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
        </div>
      ) : (
        <EmptyData message='No folders have been deleted' />
      )}
    </div>
  );
}
