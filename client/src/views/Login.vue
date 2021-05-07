<template>
  <el-form
    :model="userValidateForm"
    ref="userValidateForm"
    label-width="100px"
  >
    <el-form-item
      prop="username"
      label="用户名"
      :rules="[
      { required: true, message: '请输入用户名', trigger: 'blur' },
    ]"
    >
      <el-input v-model="userValidateForm.username"></el-input>
    </el-form-item>
    <el-form-item
      prop="userPwd"
      label="密码"
      :rules="[
      { required: true, message: '请输入密码', trigger: 'blur' },
    ]"
    >
      <el-input
        v-model="userValidateForm.userPwd"
        type="password"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="submitForm('userValidateForm')"
      >登录</el-button>
      <el-button @click="register">注册</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import socket from '@/plugins/socketIo';

export default {
  data() {
    return {
      userValidateForm: {
        username: '',
        userPwd: '',
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          socket.emit('login', this.userValidateForm);
        } else {
          this.$message({
            showClose: true,
            message: '请正确填写信息',
            type: 'warning',
          });
        }
      });
    },
    register() {
      this.$router.push({ name: 'Register' });
    },
    handleSocket() {
      socket.on('login', (chunk) => {
        if (chunk) {
          this.$store.state.userInfo = chunk;
          this.$router.push({ name: 'Home' });
          this.$message({
            showClose: true,
            message: '登录成功',
            type: 'success',
          });
        } else {
          this.$message({
            showClose: true,
            message: '用户不存在',
            type: 'error',
          });
        }
      });
    },
  },
  created() {
    this.handleSocket();
  },
};
</script>
