<!-- 
@description 鼠标按下(mouseDown)时，监听mousemove事件，当鼠标x坐标发生变化时，调用dragWidth并将x坐标值作为第一个参数
@param callback 是一个Function，用于改变容器宽/高，实现拖动鼠标改变容器宽度的效果，必填项
@param isMax 是否最大，当父组件使用全屏按钮时，用于改变direction的值，以改变样式显示
@param min 最小值，非必填，默认0
@param max 最大值，非必填
@param type 类型: col 改变宽度 默认值, row 改变高度
@example <div width={col}><ReSize @callback={col => setWid(col)} type='col' /></div>
@author hhhuilli
 -->
<script lang="ts" setup>
import { ref, defineProps, defineEmits, onMounted, onBeforeUnmount, watchEffect } from 'vue';

const props = defineProps<{
  callback?: (size: number) => void;
  isMax?: boolean;
  min?: number;
  max?: number;
  type?: string;
  style?: any;
}>();
const emit = defineEmits<{ (e: 'callback', x: number): void }>();

const { isMax = false, min = 0, max, type = 'col', style } = props;

const timer = ref();
const drager = ref();

// 控制cursor样式
const direct = ref('default');

const dragWidth = (e) => {
  let x = e.clientX;
  let direction = 'default';
  if (min && x < min) {
    x = min;
    direction = 'min';
  }
  if (max && x > max) {
    x = max;
    direction = 'max';
  }
  direct.value = direction;
  emit('callback', x);
};

const dragHeight = (e) => {
  let y = document.body.clientHeight - e.clientY;
  let direction = 'default';
  if (min && y < min) {
    y = min;
    direction = 'min';
  }
  if (max && y > max) {
    y = max;
    direction = 'max';
  }
  direct.value = direction;
  emit('callback', y);
};

/**
 * 鼠标移动时，调用dragWidth
 * @param e MouseEvent
 */
const mouseMove = (e) => {
  if (new Date().getTime() - timer.value < 50) return;
  timer.value = new Date().getTime();
  if (type === 'col') {
    dragWidth(e);
  } else {
    dragHeight(e);
  }
};

/**
 * 鼠标抬起时，移除mousemove、mouseup监听
 */
const mouseUp = () => {
  document.removeEventListener('mousemove', mouseMove);
  document.removeEventListener('mouseup', mouseUp);
};

/**
 * 鼠标按下时，添加mousemove、mouseup监听
 * @param e MouseEvent
 */
const mouseDown = (e) => {
  document?.addEventListener('mousemove', mouseMove);
  document?.addEventListener('mouseup', mouseUp);
  e.preventDefault();
};

/**
 * 添加mousedown事件监听
 */
const handleDrag = () => {
  drager.value?.addEventListener('mousedown', mouseDown);
};

onMounted(() => {
  handleDrag();
});

onBeforeUnmount(() => {
  // 销毁时移除mousedown
  drager.value?.removeEventListener('mousedown', mouseDown);
});

watchEffect(() => {
  if (isMax) {
    direct.value = 'max';
  } else {
    direct.value = 'default';
  }
});
</script>
<template>
  <div ref='drager' :className='`resize ${type}-resize ${type}-resize-${direct}`' :style='style' />
</template>
<style scoped>
.resize {
  position: relative;
  background: transparent;
  right: 0px;
  top: 0;
  z-index: 991;
}

.col-resize {
  width: 5px;
  height: 100%;
}

.row-resize {
  height: 5px;
  width: 100%;
}

.col-resize-default {
  cursor: col-resize;
}

.row-resize-default {
  cursor: row-resize;
}

.row-resize-min {
  cursor: n-resize;
}

.row-resize-max {
  cursor: s-resize;
}

.col-resize-min {
  cursor: e-resize;
}

.col-resize-max {
  cursor: w-resize;
}
</style>
