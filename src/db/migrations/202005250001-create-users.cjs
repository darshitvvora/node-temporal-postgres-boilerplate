const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      mobile: DataTypes.STRING,
      suspend_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      updated_by: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
      deleted_by: DataTypes.INTEGER,
      created_on: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_on: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_on: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('users');
  },
};
