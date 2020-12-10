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
        allowNull: false,
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      blind_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      player_folded: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      player_last_action: {
        type: Sequelize.STRING,
        allowNULL: true,
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('game_player');
  },
};
