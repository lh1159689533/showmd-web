<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue';
import { getElementById } from '@src/components/Editor/domUtil';

// canvas背景
export default defineComponent({
  name: 'CanvasBG',
  setup() {
    onMounted(() => {
      import('./lib/hexagon').then((mod) => mod?.default());
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
