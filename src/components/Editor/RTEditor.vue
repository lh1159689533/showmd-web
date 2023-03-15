<script lang="ts" setup>
import { ref, shallowRef, onBeforeUnmount, defineProps, defineEmits, toRefs } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { IToolbarConfig, IEditorConfig, IDomEditor } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css';

const props = defineProps<{ data: { name: string; content: string }; isPreview?: boolean }>();
const emit = defineEmits<{ (e: 'onChange', value: { name: string; content: string }): void }>();

const { data } = toRefs(props);
const name = ref(data.value?.name ?? '');
const content = ref(data.value?.content ?? '');

const editorRef = shallowRef<IDomEditor>();
// const toolbar = computed(() => DomEditor.getToolbar(editorRef.value));
// console.log(toolbar.value?.getConfig()?.toolbarKeys);

const editorConfig: Partial<IEditorConfig> = {
  placeholder: '',
  scroll: false, // 禁止编辑器滚动
  readOnly: props.isPreview ?? false,
  MENU_CONF: {
    uploadImage: {
      server: '', // 上传图片服务端地址
      maxFileSize: 2 * 1024 * 1024, // 单个文件的最大体积限制，默认为 2M
      maxNumberOfFiles: 10, // 最多可上传几个文件，默认为 100
      allowedFileTypes: ['image/*'], // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
      meta: {}, // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端
      customInsert(res: any, insertFn: (url: string, alt?: string, href?: string) => void) {
        // 自定义返回格式, url: 图片src alt: 图片描述文字 href: 图片的链接
        insertFn('');
      },
    },
  },
};

const toolbarConfig: Partial<IToolbarConfig> = {};

const handleCreate = (editor: IDomEditor) => {
  editorRef.value = editor;
  editorRef.value.setHtml(content.value ?? '');
  editorRef.value.focus();
  // console.log(DomEditor.getToolbar(editor));
};

const handleChange = (editor: IDomEditor) => {
  content.value = editor.getHtml();
  emit('onChange', { name: name.value, content: content.value });
};

const handleNameChange = () => {
  emit('onChange', { name: name.value, content: content.value });
};

onBeforeUnmount(() => {
  const editor = editorRef.value;
  editor?.destroy();
});
</script>

<template>
  <div class="rich-text-editor h-full overflow-hidden">
    <div class="editor-toolbar bg-white border-b">
      <Toolbar :editor="editorRef" :default-config="toolbarConfig" mode="default" class="container" />
    </div>
    <div class="editor-content relative overflow-y-auto">
      <div class="content bg-white px-16 py-4">
        <div class="title py-5 border-b">
          <input v-model="name" @change="handleNameChange" placeholder="请输入文章标题..." class="border-0 bg-transparent shadow-none font-bold text-2xl focus:outline-none" />
        </div>
        <div class="editor-container" @click="() => editorRef.focus()">
          <Editor @on-created="handleCreate" @on-change="handleChange" :default-config="editorConfig" class="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-content {
  height: calc(100% - 40px);
}

.content {
  width: 800px;
  margin: 20px auto 20px auto;
  box-shadow: 0px 0px 8px -4px #000;
  border-radius: 3px;
}

.editor-container {
  min-height: 980px;
}
</style>
