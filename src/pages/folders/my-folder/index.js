import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useInView } from 'react-intersection-observer';

import { setCurrentFolder } from 'redux/slices/curentFolder';
import { pushLocation, removeLocation } from 'redux/slices/location';
import { getFolderList } from 'services/folderController';

import EmptyData from 'components/EmptyData';
import Sort from 'components/Sort';
import LargeCard from 'components/cards/LargeCard';
import Loading from 'parts/Loading';
import { useMemo } from 'react';
import { FOLDER_LIMIT_PER_PAGE } from 'constants/constants';

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
  } = useInfiniteQuery({
    queryKey: ['folders', { sortKey }],
    queryFn: async ({ pageParam, queryKey }) => {
      return await getFolderList({
        page: pageParam,
        sortKey: queryKey[1].sortKey,
      });
    },
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages?.length + 1;
      return lastPage.data?.length !== 0 ? nextPage : undefined;
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const folderList = useMemo(() => {
    if (folders?.pages) {
      return folders.pages.map((page) => page.data).flat();
    }
    return [];
  }, [folders]);

  useEffect(() => {
    if (inView && hasNextPage && folderList?.length >= FOLDER_LIMIT_PER_PAGE) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, folderList]);

  if (folderList.length === 0 && !folderFetching)
    return <EmptyData message='There are no folders yet' />;

  if (folderLoading) return <Loading />;

  return (
    <>
      <div className='mb-4'>
        <Sort onSort={handleSort} />
      </div>
      <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4'>
        {folderList &&
          folderList?.map((folder) => {
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
