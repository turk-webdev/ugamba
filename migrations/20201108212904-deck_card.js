module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deck_card', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_card: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      id_deck: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      game_player_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('deck_card');
  },
};
