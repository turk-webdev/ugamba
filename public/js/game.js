// eslint-disable-next-line no-undef
const actionButtons = document.getElementsByClassName('action-button');
const actionAmount = document.getElementById('action-amount').value;
const gameId = document.getElementById('game').getAttribute('data-it');

const PlayerActions = {
  CHECK: 'check',
  BET: 'bet',
  CALL: 'call',
  RAISE: 'raise',
  FOLD: 'fold',
  LEAVE: 'leave',
};

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
    console.log('uhh it got here');
    if (
      gameAction === PlayerActions.BET ||
      gameAction === PlayerActions.RAISE
    ) {
      makeGameActionRequest(gameAction, { amount: actionAmount });
    }
    makeGameActionRequest(gameAction);
  });
});

// eslint-disable-next-line no-undef
socket.on('leave game', () => {
  // eslint-disable-next-line no-undef
  socket.emit('unsubscribe chat', gameId);
  console.log('hello world');
  window.location.href = `/`;
});
