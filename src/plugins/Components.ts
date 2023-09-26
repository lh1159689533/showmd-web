/**
 * 注册自定义全局组件
 */
import { defineAsyncComponent } from 'vue';

const List = defineAsyncComponent(() => import('@components/List.vue'));
const Empty = defineAsyncComponent(() => import('@components/Empty.vue'));
const Avatar = defineAsyncComponent(() => import('@src/components/Avatar.vue'));

const Components = {
  List,
  Empty,
  Comment,
  Avatar,
};

export default {
  install(app) {
    Object.keys(Components).forEach(key => app.component(key, Components[key]));
  }
};