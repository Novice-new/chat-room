<template>
  <div class="header">
    <img
      class="logo"
      src="img/logo.jpg"
      alt=""
    >
    <span class="title">Welcome to chart-romm</span>
    <div class="user">
      <el-dropdown @command="handleCommand">
        <div class="name">hello {{$store.state.userInfo.username}}</div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <img
        :src="$store.state.userInfo.img"
        alt=""
      >
    </div>
  </div>
</template>
<script>
import socket from '@/plugins/socketIo';

export default {
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        socket.emit('logout');
        this.$router.push({ name: 'Login' });
      }
    },
  },
};
</script>
<style>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
