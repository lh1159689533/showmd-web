<script lang='ts'>
import { defineComponent } from 'vue';
import Drawer from '@components/Drawer.vue';
import Input from '@components/Input.vue';
import Select from '@components/Select.vue';
import Upload from '@components/Upload.vue';
import Icon from '@components/Icon.vue';
import { newProject } from './project';

export default defineComponent({
  name: 'UploadProject',
  props: {
    visible: Boolean,
    close: Function,
  },
  components: { Drawer, Input, Select, Upload, Icon },
  setup() {
    const projectList = [{ value: '1', label: '项目1' }];

    return {
      projectList,
    };
  },
});
</script>

<template>
  <Drawer :visible='visible' @close='close' title='导入项目' :footer='false' :size='800'>
    <template v-slot:section>
      <div class='flex justify-center px-12 mt-6'>
        <label for='projectName' class='flex items-center'>项目名称：</label>
        <Input id='projectName' placeholder='请输入项目名称' class='flex-1' />
      </div>
      <div class='flex justify-center px-12 mt-6'>
        <label for='projectId' class='flex items-center'>选择已有项目：</label>
        <Select id='projectId' :options='projectList' class='flex-1' />
      </div>
      <Upload directory>
        <span class='text-sm mt-3'>选择本地文件或者文件夹导入一个新的项目</span>
        <template #hint>
          <span class='text-xs text-gray-500 mt-2'>注意：如果选择已有项目导入，则该项目下的所有内容将被即将导入的内容所覆盖，请谨慎操作！</span>
        </template>
      </Upload>
    </template>
  </Drawer>
</template>

<style scoped>
</style>
