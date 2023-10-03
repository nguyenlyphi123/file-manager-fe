import {
  REQ_STATUS_CANCEL,
  REQ_STATUS_DONE,
  REQ_STATUS_EXPIRED,
  REQ_STATUS_PROCESSING,
  REQ_STATUS_WAITING,
} from 'constants/constants';

export const isAuthor = (userId, authorId) => {
  if (!userId || !authorId) return false;

  if (userId !== authorId) return false;

  return true;
};

export const isOwner = (userId, ownerId) => {
  if (!userId || !ownerId) return false;

  if (userId !== ownerId) return false;

  return true;
};

export const hasFFPermission = (
  permissions,
  ffPermission,
  author = false,
  owner = false,
) => {
  if (owner) return true;

  if (author) return true;

  if (!ffPermission || !permissions) return false;

  if (permissions?.length === 0) return false;

  if (permissions.includes(ffPermission)) return true;
};

export const renderBottomColor = (status) => {
  switch (status) {
    case REQ_STATUS_WAITING:
      return '#FFE569';

    case REQ_STATUS_PROCESSING:
      return '#6499E9';

    case REQ_STATUS_DONE:
      return '#54B435';

    case REQ_STATUS_CANCEL:
      return '#F55050';

    case REQ_STATUS_EXPIRED:
      return '#F55050';

    default:
      return '#FFE569';
  }
};
