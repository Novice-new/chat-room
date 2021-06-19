// 处理图片上传
const multer = require('multer');
const path = require('path')
const storage = multer.diskStorage({
  // 文件保存到哪里
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "./client/public/avater"));
  },
  // 确定文件名
  filename: function (req, file, cb) {
    // 时间戳-6位随机字符.文件后缀

    // 当前时间的时间戳
    const timeStamp = Date.now();
    // 随机6位字符
    const ramdomStr = Math.random().toString(36).slice(-6);
    // 通过发送来的文件名确定文件的后缀名
    const ext = path.extname(file.originalname);
    const filename = `${timeStamp}-${ramdomStr}${ext}`;
    cb(null, filename);
  },
});
const express = require("express");
const router = express.Router();
const upload = multer({
  storage,
  limits: {
    fileSize: 150 * 1024,
  },
  fileFilter(req, file, cb) {
    //验证文件后缀名
    const extname = path.extname(file.originalname);
    const whitelist = [".jpg", ".png"];
    if (whitelist.includes(extname)) {
      cb(null, true);
    } else {
      cb(new Error(`your ext name of ${extname} is not support`));
    }
  },
});

router.post('/', upload.single("img"), (req, res) => {
  const url = `avater/${req.file.filename}`;
  res.send({
    code: 0,
    msg: "",
    data: url,
  });
});

module.exports = router;