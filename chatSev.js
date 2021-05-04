const socketIO = require('socket.io');
const userSev = require('./service/userSev');
const cors = require('cors');
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
        socket.emit('login', result);
        // 用户登录成功后告诉其他用户有新用户登录
        socket.broadcast.emit('userin', curUser);
        return;
      }
      socket.emit('login', false);
    })

    // 用户发送消息
    socket.on('msg', chunk => {
      if (chunk.to === null) {
        socket.broadcast.emit("msg", {
          from: curUser,
          to: chunk.to,
          content: chunk.content,
          time: chunk.time,
        });
      } else {
        const toSocket = user.find(item => {
          return item.userInfo.username === chunk.to.username;
        });
        if (toSocket) {
          toSocket.socket.emit('msg', chunk);
        } else {
          socket.emit('msg', {
            isOffline: true,
          });
        }
      }
    })

    // 获取所有在线用户与未上线用户
    socket.on('user', async () => {
      const users = await userSev.getAllUser();
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
      socket.emit('user', {
        userOnline,
        userOffline,
      });
    });

    // 登出
    socket.on('disconnect', () => {
      console.log("登出");
      user = user.filter(item => item.userInfo.username !== curUser.username);
      socket.broadcast.emit('userout', curUser);
    })
    socket.on('logout', chunk => {
      console.log("logout");
      user = user.filter(item => item.userInfo.username !== chunk.username);
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
  })
}