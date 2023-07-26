import { Checkbox } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { BsTrash } from 'react-icons/bs';
import { ImSpinner } from 'react-icons/im';
import { Link } from 'react-router-dom';

import Loading from 'parts/Loading';

import {
  getStarredFolder,
  unstarListOfFolder,
} from 'services/folderController';
import { getStarredFile, unstarMultipleFile } from 'services/fileController';

import FileIconHelper from 'utils/helpers/FileIconHelper';
import {
  FormattedDateTime,
  convertBytesToReadableSize,
} from 'utils/helpers/TypographyHelper';

import EmptyData from 'components/EmptyData';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';

export default function Starred() {
  const queryClient = useQueryClient();
  // fetch data
  const { data: folders, isLoading: folderLoading } = useQuery({
    queryKey: ['folder-starred'],
    queryFn: async () => await getStarredFolder(),
    retry: 3,
  });

  const { data: files, isLoading: fileLoading } = useQuery({
    queryKey: ['file-starred'],
    queryFn: async () => await getStarredFile(),
    retry: 3,
  });

  const handleUnStar = useMutation({
    mutationFn: () => {
      const folderList = checkedListItem.filter((item) => {
        if (!item.type) {
          return {
            ...item,
            parent_folder: item.parent_folder ? item.parent_folder._id : null,
          };
        }
      });

      const fileList = checkedListItem.filter((item) => {
        if (item.type) {
          return {
            ...item,
            parent_folder: item.parent_folder ? item.parent_folder._id : null,
          };
        }
      });

      return Promise.all([
        folderList.length > 0 && unstarListOfFolder(folderList),
        fileList.length > 0 && unstarMultipleFile(fileList),
      ]);
    },
    onSuccess: () => {
      SuccessToast({ message: 'Items have been deleted successfully' });
      queryClient.invalidateQueries('folder-starred');
      queryClient.invalidateQueries('file-starred');
      setCheckedListItem([]);
    },
    onError: () => {
      ErrorToast({
        message: 'Opps! Something went wrong. Please try again later',
      });
    },
  });

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

  if (folderLoading || fileLoading) return <Loading />;

  return (
    <div className='h-[200vh] py-5 px-7 tracking-wide'>
      <div className='text-[20px] text-gray-600 font-bold'>Starred</div>

      {isItems.item ? (
        <div className='mt-5'>
          <table className='w-full'>
            <thead>
              <tr className='text-[0.9em] text-gray-500 h-[40px]'>
                <th>
                  <Checkbox
                    checked={
                      checkedListItem.length === isItems.length ? true : false
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className='text-left w-[50%] font-semibold'>Name</th>
                <th className='text-left font-semibold'>Last Opened</th>
                <th className='text-left font-semibold  '>Size</th>
                <th className='flex justify-center w-[70px]'>
                  {checkedListItem.length > 0 && (
                    <button
                      onClick={() => handleUnStar.mutate(checkedListItem)}
                      className={`text-center flex justify-center items-center text-white h-[30px] px-2 bg-red-400  rounded-md cursor-pointer ${'hover:bg-red-500'}`}
                    >
                      {handleUnStar.isLoading ? (
                        <ImSpinner className='animate-spin' />
                      ) : (
                        <BsTrash />
                      )}
                    </button>
                  )}
                </th>
              </tr>
            </thead>

            {folders?.data.map((folder) => {
              return (
                <tbody key={folder._id} className='bg-white border rounded-md'>
                  <tr
                    className='mt-5 cursor-pointer'
                    onClick={() => {
                      handleCheckedListItem(folder);
                    }}
                  >
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
                      <Link
                        className='flex items-center w-fit'
                        to={`../folders/${folder._id}`}
                        state={{ folder: folder }}
                      >
                        <FileIconHelper
                          className='text-3xl mr-3'
                          type={'folder'}
                        />
                        <div className='flex flex-col'>
                          <p className='text-[0.9em] text-gray-700 font-semibold mr-3'>
                            {folder.name}
                          </p>
                          <p className='text-[0.7em] text-gray-500 font-semibold mr-3 '>
                            {folder.parent_folder
                              ? folder.parent_folder?.name
                              : 'Root'}
                          </p>
                        </div>
                      </Link>
                    </td>

                    <td>
                      <p className='text-[0.9em] text-gray-500'>
                        {FormattedDateTime(folder.lastOpened)}
                      </p>
                    </td>

                    <td>
                      <p className='text-[0.9em] text-gray-500'>
                        {convertBytesToReadableSize(folder.size || 0)}
                      </p>
                    </td>

                    <td className='flex justify-center items-center h-[75px] w-[70px]'>
                      {checkedListItem.find(
                        (item) => item._id === folder._id,
                      ) && (
                        <button
                          onClick={() => handleUnStar.mutate(checkedListItem)}
                          className={`text-center flex justify-center items-center text-white h-[30px] px-2 bg-red-400  rounded-md cursor-pointer ${'hover:bg-red-500'}`}
                        >
                          {handleUnStar.isLoading ? (
                            <ImSpinner className='animate-spin' />
                          ) : (
                            <BsTrash />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              );
            })}

            {files?.data.map((file) => {
              return (
                <tbody key={file._id} className='bg-white border rounded-md'>
                  <tr
                    className='mt-5 cursor-pointer'
                    onClick={() => {
                      handleCheckedListItem(file);
                    }}
                  >
                    <td className='p-4 w-[65px] text-center'>
                      <Checkbox
                        checked={
                          checkedListItem.find((item) => item._id === file._id)
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
                      <div className='flex items-center w-fit'>
                        <FileIconHelper
                          className='text-3xl mr-3'
                          type={file.type}
                        />
                        <div className='flex flex-col'>
                          <p className='text-[0.9em] text-gray-700 font-semibold mr-3'>
                            {file.name}
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
                        {FormattedDateTime(file.lastOpened)}
                      </p>
                    </td>

                    <td>
                      <p className='text-[0.9em] text-gray-500'>
                        {convertBytesToReadableSize(file.size || 0)}
                      </p>
                    </td>

                    <td className='flex justify-center items-center h-[75px] w-[70px]'>
                      {checkedListItem.find(
                        (item) => item._id === file._id,
                      ) && (
                        <button
                          onClick={() => handleUnStar.mutate(checkedListItem)}
                          className={`text-center flex justify-center items-center text-white h-[30px] px-2 bg-red-400  rounded-md cursor-pointer ${'hover:bg-red-500'}`}
                        >
                          {handleUnStar.isLoading ? (
                            <ImSpinner className='animate-spin' />
                          ) : (
                            <BsTrash />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
      ) : (
        <EmptyData message='No items have been starred' />
      )}
    </div>
  );
}
