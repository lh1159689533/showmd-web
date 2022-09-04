<template>
  <router-view />
</template>
<style>
:root {
  --el-color-primary: rgb(79 70 229) !important;
  --el-color-primary-light-3: rgba(79, 70, 229, 0.7) !important;
  --el-color-primary-light-7: rgba(79, 70, 229, 0.3) !important;
  --el-color-primary-light-9: rgba(79, 70, 229, 0.1) !important;
}

body {
  background-color: #f4f5f5;
}

#app {
  background-color: #f4f5f5;
  position: relative;
}

.el-message {
  min-width: fit-content !important;
  padding: 15px 19px !important;
}

.el-notification {
  width: fit-content !important;
}

.el-button:not(.is-text, .is-link, .el-button--text):focus-visible {
  border-color: transparent !important;
  outline: none !important;
  outline-offset: 0px !important;
}

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