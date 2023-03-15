/**
 * 注册自定义全局组件
 */
import { defineAsyncComponent } from 'vue';

const List = defineAsyncComponent(() => import('@components/List.vue'));
const Upload = defineAsyncComponent(() => import('@components/Upload.vue'));
// const MDEditor = defineAsyncComponent(() => import('@src/components/Editor/MDEditor.vue'));
const MDEditorIR = defineAsyncComponent(() => import('@src/components/Editor/MDEditorIR.vue'));
const MDPreview = defineAsyncComponent(() => import('@src/components/Editor/MDPreview.vue'));
const Empty = defineAsyncComponent(() => import('@components/Empty.vue'));
const Comment = defineAsyncComponent(() => import('@components/Comment/Comment.vue'));
const RTEditor = defineAsyncComponent(() => import('@src/components/Editor/RTEditor.vue'));
const RTPreview = defineAsyncComponent(() => import('@src/components/Editor/RTPreview.vue'));

const Components = {
  List,
  Upload,
  // MDEditor,
  MDEditorIR,
  MDPreview,
  Empty,
  RTEditor,
  RTPreview,
  Comment,
};

export default {
  install(app) {
    Object.keys(Components).forEach(key => app.component(key, Components[key]));
  }
};