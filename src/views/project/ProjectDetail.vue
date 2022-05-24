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
    const currentPage = ref();

    findPageList(props?.id).then((res) => {
      projectName.value = res.projectName;
      pageList.value = res.list;
      currentPage.value = res.list?.[0];
    });

    const showPageContent = (pageId) => {
      currentPage.value = pageList.value.find((page) => page.id === pageId);
    };

    return {
      projectName,
      pageList,
      currentPage,
      showPageContent,
    };
  },
  methods: {
    goBack() {
      this.$router.push('/project');
    },
  },
});
</script>

<template>
  <div class='project-detail relative w-4/5' style='margin: 0 auto; max-width: 1140px;'>
    <div class='project-detail-sider bg-white shadow-lg pt-4 fixed top-0 bottom-0 flex flex-col z-10' style='width: 240px'>
      <a class='pb-3 flex items-center border-b'>
        <span class='pl-2'>{{ projectName }}</span>
        <Icon type='arrowLeft' class='hover:text-indigo-600 cursor-pointer ml-3' @click='goBack' />
      </a>
      <div class='project-menu relative flex-1'>
        <List :dataList='pageList' class='project-sider-list absolute w-full h-full'>
          <template #default='{ item }'>
            <div
              @click='() => showPageContent(item.id)'
              :class='[currentPage?.id === item.id ? "bg-gray-100 text-indigo-600" : "text-gray-700"]'
              class='py-3 px-4 cursor-pointer border-b hover:bg-gray-100 relative'
            >
              <div class='flex justify-between text-xs text-gray-400'>
                <span>lihui</span>
                <span>{{item.modifyTime ?? item.createTime}}</span>
              </div>
              <p :title='item.pageName' class='title truncate pt-2'>{{ item.pageName }}</p>
            </div>
          </template>
        </List>
      </div>
    </div>
    <PreviewEditor :page='currentPage' class='left-60 relative'></PreviewEditor>
  </div>
</template>

<style scoped>
</style>
