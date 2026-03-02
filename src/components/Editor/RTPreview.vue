<script lang="ts" setup>
import { ref, shallowRef, onBeforeUnmount, defineProps, toRefs } from 'vue';
import { Editor } from '@wangeditor/editor-for-vue';
import { IEditorConfig, IDomEditor, SlateNode } from '@wangeditor/editor';

const props = defineProps<{ data: { name: string; content: string } }>();

const emit = defineEmits<{ (e: 'onLoaded', catalogList: any[]): void }>();

const { data } = toRefs(props);
const content = ref(data.value?.content ?? '');
const headerList = ref([]);

const editorRef = shallowRef<IDomEditor>();

const editorConfig: Partial<IEditorConfig> = {
  scroll: true, // 禁止编辑器滚动
  readOnly: true,
};

const handleCreate = (editor: IDomEditor) => {
  editorRef.value = editor;
  editor.setHtml(content.value ?? '');
  const headers = editor.getElemsByTypePrefix('header');
  headerList.value = headers.map((header) => {
    const text = SlateNode.string(header);
    const { id, type } = header as any;
    return { id: `catalog-${id}`, indent: type, title: text };
  });
  emit('onLoaded', headerList.value)
};

onBeforeUnmount(() => {
  const editor = editorRef.value;
  editor?.destroy();
});
</script>

<template>
  <div class="richtext-preview px-16 rounded-b-md">
    <Editor @on-created="handleCreate" :default-config="editorConfig" />
  </div>
  <!-- <div class="rightSider absolute top-0 right-0" style="width: 260px; padding-left: 20px">
    <slot :catalog-list="headerList"></slot>
  </div> -->
</template>

<style scoped>
.richtext-preview {
  width: 100%;
  background-color: var(--showmd-bg-color-primary);
  border-radius: 3px;
}

.outline-sider {
  box-shadow: 0px 0px 8px -6px #000;
  border-radius: 3px;
  width: 260px;
}
</style>
