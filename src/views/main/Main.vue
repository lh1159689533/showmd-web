<script lang="ts">
import { defineComponent } from 'vue';
import Section from '@components/Section.vue';
import Header from '@src/views/main/Header.vue';
export default defineComponent({
  name: 'Main',
  components: { Section, Header },
});
</script>

<template>
  <Header />
  <div id='main' class='container mx-auto'>
    <router-view></router-view>
  </div>
</template>

<style scoped>
</style>