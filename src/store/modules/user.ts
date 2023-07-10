import { findUserInfo } from '@service/user';
import { listMenu } from '@service/user';

const state = {
  user: {},
  isShowLogin: false, // 是否展示登录窗
  menus: []
};

const getters = {
  getUser(state) {
    return state.user;
  },
  getMenus(state) {
    return state.menus;
  },
  isShowLogin(state) {
    return state.isShowLogin;
  }
};

const mutations = {
  userChanged(state, user) {
    state.user = user;
  },
  menusChanged(state, menus) {
    state.menus = menus;
  },
  hideLogin(state) {
    state.isShowLogin = false;
  },
  showLogin(state) {
    state.isShowLogin = true;
  }
};

const actions = {
  async getUserInfo({ commit, dispatch }) {
    const user = await findUserInfo();
    commit('userChanged', user);
    dispatch('getUserMenu');
    return user;
  },
  async getUserMenu({ commit }) {
    const menus = await listMenu();
    commit('menusChanged', menus.map((m) => ({
      ...m,
      key: m.title,
    })));
  }
};

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
};