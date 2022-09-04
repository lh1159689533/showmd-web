/**
 * 注册自定义全局组件
 */
import List from '@components/List.vue';
import Upload from '@components/Upload.vue';
import MDEditor from '@src/components/Editor/MDEditor.vue';
import MDPreview from '@src/components/Editor/MDPreview.vue';
import Empty from '@src/components/Empty.vue';
import CanvasBG from '@src/components/CanvasBG/Index.vue';
import Comment from '@src/components/Comment/Comment.vue';

const Components = [
  List,
  Upload,
  MDEditor,
  MDPreview,
  Empty,
  CanvasBG,
  Comment,
];

export default {
  install(app) {
    Components.forEach(comp => app.component(comp.name, comp));
  }
};