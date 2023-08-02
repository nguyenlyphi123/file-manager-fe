import { axiosPrivate } from 'utils/axios';

export const searchUser = async (search) => {
  try {
    const response = await axiosPrivate.get(
      `/account/${decodeURIComponent(search)}`,
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
