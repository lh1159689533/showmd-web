/**
 * 注册自定义全局组件
 */
import Button from '@components/Button/Button.vue';
import Drawer from '@components/Drawer.vue';
import Icon from '@components/Icon.vue';
import Input from '@components/Input.vue';
import List from '@components/List.vue';
import Select from '@components/Select.vue';
import Upload from '@components/Upload.vue';
import Editor from '@src/components/Editor/Editor.vue';
import PreviewEditor from '@src/components/Editor/PreviewEditor.vue';

const Components = [
  Button,
  Drawer,
  Icon,
  Input,
  List,
  Select,
  Upload,
  Editor,
  PreviewEditor,
];

export default {
  install(app) {
    Components.forEach(comp => app.component(comp.name, comp));
  }
};