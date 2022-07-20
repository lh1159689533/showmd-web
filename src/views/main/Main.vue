<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@src/views/main/Header.vue';
export default defineComponent({
  name: 'Main',
  components: { Header },
});
</script>

<template>
  <Header />
  <div id='main' class='container mx-auto'>
    <router-view />
  </div>
</template>

<style scoped>
</style>