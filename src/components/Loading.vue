<template>
  <div ref="loadingRef" class="page-loading">loading</div>
</template>
<script lang="ts" setup>
import { ref, defineExpose, defineEmits } from 'vue';

const loadingRef = ref();

const emit = defineEmits(['checkLoaded']);

const enter = (next) => {
  console.log('enter');
  loadingRef.value?.classList.remove('out');
  loadingRef.value?.classList.add('enter');
  setTimeout(() => {
    next();
    emit('checkLoaded');
  }, 300);
};

const out = () => {
  console.log('out:', loadingRef.value);
  loadingRef.value?.classList.remove('enter');
  loadingRef.value?.classList.add('out');
};

defineExpose({
  enter,
  out,
});
</script>
<style>
.page-loading {
  width: 100vw;
  height: 100vh;
  background: var(--showmd-bg-color-primary);
  z-index: 99999;
  position: fixed;
  top: 100vh;
  left: 0;
}

.enter {
  /* animation: enter .2s ease-in forwards; */
  top: 0;
  transition: all 0.3s ease;
}

.out {
  /* animation: out .2s ease-in forwards; */
  top: 100vh;
  transition: all 0.1s ease;
}

@keyframes enter {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateX(0);
  }
}

@keyframes out {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateX(100%);
  }
}
</style>