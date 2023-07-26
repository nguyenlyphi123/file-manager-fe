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

export const getFolderList = async () => {
  try {
    const res = await axiosPrivate.get(`/folder`);

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
    const res = await axiosPrivate.put(`/folder/multiple-restore`, {
      folders: folderList,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const copyFolder = async ({ data, folderId }) => {
  try {
    const res = await axiosPrivate.post(`/folder/copy`, {
      data,
      folderId,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const moveFolder = async ({ data, folderId }) => {
  try {
    const res = await axiosPrivate.post(`/folder/move`, {
      data,
      folderId,
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

export const getSharedFolder = async () => {
  try {
    const res = await axiosPrivate.get(`/folder/shared`);

    return res.data;
  } catch (error) {
    throw error;
  }
};
