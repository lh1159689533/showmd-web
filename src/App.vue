<template>
  <router-view />
</template>
<style>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  /* 滚动条上的滚动滑块 */
  background-color: #e4e6eb;
  outline: none;
  border-radius: 2px;
}

::-webkit-scrollbar-track-piece {
  /* 滚动条没有滑块的轨道部分 */
  background: transparent;
}

::-webkit-scrollbar-track {
  box-shadow: none;
  border-radius: 2px;
}
</style>