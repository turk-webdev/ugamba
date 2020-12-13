/**
 * ---- DEV ONLY ----
 * For a working demo of this functionality & to see what the
 * returned JSON looks like, use the link below
 *
 * https://repl.it/join/wjpidpxb-turkwebdev
 */

// eslint-disable guard-for-in
const NUM_SUITS_IN_DECK = 4;
const NUM_VALUES_IN_DECK = 13;
const NUM_CARDS_IN_HAND = 5;
// eslint-disable-next-line no-restricted-properties
const ACE_VALUE = Math.pow(2, 13);
// eslint-disable-next-line prefer-numeric-literals
const STRAIGHT_LOW_ACE_INDICATOR = parseInt('10000000011110', 2);
const TEN_CARD_POSITION = 9;
// eslint-disable-next-line no-restricted-properties
const RANK_BASE_VALUE = Math.pow(10, 9);

/*
 *  The below function was adapted from an article on determining poker wins
 *  without using conditionals
 *  SOURCE: https://medium.com/javascript-in-plain-english/building-a-poker-hand-evaluator-without-conditional-branches-556c39c8e33e
 */
/**
 * This function returns a JSON object with details about the hand & win rank
 * @param {int[]} hand - contains the id's for the 5 cards in a hand
 */
const getHandWins = (hand) => {
  const suits = new Array(NUM_SUITS_IN_DECK).fill(0);
  const values = new Array(NUM_VALUES_IN_DECK).fill(0);

  // Convert each card
  hand.forEach((card) => {
    suits[Math.floor(card / NUM_VALUES_IN_DECK)] += 1;
    values[card % NUM_VALUES_IN_DECK] += 1;
  });

  // We calculate the rank value for each hand
  // this makes it so we don't have to worry about ties as it is impossible
  // for players to have identical hands
  let rankValue = values.reduce((total, val, index) => {
    if (val === 1) {
      // eslint-disable-next-line no-restricted-properties
      total += Math.pow(2, index + 1);
    } else if (val > 1) {
      // eslint-disable-next-line no-restricted-properties
      total += Math.pow(2, index + 1) * ACE_VALUE * val;
    } else {
      return 0;
    }

    return total;
  });

  const firstCardIndex = values.findIndex((entry) => entry === 1);
  const ranks = {
    royal_flush: false,
    straight_flush: false,
    quads: values.some((entry) => entry === 4),
    full_house: values.filter((entry) => entry !== 0).length === 2,
    flush: suits.some((entry) => entry === NUM_CARDS_IN_HAND),
    straight:
      values
        .slice(firstCardIndex, firstCardIndex + NUM_CARDS_IN_HAND)
        .filter((entry) => entry === 1).length === 5 ||
      rankValue === STRAIGHT_LOW_ACE_INDICATOR,
    trips: values.some((entry) => entry === 3),
    two_pair: values.filter((entry) => entry === 2).length === 2,
    pair: values.filter((entry) => entry === 2).length === 1,
    high_card: true,
  };

  ranks.straight_flush = ranks.straight && ranks.flush;
  ranks.royal_flush =
    ranks.straight_flush && firstCardIndex === TEN_CARD_POSITION;

  let rankIndex = 0;
  let rankDescription = '';
  Object.keys(ranks).every((key, index) => {
    rankIndex = 10 - index;
    rankDescription = key;
    return !ranks[key];
  });

  rankValue +=
    rankIndex * RANK_BASE_VALUE -
    ((rankValue === STRAIGHT_LOW_ACE_INDICATOR && ACE_VALUE - 1) || 0);
  rankDescription = rankDescription
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return {
    hand,
    suits,
    values,
    rankValue,
    ranks,
    rankDescription,
  };
};

const getBestWins = (allWinningHands) => {
  const bestWinningHands = {};
  // eslint-disable-next-line guard-for-in
  for (const gamePlayerId in allWinningHands) {
    let highestRankValue;
    let highestRankKey;
    // eslint-disable-next-line guard-for-in
    for (const hands in allWinningHands[gamePlayerId]) {
      const entry = allWinningHands[gamePlayerId][hands];
      if (highestRankValue === undefined && highestRankKey === undefined) {
        highestRankValue = entry.rankValue;
        highestRankKey = hands;
      }

      highestRankKey =
        entry.rankValue > highestRankValue ? hands : highestRankKey;
      highestRankValue = Math.max(entry.rankValue, highestRankValue);
    }

    bestWinningHands[gamePlayerId] =
      allWinningHands[gamePlayerId][highestRankKey];
  }
  return bestWinningHands;
};

const findWinner = (bestWinningHands) => {
  let highestRankValue;
  let highestRankKey;
  // eslint-disable-next-line guard-for-in
  for (const gamePlayerId in bestWinningHands) {
    if (highestRankValue === undefined && highestRankKey === undefined) {
      highestRankValue = bestWinningHands[gamePlayerId].rankValue;
      highestRankKey = gamePlayerId;
    }

    highestRankKey =
      bestWinningHands[gamePlayerId].rankValue > highestRankValue
        ? gamePlayerId
        : highestRankKey;
    highestRankValue =
      bestWinningHands[gamePlayerId].rankValue > highestRankValue
        ? bestWinningHands[gamePlayerId].rankValue
        : highestRankValue;
  }

  // Adding the id as a field to the response being sent back
  // eslint-disable-next-line dot-notation
  bestWinningHands[highestRankKey]['id'] = highestRankKey;
  return bestWinningHands[highestRankKey];
};

/**
 * @return {JSON} - object containing the winning player's information
 * @param {JSON} playerHands - a JSON object that holds arrays of
 * the various 5-card combinations for each player. See below for example
 *
 * playerHands = {
 *  $game_player_id: {
 *    hands: {
 *      0: [1,2,3,4,5],
 *      1: [6,7,8,9,10],
 *      etc...
 *    }
 *  },
 *  $game_player_id: ...
 * }
 */

const getWinningPlayer = (playerHands) => {
  const allWinningHands = {};
  // eslint-disable-next-line guard-for-in
  for (const gamePlayerId in playerHands) {
    allWinningHands[gamePlayerId] = {};
    // TODO: Validation & error handling
    const { hands } = playerHands[gamePlayerId];
    for (let i = 0; i < Object.keys(hands).length; i++) {
      allWinningHands[gamePlayerId][`hand${i}`] = getHandWins(hands[i]);
    }
  }

  // We now have the ranks for each possible hand of every player
  // Now we must find the best win for each player
  const bestWinningHands = getBestWins(allWinningHands);
  return findWinner(bestWinningHands);
};

module.exports = {
  getWinningPlayer,
};
