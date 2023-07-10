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
const { min, max, ...others } = toRefs(props);

const drawerRef = ref();
const dragCls = ref('');

let timer = null;

watchEffect(() => {
  if (!props.visible) {
    dragCls.value = '';
  }
});

function mouseMove(e) {
  if (timer) return;
  const width = document.body.clientWidth - e.clientX;
  if (width <= min.value) {
    dragCls.value = 'min';
    drawerRef.value.drawerRef.style.width = `${min}px`;
  } else if (width >= max.value) {
    dragCls.value = 'max';
    drawerRef.value.drawerRef.style.width = `${max}px`;
  } else {
    timer = setTimeout(() => {
      drawerRef.value.drawerRef.style.width = `${width}px`;
      clearTimeout(timer);
      timer = null;
    }, 50);
  }
}
function mouseUp() {
  document.removeEventListener('mousemove', mouseMove);
  document.removeEventListener('mouseup', mouseUp);
}

function mousedown(e) {
  e.preventDefault();
  document.addEventListener('mousemove', mouseMove);
  document.addEventListener('mouseup', mouseUp);
}
</script>
<template>
  <el-drawer v-if="visible" :model-value="true" v-bind="others" ref="drawerRef">
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
  height: calc(100% - 51px);
  float: left;
  background-color: #fff;
  margin-left: -16px;
  cursor: ew-resize;
  top: 0;
  position: absolute;
}
.drag.min {
  cursor: w-resize;
}
.drag.max {
  cursor: e-resize;
}
</style>
