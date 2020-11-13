'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'deck_card',
      {  
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        id_card: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        id_deck: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        id_game_player_hand: {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('deck_card');
  }
};
