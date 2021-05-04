<template>
  <div class="body">
    <chat-list :alterChat="alterChat"></chat-list>
    <chat-area :chatTo="chatTo"></chat-area>
    <member-list :alterChat="alterChat"></member-list>
  </div>
</template>
<script>
import socket from '@/plugins/socketIo';
import { mapMutations } from 'vuex';
import chatList from '@/components/chatList.vue';
import chatArea from '@/components/chatArea.vue';
import memberList from '@/components/memberList.vue';

export default {
  data() {
    return {
      chatTo: null,
    };
  },
  components: {
    chatList,
    chatArea,
    memberList,
  },
  methods: {
    ...mapMutations(['adduser', 'removeuser', 'addGroupMsg']),
    // 处理一些socket的监听事件
    handleSocket() {
      // 获取所有在线用户与离线用户
      socket.emit('user');
      socket.on('user', (chunk) => {
        this.$store.state.userOnline = chunk.userOnline;
        this.$store.state.userOffline = chunk.userOffline;
      });
      // 有新用户登录或者用户退出时更新在线用户
      socket.on('userin', (chunk) => {
        this.adduser(chunk);
        this.addGroupMsg(this.addGroupTip(2, chunk.username));
      });
      socket.on('userout', (chunk) => {
        this.removeuser(chunk);
        this.addGroupMsg(this.addGroupTip(3, chunk.username));
      });
      //
    },
    /**
     * type = 1 ：欢迎信息
     * type = 2 ：进入消息
     * type = 3 ：离开消息
     */
    addGroupTip(type, username = '') {
      const result = {
        type: 'tip',
        username,
      };
      if (type === 1) {
        result.details = 'welcome';
        result.content = '欢迎来到聊天室';
      } else if (type === 2) {
        result.details = 'in';
        result.content = '进入聊天室';
      } else {
        result.details = 'out';
        result.content = '离开聊天室';
      }
      return result;
    },
    // 切换对话窗口
    alterChat(user) {
      this.chatTo = user;
    },
  },
  created() {
    this.handleSocket();
    this.addGroupMsg(this.addGroupTip(1));
  },
};
</script>
