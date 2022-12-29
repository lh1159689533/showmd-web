const state = {
  isShowHeader: true
};

const getters = {
  isShowHeader(state) {
    return state.isShowHeader;
  }
};

const mutations = {
  hide(state) {
    state.isShowHeader = false;
  },
  show(state) {
    state.isShowHeader = true;
  },
};

export default {
  namespace: true,
  state,
  getters,
  mutations,
};