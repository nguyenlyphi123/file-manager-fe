import { axiosPrivate } from 'utils/axios';

export const getChatList = async () => {
  try {
    const res = await axiosPrivate.get('/chat');

    return res.data;
  } catch (error) {
    throw error;
  }
};
