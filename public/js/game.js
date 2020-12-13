// eslint-disable-next-line no-undef
const socket = io();
const actionButtons = document.getElementsByClassName('action-button');
const dynamicButtons = document.getElementsByClassName('dynamic');
const messages = document.getElementById('messages');
const gameId = document.getElementById('game').getAttribute('data-it');
const chatText = document.getElementById('chat-input');
const chatSubmit = document.getElementById('chat-submit');
const chatInput = document.getElementById('chat-input');
const gameRound = document.getElementById('game_round').getAttribute('data-it');
const communityCards = document.getElementById('community-cards');

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
 *                      Check Game Round Conditions
 * **************************************************************
 */
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
const addClick = () => {
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
};

const addPlayerToPlayerDiv = (game_player) => {
  const cardDiv1 = document.createElement('div');
  const cardDiv2 = document.createElement('div');
  const cardHandLi = document.createElement('li');
  cardHandLi.classList.add('card-hand');
  const tableUl = document.createElement('ul');
  tableUl.classList.add('card-hand');
  const infoDiv = document.createElement('div');
  const moneyP = document.createElement('p');
  const usernameP = document.createElement('p');
  const cardDivClassArr = ['card', 'back'];
  infoDiv.setAttribute('id', `${game_player.id}info`);
  moneyP.innerHTML = `Money: ${game_player.money}`;
  usernameP.innerHTML = game_player.username;
  infoDiv.appendChild(moneyP);
  infoDiv.appendChild(usernameP);
  cardDiv1.classList.add(...cardDivClassArr);
  cardDiv2.classList.add(...cardDivClassArr);
  cardHandLi.appendChild(cardDiv1);
  cardHandLi.appendChild(cardDiv2);
  tableUl.appendChild(cardHandLi);
  const playerDiv = document.createElement('div');
  playerDiv.setAttribute('id', game_player.id);
  playerDiv.appendChild(infoDiv);
  playerDiv.appendChild(tableUl);
  document.getElementById('players').appendChild(playerDiv);
};

const addButtons = () => {
  const min_bet = parseInt(
    document.getElementById('min_bet').getAttribute('data-it'),
  );
  const pClassArr = ['control'];
  const bClassArr = ['action-button', 'button', 'm-0'];
  const firstPNode = document.createElement('P');
  const secondPNode = document.createElement('P');
  const firstButtonNode = document.createElement('button');
  const secondButtonNode = document.createElement('button');
  firstPNode.classList.add(...pClassArr);
  firstButtonNode.classList.add(...bClassArr);
  secondPNode.classList.add(...pClassArr);
  secondButtonNode.classList.add(...bClassArr);

  if (min_bet === 0) {
    const betText = document.createTextNode('Bet');
    const checkText = document.createTextNode('Check');
    firstButtonNode.appendChild(betText);
    firstButtonNode.setAttribute('name', 'bet');
    secondButtonNode.appendChild(checkText);
    secondButtonNode.setAttribute('name', 'check');
    firstPNode.appendChild(firstButtonNode);
    secondPNode.appendChild(secondButtonNode);
    document.getElementById('user-action-buttons').appendChild(firstPNode);
    document.getElementById('user-action-buttons').appendChild(secondPNode);
  } else {
    const callText = document.createTextNode('Call');
    const raiseText = document.createTextNode('Raise');
    firstButtonNode.appendChild(callText);
    firstButtonNode.setAttribute('name', 'call');
    secondButtonNode.appendChild(raiseText);
    secondButtonNode.setAttribute('name', 'raise');
    firstPNode.appendChild(firstButtonNode);
    secondPNode.appendChild(secondButtonNode);
    document.getElementById('user-action-buttons').appendChild(firstPNode);
    document.getElementById('user-action-buttons').appendChild(secondPNode);
  }
  addClick();
};
window.onload = addButtons(actionButtons);

const turnOnHighlight = () => {
  const divClassArr = [
    'notification',
    'is-warning',
    'column',
    'is-one-fifth',
    'is-light',
  ];
  const currPlayerTurn = document
    .getElementById('curr_turn')
    .getAttribute('data-it');

  if (parseInt(currPlayerTurn) !== 0) {
    document
      .getElementById(`${currPlayerTurn}info`)
      .classList.add(...divClassArr);
  }
};
window.onload = turnOnHighlight();

const removeButtons = () => {
  const buttons = document.getElementById('user-action-buttons');
  buttons.removeChild(buttons.lastElementChild);
  buttons.removeChild(buttons.lastElementChild);
};

const removeNotification = () => {
  document
    .getElementById('error-field')
    .classList.remove('is-success', 'is-danger', 'column', 'is-one-quarter');
  document.getElementById('error').innerHTML = '';
};

