<script lang="ts">
import { defineComponent, ref } from 'vue';
import { findList } from './project';

export default defineComponent({
  name: 'project',
  setup() {
    const sortOptions = [
      { value: 'lastupdated', label: 'Last updated' },
      { value: 'name', label: 'Name' },
    ];

    const prefix = { icon: 'sortAsc', text: 'Sort: ' };

    const projectList = ref();
    const projectNameList = ref();

    findList().then((res) => {
      if (res?.code === 0) {
        projectList.value = res?.data;
        projectNameList.value = projectList.value.map(({ projectName }: Record<string, string>) => projectName);
      }
    });

    const sortChange = (val: string) => {
      console.log('sort change:', val);
    };

    return {
      sortOptions,
      sortChange,
      prefix,
      projectList,
      projectNameList,
    };
  },
  methods: {
    toDetail(projectId) {
      this.$router.push(`/project/detail/${projectId}`);
    },
  },
});
</script>

<template>
  <div id='project-list' class='flex-1 border-x border-gray-200 flex flex-col'>
    <header class='w-full h-16 border-b border-gray-200 flex flex-row justify-between items-center px-10'>
      <h2 class='title font-black'>Projects</h2>
      <Select :options='sortOptions' @change='sortChange' :prefix='prefix' />
    </header>
    <div class='list flex-1'>
      <List :dataList='projectList'>
        <template #default='{ item }'>
          <p @click='() => toDetail(item.id)' class='py-3 px-10 text-left cursor-pointer font-medium hover:bg-gray-50 border-b'>{{item.projectName}}</p>
        </template>
      </List>
    </div>
  </div>
</template>

<style scoped>
#project-list {
  min-height: calc(100vh - 48px);
}

#list p {
  border-bottom-width: 1px;
  box-shadow: 0px 0px 3px #e5e7eb;
}
</style>