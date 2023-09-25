<script lang="ts" setup>
import { ref, shallowRef, onBeforeUnmount, defineProps, defineEmits, toRefs, defineExpose } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { IToolbarConfig, IEditorConfig, IDomEditor, SlateNode, DomEditor } from '@wangeditor/editor';
import { upload } from '@src/utils/upload';
import message from '@utils/message';
import { querySelector } from './domUtil';

const props = defineProps<{ data: { name: string; content: string }; isPreview?: boolean }>();
const emit = defineEmits<{ (e: 'onChange', value: { name: string; content: string }, textValue?: string): void }>();

const { data } = toRefs(props);
const name = ref(data.value?.name ?? '');
const content = ref(data.value?.content ?? '');
const headerList = ref([]);
// 缩放参数
const editorTransform = ref({ scale: 1, translate: 0 });

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
    return { id: `catalog-${id}`, indent: type, title: text, contentKey: 'id', contentSelector: `#${id}` };
  });
};

const handleNameChange = () => {
  emit('onChange', { name: name.value, content: content.value });
};

/**
 * 编辑器缩放
 * @param scale 缩放比例
 */
const scaleEditor = (scale: number) => {
  const translate = (800 - 800 * scale) / 2;
  editorTransform.value = {
    scale,
    translate,
  };
  const editorDom = querySelector('.w-e-scroll>div:first-child', editorRef.value.getEditableContainer());
  if (editorDom) {
    editorDom.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${translate}, 0)`;
  }
};

// 获取文章文本内容
const getText = () => editorRef.value.getText();

onBeforeUnmount(() => {
  const editor = editorRef.value;
  editor?.destroy();
});

// 将方法暴露出去
defineExpose({
  scaleEditor,
  getText
});
</script>

<template>
  <div class="rich-text-editor h-full overflow-hidden">
    <div class="editor-toolbar bg-white border-b">
      <Toolbar :editor="editorRef" :default-config="toolbarConfig" mode="default" class="container" style="min-width: 1380px" />
    </div>
    <div class="editor-container relative overflow-y-auto">
      <div class="editor-content">
        <div class="editor-content-container">
          <div :style="{ transform: `matrix(${editorTransform.scale}, 0, 0, ${editorTransform.scale}, ${editorTransform.translate}, 81)` }" class="title py-5 border-b">
            <input
              v-model="name"
              @change="handleNameChange"
              placeholder="请输入文章标题..."
              class="w-full border-0 bg-transparent shadow-none font-bold text-2xl focus:outline-none"
            />
          </div>
          <div class="content" @click="() => editorRef.focus()">
            <Editor @on-created="handleCreate" @on-change="handleChange" :default-config="editorConfig" class="absolute w-full" />
          </div>
        </div>
      </div>
      <div class="absolute right-10" style="width: 260px; padding-left: 20px">
        <slot :catalog-list="headerList"></slot>
      </div>
    </div>
  </div>
</template>

<style>
.editor-container {
  height: calc(100% - 40px);
}

.editor-content {
  width: 800px;
  margin: -38px auto 20px auto;
  position: relative;
  height: 100%;
}

.editor-content-container .title {
  transform-origin: 0 0;
  z-index: 1;
  @apply py-4 px-16 bg-white relative;
}

.content {
  min-height: 1080px;
  height: 100%;
  position: relative;
}

.editor-content-container .w-e-text-container > .w-e-scroll > div:first-child {
  transform-origin: 0 0;
  box-shadow: 0px 0px 8px -4px #000;
  border-radius: 3px;
  padding-top: 82px !important;
  @apply py-4 px-16 bg-white;
}

.w-e-text-container {
  background-color: transparent !important;
}

.w-e-bar-item-group .w-e-bar-item-menus-container {
  z-index: 2001;
}
</style>
