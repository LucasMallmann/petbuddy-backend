module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'token_created_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'token_created_at');
  },
};
