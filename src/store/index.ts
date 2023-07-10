import { createStore } from 'vuex';
import common from './modules/common';
import user from './modules/user';
import comment from './modules/comment';

export const store = createStore({
  modules: {
    common,
    user,
    comment
  }
});

