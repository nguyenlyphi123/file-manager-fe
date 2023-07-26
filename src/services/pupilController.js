import { axiosPrivate } from 'utils/axios';

export const getPupils = async (id) => {
  try {
    const res = await axiosPrivate.get(`/pupil/class/${id}`);

    return res.data;
  } catch (error) {
    throw error;
  }
};
