<script lang="ts">
import { defineComponent } from 'vue';
import Select from '@components/Select.vue';
import List from '@src/components/List.vue';

export default defineComponent({
  name: 'project',
  components: {
    Select,
    List,
  },
  setup() {
    const sortOptions = [
      { value: 'lastupdated', label: 'Last updated' },
      { value: 'name', label: 'Name' },
    ];

    const prefix = { icon: 'sortAsc', text: 'Sort: ' };

    const projectList = [
      'dsdsdsdsdadsadsfsfsdasdasd',
      'dsdsdsdsdadsadsfsfsdasdasd',
      'dsdsdsdsdadsadsfsfsdasdasd',
    ];

    const sortChange = (val: string) => {
      console.log('sort change:', val);
    };

    return {
      sortOptions,
      sortChange,
      prefix,
      projectList,
    };
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
        <template v-slot:default='{ item }'>
          <p class="py-3 px-10 text-left cursor-pointer font-medium">{{item}}</p>
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