const User = require("../model/user");
const Mock = require('mockjs');
const data = Mock.mock({
  'data|5-10': [{
    "username": "@cname",
    "userPwd|8": "@character(\"number\")",
    "img": "'@url('http')'"
  }],
}).data;
User.bulkCreate(data).then(res => {
  console.log(JSON.parse(JSON.stringify(res)));
})