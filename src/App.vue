<template>
  <router-view />
</template>
<style>
:root {
  --el-color-primary: rgb(79 70 229) !important;
  --el-color-primary-light-1: rgba(79, 70, 229, 0.9) !important;
  --el-color-primary-light-2: rgba(79, 70, 229, 0.8) !important;
  --el-color-primary-light-3: rgba(79, 70, 229, 0.7) !important;
  --el-color-primary-light-4: rgba(79, 70, 229, 0.6) !important;
  --el-color-primary-light-5: rgba(79, 70, 229, 0.5) !important;
  --el-color-primary-light-6: rgba(79, 70, 229, 0.4) !important;
  --el-color-primary-light-7: rgba(79, 70, 229, 0.3) !important;
  --el-color-primary-light-8: rgba(79, 70, 229, 0.2) !important;
  --el-color-primary-light-9: rgba(79, 70, 229, 0.1) !important;
}

body {
  background-color: #f4f5f5;
}

#app {
  background-color: #f4f5f5;
  position: relative;
}

/** element-ui样式重写 start */
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

.el-badge__content.is-fixed {
  border: none !important;
}

.el-button--primary {
  --el-button-disabled-bg-color: rgba(79, 70, 229, 0.5) !important;
  --el-button-disabled-border-color: transparent !important;
}
/** element-ui样式重写 end */

/* 公共css start */
.container {
  width: 1380px !important;
  margin: 0 auto;
}

.delimiter {
  gap: 16px;
}

.delimiter>span {
  position: relative;
  display: flex;
  align-items: center;
}

.delimiter>span:last-child::before, .delimiter>span:not(:first-child):not(:last-child)::before {
  content: ' ';
  position: absolute;
  display: block;
  width: 3px;
  height: 3px;
  background-color: #666;
  border-radius: 50%;
  left: -9px;
  color: #000;
}

.delimiter>span:first-child::after, .delimiter>span:not(:first-child):not(:last-child)::after {
  content: ' ';
  position: absolute;
  display: block;
  width: 3px;
  height: 3px;
  background-color: #666;
  border-radius: 50%;
  right: -10px;
  color: #000;
}
/* 公共css end */

@media screen and (max-width: 1439px) {
  .container {
    max-width: 1190px;
  }
}

@media screen and (min-width: 1440px) and (max-width: 1535px) {
  .container {
    max-width: 1280px;
  }
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