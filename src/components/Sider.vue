<script>
import { defineComponent } from "vue";
import { newProject } from '@views/project/project';

export default defineComponent({
  name: "sider",
  methods: {
    newProjectHandle() {
      newProject();
    }
  },
});
</script>

<template>
  <div id="sider" class="w-1/6 px-10 py-6">
    <div id="user-info" class="flex flex-row">
      <img src="img/avatars.jpeg" class="rounded-full w-12 h-12" />
      <div class="flex-col ml-3 text-left">
        <span class="font-bold text-lg">Liuh</span>
        <div class="text-sm text-gray-500">
          <i class="github p-2 mr-1"></i>
          <span>lh1159689533</span>
        </div>
      </div>
    </div>
    <div class="mt-12">
      <button class="new-project" type="primary" @click="newProjectHandle">New Project</button>
    </div>
  </div>
</template>

<style scoped>
#sider i.github {
  background-image: url("img/github.svg");
  background-size: 100% 100%;
}
</style>
