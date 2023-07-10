<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const dataList = ref([]);

const getData = () => {
  const eventSource = new EventSource('api/showmd/sse', { withCredentials: true });
  eventSource.onopen = (event) => {
    console.log('EventSource is open');
    console.error(event);
  };

  eventSource.onmessage = (event) => {
    console.log('EventSource：', event.data);
    dataList.value.push(event.data);
  };

  eventSource.onerror = (err) => {
    console.log('err:', err);
  };
};

onMounted(() => {
  getData();
});


</script>

<template>
  <div class="source-event-test flex flex-col h-full p-2">
    <List :data-list="dataList">
      <template #default="{ item }">
        <span>{{ item }}</span>
      </template>
    </List>
  </div>
</template>

<style></style>
