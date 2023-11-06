import { axiosPrivate } from 'utils/axios';

export const search = async ({ name, type, action }) => {
  const { data } = await axiosPrivate.get(
    `/search?name=${name}&type=${type}&action=${action}`,
  );

  return data;
};
