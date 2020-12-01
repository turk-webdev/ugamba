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
      // join global chat on connection always
      socket.join('0');

      if (user && user.user) {
        user.user.color = _.random(5);
        user.user.socket = socket.id;
        socket.request.session.save();
      }

      socket.on('chat message', (msg) => {
        io.to(msg.room).emit('chat message', {
          username: user.user.username,
          message: msg.text,
          color: user.user.color,
        });
      });

      socket.on('unsubscribe chat', (room) => {
        // on unsubscribe, leave the room and tell everyone in the room
        socket.leave(room);
        socket.to(room).emit('unsubscribe chat', user.user);
      });

      socket.on('subscribe chat', (room) => {
        // on unsubscribe, join the room and tell everyone in the room
        socket.join(room);
        socket.to(room).emit('subscribe chat', user.user);
      });

      socket.on('join game room', (game_id) => {
        socket.join(game_id);
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
