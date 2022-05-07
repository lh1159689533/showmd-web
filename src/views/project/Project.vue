<script lang="ts">
import { defineComponent } from 'vue';
import Sider from '@src/views/project/Sider.vue';
import ProjectList from './ProjectList.vue';
import Header from "./Header.vue";
export default defineComponent({
  name: 'project',
  components: { Sider, ProjectList, Header },
});
</script>

<template>
  <Header />
  <div id='project' class='flex flex-row'>
    <Sider />
    <ProjectList class='flex-1' />
    <div class='right-sider w-1/5'></div>
  </div>
</template>