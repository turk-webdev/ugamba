'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'game',
      {  
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        num_players: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1
        },
        id_deck: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        game_pot: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        }
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('game');
  }
};
