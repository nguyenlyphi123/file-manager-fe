import { axiosPrivate } from 'utils/axios';

const ITEMS_PER_PAGE = 20;

export const getMessages = async ({ id, page }) => {
  try {
    const res = await axiosPrivate.get(
      `/message/${id}?limit=${ITEMS_PER_PAGE}&page=${page}`,
    );

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
