const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const index = require('./routes/index');

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New client connected!');

    // TODO: Place in a different file
    socket.on('enterName', (name) => {
        console.log(name, 'joined the game!')
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected :(');
    });
});

const port = process.env.PORT || 4001;
server.listen(port, () => console.log('Listening on port', port));