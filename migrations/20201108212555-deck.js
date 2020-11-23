module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('deck', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('deck');
  },
};
