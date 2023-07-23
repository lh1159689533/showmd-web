import { findUserInfo } from '@service/user';
import { listMenu } from '@service/user';
import { listCategory } from '@service/category';

const state = {
  user: {},
  isShowLogin: false, // 是否展示登录窗
  menus: [],
  categoryList: null,
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
  },
  getCategoryList(state) {
    return state.categoryList;
  },
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
  },
  categoryChanged(state, categorys) {
    state.categoryList = categorys;
  },
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
  },
  async listCategory({ commit, rootState }) {
    if (rootState.user.categoryList?.length) {
      return rootState.user.categoryList;
    }
    const categorys = await listCategory();
    commit('categoryChanged', categorys);
    return categorys;
  }
};

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
};