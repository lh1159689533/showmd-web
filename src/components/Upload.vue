<script lang='ts'>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Upload',
  props: {
    accept: String, // 上传文件类型
    directory: Boolean, // true上传文件夹 false上传文件
  },
  emits: ['fileChange'],
  setup(_, { emit }) {
    const inputRef = ref<HTMLInputElement>();
    const fileList = ref<string[]>([]);

    const upload = () => {
      const inputFile = inputRef.value;
      if (!inputFile) return;
      inputFile?.click?.();
      inputFile?.addEventListener('change', () => {
        const { files } = inputFile;
        if (!files) return;
        fileList.value = [].slice.call(inputFile.files)?.map((f) => f.name);
        emit('fileChange', files);
      });
    };

    // 根据下标移除待上传文件
    const remove = (index: number) => {
      fileList.value.splice(index, 1);
    };

    return {
      inputRef,
      upload,
      fileList,
      remove,
    };
  },
});
</script>

<template>
  <div class='w-full flex flex-col items-center mt-16' v-bind='$attrs'>
    <div @click='upload' class='border border-dashed w-4/5 h-40 rounded bg-gray-50 hover:border-indigo-500 cursor-pointer flex flex-col items-center p-6'>
      <el-icon>
        <Upload class='w-14 h-14 text-indigo-600' />
      </el-icon>
      <slot />
      <slot name='hint' />
    </div>
    <input ref='inputRef' type='file' :webkitdirectory='directory' :accept='accept' class='hidden' />
    <List :data-list='fileList' class='w-4/5 mt-4 h-96'>
      <template #default='{ item, index, hoverIndex }'>
        <p class='mt-2 text-left flex items-center text-sm'>
          <el-icon>
            <Paperclip class='text-gray-400 w-3.5 h-3.5 mr-2' />
          </el-icon>
          <span class='file-name flex-1 relative'>{{ item }}</span>
          <el-icon>
            <Close
              @click='() => remove(index)'
              :class='[index === hoverIndex ? "block" : "hidden"]'
              class='remove-file text-gray-500 w-3.5 h-3.5 mr-2 hover:text-indigo-500 cursor-pointer'
            />
          </el-icon>
        </p>
      </template>
    </List>
  </div>
</template>

<style scoped>
</style>
