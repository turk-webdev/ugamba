const Game = require('./game');
const GamePlayer = require('./game_player');
const User = require('./user');

const leaveHandler = async (req) => {
  const { game_id } = req.params;
  const { user } = req;
  const io = req.app.get('io');
  const userSocket = req.session.passport.user.socket;

  io.to(userSocket).emit('status-msg', {
    type: 'success',
    msg: 'Leaving...',
  });
  const gameplayer = await GamePlayer.getByUserIdAndGameId(user.id, game_id);

  io.to(userSocket).emit('leave game');
  io.to(game_id).emit('user left', gameplayer);
  await GamePlayer.removePlayer(user.id, game_id);
  const numPlayers = await Game.getNumPlayers(game_id);
  if (parseInt(numPlayers.count) <= 1) {
    io.to(game_id).emit('game end');
    await Game.delete(game_id);
    await GamePlayer.deleteAllPlayersFromGame(game_id);
  }
  return 1;
};

// we need to get the users money, validate bet
// if validated then we can remove the money from the user
// finally we can then add that amount to the game pot
const betHandler = async (req) => {
  const { game_id, game_action } = req.params;
  const { user } = req;
  const io = req.app.get('io');
  const userSocket = req.session.passport.user.socket;
  const action_amount = req.body.amount;
  const i_action_amount = parseInt(action_amount);

  const game_player = await GamePlayer.getByUserIdAndGameId(user.id, game_id);
  const user_money = await User.getMoneyById(user.id);
  const min_bid = await Game.getMinBet(game_id);

  const i_user_money = parseInt(Object.values(user_money));
  const i_min_bid = parseInt(Object.values(min_bid));

  if (i_action_amount === 0) {
    io.to(userSocket).emit('status-msg', {
      type: 'error',
      msg: 'Thats not a bet, use check instead!',
    });
    return 1;
  }
  if (i_user_money >= i_action_amount && i_action_amount >= i_min_bid) {
    const new_value = i_user_money - i_action_amount;
    await User.updateMoneyById(user.id, new_value);
    const gamePot = await Game.getGamePot(game_id);
    const i_game_pot = parseInt(Object.values(gamePot));
    const updated_game_pot = i_game_pot + i_action_amount;
    await Game.updateGamePot(game_id, i_game_pot + i_action_amount);
    await Game.updateMinBet(game_id, i_action_amount);
    await GamePlayer.updatePlayerLastAction(game_id, user.id, game_action);
    io.to(game_id).emit('user update', {
      id: game_player.id,
      money: new_value,
    });
    io.to(game_id).emit('game update', {
      min_bet: i_action_amount,
      game_pot: updated_game_pot,
    });
  } else {
    io.to(userSocket).emit('status-msg', {
      type: 'error',
      msg: 'You dont have enough money!',
    });
    return 1;
  }

  return 0;
};

// we need to get the users money, validate bet
// if validated then we can remove the money from the user
// finally we can then add that amount to the game pot
const callHandler = async (req) => {
  const { game_id, game_action } = req.params;
  const { user } = req;
  const io = req.app.get('io');
  const userSocket = req.session.passport.user.socket;

  const game_player = await GamePlayer.getByUserIdAndGameId(user.id, game_id);
  const user_money = await User.getMoneyById(user.id);
  const min_bid = await Game.getMinBet(game_id);

  const i_user_money = parseInt(Object.values(user_money));
  const i_min_bid = parseInt(Object.values(min_bid));

  if (i_user_money >= i_min_bid) {
    const new_value = i_user_money - i_min_bid;
    await User.updateMoneyById(user.id, new_value);
    const gamePot = await Game.getGamePot(game_id);
    const i_game_pot = parseInt(Object.values(gamePot));
    const updated_game_pot = i_game_pot + i_min_bid;
    await Game.updateGamePot(game_id, i_game_pot + i_min_bid);
    await GamePlayer.updatePlayerLastAction(game_id, user.id, game_action);
    io.to(game_id).emit('user update', {
      id: game_player.id,
      money: new_value,
    });
    io.to(game_id).emit('game update', {
      min_bet: i_min_bid,
      game_pot: updated_game_pot,
    });
  } else {
    io.to(userSocket).emit('status-msg', {
      type: 'error',
      msg: 'You dont have enough money!',
    });
  }
};

// we need to get the users money, validate bet
// if validated then we can remove the money from the user
// finally we can then add that amount to the game pot
const raiseHandler = async (req) => {
  const { game_id, game_action } = req.params;
  const { user } = req;
  const io = req.app.get('io');
  const userSocket = req.session.passport.user.socket;
  const action_amount = req.body.amount;
  const i_action_amount = parseInt(action_amount);

  const game_player = await GamePlayer.getByUserIdAndGameId(user.id, game_id);
  const user_money = await User.getMoneyById(user.id);
  const min_bid = await Game.getMinBet(game_id);

  const i_user_money = parseInt(Object.values(user_money));
  const i_min_bid = parseInt(Object.values(min_bid));

  if (i_user_money >= i_action_amount + i_min_bid && i_action_amount !== 0) {
    const new_value = i_user_money - i_action_amount - i_min_bid;
    await User.updateMoneyById(user.id, new_value);
    const gamePot = await Game.getGamePot(game_id);
    const i_game_pot = parseInt(Object.values(gamePot));
    const updated_game_pot = i_game_pot + i_action_amount + i_min_bid;
    await Game.updateGamePot(game_id, updated_game_pot);
    await Game.updateMinBet(game_id, i_action_amount + i_min_bid);
    await GamePlayer.updatePlayerLastAction(game_id, user.id, game_action);
    io.to(game_id).emit('user update', {
      id: game_player.id,
      money: new_value,
    });
    io.to(game_id).emit('game update', {
      min_bet: i_action_amount + i_min_bid,
      game_pot: updated_game_pot,
    });
  } else if (i_action_amount === 0) {
    io.to(userSocket).emit('status-msg', {
      type: 'error',
      msg: 'Thats not a raise, use Call instead!',
    });
    return 1;
  } else {
    io.to(userSocket).emit('status-msg', {
      type: 'error',
      msg: 'You dont have enough money!',
    });
    return 1;
  }

  return 0;
};

const foldHandler = async (req) => {
  const { game_id, game_action } = req.params;
  const { user } = req;
  const io = req.app.get('io');
  const userSocket = req.session.passport.user.socket;
  const game_player = await GamePlayer.getByUserIdAndGameId(user.id, game_id);

  io.to(userSocket).emit('status-msg', {
    type: 'success',
    msg: 'Folded!',
  });
  io.to(game_id).emit('user fold', game_player.id);

  await GamePlayer.setPlayertoFold(user.id, game_id);
  await GamePlayer.updatePlayerLastAction(game_id, user.id, game_action);
};

module.exports = {
  leaveHandler,
  betHandler,
  callHandler,
  raiseHandler,
  foldHandler,
};
