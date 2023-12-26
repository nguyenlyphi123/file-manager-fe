import {
  getFolderDetail,
  getFolderList,
  getRemovedFolder,
  getSharedFolder,
  getStarredFolder,
  renameFolder,
} from 'services/folderController';
import { useCoreMutation, useFetch, useLoadMore } from './core.api';

export const RQK_FOLDERS = 'folders';
export const RQK_FOLDER = 'folder';
export const RQK_STARRED_FOLDERS = 'starred-folders';
export const RQK_SHARED_FOLDERS = 'shared-folders';
export const RQK_REMOVED_FOLDERS = 'removed-folders';

// queries
export const useFoldersInfiniteQuery = (params) =>
  useLoadMore({ key: RQK_FOLDERS, params, query: getFolderList });

export const useFolderQuery = (id) =>
  useFetch({ key: RQK_FOLDER, query: getFolderDetail, params: { id } });

export const useStarredFolderQuery = () =>
  useFetch({ key: RQK_STARRED_FOLDERS, query: getStarredFolder });

export const useSharedFolderQuery = () =>
  useFetch({ key: RQK_SHARED_FOLDERS, query: getSharedFolder });

export const useRemovedFolderQuery = () =>
  useFetch({ key: RQK_REMOVED_FOLDERS, query: getRemovedFolder });

// mutations

export const useRenameFolderMutation = (id, parentId) => {
  return useCoreMutation({
    key: RQK_FOLDER,
    params: { parentId },
    mutation: (name) => renameFolder({ id, name }),
  });
};
