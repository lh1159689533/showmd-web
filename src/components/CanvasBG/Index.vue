<script lang='ts'>
import { defineComponent, onMounted } from 'vue';

// canvas背景
export default defineComponent({
  name: 'CanvasBG',
  setup() {
    onMounted(() => {
      import('./lib/hexagon').then(mod => mod?.default());
    });
  },
});
</script>

<template>
  <canvas id='CanvasBG'></canvas>
</template>

<style scoped>
</style>
