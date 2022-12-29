<script lang="ts" setup>
import Header from './Header.vue';
import Sider from './Sider.vue';
</script>
  
<template>
  <div class='h-screen'>
    <Header />
    <div id='creator' class='container relative top-12 flex' style='height:calc(100% - 48px)'>
      <div class='w-52 h-full'>
        <Sider />
      </div>
      <div class='flex-1 bg-white overflow-hidden'>
        <router-view />
      </div>
    </div>
  </div>
</template>
  
<style scoped>

</style>