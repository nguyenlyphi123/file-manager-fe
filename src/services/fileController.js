import { apiURL } from '../constants/constants';
import { axiosPrivate } from '../utils/axios';

export const uploadSingleFile = async ({
  name,
  type,
  size,
  parent_folder,
  link,
}) => {
  try {
    const res = await axiosPrivate.post(`${apiURL}/file`, {
      name,
      type,
      size,
      parent_folder,
      link,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getFileList = async () => {
  try {
    const res = await axiosPrivate.get(`${apiURL}/file`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getFileByFolder = async ({ id }) => {
  try {
    const res = await axiosPrivate.get(`${apiURL}/file/${id}`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const copyFile = async ({ data, folderId }) => {
  try {
    const res = await axiosPrivate.post(`${apiURL}/file/copy`, {
      data,
      folderId,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const moveFile = async ({ data, folderId }) => {
  try {
    const res = await axiosPrivate.post(`${apiURL}/file/move`, {
      data,
      folderId,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const starFile = async ({ id }) => {
  try {
    const res = await axiosPrivate.put(`${apiURL}/file/${id}/star`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const unstarFile = async ({ id }) => {
  try {
    const res = await axiosPrivate.put(`${apiURL}/file/${id}/unstar`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const renameFile = async ({ id, name }) => {
  try {
    const res = await axiosPrivate.put(`${apiURL}/file/rename`, {
      fileId: id,
      name,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const removeFileToTrash = async ({ id }) => {
  try {
    const res = await axiosPrivate.put(`${apiURL}/file/trash`, { fileId: id });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const restoreFile = async ({ id }) => {
  try {
    const res = await axiosPrivate.put(`${apiURL}/file/restore`, {
      fileId: id,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFile = async ({ data }) => {
  try {
    const res = await axiosPrivate.post(`${apiURL}/file/delete`, {
      fileData: data,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getRemovedFile = async () => {
  try {
    const res = await axiosPrivate.get(`${apiURL}/file/trash`);

    return res.data;
  } catch (error) {
    throw error;
  }
};
