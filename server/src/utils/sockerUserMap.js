const socketUserMap = new Map();

const getUserSocker = (userId) => {
    return socketUserMap.get(userId);
}

const removeUserSocker = (userId) => {
    socketUserMap.delete(userId);
}

const setUserSocker = (userId, socketId) => {
    socketUserMap.set(userId, socketId);
}

export {
    getUserSocker,
    removeUserSocker,
    setUserSocker
};