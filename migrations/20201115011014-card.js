module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('card', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      suit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      suit_display: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      value_display: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('card');
  },
};
