import io from 'socket.io-client';

const socket = io('http://localhost:9527');
export default socket;
