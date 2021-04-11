module.exports = (io, socket) => {
    const enterUser = (payload) => {

    }

    const exitUser = (userId, callback) => {

    }

    socket.on('user:enter', enterUser);
    socket.on('user:exit', exitUser);
}