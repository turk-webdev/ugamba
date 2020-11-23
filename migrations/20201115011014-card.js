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
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('card');
  },
};
