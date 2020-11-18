const socket = io();

const chatText = document.getElementById('chat-input');
const chatSubmit = document.getElementById('chat-submit');
const messages = document.getElementById('messages');
const chatInput = document.getElementById('chat-input');

const pageloader = document.getElementById('loader-wrapper');
const quickPlay = document.getElementById('quick-play');
const exitLoading = document.getElementById('exit-loading');
quickPlay.addEventListener('click', (e) => {
  e.preventDefault(); // prevents page reloading
  pageloader.classList.add('is-loading');
  exitLoading.classList.remove('is-hidden');
});
exitLoading.addEventListener('click', (e) => {
  e.preventDefault(); // prevents page reloading
  pageloader.classList.remove('is-loading');
  exitLoading.classList.add('is-hidden');
});

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

const messageTypes = [
  'has-text-primary',
  'has-text-link',
  'has-text-info',
  'has-text-success',
  'has-text-warning',
  'has-text-danger',
];

const addMessageToChat = (res) => {
  const textClassArr = ['is-size-6', 'mt-4'];
  // console.log('res=>', messageTypes[res.color]);
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

socket.on('chat message', (res) => {
  addMessageToChat(res);
});

socket.on('test', (test) => {
  console.log('hit test');
});
