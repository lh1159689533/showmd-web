<!--
 - 自定义抽屉组件，可拖拽改变其宽度
 - 新增属性: max min visible
 - 继承属性: el-drawer属性, 不包括 modelValue
-->
<script lang="ts" setup>
import { defineProps, ref, toRefs, watchEffect, withDefaults } from 'vue';
import { DrawerProps } from 'element-plus';

interface IProps extends Omit<DrawerProps, 'modelValue'> {
  max?: number;
  min?: number;
  visible: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  min: 200,
  max: 600,
});
const { min, max, size, title, beforeClose, direction } = toRefs(props);

const drawerRef = ref();
const dragCls = ref('');

let timer = null;
let time = null;

watchEffect(() => {
  if (!props.visible) {
    dragCls.value = '';
  }
});

function mouseMove(e) {
  let width = document.body.clientWidth - e.clientX;
  if (width <= min.value) {
    dragCls.value = 'min';
    width = min.value;
  } else if (width >= max.value) {
    dragCls.value = 'max';
    width = max.value;
  }
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  const curr = new Date().getTime();
  if (curr - time > 50) {
    drawerRef.value.drawerRef.style.width = `${width}px`;
    time = curr;
  } else {
    timer = setTimeout(() => {
      drawerRef.value.drawerRef.style.width = `${width}px`;
      clearTimeout(timer);
      timer = null;
    }, 20);
  }
}
function mouseUp() {
  document.removeEventListener('mousemove', mouseMove);
  document.removeEventListener('mouseup', mouseUp);
}

function mousedown(e) {
  e.preventDefault();
  time = new Date().getTime();
  document.addEventListener('mousemove', mouseMove);
  document.addEventListener('mouseup', mouseUp);
}
</script>
<template>
  <el-drawer
    v-if="visible" :model-value="true" :title="title" :direction="direction" :before-close="beforeClose"
    ref="drawerRef" :size="size" :close-on-click-modal="false" :destroy-on-close="true"
  >
    <div @mousedown="mousedown" class="drag" :class="dragCls"></div>
    <slot></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </el-drawer>
</template>
<style>
.drag {
  width: 5px;
  /* height: calc(100% - 51px); */
  height: 100%;
  float: left;
  background-color: #fff;
  margin-left: -16px;
  cursor: ew-resize;
  top: 0;
  left: 15px;
  position: absolute;
}

.dark .el-drawer__title {
  @apply dark:text-zinc-300;
}

.dark .drag {
  @apply bg-zinc-900;
}

.drag.min {
  cursor: w-resize;
}

.drag.max {
  cursor: e-resize;
}
</style>
