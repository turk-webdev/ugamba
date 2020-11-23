module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('game_player_hand', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      game_player_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      deck_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      deck_card1_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      deck_card2_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      deck_card3_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      deck_card4_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      deck_card5_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      strength: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('game_player_hand');
  },
};
