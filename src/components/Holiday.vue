<script lang="ts" setup>
import { ref } from 'vue';
import { holiday } from '@service/user';

const holidayConf = ref();

holiday().then((data) => {
  const { gradient = [] } = data?.center ?? {};
  holidayConf.value = {
    ...data,
    gradient: gradient.reduce((acc, curr) => `${acc}, ${curr.color} ${curr.percentage}%`, 'to right'),
  };
});
</script>

<template>
  <div v-if="holidayConf?.show" class="holiday h-full w-full absolute flex top-0 left-0 -z-10">
    <img :src="holidayConf?.left.img" class="w-28" />
    <div class="flex-1" :style="`background-image: linear-gradient(${holidayConf?.gradient})`"></div>
    <img :src="holidayConf?.right.img" class="w-28" />
  </div>
</template>

<style scoped></style>
