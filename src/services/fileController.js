import { axiosPrivate } from '../utils/axios';

export const uploadSingleFile = async ({
  name,
  type,
  size,
  parent_folder,
  link,
}) => {
  try {
    const res = await axiosPrivate.post(`/file`, {
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
    const res = await axiosPrivate.get(`/file`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getFileByFolder = async ({ id }) => {
  try {
    const res = await axiosPrivate.get(`/file/${id}`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const copyFile = async ({ data, folderId }) => {
  try {
    const res = await axiosPrivate.post(`/file/copy`, {
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
    const res = await axiosPrivate.post(`/file/move`, {
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
    const res = await axiosPrivate.put(`/file/${id}/star`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const unstarFile = async ({ id }) => {
  try {
    const res = await axiosPrivate.put(`/file/${id}/unstar`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const renameFile = async ({ data, name }) => {
  try {
    const res = await axiosPrivate.put(`/file/rename`, {
      fileData: data,
      name,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const removeFileToTrash = async ({ id }) => {
  try {
    const res = await axiosPrivate.put(`/file/trash`, { fileId: id });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const restoreFile = async ({ id }) => {
  try {
    const res = await axiosPrivate.put(`/file/restore`, {
      fileId: id,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFile = async ({ data }) => {
  try {
    const res = await axiosPrivate.post(`/file/delete`, {
      fileData: data,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getRemovedFile = async () => {
  try {
    const res = await axiosPrivate.get(`/file/trash`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const downloadFile = async ({ data }) => {
  try {
    const res = await axiosPrivate.post(
      `/gc/download`,
      { data },
      {
        responseType: 'arraybuffer',
      },
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};
