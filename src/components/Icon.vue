<script lang='ts'>
import { defineComponent } from 'vue';
import {
  TrashIcon,
  UploadIcon,
  DownloadIcon,
  PlusIcon,
  SearchIcon,
  FolderAddIcon,
  PaperClipIcon,
  XIcon,
  SortAscendingIcon,
} from '@heroicons/vue/Outline';

export default defineComponent({
  name: 'Icon',
  components: {
    TrashIcon,
    UploadIcon,
    DownloadIcon,
    PlusIcon,
    SearchIcon,
    FolderAddIcon,
    PaperClipIcon,
    XIcon,
    SortAscendingIcon,
  },
  props: {
    type: String,
  },
});
</script>

<template>
  <XIcon v-if='type === "close"' class='w-5 h-5' v-bind='$attrs' />
  <PlusIcon v-if='type === "new"' class='w-5 h-5' v-bind='$attrs' />
  <UploadIcon v-if='type === "upload"' class='w-5 h-5' v-bind='$attrs' />
  <DownloadIcon v-if='type === "download"' class='w-5 h-5' v-bind='$attrs' />
  <TrashIcon v-if='type === "trash"' class='w-5 h-5' v-bind='$attrs' />
  <SearchIcon v-if='type === "search"' class='w-5 h-5' v-bind='$attrs' />
  <FolderAddIcon v-if='type === "uploadFile"' class='w-5 h-5' v-bind='$attrs' />
  <PaperClipIcon v-if='type === "paperClip"' class='w-5 h-5' v-bind='$attrs' />
  <SortAscendingIcon v-if='type === "sortAsc"' class='w-5 h-5' v-bind='$attrs' />
</template>

<style scoped>
</style>
