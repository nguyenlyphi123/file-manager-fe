import {
  getFileByFolder,
  getFileList,
  getRemovedFile,
  getSharedFile,
  getStarredFile,
} from 'services/fileController';
import { useFetch, useLoadMore } from './core.api';

export const RQK_FILES = 'files';
export const RQK_FILE = 'file';
export const RQK_STARRED_FILES = 'starred-files';
export const RQK_SHARED_FILES = 'shared-files';
export const RQK_REMOVED_FILES = 'removed-files';

export const useFilesInfiniteQuery = (params) => {
  return useLoadMore({ key: RQK_FILES, params, query: getFileList });
};

export const useFileQuery = (folderId) => {
  return useFetch({
    key: RQK_FILES,
    params: { id: folderId },
    query: getFileByFolder,
  });
};

export const useStarredFileQuery = () =>
  useFetch({ key: RQK_STARRED_FILES, query: getStarredFile });

export const useSharedFileQuery = () =>
  useFetch({ key: RQK_SHARED_FILES, query: getSharedFile });

export const useRemovedFileQuery = () =>
  useFetch({ key: RQK_REMOVED_FILES, query: getRemovedFile });
