const User = require('../model/user');
const pick = require('../util/pickProp');
const { Op } = require('sequelize');

exports.addUser = async function (userObj) {
  userObj = pick(userObj, "username", "userPwd", "img");
  const result = await User.create(userObj);
  return result.toJSON();
}
exports.updateUser = async function (id, userObj) {
  return await User.update(userObj, {
    where: {
      id,
    }
  });
}
exports.deleteUser = async function (id) {
  return await User.destroy({
    where: {
      id,
    }
  })
}
exports.login = async function (username, userPwd) {
  const result = await User.findOne({
    attributes: ['username', 'img'],
    where: {
      username,
      userPwd,
    }
  });
  if (result) {
    return result.toJSON();
  }
  return null;
}
exports.getUserById = async function (id) {
  const result = await User.findByPk(id);
  return result.toJSON();
}
exports.getAllUser = async function (username = "") {
  const where = {};
  if (username) {
    where.username = {
      [Op.like]: `%${username}%`,
    };
  }
  const result = await User.findAll({
    attributes: ["username", "img"],
    where,
  });
  return JSON.parse(JSON.stringify(result));
}