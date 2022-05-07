<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Header',
  setup() {},
});
</script>

<template>
  <div class='h-12 bg-indigo-600 shadow'>
    <header class='container mx-auto h-12'>
      <div class='w-6/12 mx-auto flex items-center h-12 relative'>
        <Input
          type='search'
          placeholder='Search projects'
          class='text-white bg-indigo-400 caret-white w-full'
          style='border-width: 0'
        />
      </div>
    </header>
  </div>
</template>

<style scoped>
</style>
