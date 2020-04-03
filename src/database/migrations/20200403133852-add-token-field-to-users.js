module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'token', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'token');
  },
};
