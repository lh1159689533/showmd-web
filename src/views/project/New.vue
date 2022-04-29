<script lang='ts'>
import { defineComponent } from 'vue';
import Drawer from '@components/Drawer.vue';

export default defineComponent({
  name: 'New',
  props: {
    visible: Boolean,
    close: Function,
  },
  components: { Drawer },
  setup() {},
});
</script>

<template>
  <Drawer :visible='visible' @close='close' title='新建项目' :footer='false' :size='800'>
    <template v-slot:footer>新建项目</template>
  </Drawer>
</template>

<style scoped>
</style>
