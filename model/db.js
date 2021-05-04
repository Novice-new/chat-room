const { Sequelize } = require('sequelize');
const sequelize = new Sequelize("chatroom", "root", "20000527", {
  host: "localhost",
  dialect: 'mysql',
  logging: null,
})
module.exports = sequelize;
