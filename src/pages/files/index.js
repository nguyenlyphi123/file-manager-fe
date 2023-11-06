import { useInView } from 'react-intersection-observer';
import { useState } from 'react';

import { getFileList } from 'services/fileController';

import LargeCard from 'components/cards/LargeCard';
import EmptyData from 'components/EmptyData';
import Sort from 'components/Sort';
import Loading from 'parts/Loading';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { FILE_LIMIT_PER_PAGE } from 'constants/constants';

export default function Files() {
  const { ref, inView } = useInView();

  const [sortKey, setSortKey] = useState('lastOpened');

  const handleSort = (val) => {
    setSortKey(val);
  };

  const {
    data: files,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['folders', { sortKey }],
    queryFn: async ({ pageParam, queryKey }) => {
      return await getFileList({
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

  const fileList = useMemo(() => {
    if (files?.pages) {
      return files.pages.map((page) => page.data).flat();
    }
    return [];
  }, [files]);

  useEffect(() => {
    if (inView && hasNextPage && fileList?.length >= FILE_LIMIT_PER_PAGE) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, fileList]);

  if (isLoading) return <Loading />;

  return (
    <div className='min-h-[calc(100vh-142px)] py-5 px-7 tracking-wide relative'>
      <div className='text-[20px] text-gray-600 font-bold'>Files</div>
      <div className='mb-4 mt-5'>
        <Sort onSort={handleSort} />
      </div>
      <div className='mt-5'>
        {fileList?.length > 0 ? (
          <>
            <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4'>
              {fileList?.map((file) => (
                <LargeCard key={file._id} data={file} isFolder={false} />
              ))}
              <div ref={ref}></div>
            </div>
          </>
        ) : (
          <EmptyData message={'There are no files yet'} />
        )}
      </div>
    </div>
  );
}
