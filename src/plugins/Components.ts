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
import VditorEditor from '@src/components/Editor/VditorEditor.vue';
import VditorPreviewEditor from '@src/components/Editor/VditorPreviewEditor.vue';

const Components = [
  Button,
  Drawer,
  Icon,
  Input,
  List,
  Select,
  Upload,
  VditorEditor,
  VditorPreviewEditor,
];

export default {
  install(app) {
    Components.forEach(comp => app.component(comp.name, comp));
  }
};