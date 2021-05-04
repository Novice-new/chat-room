<template>
  <div class="memberList">
    <div class="total">在线人数<span>{{userOnline.length}}</span></div>
    <div class="members-area">
      <div
        class="member"
        v-for="user in userOnline"
        :key="user.username"
        @click="handleClick(user)"
      >
        <img
          :src="user.img"
          alt=""
        >
        <span class="name">{{user.username}}</span>
        <span class="state">在线</span>
      </div>
      <div
        class="member offline"
        v-for="user in userOffline"
        :key="user.username"
        @click="offLineClick"
      >
        <img
          :src="user.img"
          alt=""
        >
        <span class="name">{{user.username}}</span>
        <span class="state">离线</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  props: {
    alterChat: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapState(['userOnline', 'userOffline']),
  },
  methods: {
    ...mapMutations(['changeChatList']),
    handleClick(user) {
      if (user.username === this.$store.state.userInfo.username) {
        this.$message({
          showClose: true,
          message: '不能和自己聊天',
          type: 'warning',
        });
        return;
      }
      this.changeChatList(user);
      this.alterChat(user);
    },
    offLineClick() {
      this.$message({
        showClose: true,
        message: '对方未进入聊天室',
        type: 'warning',
      });
    },
  },
};
</script>
