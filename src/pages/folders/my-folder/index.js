import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch } from 'react-redux';

import { setCurrentFolder } from 'redux/slices/curentFolder';
import { pushLocation, removeLocation } from 'redux/slices/location';

import { useFoldersInfiniteQuery } from 'apis/folder.api';
import EmptyData from 'components/EmptyData';
import Sort from 'components/Sort';
import LargeCard from 'components/cards/LargeCard';
import { FOLDER_LIMIT_PER_PAGE } from 'constants/constants';
import Loading from 'parts/Loading';

export default function MyFolder() {
  // dispatch action redux
  const dispatch = useDispatch();

  const [sortKey, setSortKey] = useState('lastOpened');

  const { ref, inView } = useInView();

  const handleSort = (val) => {
    setSortKey(val);
  };

  const handleCardSelect = (val) => {
    const data = {
      parent: val.parent_folder ? val.parent_folder._id : '',
      name: val.name,
      _id: val._id,
      href: val.href,
    };
    dispatch(pushLocation(data));
    dispatch(setCurrentFolder(val));
  };

  useEffect(() => {
    dispatch(removeLocation());
  }, [dispatch]);

  // folder data
  const {
    data: folders,
    isLoading: folderLoading,
    isFetching: folderFetching,
    hasNextPage,
    fetchNextPage,
  } = useFoldersInfiniteQuery({ sortKey });

  useEffect(() => {
    if (inView && hasNextPage && folders?.length >= FOLDER_LIMIT_PER_PAGE) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, folders]);

  if (folders.length === 0 && !folderFetching)
    return <EmptyData message='There are no folders yet' />;

  if (folderLoading) return <Loading />;

  return (
    <>
      <div className='mb-4'>
        <Sort onSort={handleSort} />
      </div>
      <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4'>
        {folders.length > 0 &&
          folders?.map((folder) => {
            return (
              <LargeCard
                onClick={handleCardSelect}
                key={folder._id}
                data={folder}
              />
            );
          })}
        <div ref={ref}></div>
      </div>
    </>
  );
}
