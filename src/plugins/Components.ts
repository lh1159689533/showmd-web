/**
 * 注册自定义全局组件
 */
import { defineAsyncComponent } from 'vue';

const List = defineAsyncComponent(() => import('@components/List.vue'));
const Upload = defineAsyncComponent(() => import('@components/Upload.vue'));
const MDEditor = defineAsyncComponent(() => import('@components/Editor/MDEditor.vue'));
const MDEditorIR = defineAsyncComponent(() => import('@components/Editor/MDEditorIR.vue'));
const MDPreview = defineAsyncComponent(() => import('@components/Editor/MDPreview.vue'));
const Empty = defineAsyncComponent(() => import('@components/Empty.vue'));
// const CanvasBG = defineAsyncComponent(() => import('@components/CanvasBG/Index.vue'));
const Comment = defineAsyncComponent(() => import('@components/Comment/Comment.vue'));
// import List from '@components/List.vue';
// import Upload from '@components/Upload.vue';
// import MDEditor from '@src/components/Editor/MDEditor.vue';
// import MDEditorIR from '@src/components/Editor/MDEditorIR.vue';
// import MDPreview from '@src/components/Editor/MDPreview.vue';
// import Empty from '@src/components/Empty.vue';
// import CanvasBG from '@src/components/CanvasBG/Index.vue';
// import Comment from '@src/components/Comment/Comment.vue';

const Components = [
  List,
  Upload,
  MDEditor,
  MDEditorIR,
  MDPreview,
  Empty,
  // CanvasBG,
  Comment,
];

export default {
  install(app) {
    Components.forEach(comp => app.component(comp.name, comp));
  }
};