<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Header',
  setup() {
    
  },
})
</script>

<template>
  <div class="h-12 bg-indigo-600 shadow">
    <header class="container mx-auto h-12">
      <div class="w-6/12 mx-auto flex items-center h-12 relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="w-5 h-5"></i>
        </div>
        <input type="text" name="email-address" placeholder="Search projects" class="text-white placeholder-gray-300 outline-none caret-white pl-10 p-2 bg-indigo-400 bg-opacity-50 focus:ring-indigo-500 focus:border-indigo-400 block w-full shadow-sm sm:text-sm rounded-md">
      </div>
    </header>
  </div>
</template>

<style scoped>
header i {
  background-image: url('img/search.svg');
}
</style>
