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
  XCircleIcon,
  SortAscendingIcon,
  CheckCircleIcon,
  CheckIcon,
  ExclamationCircleIcon,
  ArrowSmLeftIcon,
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
    XCircleIcon,
    SortAscendingIcon,
    CheckCircleIcon,
    CheckIcon,
    ExclamationCircleIcon,
    ArrowSmLeftIcon,
  },
  props: {
    type: String,
    circle: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<template>
  <XIcon v-if='["close", "error"].includes(type) && !circle' class='w-5 h-5' v-bind='$attrs' aria-hidden='true' />
  <XCircleIcon v-else-if='["close", "error"].includes(type) && circle' class='w-5 h-5' v-bind='$attrs'
    aria-hidden='true' />
  <PlusIcon v-if='type === "new"' class='w-5 h-5' v-bind='$attrs' aria-hidden='true' />
  <UploadIcon v-if='type === "upload"' class='w-5 h-5' v-bind='$attrs' aria-hidden='true' />
  <DownloadIcon v-if='type === "download"' class='w-5 h-5' v-bind='$attrs' aria-hidden='true' />
  <TrashIcon v-if='type === "trash"' class='w-5 h-5' v-bind='$attrs' aria-hidden='true' />
  <SearchIcon v-if='type === "search"' class='w-5 h-5' v-bind='$attrs' aria-hidden='true' />
  <FolderAddIcon v-if='type === "uploadFile"' class='w-5 h-5' v-bind='$attrs' aria-hidden='true' />
  <PaperClipIcon v-if='type === "paperClip"' class='w-5 h-5' v-bind='$attrs' aria-hidden='true' />
  <SortAscendingIcon v-if='type === "sortAsc"' class='w-5 h-5' v-bind='$attrs' aria-hidden='true' />
  <CheckIcon v-if='["check", "success"].includes(type) && !circle' class='w-5 h-5' v-bind='$attrs' aria-hidden='true' />
  <CheckCircleIcon v-else-if='["check", "success"].includes(type) && circle' class='w-5 h-5' v-bind='$attrs'
    aria-hidden='true' />
  <ExclamationCircleIcon v-if='type === "warn" && circle' class='w-5 h-5' v-bind='$attrs' aria-hidden='true' />
  <ArrowSmLeftIcon v-if='type === "arrowLeft"' class='w-5 h-5 inline-block' v-bind='$attrs' aria-hidden='true' />
</template>

<style scoped>
</style>
