const socketIo = require('socket.io');
const _ = require('lodash');

// const GamePlayer = require('../classes/game_player');
const DeckClass = require('../classes/deck');
const Game = require('../classes/game');

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
      socket.join('chat-0');
      // eslint-disable-next-line max-len
      // io.to(`user-${id}`).emit('game init', {cards: Deck.getallcardsforuser, id});
      // socket.join(`user-${user.user.id}`);

      if (user && user.user) {
        user.user.color = _.random(5);
        user.user.socket = socket.id;
        socket.request.session.save();
      }

      socket.on('init game', (data) => {
        console.log('---- SOCKET_INIT_GAME DATA: ', data);
        console.log('---- USER INFO: ', user.user.id);
        Game.findDeckByGameId(data.game_id).then((deck) => {
          // eslint-disable-next-line max-len
          DeckClass.getAllOwnedCardsInDeck(deck[0].id_deck).then(
            (playercards) => {
              console.log('---- SOCKETS PLAYERCARDS: ', playercards);
              socket.to(data.game_id).emit('init game', {
                cards: playercards,
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
