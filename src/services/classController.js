import { axiosPrivate } from 'utils/axios';

export const getClasses = async (id) => {
  try {
    const res = await axiosPrivate.get(`/class/${id}`);

    return res.data;
  } catch (error) {
    throw error;
  }
};
