<script lang="ts" setup>
import { ref, shallowRef, onBeforeUnmount, defineProps, defineEmits, toRefs } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { IToolbarConfig, IEditorConfig, IDomEditor, SlateNode, DomEditor } from '@wangeditor/editor';
import { upload } from '@src/utils/upload';
import message from '@utils/message';

const props = defineProps<{ data: { name: string; content: string }; isPreview?: boolean }>();
const emit = defineEmits<{ (e: 'onChange', value: { name: string; content: string }, textValue?: string): void }>();

const { data } = toRefs(props);
const name = ref(data.value?.name ?? '');
const content = ref(data.value?.content ?? '');
const headerList = ref([]);

const editorRef = shallowRef<IDomEditor>();
// const toolbar = computed(() => DomEditor.getToolbar(editorRef.value));
// console.log(toolbar.value?.getConfig()?.toolbarKeys);

const editorConfig: Partial<IEditorConfig> = {
  placeholder: '',
  scroll: false, // 禁止编辑器滚动
  readOnly: props.isPreview ?? false,
  MENU_CONF: {
    uploadImage: {
      maxFileSize: 50 * 1024 * 1024, // 单个文件的最大体积限制，默认为 2M
      maxNumberOfFiles: 1, // 最多可上传几个文件，默认为 100
      allowedFileTypes: ['image/*'], // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
      meta: {}, // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端
      async customUpload(file: File, insertFn: (url: string, alt?: string, href?: string) => void) {
        const [err, res] = await upload(file);
        if (!err && res.code === 0) {
          insertFn(`/api/${res?.data?.path}`);
          message.success('图片上传成功');
        } else {
          message.error('图片上传失败');
        }
      },
    },
  },
};

const toolbarConfig: Partial<IToolbarConfig> = {};
toolbarConfig.excludeKeys = ['fullScreen'];

const handleCreate = (editor: IDomEditor) => {
  editorRef.value = editor;
  editorRef.value.setHtml(content.value ?? '');
  editorRef.value.focus();
  console.log(DomEditor.getToolbar(editor));
};

const handleChange = (editor: IDomEditor) => {
  content.value = editor.getHtml();
  emit('onChange', { name: name.value, content: content.value }, editor.getText());

  // 更新目录
  const headers = editor.getElemsByTypePrefix('header');
  headerList.value = headers.map((header) => {
    const text = SlateNode.string(header);
    const { id, type } = header as any;
    return { id: `catalog-${id}`, indent: type, title: text };
  });
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
      <Toolbar :editor="editorRef" :default-config="toolbarConfig" mode="default" class="container" style="min-width: 1380px" />
    </div>
    <div class="editor-content relative overflow-y-auto">
      <div class="content bg-white px-16 py-4">
        <div class="title py-5 border-b">
          <input v-model="name" @change="handleNameChange" placeholder="请输入文章标题..." class="border-0 bg-transparent shadow-none font-bold text-2xl focus:outline-none" />
        </div>
        <div class="editor-container" @click="() => editorRef.focus()">
          <Editor @on-created="handleCreate" @on-change="handleChange" :default-config="editorConfig" />
        </div>
      </div>
      <div class="absolute right-28" style="width: 260px; padding-left: 20px">
        <slot :catalog-list="headerList"></slot>
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
