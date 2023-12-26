import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useMemo } from 'react';

// queries
export const useLoadMore = ({ key, params, query }) => {
  const context = useInfiniteQuery({
    queryKey: [key, params],
    queryFn: ({ pageParam = 1, queryKey }) => {
      return query({
        page: pageParam,
        ...queryKey[1],
      });
    },
    getPreviousPageParam: (firstPage) => firstPage?.previousId ?? false,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages?.length + 1;
      return lastPage.data?.length !== 0 ? nextPage : undefined;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const dataToList = useMemo(() => {
    if (context.data?.pages) {
      return context.data.pages.map((page) => page.data).flat();
    }
    return [];
  }, [context.data]);

  return {
    ...context,
    data: dataToList,
  };
};

export const useFetch = ({ key, params, query, config }) =>
  useQuery({
    queryKey: [key, params],
    queryFn: ({ queryKey }) => {
      return query(queryKey?.[1]);
    },
    retry: false,
    refetchOnWindowFocus: false,
    ...config,
  });

// mutations
export const useCoreMutation = ({ key, params, mutation, updater, config }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutation,
    onMutate: async (data) => {
      await queryClient.cancelQueries([key, params]);

      const previousData = queryClient.getQueryData([key, params]);

      queryClient.setQueryData([key, params], (old) => {
        return updater ? (old, data) : data;
      });

      return previousData;
    },
    onError: (err, variables, previousData) => {
      queryClient.setQueryData([key, params], previousData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([key, params]);
    },
    ...config,
  });
};
