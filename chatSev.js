const socketIO = require('socket.io');
const userSev = require('./service/userSev');
const fs = require('fs');
const path = require('path');
let user = [];

module.exports = function (server) {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"],
      credentials: true,
    }
  });
  io.on('connection', socket => {
    let curUser = {};
    // 登录
    socket.on('login', async chunk => {
      const result = await userSev.login(chunk.username, chunk.userPwd);
      if (result) {
        user.push({
          userInfo: result,
          socket,
        })
        curUser = result;
        // 返回成功登陆的信息
        socket.emit('login', curUser);
        // 用户登录成功后告诉其他用户有新用户登录
        socket.broadcast.emit('userin', curUser);
        return;
      }
      // 用户不存在返回失败消息
      socket.emit('login', false);
    })

    // 用户发送消息
    socket.on('msg', chunk => {
      // 如果chunk.to为null代表是群消息
      if (chunk.to === null) {
        // 给所有在线用户广播
        socket.broadcast.emit("msg", {
          from: curUser,
          to: chunk.to,
          content: chunk.content,
          time: chunk.time,
        });
      } else {
        // 找到对应的用户，向其发送消息
        const toSocket = user.find(item => {
          return item.userInfo.username === chunk.to.username;
        }).socket;
        toSocket.emit('msg', chunk);
      }
    })

    // 获取所有在线用户与未上线用户
    socket.on('user', async () => {
      // 在数据库中拿到所有用户
      const users = await userSev.getAllUser();
      // 将这些用户分为在线与离线
      const userOnline = user.map(item => item.userInfo);
      const userOffline = users.filter(item => {
        for (let i = 0; i < userOnline.length; i++) {
          const online = userOnline[i];
          if (item.username == online.username && item.img == online.img) {
            return false;
          }
        }
        return true;
      });
      // 将数据返回给客户
      socket.emit('user', {
        userOnline,
        userOffline,
      });
    });

    // 登出
    socket.on('disconnect', () => {
      user = user.filter(item => item.userInfo.username !== curUser.username);
      socket.broadcast.emit('userout', curUser);
    })
    socket.on('logout', () => {
      user = user.filter(item => item.userInfo.username !== curUser.username);
      socket.broadcast.emit('userout', curUser);
    });

    // 注册
    socket.on('register', async (chunk) => {
      const result = await userSev.getAllUser(chunk.username);
      if (result.length > 0) {
        socket.emit('register', {
          state: 'fail',
          msg: '该用户名已存在',
        })
      } else {
        const res = await userSev.addUser(chunk);
        console.log(res);
        socket.emit('register', {
          state: 'success',
          msg: '成功添加',
        })
      }
    })

    // 更新头像（删除旧头像）
    socket.on('updateAvater', chunk => {
      const oldPath = path.resolve(__dirname, "./client/public", chunk);
      fs.unlink(oldPath);
    })
  })
}