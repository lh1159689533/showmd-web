<script lang="ts" setup>
import Header from '@src/views/main/Header.vue';
</script>

<template>
  <Header />
  <div id='main' class='container relative top-12'>
    <router-view />
  </div>
</template>

<style scoped>

</style>