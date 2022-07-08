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
  EyeIcon,
  PencilAltIcon,
  DocumentTextIcon,
  LogoutIcon,
} from '@heroicons/vue/Outline';
import { BellIcon } from '@heroicons/vue/solid';

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
    BellIcon,
    EyeIcon,
    PencilAltIcon,
    DocumentTextIcon,
    LogoutIcon,
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
  <XIcon
    v-if='["close", "error"].includes(type) && !circle'
    class='w-5 h-5'
    v-bind='$attrs'
    aria-hidden='true'
  />
  <XCircleIcon
    v-else-if='["close", "error"].includes(type) && circle'
    class='w-5 h-5'
    v-bind='$attrs'
    aria-hidden='true'
  />
  <PlusIcon
    v-if='type === "new"'
    class='w-5 h-5'
    v-bind='$attrs'
    aria-hidden='true'
  />
  <UploadIcon
    v-if='type === "upload"'
    class='w-5 h-5'
    v-bind='$attrs'
    aria-hidden='true'
  />
  <DownloadIcon
    v-if='type === "download"'
    class='w-5 h-5'
    v-bind='$attrs'
    aria-hidden='true'
  />
  <TrashIcon
    v-if='type === "trash"'
    class='w-5 h-5'
    v-bind='$attrs'
    aria-hidden='true'
  />
  <SearchIcon
    v-if='type === "search"'
    class='w-5 h-5'
    v-bind='$attrs'
    aria-hidden='true'
  />
  <FolderAddIcon
    v-if='type === "uploadFile"'
    class='w-5 h-5'
    v-bind='$attrs'
    aria-hidden='true'
  />
  <PaperClipIcon
    v-if='type === "paperClip"'
    class='w-5 h-5'
    v-bind='$attrs'
    aria-hidden='true'
  />
  <SortAscendingIcon
    v-if='type === "sortAsc"'
    class='w-5 h-5'
    v-bind='$attrs'
    aria-hidden='true'
  />
  <CheckIcon
    v-if='["check", "success"].includes(type) && !circle'
    class='w-5 h-5'
    v-bind='$attrs'
    aria-hidden='true'
  />
  <CheckCircleIcon
    v-else-if='["check", "success"].includes(type) && circle'
    class='w-5 h-5'
    v-bind='$attrs'
    aria-hidden='true'
  />
  <ExclamationCircleIcon
    v-if='type === "warn" && circle'
    class='w-5 h-5'
    v-bind='$attrs'
    aria-hidden='true'
  />
  <ArrowSmLeftIcon
    v-if='type === "arrowLeft"'
    class='w-5 h-5 inline-block'
    v-bind='$attrs'
    aria-hidden='true'
  />
  <BellIcon
    v-if='type === "bell"'
    class='w-5 h-5 inline-block'
    v-bind='$attrs'
    aria-hidden='true'
  />
  <EyeIcon
    v-if='type === "eye"'
    class='w-5 h-5 inline-block'
    v-bind='$attrs'
    aria-hidden='true'
  />
  <PencilAltIcon
    v-if='type === "edit"'
    class='w-5 h-5 inline-block'
    v-bind='$attrs'
    aria-hidden='true'
  />
  <DocumentTextIcon
    v-if='type === "document-text"'
    class='w-5 h-5 inline-block'
    v-bind='$attrs'
    aria-hidden='true'
  />
  <LogoutIcon
    v-if='type === "logout"'
    class='w-5 h-5 inline-block'
    v-bind='$attrs'
    aria-hidden='true'
  />
</template>

<style scoped>
</style>
