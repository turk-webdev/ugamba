// eslint-disable-next-line no-undef
const socket = io();
const actionButtons = document.getElementsByClassName('action-button');
const dynamicButtons = document.getElementsByClassName('dynamic');
const messages = document.getElementById('messages');
const gameId = document.getElementById('game').getAttribute('data-it');
const chatText = document.getElementById('chat-input');
const chatSubmit = document.getElementById('chat-submit');
const chatInput = document.getElementById('chat-input');
const playersDiv = document.getElementById('players');
const communityCards = document.getElementById('community-cards');

const PlayerActions = {
  CHECK: 'check',
  BET: 'bet',
  CALL: 'call',
  RAISE: 'raise',
  FOLD: 'fold',
  LEAVE: 'leave',
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
  if (!document.getElementById(game_player.id)) {
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
    moneyP.innerHTML = `Money: $${game_player.money}`;
    usernameP.innerHTML = game_player.username;
    cardDiv1.classList.add(...cardDivClassArr);
    cardDiv2.classList.add(...cardDivClassArr);
    cardHandLi.appendChild(cardDiv1);
    cardHandLi.appendChild(cardDiv2);
    tableUl.appendChild(cardHandLi);
    const playerDiv = document.createElement('div');
    const playerDivClassArr = ['is-flex', 'is-flex-direction-column'];
    playerDiv.appendChild(moneyP);
    playerDiv.appendChild(usernameP);
    playerDiv.appendChild(infoDiv);
    playerDiv.appendChild(tableUl);
    playerDiv.classList.add(...playerDivClassArr);
    const playerWrapperDiv = document.createElement('div');
    const playerWrapperDivClassArr = [
      'column',
      'player-section',
      'has-background-success-dark',
      'is-3',
      'playingCards',
      'fourColours',
      'rotateHand',
      'm-3',
      'has-text-weight-bold',
      'is-size-5',
      'is-flex',
      'is-flex-direction-column',
      'is-align-items-center',
    ];
    cardHandLi.setAttribute('id', `hand-back${game_player.id}`);
    playerWrapperDiv.appendChild(playerDiv);
    playerWrapperDiv.setAttribute('id', game_player.id);
    playerWrapperDiv.classList.add(...playerWrapperDivClassArr);
    playersDiv.appendChild(playerWrapperDiv);
  }
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

  if (parseInt(min_bet) === 0) {
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
  const divClassArr = ['highlight'];
  const currPlayerTurn = document
    .getElementById('curr_turn')
    .getAttribute('data-it');

  if (parseInt(currPlayerTurn) !== 0) {
    document.getElementById(currPlayerTurn).classList.add(...divClassArr);
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
    .classList.remove('is-success', 'is-danger', 'column', 'notification');
  document.getElementById('error').innerHTML = '';
};
const clearPlayerCards = () => {
  const playergpid = document
    .getElementsByClassName('player-cards')[0]
    .getAttribute('id');
  const cardHandLi = document.getElementById(`card-hand${playergpid}`);
  if (cardHandLi === null) {
    return;
  }

  while (cardHandLi.firstChild) {
    cardHandLi.removeChild(cardHandLi.lastChild);
  }
};

const giveHiddenCards = () => {
  const { childNodes } = playersDiv;
  for (let i = 0; i < childNodes.length; i++) {
    if (childNodes[i].id) {
      console.log(childNodes[i].id);
      const gpid = playersDiv.childNodes[i].getAttribute('id');
      document.getElementById(`hand-back${gpid}`).innerHTML = '';

      const div1 = document.createElement('div');
      div1.classList.add('card', 'back');
      const div2 = document.createElement('div');
      div2.classList.add('card', 'back');
      document.getElementById(`hand-back${gpid}`).appendChild(div1);
      document.getElementById(`hand-back${gpid}`).appendChild(div2);
    }
  }
};

/*
 * **************************************************************
 *                          Sockets
 * **************************************************************
 */
socket.on('init game', (results) => {
  let gpid;
  clearPlayerCards();
  giveHiddenCards();
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

socket.on('user left', (game_player) => {
  document.getElementById(game_player.id).remove();
});
socket.on('game end', () => {
  document.getElementById(
    'winner-modal-content',
  ).innerHTML = `The game has ended. Sending you back home`;
  document.getElementById('winner-modal').classList.add('is-active');
  setTimeout(() => {
    document.getElementById('winner-modal').classList.remove('is-active');
    window.location.href = `/`;
  }, 3000);
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
    divClassArr = ['notification', 'is-success', 'column'];
  } else {
    divClassArr = ['notification', 'is-danger', 'column'];
  }
  const target = document.getElementById('error-field');
  target.classList.add(...divClassArr);
  document.getElementById('error').innerHTML = msg.msg;
  setTimeout(removeNotification, 3000);
});

socket.on('broadcast winner', (winner) => {
  document.getElementById(
    'winner-modal-content',
  ).innerHTML = `WINNER: ${winner.winner.username} with a pot of $${winner.pot}`;
  document.getElementById('winner-modal').classList.add('is-active');
  setTimeout(() => {
    document.getElementById('winner-modal').classList.remove('is-active');
    document.getElementById('winner-modal-content').innerHTML = '';
  }, 3000);
});

socket.on('user update', (gamePlayer) => {
  document.getElementById(
    `${gamePlayer.id}money`,
  ).innerHTML = `Money: ${gamePlayer.money.toString()}`;
  document.getElementById('error').innerHTML = '';
});

socket.on('game update', (game) => {
  const actionAmountInput = document.getElementById('action-amount');
  actionAmountInput.setAttribute('min', game.min_bet);
  actionAmountInput.setAttribute('value', game.min_bet + 1);
  document.getElementById('min_bet').setAttribute('data-it', game.min_bet);
  document.getElementById(
    'min_bet',
  ).innerHTML = `Min Bet: ${game.min_bet.toString()}`;
  document.getElementById('game_pot').setAttribute('data-it', game.game_pot);
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
  const divClassArr = ['highlight'];
  document.getElementById(id).classList.add(...divClassArr);
});

socket.on('turn-notification-off', (id) => {
  const divClassArr = ['highlight'];
  document.getElementById(id).classList.remove(...divClassArr);
});

socket.on('update-turn', (player) => {
  document
    .getElementById('curr_turn')
    .setAttribute('data-it', player.id.toString());
  document.getElementById(
    'curr_turn',
  ).innerHTML = `Current player turn: ${player.username.toString()}`;
});

socket.on('user fold', (id) => {
  if (document.getElementById(`hand-back${id}`)) {
    document.getElementById(`hand-back${id}`).innerHTML = '';
  }
  if (document.getElementById(`card-hand${id}`)) {
    document.getElementById(`card-hand${id}`).innerHTML = '';
  }
});

socket.on('add player', (game_player) => {
  addPlayerToPlayerDiv(game_player);
});
