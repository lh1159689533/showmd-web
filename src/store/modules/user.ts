import { findUserById } from '@service/user';

const state = {
  user: {}
};

const getters = {
  getUser(state) {
    return state.user;
  }
};

const mutations = {
  userChanged(state, user) {
    state.user = user;
  }
};

const actions = {
  async getUserById({ commit }, id) {
    const user = await findUserById(id);
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