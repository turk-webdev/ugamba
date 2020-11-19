const socketIo = require('socket.io');
const _ = require('lodash');

let io = {};

const init = (server, session) => {
  io = socketIo(server)
    .use((socket, next) => {
      session(socket.request, {}, next);
    })
    .on('connection', (socket) => {
      console.log('a user connected');
      const user = socket.request.session.passport;

      if (user && user.user) {
        user.user.color = _.random(5);
        user.user.socket = socket.id;
        socket.request.session.save();
      }

      socket.on('chat message', (msg) => {
        io.emit('chat message', {
          username: user.user.username,
          message: msg,
          color: user.user.color,
        });
      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  return io;
};

module.exports = {
  init,
  io,
};
