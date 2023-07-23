import { Checkbox } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { BsTrash } from 'react-icons/bs';
import { ImSpinner } from 'react-icons/im';
import { Link } from 'react-router-dom';
import Loading from '../../parts/Loading';
import {
  getStarredFolder,
  unstarFolder,
  unstarListOfFolder,
} from '../../services/folderController';
import FileIconHelper from '../../utils/helpers/FileIconHelper';
import {
  FormattedDateTime,
  convertBytesToReadableSize,
} from '../../utils/helpers/TypographyHelper';
import EmptyData from '../EmptyData';
import ErrorToast from '../toasts/ErrorToast';
import SuccessToast from '../toasts/SuccessToast';

export default function Starred() {
  // fetch data
  const {
    data: folders,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['starred'],
    queryFn: async () => await getStarredFolder(),
    retry: 3,
  });

  const handleUnStarListOfFolder = useMutation({
    mutationFn: async (folderList) => await unstarListOfFolder(folderList),
    onSuccess: () => {
      SuccessToast({ message: 'Folders have been unstarred successfully' });
      setCheckedListItem([]);
      refetch();
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
      setCheckedListItem(checkedListItem.filter((item) => item !== data));
      return;
    }
    setCheckedListItem([...checkedListItem, data]);
  };

  const handleSelectAll = () => {
    if (checkedListItem.length === folders?.data.length) {
      setCheckedListItem([]);
      return;
    }
    setCheckedListItem(folders?.data.map((folder) => folder._id));
  };

  if (isLoading) return <Loading />;

  return (
    <div className='h-[200vh] py-5 px-7 tracking-wide'>
      <div className='text-[20px] text-gray-600 font-bold'>Starred</div>

      {folders?.data?.length > 0 ? (
        <div className='mt-5'>
          <table className='w-full'>
            <thead>
              <tr className='text-[0.9em] text-gray-500 h-[40px]'>
                <th>
                  <Checkbox
                    checked={
                      checkedListItem.length === folders?.data?.length
                        ? true
                        : false
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
                      onClick={() =>
                        handleUnStarListOfFolder.mutate(checkedListItem)
                      }
                      className={`text-center flex justify-center items-center text-white h-[30px] px-2 bg-red-400  rounded-md cursor-pointer ${'hover:bg-red-500'}`}
                    >
                      {handleUnStarListOfFolder.isLoading ? (
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
                      handleCheckedListItem(folder._id);
                    }}
                  >
                    <td className='p-4 w-[65px] text-center'>
                      <Checkbox
                        checked={
                          checkedListItem.find((item) => item === folder._id)
                            ? true
                            : false
                        }
                        onChange={(_, checked) =>
                          checked
                            ? handleCheckedListItem(folder._id)
                            : handleCheckedListItem(folder._id)
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
                      {checkedListItem.find((item) => item === folder._id) && (
                        <button
                          onClick={() =>
                            handleUnStarListOfFolder.mutate(checkedListItem)
                          }
                          className={`text-center flex justify-center items-center text-white h-[30px] px-2 bg-red-400  rounded-md cursor-pointer ${'hover:bg-red-500'}`}
                        >
                          {handleUnStarListOfFolder.isLoading ? (
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
        <EmptyData message='No folders have been starred' />
      )}
    </div>
  );
}
