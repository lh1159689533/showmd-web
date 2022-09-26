import { createStore } from 'vuex';
import user from './modules/user';
import comment from './modules/comment';

export const store = createStore({
  modules: {
    user,
    comment
  }
});

