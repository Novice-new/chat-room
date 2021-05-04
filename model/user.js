const sequelize = require('./db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userPwd: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  createdAt: false,
  updatedAt: false,
  paranoid: true,
})
module.exports = User;