/**
 * 注册自定义全局组件
 */
import List from '@components/List.vue';
import Upload from '@components/Upload.vue';
import Editor from '@src/components/Editor/Editor.vue';
import PreviewEditor from '@src/components/Editor/PreviewEditor.vue';

const Components = [
  List,
  Upload,
  Editor,
  PreviewEditor,
];

export default {
  install(app) {
    Components.forEach(comp => app.component(comp.name, comp));
  }
};