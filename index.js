require("./init");
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// 跨域中间件
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, "*");
        return;
      }
      callback(null, origin);
    },
    credentials: true,
  })
);

// 静态文件中间件
// 静态文件默认为打包后的前端dist目录
app.use(express.static(path.resolve(__dirname, "./client/dist")));

// 上传文件中间件
app.use('/upload', require('./uploadMid'));

require('./chatSev')(server);
server.listen(9527, () => {
  console.log("server listening 9527");
})
