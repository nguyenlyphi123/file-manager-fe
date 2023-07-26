export const isAuthor = (userId, authorId) => {
  if (!userId || !authorId) return false;

  if (userId !== authorId) return false;

  return true;
};

export const hasFFPermission = (permissions, ffPermission, author = false) => {
  if (author) return true;

  if (!ffPermission || !permissions) return false;

  if (permissions?.length === 0) return false;

  if (permissions.includes(ffPermission)) return true;
};
