<script lang="ts">
import { defineComponent } from "vue";
import Select from '@components/Select.vue';

export default defineComponent({
  name: "project",
  components: {
    Select
  },
  setup() {
    const sortOptions = [
      { value: 'lastupdated', label: 'Last updated' },
      { value: 'name', label: 'Name' },
    ];

    const sortChange = (val: string) => {
      console.log('sort change:', val);
    };

    return {
      sortOptions,
      sortChange
    };
  }
});
</script>

<template>
  <div id="project-list" class="flex-1 border-x border-gray-200 flex flex-col">
    <header class=" w-full h-16 border-b border-gray-200 flex flex-row justify-between items-center px-10">
      <h2 class="title font-bold">Projects</h2>
      <Select :options='sortOptions' @change='sortChange' />
    </header>
    <div class="list flex-1"></div>
  </div>
</template>

<style scoped>
#project-list {
  min-height: calc(100vh - 48px);
}
</style>