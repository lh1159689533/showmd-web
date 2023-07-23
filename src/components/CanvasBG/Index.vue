<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue';
import { getElementById } from '@src/components/Editor/domUtil';
import storage from '@src/utils/storage';

// canvas背景
export default defineComponent({
  name: 'CanvasBG',
  setup() {
    onMounted(() => {
      const theme = storage.getItem('theme');
      import(theme === 'dark' ? './lib/hexagon' : './lib/danceLine').then((mod) => mod?.default());
      // import('./lib/danceLine').then((mod) => mod?.default());
      // import('./lib/numberRain').then((mod) => mod?.default());
      // import('./lib/starrySky').then((mod) => mod?.default());
    });

    onUnmounted(() => {
      const canvas = getElementById('CanvasBG');
      if (canvas) {
        (canvas as HTMLCanvasElement).getContext('2d')?.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    });
  },
});
</script>

<template>
  <canvas id="CanvasBG"></canvas>
</template>

<style scoped></style>
