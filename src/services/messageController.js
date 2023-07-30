import { axiosPrivate } from 'utils/axios';

export const getMessages = async ({ id }) => {
  try {
    const res = await axiosPrivate.get(`/message/${id}`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const sendMessage = async ({ id, content }) => {
  try {
    const res = await axiosPrivate.post(`/message`, { chat: id, content });

    return res.data;
  } catch (error) {
    throw error;
  }
};
