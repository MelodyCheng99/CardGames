const server = require('http').createServer();
const io = require('socket.io')(server);

const registerUserHandlers = require('./userHandler');

const onConnection = (socket) => {
    registerUserHandlers(io, socket);
}

io.on('connection', onConnection);