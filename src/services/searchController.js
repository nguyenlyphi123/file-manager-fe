import { axiosPrivate } from 'utils/axios';

export const search = async (name) => {
  const { data } = await axiosPrivate.get(`/search/${name}`);

  return data;
};
