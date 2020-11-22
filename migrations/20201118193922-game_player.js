module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('game_player', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_game: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      id_player: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('game_player');
  },
};
