const socket = io();

const users = {};

const chatDiv = document.getElementById('chat');
chatDiv.scrollTop = chatDiv.scrollHeight;

const chatText = document.getElementById('chat-input');
const chatSubmit = document.getElementById('chat-submit');
const messages = document.getElementById('messages');

const messageTypes = [
  'is-dark',
  'is-primary',
  'is-link',
  'is-info',
  'is-success',
  'is-warning',
  'is-danger',
];

const addMessageToChat = (res) => {
  const classArr = ['message', users[res.username].color];
  const li = document.createElement('li');
  li.classList.add(...classArr);
  const messageHeader = document.createElement('div');
  messageHeader.classList.add('message-header');
  messageHeader.appendChild(document.createTextNode(`${res.username}`));

  const messageBody = document.createElement('div');
  messageBody.classList.add('message-body');
  messageBody.appendChild(document.createTextNode(`${res.message}`));

  li.appendChild(messageHeader);
  li.appendChild(messageBody);
  messages.appendChild(li);
};

chatSubmit.addEventListener('click', (e) => {
  e.preventDefault(); // prevents page reloading
  // console.log('chatText.value => ', chatText.value);
  if (chatText.value) {
    socket.emit('chat message', chatText.value);
    chatText.value = '';
  }
  return false;
});

socket.on('chat message', (res) => {
  // console.log('this is the message on the frontend => ', msg);
  console.log('res => ', res);
  addMessageToChat(res);
});

socket.on('set username', (user) => {
  users[user.username] = {
    color: messageTypes[user.color],
    username: user.socketId,
  };
});
