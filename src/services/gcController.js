import { axiosPrivate } from 'utils/axios';

export const uploadFile = async (file) => {
  try {
    const res = await axiosPrivate.post(
      `${process.env.REACT_APP_API_URL}/gc/upload`,
      file,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
