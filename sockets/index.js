const socketIo = require('socket.io');

let io = {};
let user = {};

const init = (server, session) => {
  io = socketIo(server)
    .use((socket, next) => {
      session(socket.request, {}, next);
    })
    .on('connection', (socket) => {
      console.log('a user connected');
      user = socket.request.session.passport;
      if (user) {
        io.emit('set username', {
          username: user.user.username,
          color: Math.floor(Math.random() * 7),
          socketId: socket.id,
        });
      }

      socket.on('chat message', (msg) => {
        console.log('msg => ', msg, ' ', user.user.username);
        io.emit('chat message', { username: user.user.username, message: msg });
      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
};

// io.on('connection', (socket) => {
// console.log(socket.request.session.passport);
// console.log('a user connected');
// });

module.exports = {
  init,
  io,
};
