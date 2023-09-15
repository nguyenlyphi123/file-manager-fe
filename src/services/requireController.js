import { axiosPrivate } from 'utils/axios';

export const createRequire = async (data) => {
  try {
    const res = await axiosPrivate.post(`/require`, data);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getRequire = async () => {
  try {
    const res = await axiosPrivate.get(`/require`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateStatus = async (posData) => {
  try {
    const res = await axiosPrivate.put(`/require/status`, posData);

    return res.data;
  } catch (error) {
    throw error;
  }
};
