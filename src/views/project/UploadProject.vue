<script lang='ts'>
import { defineComponent, ref, getCurrentInstance } from 'vue';
import { newProject, uploadProject, findList } from './project';

export default defineComponent({
  name: 'UploadProject',
  props: {
    visible: Boolean,
  },
  emits: ['close'],
  setup() {
    const projectList = ref();
    const projectName = ref('');
    const projectId = ref('');
    const fileList = ref<FileList>();
    const { $message: message }: any = getCurrentInstance().proxy;

    findList().then((res) => {
      if (res?.code === 0) {
        projectList.value = res?.data?.map(
          ({ id, project_name }: Record<string, string | number>) => ({
            label: project_name,
            value: id,
          })
        );
      }
    });

    const upload = async () => {
      const formData = new FormData();
      if (fileList.value?.length) {
        [].slice.call(fileList.value).forEach((f) => formData.append('file', f));
      }
      const [err, result] = await uploadProject(
        projectName.value,
        projectId.value,
        formData
      );
      if (!err && result?.code === 0) {
        message.success('上传成功');
      } else {
        message.error('上传失败');
      }
    };

    const fileChange = (files: FileList) => {
      fileList.value = files;
    };

    return {
      projectList,
      projectName,
      projectId,
      upload,
      fileChange,
    };
  },
});
</script>

<template>
  <Drawer :visible='visible' @close='$emit("close")' title='导入项目' :footer='true'>
    <template #section>
      <div class='h-full flex flex-col'>
        <div class='flex justify-center px-12 mt-6'>
          <label for='projectName' class='flex items-center'>项目名称：</label>
          <Input id='projectName' v-model='projectName' placeholder='请输入项目名称' class='flex-1' />
        </div>
        <div class='flex justify-center px-12 mt-6'>
          <label for='projectId' class='flex items-center'>选择已有项目：</label>
          <Select id='projectId' v-model='projectId' :options='projectList' class='flex-1' />
        </div>
        <Upload directory @fileChange='fileChange'>
          <span class='text-sm mt-3'>选择本地文件或者文件夹导入一个新的项目</span>
          <template #hint>
            <span class='text-xs text-gray-500 mt-2'>注意：如果选择已有项目导入，则该项目下的所有内容将被即将导入的内容所覆盖，请谨慎操作！</span>
          </template>
        </Upload>
      </div>
    </template>
    <template #footer>
      <div class='upload-btn w-28'>
        <Button @click='upload'>上传</Button>
      </div>
    </template>
  </Drawer>
</template>

<style scoped>
</style>
