import { findUserInfo } from '@service/user';

const state = {
  user: {},
  isShowLogin: false, // 是否展示登录窗
};

const getters = {
  getUser(state) {
    return state.user;
  },
  isShowLogin(state) {
    return state.isShowLogin;
  }
};

const mutations = {
  userChanged(state, user) {
    state.user = user;
  },
  hideLogin(state) {
    state.isShowLogin = false;
  },
  showLogin(state) {
    state.isShowLogin = true;
  }
};

const actions = {
  async getUserInfo({ commit }) {
    const user = await findUserInfo();
    commit('userChanged', user);
    return user;
  }
};

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
};