/*
 * **************************************************************
 *                          Sockets
 * **************************************************************
 */
socket.on('init game', (results) => {
  let gpid;
  // document.getElementById(`card-hand${card.game_player_id}`).innerHTML = '';
  results.cards.forEach((card) => {
    if (document.getElementById(`card-hand${card.game_player_id}`)) {
      const carddiv = document.createElement('div');
      // const translatedCard = translateCard(card.id_card);
      gpid = `card-hand${card.game_player_id}`;
      const cardDivClassArr = [
        'card',
        `rank-${card.value_display}`,
        `${card.suit_display}`,
      ];
      const rankSpan = document.createElement('span');
      rankSpan.appendChild(document.createTextNode(card.value_display));
      rankSpan.classList.add('rank');
      const suitSpan = document.createElement('span');
      suitSpan.innerHTML = `&${card.suit_display};`;
      suitSpan.classList.add('suit');

      carddiv.classList.add(...cardDivClassArr);
      carddiv.appendChild(rankSpan);
      carddiv.appendChild(suitSpan);
      if (document.getElementById(gpid)) {
        document.getElementById(gpid).appendChild(carddiv);
      }
    }
  });
});

socket.on('update community cards', (results) => {
  communityCards.innerHTML = '';
  results.cards.forEach((card) => {
    const carddiv = document.createElement('div');
    const cardDivClassArr = [
      'card',
      `rank-${card.value_display}`,
      `${card.suit_display}`,
    ];
    const rankSpan = document.createElement('span');
    rankSpan.appendChild(document.createTextNode(card.value_display));
    rankSpan.classList.add('rank');
    const suitSpan = document.createElement('span');
    suitSpan.innerHTML = `&${card.suit_display};`;
    suitSpan.classList.add('suit');

    carddiv.classList.add(...cardDivClassArr);
    carddiv.appendChild(rankSpan);
    carddiv.appendChild(suitSpan);
    if (communityCards) {
      communityCards.appendChild(carddiv);
    }
  });
});

socket.on('leave game', () => {
  socket.emit('unsubscribe chat', gameId);
  window.location.href = `/`;
});

const loadIntoGameRoom = () => {
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
  let divClassArr = [];
  if (msg.type === 'success') {
    divClassArr = ['notification', 'is-success', 'column', 'is-one-quarter'];
  } else {
    divClassArr = ['notification', 'is-danger', 'column', 'is-one-quarter'];
  }
  const target = document.getElementById('error-field');
  target.classList.add(...divClassArr);
  document.getElementById('error').innerHTML = msg.msg;
  setTimeout(removeNotification, 3000);
});

socket.on('user update', (gamePlayer) => {
  document.getElementById(
    gamePlayer.id,
  ).childNodes[1].innerHTML = `Money: ${gamePlayer.money.toString()}`;
  document.getElementById('error').innerHTML = '';
});

socket.on('game update', (game) => {
  const actionAmountInput = document.getElementById('action-amount');
  actionAmountInput.setAttribute('min', game.min_bet);
  actionAmountInput.setAttribute('value', game.min_bet + 1);
  document
    .getElementById('min_bet')
    .getAttribute('data-it', game.min_bet.toString());
  document.getElementById(
    'min_bet',
  ).innerHTML = `Min Bet: ${game.min_bet.toString()}`;
  document
    .getElementById('game_pot')
    .setAttribute('data-it', game.game_pot.toString());
  document.getElementById(
    'game_pot',
  ).innerHTML = `Game Pot: ${game.game_pot.toString()}`;
  removeButtons();
  addButtons(dynamicButtons);
});

socket.on('round update', (game_round) => {
  document.getElementById('game_round').setAttribute('data-it', game_round);
  document.getElementById(
    'game_round',
  ).innerHTML = `Game Round: ${game_round.toString()}`;
});

socket.on('turn-notification-on', (id) => {
  const divClassArr = [
    'notification',
    'is-warning',
    'column',
    'is-one-fifth',
    'is-light',
  ];
  document.getElementById(`${id}info`).classList.add(...divClassArr);
});

socket.on('turn-notification-off', (id) => {
  const divClassArr = [
    'notification',
    'is-warning',
    'column',
    'is-one-fifth',
    'is-light',
  ];
  document.getElementById(`${id}info`).classList.remove(...divClassArr);
});

socket.on('update-turn', (id) => {
  document.getElementById('curr_turn').setAttribute('data-it', id.toString());
  document.getElementById(
    'curr_turn',
  ).innerHTML = `Current player turn: ${id.toString()}`;
});

socket.on('add player', (game_player) => {
  addPlayerToPlayerDiv(game_player);
});
