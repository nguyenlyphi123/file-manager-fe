import { axiosPrivate } from 'utils/axios';

export const getChatList = async () => {
  try {
    const res = await axiosPrivate.get('/chat');

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createSingleChat = async ({ member }) => {
  try {
    const res = await axiosPrivate.post('/chat', { member });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createGroupChat = async ({ name, member }) => {
  try {
    const res = await axiosPrivate.post('/chat/group', { name, member });

    return res.data;
  } catch (error) {
    throw error;
  }
};
