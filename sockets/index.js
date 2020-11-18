const socketIo = require('socket.io');
const _ = require('lodash');

let io = {};

const init = (server, session) => {
  io = socketIo(server)
    .use((socket, next) => {
      session(socket.request, {}, next);
    })
    .on('connection', (socket) => {
      const user = socket.request.session.passport;
      if (user.user) {
        user.user.color = _.random(5);
        user.user.socket = socket.id;
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

// io.on('connection', (socket) => {
// console.log(socket.request.session.passport);
// console.log('a user connected');
// });

module.exports = {
  init,
  io,
};
