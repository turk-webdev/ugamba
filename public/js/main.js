// eslint-disable-next-line no-undef
const socket = io();

const chatText = document.getElementById('chat-input');
const chatSubmit = document.getElementById('chat-submit');
const messages = document.getElementById('messages');
const chatInput = document.getElementById('chat-input');

const pageloader = document.getElementById('loader-wrapper');
const quickPlay = document.getElementById('quick-play');
const exitLoading = document.getElementById('exit-loading');
const joinExistingGame = document.getElementsByClassName('join-existing-game');
const chatMenuItem = document.getElementsByClassName('chat-menu-item');
const messageTypes = [
  'has-text-primary',
  'has-text-link',
  'has-text-info',
  'has-text-success',
  'has-text-warning',
  'has-text-danger',
];

if (joinExistingGame) {
  Array.from(joinExistingGame).forEach((button) => {
    const id = button.getAttribute('data-it');
    button.addEventListener('click', () => {
      window.location.href = `api/game/${id}`;
    });
  });
}

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
 *                        Event listeners
 * **************************************************************
 */
if (quickPlay) {
  quickPlay.addEventListener('click', (e) => {
    e.preventDefault(); // prevents page reloading
    pageloader.classList.add('is-loading');
    exitLoading.classList.remove('is-hidden');
    fetch('api/game/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
  exitLoading.addEventListener('click', (e) => {
    e.preventDefault(); // prevents page reloading
    pageloader.classList.remove('is-loading');
    exitLoading.classList.add('is-hidden');
  });
}

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
  messages.scrollTop = messages.scrollHeight;
};

/*
 * **************************************************************
 *                          Sockets
 * **************************************************************
 */
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

socket.on('join game', (res) => {
  // eslint-disable-next-line no-console
  socket.emit('join game room', res.game_id);
  window.location.href = `api/game/${res.game_id}`;
});
