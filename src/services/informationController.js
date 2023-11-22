import { axiosPrivate } from 'utils/axios';

export const getInformation = async () => {
  try {
    const response = await axiosPrivate.get('/information');

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateInformation = async (data) => {
  try {
    const response = await axiosPrivate.put('/information', data);

    return response.data;
  } catch (error) {
    throw error;
  }
};
