const { host } = require('constants/constants');
const { io } = require('socket.io-client');

const socket = io(host, { withCredentials: true });

export default socket;
