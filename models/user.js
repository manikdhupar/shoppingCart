const Sequelize = require('sequelize');
const sequelize = require('../util/database');

module.exports = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  email: Sequelize.STRING,
  name: Sequelize.STRING
});
