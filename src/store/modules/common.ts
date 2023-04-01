const state = {
  isShowHeader: true,
  catalogHeight: 0,
};

const getters = {
  isShowHeader(state) {
    return state.isShowHeader;
  },
  catalogHeight() {
    return state.catalogHeight;
  }
};

const mutations = {
  hide(state) {
    state.isShowHeader = false;
  },
  show(state) {
    state.isShowHeader = true;
  },
  catalogHeight(state, hei: number) {
    state.catalogHeight = hei;
  }
};

export default {
  namespace: true,
  state,
  getters,
  mutations,
};