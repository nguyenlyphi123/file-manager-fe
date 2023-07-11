import { apiURL } from '../constants/constants';
import { axiosPrivate } from '../utils/axios';

export const getFolderList = async () => {
  try {
    const res = await axiosPrivate.get(`${apiURL}/folder`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getFolderDetail = async ({ id }) => {
  try {
    const res = await axiosPrivate.get(`${apiURL}/folder/${id}/detail`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const renameFolder = async ({ id, name }) => {
  try {
    const res = await axiosPrivate.put(`${apiURL}/folder/${id}`, { name });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFolder = async ({ id }) => {
  try {
    const res = await axiosPrivate.delete(`${apiURL}/folder/${id}`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const starFolder = async ({ id }) => {
  try {
    const res = await axiosPrivate.put(`${apiURL}/folder/star/${id}`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const unstarFolder = async ({ id }) => {
  try {
    const res = await axiosPrivate.put(`${apiURL}/folder/unstar/single`, {
      folderId: id,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const unstarListOfFolder = async (folderList) => {
  try {
    const res = await axiosPrivate.put(`${apiURL}/folder/unstar/list-folder`, {
      folderIdList: folderList,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getStarredFolder = async () => {
  try {
    const res = await axiosPrivate.get(`${apiURL}/folder/starred`);

    return res.data;
  } catch (error) {
    throw error;
  }
};
