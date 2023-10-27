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

export const renderAvatarName = (name) => {
  if (!name) return '';

  const parsedName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const splitName = parsedName.split(' ');

  if (splitName.length === 1) return splitName[0][0];

  return splitName[splitName.length - 1][0];
};

export const renderAvatarColor = (color) => {
  if (color) return color;

  const colorPalettes = [
    '#f0ad4e', // Mango
    '#ffc0cb', // Pink
    '#87cefa', // Sky Blue
    '#ff6347', // Tomato
    '#00fa9a', // Medium Spring Green
    '#ff4500', // Orange Red
    '#48d1cc', // Medium Turquoise
    '#ff69b4', // Hot Pink
    '#ffd700', // Gold
    '#00ced1', // Dark Turquoise
    '#ff8c00', // Dark Orange
    '#20b2aa', // Light Sea Green
    '#ff1493', // Deep Pink
    '#32cd32', // Lime Green
    '#ff7f50', // Coral
    '#00ff7f', // Spring Green
    '#ff6347', // Tomato
    '#00bfff', // Deep Sky Blue
    '#ff4500', // Orange Red
    '#98fb98', // Pale Green
  ];

  const randomColor = colorPalettes[Math.floor(Math.random() * 6)];

  return randomColor;
};

export const renderFileTypes = () => {
  const fileTypes = [
    'folder',
    'doc',
    'docx',
    'zip',
    'exe',
    'jpg',
    'png',
    'mp3',
    'mp4',
    'ppt',
    'pdf',
    'svg',
    'txt',
    'xlsx',
  ];

  return fileTypes;
};
