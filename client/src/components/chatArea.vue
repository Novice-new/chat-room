<template>
  <div class="chatArea">
    <div
      class="title"
      v-if="chatTo === null"
    >聊天室</div>
    <div
      class="title"
      v-else
    >{{chatTo.username}}</div>
    <div class="dialog-list">
      <template v-if="chatTo===null">
        <div
          class="dialog"
          v-for="chatInfo in groupChat"
          :key="chatInfo.time"
          :class="chatInfo.type"
        >
          <template v-if="chatInfo.type==='left'">
            <img
              :src="chatInfo.from.img"
              alt=""
            >
            <div class="details">
              <div class="name">{{chatInfo.from.username}}</div>
              <div class="content">{{chatInfo.content}}</div>
            </div>
          </template>
          <template v-else-if="chatInfo.type==='right'">
            <div class="details">
              <div class="name">{{chatInfo.from.username}}</div>
              <div class="content">{{chatInfo.content}}</div>
            </div>
            <img
              :src="chatInfo.from.img"
              alt=""
            >
          </template>
          <template v-else>
            <div :class="chatInfo.details">
              <span>{{chatInfo.username?chatInfo.username:''}}</span>
              {{chatInfo.content}}
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <div
          class="dialog"
          v-for="msg in privateMsg.msgs"
          :key="msg.time"
          :class="msg.type"
        >
          <template v-if="msg.type==='left'">
            <img
              :src="privateMsg.to.img"
              alt=""
            >
            <div class="details">
              <div class="name">{{privateMsg.to.username}}</div>
              <div class="content">{{msg.content}}</div>
            </div>
          </template>
          <template v-else-if="msg.type==='right'">
            <div class="details">
              <div class="name">{{userInfo.username}}</div>
              <div class="content">{{msg.content}}</div>
            </div>
            <img
              :src="userInfo.img"
              alt=""
            >
          </template>
        </div>
      </template>
    </div>
    <div class="input-area">
      <textarea v-model="content">
      </textarea>
      <div class="btns">
        <el-button
          type="primary"
          size="small"
          @click="sendMsg"
        >发送</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import socket from '@/plugins/socketIo';
import { mapState, mapMutations } from 'vuex';

export default {
  props: {
    chatTo: {
      required: true,
    },
  },
  data() {
    return {
      content: '',
    };
  },
  computed: {
    ...mapState(['userInfo', 'groupChat', 'privateChat']),
    privateMsg() {
      const result = this.privateChat.filter((item) => {
        if (item.to.username === this.chatTo.username) {
          return true;
        }
        return false;
      });
      return result[0];
    },
  },
  methods: {
    ...mapMutations(['addGroupMsg', 'addPrivateMsg']),
    sendMsg() {
      if (!this.content) {
        this.$message({
          showClose: true,
          message: '发送内容不能为空',
          type: 'warning',
        });
        return;
      }
      const chatData = {
        from: this.userInfo,
        to: this.chatTo,
        content: this.content,
        time: Date.now(),
      };
      socket.emit('msg', chatData);
      this.content = '';
      // 由于使自己发的消息所以固定在右边
      chatData.type = 'right';
      // 如果是发送给所有人
      if (this.chatTo === null) {
        this.addGroupMsg(chatData);
      } else {
        // 如果是私聊由于使自己发给别人所以私聊对象是to
        this.addPrivateMsg({
          // 私聊对象
          chatTo: chatData.to,
          msg: {
            content: chatData.content,
            time: chatData.time,
            type: chatData.type,
          },
        });
      }
      this.scrollToBottom();
    },
    handleSocket() {
      socket.on('msg', (chunk) => {
        // 收到的消息一定不是自己发出的所以位置固定为左边
        const newDate = {
          ...chunk,
          type: 'left',
        };
        // 如果是发给所有人的消息
        if (newDate.to === null) {
          this.addGroupMsg(newDate);
        } else {
          console.log(chunk);
          // 如果是私聊由于使别人发给你的所以私聊对象应该是from
          if (chunk.isOffline) {
            this.$message({
              showClose: true,
              message: '对方已下线',
              type: 'warning',
            });
            return;
          }
          this.addPrivateMsg({
            chatTo: newDate.from,
            msg: {
              content: newDate.content,
              time: newDate.time,
              type: newDate.type,
            },
          });
        }
        this.scrollToBottom();
      });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = document.querySelector('.dialog-list');
        container.scrollTop = container.scrollHeight;
      });
    },
  },
  created() {
    this.handleSocket();
  },
};
</script>
