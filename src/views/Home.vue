<script lang="ts">
import { defineComponent } from 'vue';
import Section from '@components/Section.vue';
export default defineComponent({
  name: 'home',
  components: { Section },
});
</script>

<template>
  <div id='home'>
    <Section />
  </div>
</template>