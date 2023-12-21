import { useQueries } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { pushLocation } from 'redux/slices/location';

import { getSharedFile, getSharedFileByMe } from 'services/fileController';
import {
  getSharedFolder,
  getSharedFolderByMe,
} from 'services/folderController';

import { TiArrowSortedDown } from 'react-icons/ti';

import MediumCard from 'components/cards/MediumCard';
import EmptyData from 'components/EmptyData';

import Loading from 'parts/Loading';

function Shared() {
  const generateQueryConfig = (key, queryFn) => ({
    queryKey: [key],
    queryFn,
    refetchOnWindowFocus: false,
  });

  const queryConfigs = [
    generateQueryConfig('folder-shared', getSharedFolder),
    generateQueryConfig('file-shared', getSharedFile),
    generateQueryConfig('folder-shared-bm', getSharedFolderByMe),
    generateQueryConfig('file-shared-bm', getSharedFileByMe),
  ];

  const queryResults = useQueries({ queries: queryConfigs });

  const [
    { data: folders, isLoading: folderLoading },
    { data: files, isLoading: fileLoading },
    { data: foldersByMe, isLoading: folderBMLoading },
    { data: filesByMe, isLoading: fileBMLoading },
  ] = queryResults;

  // dispatch action redux
  const dispatch = useDispatch();

  const handleCardSelect = (val) => {
    const data = {
      parent: val.parent_folder ? val.parent_folder._id : '',
      name: val.name,
      _id: val._id,
      href: val.href,
    };
    dispatch(pushLocation(data));
  };

  if (folderLoading || fileLoading || folderBMLoading || fileBMLoading)
    return <Loading />;

  if (
    folders?.data?.length === 0 &&
    files?.data?.length === 0 &&
    foldersByMe?.data?.length === 0 &&
    filesByMe?.data?.length === 0
  )
    return <EmptyData message={'There is no folders or files'} />;

  return (
    <div className='h-[200vh] py-5 px-7 tracking-wide'>
      {foldersByMe?.data?.length > 0 || filesByMe?.data?.length > 0 ? (
        <>
          <div className='text-[20px] text-gray-600 font-bold'>Share By Me</div>

          <div className='mt-5'>
            <div className='flex items-center mb-4'>
              <p className='text-sm text-gray-500 font-semibold mr-2'>
                Last Opened
              </p>
              <TiArrowSortedDown className='text-gray-500' />
            </div>

            <div>
              {foldersByMe?.data?.length > 0 && (
                <>
                  <p className='text-gray-700 font-medium'>Folders</p>
                  <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4 mt-2'>
                    {foldersByMe?.data?.map((folder) => {
                      return (
                        <MediumCard
                          onClick={handleCardSelect}
                          key={folder._id}
                          data={folder}
                        />
                      );
                    })}
                  </div>
                </>
              )}

              <div className='mt-4'>
                {filesByMe?.data?.length > 0 && (
                  <>
                    <p className='text-gray-700 font-medium'>Files</p>
                    <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4 mt-2'>
                      {filesByMe?.data?.map((file) => {
                        return (
                          <MediumCard
                            onClick={handleCardSelect}
                            key={file._id}
                            data={file}
                            isFolder={false}
                          />
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        ''
      )}

      {folders?.data?.length > 0 || files?.data?.length > 0 ? (
        <>
          <div className='text-[20px] text-gray-600 font-bold'>
            Share With Me
          </div>

          <div className='mt-5'>
            <div className='flex items-center mb-4'>
              <p className='text-sm text-gray-500 font-semibold mr-2'>
                Last Opened
              </p>
              <TiArrowSortedDown className='text-gray-500' />
            </div>

            <div>
              {folders && folders?.data?.length > 0 && (
                <>
                  <p className='text-gray-700 font-medium'>Folders</p>
                  <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4 mt-2'>
                    {folders?.data?.map((folder) => {
                      return (
                        <MediumCard
                          onClick={handleCardSelect}
                          key={folder._id}
                          data={folder}
                        />
                      );
                    })}
                  </div>
                </>
              )}

              <div className='mt-4'>
                {files && files?.data?.length > 0 && (
                  <>
                    <p className='text-gray-700 font-medium'>Files</p>
                    <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4 mt-2'>
                      {files?.data?.map((file) => {
                        return (
                          <MediumCard
                            onClick={handleCardSelect}
                            key={file._id}
                            data={file}
                            isFolder={false}
                          />
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        ''
      )}
    </div>
  );
}

export default Shared;
