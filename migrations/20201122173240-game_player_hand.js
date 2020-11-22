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
