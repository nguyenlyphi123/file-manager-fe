export const isSender = (userId, senderId) => {
  if (senderId === userId) {
    return true;
  }
};

export const isSameChatRoom = (currentRoom, receiveRoom) => {
  if (currentRoom === receiveRoom) {
    return true;
  }

  return false;
};
