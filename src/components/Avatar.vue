<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps<{ src: string }>();
</script>

<template>
  <img :src="src" @error="(e) => (e.target as HTMLImageElement).src = '/api/avatars.png'" v-bind="$attrs" />
</template>

<style scoped></style>
