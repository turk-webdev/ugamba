'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'game_action',
      {  
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        id_deal: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        id_game_player: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        game_action: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        game_action_display: {
          type: Sequelize.STRING,
          allowNull: false
        }
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('game_action');
  }
};