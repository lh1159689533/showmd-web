<script lang='ts'>
import { defineComponent, ref } from 'vue';
import { findContentById } from './page';

export default defineComponent({
  name: 'PageEdit',
  props: {
    id: String,
  },
  setup(props) {
    const page = ref('');
    findContentById(props.id).then((res) => {
      page.value = res;
    });

    return {
      page,
    };
  },
});
</script>

<template>
  <div id='myEditor' class='flex flex-col'>
    <div class='tool flex p-3 bg-white'>
      <Input v-model='page.pageName' class='flex-1 border-0 bg-transparent shadow-none font-bold text-2xl' />
      <div class='rightGroups flex py-1'>
        <Button type='weak' class='publish w-20 mr-4'>草稿箱</Button>
        <Button class='publish w-20'>发布</Button>
      </div>
    </div>
    <VditorEditor v-if='page' :value='page.pageContent' />
  </div>
</template>

<style scoped>
</style>
