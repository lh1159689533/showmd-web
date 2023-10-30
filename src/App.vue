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

  --showmd-bg-color-primary: #fff;
  --showmd-bg-color-weak: #f3f4f6;
  --showmd-bg-color-hover: #f9fafb;
  --showmd-text-color-primary: #111827;
  --showmd-text-color-danger: #ef4444;
  --showmd-text-color-weak: #4b5563;
  --showmd-text-color-disable: #9ca3af;
  --showmd-border-color: #e5e7eb;

  --showmd-text-color-hover: #6366f1;
  --showmd-border-color-hover: #6366f1;
}

:root.dark {
  /* richtext暗黑样式 start */
  --w-e-textarea-bg-color: #18181b;
  --w-e-textarea-color: #d4d4d8;
  --w-e-textarea-slight-bg-color: #27272a;
  --w-e-textarea-slight-border-color: #27272a;
  --w-e-textarea-selected-border-color: #71717a;
  /* richtext暗黑样式 end */

  --showmd-bg-color-primary: #18181b;
  --showmd-bg-color-weak: #3f3f46;
  --showmd-bg-color-hover: #27272a;
  --showmd-text-color-primary: #d4d4d8;
  --showmd-text-color-weak: #71717a;
  --showmd-text-color-disable: #52525b;
  --showmd-border-color: #27272a;
}

html,
body {
  padding: 0;
  margin: 0;
}

body {
  overflow-y: auto;
  @apply bg-gray-100;
}

.dark body {
  @apply bg-black;
}

#app {
  height: 100%;
  position: relative;
  overflow-y: hidden;
}

.dark .w-e-text-container pre>code {
  text-shadow: 0 1px #000;
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

.el-popper.is-customized {
  padding: 6px 12px;
  @apply border;
  background-color: var(--showmd-bg-color-primary);
  color: var(--showmd-text-color-primary);
  border-color: var(--showmd-border-color);
}

.el-popper.is-customized .el-popper__arrow::before {
  @apply border;
  right: 0;
  background-color: var(--showmd-bg-color-primary);
  color: var(--showmd-text-color-primary);
  border-color: var(--showmd-border-color);
}

/** element-ui样式重写 end */

/** windicss样式重写 start */
h1 {
  font-size: 2em !important;
  font-weight: bold !important;
}

h3 {
  font-size: 1.17em !important;
  font-weight: bold !important;
}

/** windicss样式重写 end */

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

.delimiter>span:last-child::before,
.delimiter>span:not(:first-child):not(:last-child)::before {
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

.delimiter>span:first-child::after,
.delimiter>span:not(:first-child):not(:last-child)::after {
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
@media screen and (max-width: 1065px) {
  .container {
    max-width: 660px;
  }
}

@media screen and (min-width: 1066px) and (max-width: 1179px) {
  .container {
    max-width: 760px;
  }
}

@media screen and (min-width: 1180px) and (max-width: 1284px) {
  .container {
    max-width: 880px;
  }
}

@media screen and (min-width: 1285px) and (max-width: 1614px) {
  .container {
    max-width: 990px;
  }
}

@media screen and (min-width: 1615px) and (max-width: 1700px) {
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
  outline: none;
  border-radius: 2px;
  background-color: var(--showmd-bg-color-weak);
}

::-webkit-scrollbar-track-piece {
  /* 滚动条没有滑块的轨道部分 */
  background-color: var(--showmd-bg-color-primary);
}

::-webkit-scrollbar-track {
  box-shadow: none;
  border-radius: 2px;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root) {
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 999;
}

/* 文字选中时的下划线动画 */
.text-underline {
  padding-bottom: 2px;
  background: linear-gradient(to right, var(--showmd-border-color-hover), var(--showmd-border-color-hover));
  background-repeat: no-repeat;
  background-position: right bottom;
  background-size: 0 1.5px;
  transition: background-size .3s;
}

.text-underline:hover {
  background-size: 100% 1.5px;
  background-position-x: left;
}

.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
}
</style>