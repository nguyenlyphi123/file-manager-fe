import { axiosPrivate } from 'utils/axios';

export const getMajors = async () => {
  try {
    const response = await axiosPrivate.get('/major');

    return response.data;
  } catch (error) {
    throw error;
  }
};
