<script lang='ts'>
import { defineComponent, ref, toRefs, onMounted, watch } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

export default defineComponent({
  name: 'Editor',
  props: {
    value: String,
    mode: String, // preview editor
  },
  setup(props) {
    const vditor = ref<Vditor | null>(null);
    let isReady = false;

    const { value } = toRefs(props);

    watch(value, (newVal: string) => {
      // console.log('newVal:', newVal);
      isReady && vditor.value.setValue(newVal);
    });

    onMounted(() => {
      vditor.value = new Vditor('myEditor', {
        toolbarConfig: {
          hide: true,
        },
        outline: {
          enable: true,
          position: 'right',
        },
        preview: {
          actions: []
        },
        mode: 'ir',
        after() {
          vditor.value.setValue(props?.value ?? '');
          isReady = true;
        },
      });
    });
  },
});
</script>

<template>
  <div id='myEditor' class='min-h-screen' v-bind='$attrs'></div>
</template>

<style>
#myEditor .vditor-toolbar--hide {
  display: none !important;
}

/* #myEditor .vditor-sv {
  display: none !important;
} */
</style>
