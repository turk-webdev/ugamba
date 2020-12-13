/* eslint-disable */
const Game = require('./game');
const GamePlayer = require('./game_player');
const User = require('./user');

const updateGamePot = async (gameId, deltaBalance) => {
    const currPot = await Game.getGamePot(gameId);
    await Game.updateGamePot(gameId, parseInt(Object.values(currPot) + deltaBalance));
    return await Game.getGamePot(gameId);
};

// we need to get the users money, validate bet
// if validated then we can remove the money from the user
// finally we can then add that amount to the game pot
const betHandler = async (req, res) => {
    const { game_id, game_action } = req.params;
    const { user } = req;
    const actionAmount = req.body.amount;
    const actionAmountInt = parseInt(actionAmount);
    const userMoney = await User.getMoneyById(user.id);
    const minBet = await Game.getMinBet();
    const userMoneyInt = parseInt(Object.values(userMoney));
    const minBetInt = parseInt(Object.values(minBet));

    if (actionAmountInt === 0) {
        io.to(userSocket).emit('status-msg', {
        type: 'error',
        msg: 'Thats not a bet, use check instead!',
        });
        return res.send('error');
    }

    // If all is a-ok, then update pot & wallet and ping all sockets
    // otherwise, ping error on socket
    if (userMoneyInt >= actionAmountInt && actionAmountInt >= minBetInt) {
        const new_value = userMoneyInt - actionAmountInt;
        await User.updateMoneyById(user.id, new_value);
        const updated_game_pot = updateGamePot(game_id, actionAmountInt);
        await Game.updateMinBet(game_id, actionAmountInt);
        
        await GamePlayer.updatePlayerLastAction(game_id, user.id, game_action);
        
        io.to(userSocket).emit('user update', {
            id: game_player.id,
            money: new_value,
        });

        io.to(game_id).emit('game update', {
            min_bet: actionAmountInt,
            game_pot: updated_game_pot,
        });
    } else {
        io.to(userSocket).emit('status-msg', {
            type: 'error',
            msg: 'You dont have enough money!',
        });
        return res.send('error');
    }
};

const checkHandler = async (io) => {
    // TODO: review
    // literally nothing happens, signify in user game window by greying
    // out actions for that 'turn'?
    await GamePlayer.updatePlayerLastAction(game_id, user.id, game_action);
    io.to(userSocket).emit('status-msg', {
      type: 'success',
      msg: 'Checked!',
    });
};

// we need to get the users money, validate bet
// if validated then we can remove the money from the user
// finally we can then add that amount to the game pot
const callHandler = async (req, res) => {
    const { game_id, game_action } = req.params;
    const { user } = req;
    const user_money = await User.getMoneyById(user.id);
    const min_bid = await Game.getMinBet(game_id);
    const i_user_money = parseInt(Object.values(user_money));
    const i_min_bid = parseInt(Object.values(min_bid));

    if (i_user_money >= i_min_bid) {
        // Update monies
        const new_value = i_user_money - i_min_bid;
        await User.updateMoneyById(user.id, new_value);
        const updated_game_pot = updateGamePot(game_id, i_min_bid);

        // Notify sockets
        await GamePlayer.updatePlayerLastAction(game_id, user.id, game_action);
        io.to(userSocket).emit('user update', {
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

const resetHandler = async (req, res) => {
    const { game_id } = req.params;
    const { user } = req;

    await Game.updateGamePot(game_id, 0);
    await Game.updateMinBet(game_id, 0);
    await User.updateMoneyById(user.id, 1000);

    const user_money = await User.getMoneyById(user.id);
    const min_bid = await Game.getMinBet(game_id);
    const i_user_money = parseInt(Object.values(user_money));
    const i_min_bid = parseInt(Object.values(min_bid));
    const gamePot = await Game.getGamePot(game_id);
    const i_game_pot = parseInt(Object.values(gamePot));
    
    io.to(userSocket).emit('user update', {
      id: user.id,
      money: i_user_money,
    });
    io.to(game_id).emit('game update', {
      min_bet: i_min_bid,
      game_pot: i_game_pot,
    });
    io.to(userSocket).emit('status-msg', {
      type: 'success',
      msg: 'Reset!',
    });
};

// we need to get the users money, validate bet
// if validated then we can remove the money from the user
// finally we can then add that amount to the game pot
const raiseHandler = async (req, res) => {
    const { user } = req;
    const { game_id, game_action } = req.params;
    const i_action_amount = parseInt(req.body.amount);
    const user_money = await User.getMoneyById(user.id);
    const min_bid = await Game.getMinBet(game_id);
    const i_user_money = parseInt(Object.values(user_money));
    const i_min_bid = parseInt(Object.values(min_bid));

    if (i_user_money >= i_action_amount + i_min_bid && i_action_amount !== 0) {
        // Update the monies
        const new_value = i_user_money - i_action_amount - i_min_bid;
        await User.updateMoneyById(user.id, new_value);
        const updated_game_pot = updateGamePot(game_id, (i_action_amount + i_min_bid));
        await Game.updateMinBet(game_id, (i_action_amount + i_min_bid));
        
        // Update & notify player
        await GamePlayer.updatePlayerLastAction(game_id, user.id, game_action);
        io.to(userSocket).emit('user update', {
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
        return res.send('error');
    } else {
        io.to(userSocket).emit('status-msg', {
            type: 'error',
            msg: 'You dont have enough money!',
        });
        return res.send('error');
    }
};

const processLeave = async (req, res) => {
    const { game_id } = req.params;
    const { user } = req;
    const io = req.app.get('io');
    const userSocket = req.session.passport.user.socket;

    io.to(userSocket).emit('status-msg', {
        type: 'success',
        msg: 'Leaving...',
    });
    const gameplayer = await GamePlayer.getByuser.idAndGameId(user.id, game_id);

    io.to(userSocket).emit('leave game');
    io.to(game_id).emit('user left', gameplayer);
    await GamePlayer.removePlayer(user.id, game_id);
    const numPlayers = await Game.getNumPlayers(game_id);

    // Close the game if there's not enough players after player leaves
    if (parseInt(numPlayers.count) <= 1) {
        io.to(game_id).emit('game end');
        await Game.delete(game_id);
        await GamePlayer.deleteAllPlayersFromGame(game_id);
    }

    return res.send('error');
};

module.exports = {
    processLeave,
    betHandler,
    checkHandler,
    callHandler,
    raiseHandler,
    resetHandler,
};