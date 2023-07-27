import { axiosPrivate } from 'utils/axios';

export const getLecturersBySpecialize = async (id) => {
  try {
    const res = await axiosPrivate.get(`/lecturers/specialize/${id}`);

    return res.data;
  } catch (error) {
    throw error;
  }
};
