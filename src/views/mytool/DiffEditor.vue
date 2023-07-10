<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

const diffDom = ref();

const originalModel = editor.createModel('', 'text/plain');
const modifiedModel = editor.createModel('', 'text/plain');

const initDiffEditor = () => {
  const diffEditor = editor.createDiffEditor(diffDom.value, {
    originalEditable: true,
    automaticLayout: true,
  });

  diffEditor.setModel({
    original: originalModel,
    modified: modifiedModel,
  });
};

onMounted(() => {
  initDiffEditor();
});
</script>

<template>
  <div ref="diffDom" class="diff-editor flex flex-col h-full p-2"></div>
</template>

<style></style>
