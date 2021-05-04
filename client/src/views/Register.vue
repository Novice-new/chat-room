<template>
  <el-form
    :model="ruleForm"
    status-icon
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-form-item
      label="用户名"
      prop="username"
    >
      <el-input v-model.number="ruleForm.username"></el-input>
    </el-form-item>
    <el-form-item
      label="密码"
      prop="pass"
    >
      <el-input
        type="password"
        v-model="ruleForm.pass"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="确认密码"
      prop="checkPass"
    >
      <el-input
        type="password"
        v-model="ruleForm.checkPass"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item
      prop="imgUrl"
      label="用户头像"
    >
      <el-upload
        name="img"
        class="avatar-uploader"
        action="http://localhost:9527/upload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img
          v-if="ruleForm.imgUrl"
          :src="ruleForm.imgUrl"
          class="avatar"
        >
        <i
          v-else
          class="el-icon-plus avatar-uploader-icon"
        ></i>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="submitForm('ruleForm')"
      >提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import socket from '@/plugins/socketIo';

export default {
  data() {
    const validateCheckPass = (rule, value, callback) => {
      if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        username: '',
        pass: '',
        checkPass: '',
        imgUrl: '',
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { max: 8, message: '用户名最多由8为字符组成', trigger: 'blur' },
        ],
        pass: [
          { required: true, trigger: 'blur' },
        ],
        checkPass: [
          { required: true, trigger: 'blur' },
          { validator: validateCheckPass, trigger: 'blur' },
        ],
        imgUrl: [
          { required: true, message: '请上传头像', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      console.log(this.ruleForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            username: this.ruleForm.username,
            userPwd: this.ruleForm.pass,
            img: this.ruleForm.imgUrl,
          };
          socket.emit('register', data);
          socket.on('register', (chunk) => {
            if (chunk.state === 'success') {
              this.$message({
                showClose: true,
                message: chunk.msg,
                type: 'success',
              });
              this.$router.push({ name: 'Login' });
            } else {
              this.$message({
                showClose: true,
                message: chunk.msg,
                type: 'error',
              });
            }
          });
        } else {
          this.$message({
            showClose: true,
            message: '请正确填写信息',
            type: 'error',
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAvatarSuccess(res) {
      this.ruleForm.imgUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG 格式或 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return (isJPG || isPNG) && isLt2M;
    },
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
