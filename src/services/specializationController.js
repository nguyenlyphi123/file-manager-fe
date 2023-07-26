import { axiosPrivate } from 'utils/axios';

export const getSpecialization = async () => {
  try {
    const res = await axiosPrivate.get(`/specialization`);

    return res.data;
  } catch (error) {
    throw error;
  }
};
