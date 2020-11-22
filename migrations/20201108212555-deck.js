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

  down: async (queryInterface) => {
    return queryInterface.dropTable('deck');
  },
};
