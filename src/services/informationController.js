import { axiosPrivate } from 'utils/axios';

export const getInformation = async () => {
  try {
    const response = await axiosPrivate.get('/information');

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getInformationById = async (id) => {
  try {
    const response = await axiosPrivate.get(`/information/details/${id}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGroupedInformationByManager = async () => {
  try {
    const response = await axiosPrivate.get(
      '/information/list-grouped-manager',
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGroupedInformationByAdmin = async () => {
  try {
    const response = await axiosPrivate.get('/information/list-grouped-admin');

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getListMentorInformationWithSpecialization = async (specId) => {
  try {
    const response = await axiosPrivate.get(
      `/information/list-mentor/${specId}`,
    );

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

export const assignMentor = async ({
  mentor_id,
  member_id,
  major_id,
  spec_id,
}) => {
  try {
    const response = await axiosPrivate.put('/information/assign-mentor', {
      mentor_id,
      member_id,
      major_id,
      spec_id,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignRole = async ({
  member_id,
  permission,
  major_id,
  spec_id,
}) => {
  try {
    const response = await axiosPrivate.put('/information/assign-role', {
      member_id,
      permission,
      major_id,
      spec_id,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
