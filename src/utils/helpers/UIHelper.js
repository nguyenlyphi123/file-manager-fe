import { LECTURERS, MANAGER } from 'constants/constants';

export const hasUIPermission = (permission) => {
  if (permission === LECTURERS || permission === MANAGER) {
    return true;
  }

  return false;
};
