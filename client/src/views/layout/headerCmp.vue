<template>
  <div class="header">
    <img
      class="logo"
      src="img/logo.jpg"
      alt=""
    >
    <span class="title">Welcome to chart-romm</span>
    <div class="user">
      <span>hello {{$store.state.userInfo.username}}</span>
      <img
        :src="$store.state.userInfo.img"
        alt=""
      >
    </div>
  </div>
</template>
<script>
export default {

};
</script>
