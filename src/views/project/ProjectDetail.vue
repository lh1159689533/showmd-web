<script lang='ts'>
import { defineComponent, ref } from 'vue';
import { findPageList } from './project';

export default defineComponent({
  name: 'ProjectDetail',
  props: {
    id: String,
  },
  setup(props) {
    const pageList = ref();
    const projectName = ref();
    const pageContent = ref();
    const currentPageId = ref();

    findPageList(props?.id).then((res) => {
      projectName.value = res.projectName;
      pageList.value = res.list;
      pageContent.value = res.list?.[0]?.pageContent;
      currentPageId.value = res.list?.[0]?.id;
    });

    const showPageContent = (pageId) => {
      pageContent.value = pageList.value.find((page) => page.id === pageId)?.pageContent;
      currentPageId.value = pageId;
    };

    return {
      projectName,
      pageList,
      pageContent,
      currentPageId,
      showPageContent,
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
  },
});
</script>

<template>
  <div class='project-detail relative w-4/5' style='margin: 0 auto'>
    <div class='project-detail-sider bg-gray-50 shadow-lg pl-4 pt-4 fixed top-0 bottom-0' style='width: 240px'>
      <a class='mb-3 flex items-center'>
        <span class='pl-2'>{{ projectName }}</span>
        <Icon type='arrowLeft' class='hover:text-indigo-600 cursor-pointer ml-3' @click='goBack' />
      </a>
      <List :dataList='pageList' class='project-sider-list'>
        <template #default='{ item }'>
          <p @click='() => showPageContent(item.id)' class='py-2 pl-4 cursor-pointer truncate hover:bg-indigo-600 hover:text-white relative' :class='[currentPageId === item.id ? "bg-indigo-600 text-white" : ""]' :title='item.pageName'>{{ item.pageName }}</p>
        </template>
      </List>
    </div>
    <!-- <Editor :value='pageContent' class='flex-1'></Editor> -->
    <PreviewEditor :value='pageContent' class='left-60 relative min-h-screen' style='width: calc(100% - 240px)'></PreviewEditor>
  </div>
</template>

<style scoped>
</style>
