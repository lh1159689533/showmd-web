<script lang="ts">
import { defineComponent } from "vue";
import Sider from "@components/Sider.vue";
import Section from "@components/Section.vue";
export default defineComponent({
  name: "home",
  components: { Sider, Section },
});
</script>

<template>
  <div id="home">
    <Sider />
    <Section />
  </div>
</template>