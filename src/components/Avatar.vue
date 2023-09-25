<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps<{ src?: string }>();

const defaultSrc = '/api/avatars.png';
</script>

<template>
  <img :src="src ?? defaultSrc" @error="(e) => (e.target as HTMLImageElement).src = defaultSrc" v-bind="$attrs" />
</template>

<style scoped></style>
