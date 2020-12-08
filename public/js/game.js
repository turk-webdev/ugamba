// eslint-disable-next-line no-undef
const socket = io();
const actionButtons = document.getElementsByClassName('action-button');
const messages = document.getElementById('messages');
const gameId = document.getElementById('game').getAttribute('data-it');
const chatText = document.getElementById('chat-input');
const chatSubmit = document.getElementById('chat-submit');
const chatInput = document.getElementById('chat-input');

const PlayerActions = {
  CHECK: 'check',
  BET: 'bet',
  CALL: 'call',
  RAISE: 'raise',
  FOLD: 'fold',
  LEAVE: 'leave',
  RESET: 'reset',
};
const messageTypes = [
  'has-text-primary',
  'has-text-link',
  'has-text-info',
  'has-text-success',
  'has-text-warning',
  'has-text-danger',
];

const chatMenuItem = document.getElementsByClassName('chat-menu-item');
if (chatMenuItem) {
  Array.from(chatMenuItem).forEach((button) => {
    /*
     * for each chat room button, the data-it associated with that button
     * is the id of the room you want to chat in.
     *
     */
    const id = button.getAttribute('data-it');
    button.addEventListener('click', () => {
      const activeRoom = document.getElementsByClassName(
        'chat-menu-item is-active',
      )[0];
      // If you click on a chat room, unubscribe from all chatrooms, join
      // the one you want, and clear the chat
      activeRoom.classList.remove('is-active');
      socket.emit('unsubscribe chat', activeRoom.getAttribute('data-it'));
      messages.innerHTML = '';
      button.classList.add('is-active');
      socket.emit('subscribe chat', id);
    });
  });
}
/*
 * **************************************************************
 *                      Helper functions
 * **************************************************************
 */
const addMessageToChat = (res) => {
  const textClassArr = ['is-size-6', 'mt-4'];
  const coloredNameClassArr = [messageTypes[res.color]];
  const li = document.createElement('li');
  const span = document.createElement('span');
  li.classList.add(...textClassArr);
  span.appendChild(document.createTextNode(`${res.username}: `));
  li.appendChild(span);
  li.appendChild(document.createTextNode(`${res.message}`));
  span.classList.add(...coloredNameClassArr);
  messages.appendChild(li);
  console.log('scrollheight => ', messages.scrollHeight);
  messages.scrollTop = messages.scrollHeight;
};
if (chatInput) {
  chatSubmit.addEventListener('click', (e) => {
    // get the room id of the currently active chat
    const room = document
      .getElementsByClassName('chat-menu-item is-active')[0]
      .getAttribute('data-it');
    e.preventDefault(); // prevents page reloading
    if (chatText.value) {
      socket.emit('chat message', { text: chatText.value, room });
      chatText.value = '';
    }
    return false;
  });
  chatInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      chatSubmit.click();
    }
  });
}
const makeGameActionRequest = async (gameAction = '', body = {}) => {
  await fetch(`${gameId}/${gameAction}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

Array.from(actionButtons).forEach((button) => {
  const gameAction = button.getAttribute('name');
  button.addEventListener('click', () => {
    if (
      gameAction === PlayerActions.BET ||
      gameAction === PlayerActions.RAISE
    ) {
      const actionAmount = document.getElementById('action-amount').value;
      makeGameActionRequest(gameAction, { amount: actionAmount });
    } else {
      makeGameActionRequest(gameAction);
    }
  });
});

/*
 * **************************************************************
 *                          Sockets
 * **************************************************************
 */
socket.on('leave game', () => {
  socket.emit('unsubscribe chat', gameId);
  console.log('hello world');
  window.location.href = `/`;
});
socket.on('testing', () => {
  alert('testing');
  console.log('hello');
});

const loadIntoGameRoom = () => {
  console.log('gameId => ', gameId);
  socket.emit('game room', gameId);
};
window.onload = loadIntoGameRoom();

socket.on('chat message', (res) => {
  addMessageToChat(res);
});

socket.on('unsubscribe chat', (user) => {
  const divClassArr = ['column', 'is-full', 'has-text-centered'];
  const liClassArr = ['has-text-grey-light', 'has-text-centered'];
  const div = document.createElement('div');
  const li = document.createElement('li');
  div.classList.add(...divClassArr);
  li.classList.add(...liClassArr);
  li.appendChild(
    document.createTextNode(`${user.username} has left the chat room`),
  );
  div.append(li);
  messages.appendChild(div);
  // messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('subscribe chat', (user) => {
  const divClassArr = ['column', 'is-full', 'has-text-centered'];
  const liClassArr = ['has-text-grey-light', 'has-text-centered'];
  const div = document.createElement('div');
  const li = document.createElement('li');
  div.classList.add(...divClassArr);
  li.classList.add(...liClassArr);
  li.appendChild(
    document.createTextNode(`${user.username} has joined the chat room`),
  );
  div.append(li);
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('status-msg', (msg) => {
  document.getElementById('error').innerHTML = msg;
});

socket.on('user update', (user) => {
  document.getElementById(
    user.id,
  ).children[1].innerHTML = `Money: ${user.money.toString()}`; // get the user element, and then update the player money value, which should be the second child element
  document.getElementById('error').innerHTML = '';
});

socket.on('game update', (min_bet, game_pot) => {
  document.getElementById(
    'min_bet',
  ).innerHTML = `Min Bet: ${min_bet.toString()}`;
  document.getElementById(
    'game_pot',
  ).innerHTML = `Game Pot: ${game_pot.toString()}`;
});
