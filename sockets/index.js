const socketIo = require('socket.io');
const _ = require('lodash');

const DeckClass = require('../classes/deck');
const Game = require('../classes/game');

let io = {};

const init = (server, session) => {
  io = socketIo(server)
    .use((socket, next) => {
      session(socket.request, {}, next);
    })
    .on('connection', (socket) => {
      const user = socket.request.session.passport;
      // join global chat on connection always
      socket.join('chat-0');

      if (user && user.user) {
        user.user.color = _.random(5);
        user.user.socket = socket.id;
        socket.request.session.save();
      }

      socket.on('init game', (data) => {
        Game.findDeckByGameId(data.game_id).then((deck) => {
          // eslint-disable-next-line max-len
          DeckClass.getAllOwnedCardsInDeck(deck[0].id_deck).then(
            (playercards) => {
              socket.to(data.game_id).emit('init game', {
                cards: playercards,
              });
            },
          );
        });
      });

      socket.on('send community cards', (data) => {
        Game.findDeckByGameId(data.game_id).then((deck) => {
          // eslint-disable-next-line max-len
          DeckClass.getAllCommunityCardsInDeck(deck[0].id_deck).then(
            (communitycards) => {
              socket.to(data.game_id).emit('send community cards', {
                cards: communitycards,
              });
            },
          );
        });
      });

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

      socket.on('game room', (game_id) => {
        socket.join(game_id);
      });

      socket.on('disconnect', () => {});
    });
  return io;
};

module.exports = {
  init,
  io,
};
