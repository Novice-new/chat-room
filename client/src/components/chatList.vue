<template>
  <div class="chatList">
    <div class="chat-search">
      <el-input
        placeholder=""
        suffix-icon="el-icon-search"
        v-model="searchInfo"
        size="small"
      >
      </el-input>
    </div>
    <div class="my-chats">
      <div
        v-show="showGroup"
        class="chat-item group"
        @click="alterChat(null)"
      >
        <img
          src="img/logo.jpg"
          alt=""
        >
        <div class="chat-info">
          <div class="chat-name">群聊</div>
          <div class="latest-word">{{groupLastMsg.content}}</div>
        </div>
        <div class="chat-time">{{groupLastMsg.time}}</div>
      </div>
      <div
        class="chat-item previte"
        v-for="(chat) in chatList"
        :key="chat.id"
        @click="handleClick(chat.to)"
      >
        <img
          :src="chat.to.img"
          alt=""
        >
        <div class="chat-info">
          <div class="chat-name">{{chat.to.username}}</div>
          <div class="latest-word">{{chat.msg}}</div>
        </div>
        <div class="chat-time">{{chat.time}}</div>
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
  data() {
    return {
      searchInfo: '',

    };
  },
  computed: {
    ...mapState(['groupChat', 'privateChat']),
    showGroup() {
      if (this.searchInfo && !'群聊'.includes(this.searchInfo)) {
        return false;
      }
      return true;
    },
    chatList() {
      let result = this.privateChat;
      if (this.searchInfo) {
        result = result.filter((item) => item.to.username.includes(this.searchInfo));
      }
      result = result.map((item) => {
        const len = item.msgs.length;
        if (len === 0) return item;
        const date = new Date(item.msgs[len - 1].time);
        const data = {
          to: item.to,
          msg: item.msgs[len - 1].content,
          time: date.toTimeString().substring(0, 5),
          id: date.getTime(),
        };
        return data;
      });
      return result;
    },
    groupLastMsg() {
      const msgs = this.groupChat.filter((item) => item.type !== 'tip');
      const len = msgs.length;
      const result = {
        content: '',
        time: '',
      };
      if (len !== 0) {
        const date = new Date(msgs[len - 1].time);
        result.content = msgs[len - 1].content;
        result.time = date.toTimeString().substring(0, 5);
      }
      return result;
    },
  },
  methods: {
    ...mapMutations(['changeChatList']),
    handleClick(chatTo) {
      this.changeChatList(chatTo);
      this.alterChat(chatTo);
    },
  },
};
</script>
