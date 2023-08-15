const { io } = require('socket.io-client');

const socket = io(process.env.REACT_APP_HOST_URL, { withCredentials: true });

export default socket;
