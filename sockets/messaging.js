const io = require('./index');

io.on('connection', (socket) => {
  console.log(socket.request.session.passport);
  console.log('a user connected');
});
