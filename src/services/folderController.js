import { FOLDER_LIMIT_PER_PAGE } from 'constants/constants';
import { axiosPrivate } from 'utils/axios';

export const createFolder = async ({ name, parent_folder }) => {
  try {
    const res = await axiosPrivate.post(`/folder`, {
      name,
      parent_folder,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createQuickAccessFolder = async ({ name, parent_folder }) => {
  try {
    const res = await axiosPrivate.post(`/folder/quick-access`, {
      name,
      parent_folder,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getFolderList = async ({ limit = 50, page = 1, sortKey }) => {
  try {
    const res = await axiosPrivate.get(
      `/folder?limit=${limit || FOLDER_LIMIT_PER_PAGE}&page=${page}&sortKey=${
        sortKey || 'lastOpened'
      }`,
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getQuickAccessFolder = async ({ page = 1 }) => {
  try {
    const res = await axiosPrivate.get(
      `/folder/quick-access?limit=${FOLDER_LIMIT_PER_PAGE}&page=${page}`,
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getFolderDetail = async ({ id }) => {
  try {
    const res = await axiosPrivate.get(`/folder/${id}/detail`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const renameFolder = async ({ id, name }) => {
  try {
    const res = await axiosPrivate.put(`/folder/${id}`, { name });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFolder = async ({ id }) => {
  try {
    const res = await axiosPrivate.post(`/folder/delete`, { folderId: id });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMultipleFolder = async (folderList) => {
  try {
    const res = await axiosPrivate.post(`/folder/multiple-delete`, {
      folders: folderList,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const starFolder = async ({ id }) => {
  try {
    const res = await axiosPrivate.put(`/folder/star/${id}`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const unstarFolder = async ({ id }) => {
  try {
    const res = await axiosPrivate.put(`/folder/unstar/single`, {
      folderId: id,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const unstarListOfFolder = async (folderList) => {
  try {
    const res = await axiosPrivate.put(`/folder/unstar/list-folder`, {
      folderIdList: folderList,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getStarredFolder = async () => {
  try {
    const res = await axiosPrivate.get(`/folder/starred`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const removeFolderToTrash = async ({ id }) => {
  try {
    const res = await axiosPrivate.put(`/folder/${id}/trash`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getRemovedFolder = async () => {
  try {
    const res = await axiosPrivate.get(`/folder/trash`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const restoreFolder = async ({ id }) => {
  try {
    const res = await axiosPrivate.put(`/folder/${id}/restore`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const restoreMultipleFolder = async (folderList) => {
  try {
    const res = await axiosPrivate.post(`/folder/multiple-restore`, {
      folders: folderList,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const copyFolder = async ({ data, desData }) => {
  try {
    const res = await axiosPrivate.post(`/folder/copy`, {
      data,
      desData,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const moveFolder = async ({ data, desData }) => {
  try {
    const res = await axiosPrivate.post(`/folder/move`, {
      data,
      desData,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const downloadFolder = async ({ id }) => {
  try {
    const res = await axiosPrivate.post(
      `/gc/folder/download`,
      { id },
      { responseType: 'arraybuffer' },
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const shareFolder = async ({ emails, folderId, permissions }) => {
  try {
    const res = await axiosPrivate.post(`/folder/share`, {
      emails,
      folderId,
      permissions,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const unShareFolder = async ({ id }) => {
  try {
    const res = await axiosPrivate.put(`/folder/unshare/${id}`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getSharedFolder = async () => {
  try {
    const res = await axiosPrivate.get(`/folder/shared`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getSharedFolderByMe = async () => {
  try {
    const res = await axiosPrivate.get(`/folder/sharedByMe`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const pinFolder = async ({ folderId, quickAccess }) => {
  try {
    const res = await axiosPrivate.put(`/folder/${folderId}/pin`, {
      quickAccess,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};
