import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: {},
    userOnline: [],
    userOffline: [],
    groupChat: [],
    privateChat: [
      // {
      //   // 私聊目标
      //   to: {
      //     username: '汤明',
      //     img: 'http://pnjswi.name/gqjsj',
      //   },
      //   // 私聊内容
      //   msgs: [
      //     {
      //       content: 'ceshi',
      //       time: 1619449294891,
      //       type: 'left',
      //     },
      //   ],
      // },
    ],
  },
  mutations: {
    adduser(state, payload) {
      state.userOnline.push(payload);
      state.userOffline = state.userOffline.filter((item) => item.username !== payload.username);
    },
    removeuser(state, payload) {
      state.userOffline.push(payload);
      state.userOnline = state.userOnline.filter((item) => item.username !== payload.username);
    },
    addGroupMsg(state, payload) {
      state.groupChat.push(payload);
    },
    addPrivateMsg(state, payload) {
      const index = state.privateChat.findIndex((item) => {
        if (item.to.username === payload.chatTo.username) {
          return true;
        }
        return false;
      });
      if (index < 0) {
        const result = { to: payload.chatTo };
        if (!payload.msg) {
          result.msgs = [];
        } else {
          result.msgs = [payload.msg];
        }
        state.privateChat.push(result);
      } else {
        state.privateChat[index].msgs.push(payload.msg);
      }
    },
    changeChatList(state, payload) {
      const index = state.privateChat.findIndex((item) => {
        if (item.to.username === payload.username) {
          return true;
        }
        return false;
      });
      if (index < 0) {
        state.privateChat.unshift({
          to: payload,
          msgs: [],
        });
      } else {
        state.privateChat.unshift(state.privateChat[index]);
        state.privateChat.splice(index + 1, 1);
      }
    },
  },
  actions: {
  },
  modules: {
  },
});
