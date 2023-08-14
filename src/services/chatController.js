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

export const leaveChat = async ({ id }) => {
  try {
    const res = await axiosPrivate.post(`/chat/delete`, { chatId: id });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const leaveGroupChat = async ({ id }) => {
  try {
    const res = await axiosPrivate.post(`/chat/group/leave`, { chatId: id });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addMember = async ({ id, member }) => {
  try {
    const res = await axiosPrivate.post(`/chat/group/add`, {
      chatId: id,
      memberId: member,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const removeMember = async ({ id, member }) => {
  try {
    const res = await axiosPrivate.post(`/chat/group/remove`, {
      chatId: id,
      memberId: member,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteGroupChat = async ({ id }) => {
  try {
    const res = await axiosPrivate.post(`/chat/group/delete`, { chatId: id });

    return res.data;
  } catch (error) {
    throw error;
  }
};
