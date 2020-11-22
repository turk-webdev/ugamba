// eslint-disable-next-line no-undef
const socket = io();

const chatText = document.getElementById('chat-input');
const chatSubmit = document.getElementById('chat-submit');
const messages = document.getElementById('messages');
const chatInput = document.getElementById('chat-input');

const pageloader = document.getElementById('loader-wrapper');
const quickPlay = document.getElementById('quick-play');
const exitLoading = document.getElementById('exit-loading');
const messageTypes = [
  'has-text-primary',
  'has-text-link',
  'has-text-info',
  'has-text-success',
  'has-text-warning',
  'has-text-danger',
];

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
    console.log('EVENTTARGETID: ', e.target.id);
    const data = { id: 22 };
    fetch('api/game/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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
    e.preventDefault(); // prevents page reloading
    if (chatText.value) {
      socket.emit('chat message', chatText.value);
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
};

/*
 * **************************************************************
 *                          Sockets
 * **************************************************************
 */
socket.on('chat message', (res) => {
  addMessageToChat(res);
});

socket.on('join game', (res) => {
  // eslint-disable-next-line no-console
  console.log('hit test');
  window.location.href = `api/game/join/${res.game_id}`;
});
