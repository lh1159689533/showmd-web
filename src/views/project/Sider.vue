<script lang='ts'>
import { defineComponent, ref } from 'vue';
import UploadProject from './UploadProject.vue';
import NewProject from './New.vue';

export default defineComponent({
  name: 'sider',
  components: { UploadProject, NewProject },
  setup() {
    const isShow = ref(false);
    const isShowUpload = ref(false);

    return {
      isShow,
      isShowUpload,
    };
  },
});
</script>

<template>
  <div id='sider' class='w-1/6 px-10 py-6'>
    <div id='user-info' class='flex flex-row'>
      <img class='rounded-full w-12 h-12' />
      <div class='flex-col ml-3 text-left'>
        <span class='font-bold text-lg'>Liuh</span>
        <div class='text-sm text-gray-500'>
          <i class='github p-2 mr-1'></i>
          <span>lh1159689533</span>
        </div>
      </div>
    </div>
    <div class='mt-12'>
      <Button icon='new' @click='() => isShow = true' class='w-full'>新建项目</Button>
      <Button icon='upload' type='weak' class='mt-4 w-full' @click='() => isShowUpload = true'>导入项目</Button>
    </div>
    <NewProject :visible='isShow' @close='() => isShow = false' />
    <UploadProject :visible='isShowUpload' @close='() => isShowUpload = false' />
  </div>
</template>

<style scoped>
#sider i.github {
  background-image: url('img/github.svg');
  background-size: 100% 100%;
}
</style>
