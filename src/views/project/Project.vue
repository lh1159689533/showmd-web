<script lang="ts">
import { defineComponent } from "vue";
import Sider from "@components/Sider.vue";
import ProjectList from "./ProjectList.vue";
export default defineComponent({
  name: "project",
  components: { Sider, ProjectList },
});
</script>

<template>
  <div id="project" class="flex flex-row">
    <Sider />
    <ProjectList class="flex-1" />
    <div class="right-sider w-1/5"></div>
  </div>
</template>