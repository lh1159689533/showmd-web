<template>
  <Loading ref="loadingRef" @checkLoaded="checkLoaded" />
  <router-view />
</template>
<script lang="ts" setup>
// import { onMounted, ref } from 'vue';
// import { useRouter } from 'vue-router';
// import Loading from '@components/Loading.vue';

// 导入完整主题系统
import './theme/index.css'

// const loadingRef = ref();

// const router = useRouter();

// const checkLoaded = () => {
//   let timer = setInterval(() => {
//     console.log('checking loaded:', document.readyState);
//     if (document.readyState === 'complete') {
//       clearInterval(timer);
//       loadingRef.value.out();
//     }
//   }, 300);
// };

// onMounted(() => {
//   checkLoaded();
//   router.beforeEach((to, from, next) => {
//     loadingRef.value.enter(next);
//   });
// });
</script>
<style>
:root {
  --el-color-primary: #f87171 !important;
  --el-color-primary-light-1: rgba(248, 113, 113, 0.9) !important;
  --el-color-primary-light-2: rgba(248, 113, 113, 0.8) !important;
  --el-color-primary-light-3: rgba(248, 113, 113, 0.7) !important;
  --el-color-primary-light-4: rgba(248, 113, 113, 0.6) !important;
  --el-color-primary-light-5: rgba(248, 113, 113, 0.5) !important;
  --el-color-primary-light-6: rgba(248, 113, 113, 0.4) !important;
  --el-color-primary-light-7: rgba(248, 113, 113, 0.3) !important;
  --el-color-primary-light-8: rgba(248, 113, 113, 0.2) !important;
  --el-color-primary-light-9: rgba(248, 113, 113, 0.1) !important;

  /* 原有变量 */
  --showmd-bg-color-primary: var(--bg-color-page);
  --showmd-bg-color-weak: #f3f4f6;
  --showmd-bg-color-hover: var(--bg-color-dropdown-hover);
  --showmd-bg-color-active: #e5e7eb;
  --showmd-text-color-primary: var(--text-color-primary);
  --showmd-text-color-danger: #ef4444;
  --showmd-text-color-weak: var(--text-color-secondary);
  --showmd-text-color-disable: #9ca3af;
  --showmd-border-color: #e5e7eb;
  --showmd-text-color-hover: var(--vibrant-coral);
  --showmd-border-color-hover: var(--vibrant-coral);
  
  /* 额外的颜色变量 */
  --showmd-bg-color: var(--showmd-bg-color-primary);
  --showmd-text-color: var(--showmd-text-color-primary);
  --showmd-danger-color: #ef4444;
  --showmd-text-color-secondary: var(--text-color-secondary);

  /* 🌸 珊瑚红主题色彩系统 - 基于 #f87171 */
  --vibrant-coral: #f87171;
  --coral-primary: #ef4444;
  --coral-secondary: #dc2626;
  --coral-light: #fca5a5;
  --coral-lighter: #fecaca;
  --coral-lightest: #fee2e2;
  --coral-dark: #b91c1c;
  --coral-darker: #991b1b;
  
  /* 🎨 珊瑚红渐变系统 */
  --gradient-coral-primary: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
  --gradient-coral-warm: linear-gradient(135deg, #fca5a5 0%, #f87171 100%);
  --gradient-coral-cool: linear-gradient(135deg, #f87171 0%, #22d3ee 100%);
  --gradient-coral-sunset: linear-gradient(135deg, #fb923c 0%, #f87171 100%);
  
  /* 🌿 翡翠绿主题色彩系统 - 基于 #34d399 */
  --vibrant-emerald: #34d399;
  --emerald-primary: #10b981;
  --emerald-secondary: #059669;
  --emerald-light: #6ee7b7;
  --emerald-lighter: #a7f3d0;
  --emerald-lightest: #d1fae5;
  --emerald-dark: #047857;
  --emerald-darker: #065f46;
  
  /* 🎨 翡翠绿渐变系统 */
  --gradient-emerald-primary: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  --gradient-emerald-warm: linear-gradient(135deg, #6ee7b7 0%, #34d399 100%);
  --gradient-emerald-cool: linear-gradient(135deg, #34d399 0%, #2dd4bf 100%);
  --gradient-emerald-sunset: linear-gradient(135deg, #a3e635 0%, #34d399 100%);
  
  /* 🌿 护眼绿色主题色彩系统 */
  /* 护眼绿色渐变 */
  --gradient-primary: linear-gradient(135deg, #10b981 0%, #059669 100%);
  --gradient-secondary: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  --gradient-accent: linear-gradient(135deg, #6ee7b7 0%, #34d399 100%);
  --gradient-warm: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  --gradient-cool: linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%);
  
  /* 护眼色系 */
  --neon-blue: #06b6d4;
  --neon-pink: #ec4899;
  --neon-green: #10b981;
  --neon-emerald: #059669;
  --neon-orange: #f59e0b;
  
  /* 护眼功能色 */
  --vibrant-green: #10b981;
  --electric-teal: #14b8a6;
  --sunset-orange: #f59e0b;
  --mint-green: #6ee7b7;
  --sage-green: #84cc16;
  --neon-coral: #f87171;
  
  /* 毛玻璃效果 */
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  --glass-backdrop: blur(8px);
  
  /* 动效变量 */
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --transition-fast: all 0.15s ease-out;
  --shadow-glow: 0 0 20px rgba(16, 185, 129, 0.3);
  --shadow-float: 0 10px 25px rgba(0, 0, 0, 0.1);
  --shadow-press: 0 2px 8px rgba(0, 0, 0, 0.15);
}

:root.dark {
  /* richtext暗黑样式 start */
  --w-e-textarea-bg-color: #18181b;
  --w-e-textarea-color: #d4d4d8;
  --w-e-textarea-slight-bg-color: #27272a;
  --w-e-textarea-slight-border-color: #27272a;
  --w-e-textarea-selected-border-color: #71717a;
  /* richtext暗黑样式 end */

  /* 原有暗色变量 */
  --showmd-bg-color-primary: #18181b;
  --showmd-bg-color-weak: #3f3f46;
  --showmd-bg-color-hover: #27272a;
  --showmd-bg-color-active: #3f3f46;
  --showmd-text-color-primary: #d4d4d8;
  --showmd-text-color-weak: #71717a;
  --showmd-text-color-disable: #52525b;
  --showmd-border-color: #27272a;
  
  /* 额外的颜色变量 - 暗色主题 */
  --showmd-bg-color: var(--showmd-bg-color-primary);
  --showmd-text-color: var(--showmd-text-color-primary);
  --showmd-danger-color: #f87171;
  --showmd-text-color-secondary: #a1a1aa;

  /* 🌙 暗色翡翠绿主题 */
  --vibrant-emerald-dark: #6ee7b7;
  --emerald-primary-dark: #34d399;
  --emerald-secondary-dark: #10b981;
  --emerald-light-dark: #a7f3d0;
  --emerald-lighter-dark: #d1fae5;
  --emerald-dark-dark: #059669;
  --emerald-darker-dark: #047857;
  
  /* 🌙 暗色护眼绿色主题 */
  /* 暗色护眼渐变 */
  --gradient-primary: linear-gradient(135deg, #10b981 0%, #059669 100%);
  --gradient-secondary: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  --gradient-accent: linear-gradient(135deg, #6ee7b7 0%, #34d399 100%);
  --gradient-warm: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  --gradient-cool: linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%);
  
  /* 暗色护眼效果 */
  --neon-blue: #06b6d4;
  --neon-pink: #ec4899;
  --neon-green: #22c55e;
  --neon-emerald: #10b981;
  --neon-orange: #f59e0b;
  
  /* 暗色毛玻璃 */
  --glass-bg: rgba(0, 0, 0, 0.3);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  --glass-backdrop: blur(12px);
  
  /* 暗色阴影 */
  --shadow-glow: 0 0 25px rgba(16, 185, 129, 0.4);
  --shadow-float: 0 10px 25px rgba(0, 0, 0, 0.3);
  --shadow-press: 0 2px 8px rgba(0, 0, 0, 0.4);
}

html {
  scroll-behavior: auto !important;
}

html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  /* 保留 body 的 overflow-x: hidden 以防止水平滚动 */
  overflow-x: hidden;
  /* 让 body 作为主滚动容器 */
  overflow-y: auto;
}

body {
  /* 移除重复的 overflow 设置，让 body 作为主滚动容器 */
  @apply bg-gray-100;
}

.dark body {
  @apply bg-black;
}

#app {
  min-height: 100vh;
  position: relative;
  /* 移除 overflow 属性以修复 sticky 定位问题 */
  /* overflow-y: auto; */
  /* overflow-x: hidden; */
}

/* 防止其他组件干扰滚动 */
body.overflow-hidden {
  overflow: auto !important;
}

/* 防止滚动跳转 */
* {
  scroll-behavior: auto !important;
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

/* 🎨 现代化按钮系统 */
.el-button {
  position: relative;
  overflow: hidden;
  border-radius: 12px !important;
  font-weight: 600 !important;
  transition: var(--transition-smooth) !important;
  border: none !important;
  box-shadow: var(--shadow-float) !important;
}

.el-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.el-button:hover::before {
  left: 100%;
}

.el-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: var(--shadow-glow) !important;
}

.el-button:active {
  transform: translateY(0) !important;
  box-shadow: var(--shadow-press) !important;
}

/* 🎨 主要按钮样式 */
.el-button--primary {
  background: var(--gradient-primary) !important;
  --el-button-disabled-bg-color: rgba(16, 185, 129, 0.5) !important;
  --el-button-disabled-border-color: transparent !important;
}

.el-button--primary:hover {
  background: var(--gradient-primary) !important;
  filter: brightness(1.1) !important;
}

/* 🎨 成功按钮样式 */
.el-button--success {
  background: var(--gradient-accent) !important;
}

.el-button--success:hover {
  background: var(--gradient-accent) !important;
  filter: brightness(1.1) !important;
}

/* 🎨 警告按钮样式 */
.el-button--warning {
  background: var(--gradient-warm) !important;
}

.el-button--warning:hover {
  background: var(--gradient-warm) !important;
  filter: brightness(1.1) !important;
}

/* 🎨 危险按钮样式 */
.el-button--danger {
  background: var(--gradient-secondary) !important;
}

.el-button--danger:hover {
  background: var(--gradient-secondary) !important;
  filter: brightness(1.1) !important;
}

/* 🎨 信息按钮样式 */
.el-button--info {
  background: var(--gradient-cool) !important;
  color: #333 !important;
}

.el-button--info:hover {
  background: var(--gradient-cool) !important;
  filter: brightness(1.1) !important;
  color: #333 !important;
}

/* 🎨 默认按钮样式 */
.el-button--default {
  background: var(--glass-bg) !important;
  backdrop-filter: var(--glass-backdrop) !important;
  border: 1px solid var(--glass-border) !important;
  color: var(--showmd-text-color-primary) !important;
}

  .el-button--default:hover {
  background: var(--glass-bg) !important;
  border-color: var(--vibrant-coral) !important;
  color: var(--vibrant-coral) !important;
}

/* 🎨 文本按钮样式 */
.el-button--text {
  color: var(--vibrant-coral) !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
  transition: var(--transition-smooth) !important;
}

.el-button--text:hover {
  background: rgba(16, 185, 129, 0.1) !important;
  transform: none !important;
  box-shadow: none !important;
}

/* 🎨 链接按钮样式 */
.el-button.is-link {
  color: var(--vibrant-coral) !important;
  text-decoration: none !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  transition: var(--transition-smooth) !important;
}

.el-button.is-link:hover {
  color: var(--neon-emerald) !important;
  text-decoration: underline !important;
  transform: none !important;
  box-shadow: none !important;
}

/* 🎨 小尺寸按钮 */
.el-button--small {
  border-radius: 10px !important;
  padding: 8px 16px !important;
  font-size: 13px !important;
}

/* 🎨 大尺寸按钮 */
.el-button--large {
  border-radius: 14px !important;
  padding: 14px 28px !important;
  font-size: 16px !important;
}

/* 🎨 禁用状态 */
.el-button.is-disabled {
  opacity: 0.6 !important;
  transform: none !important;
  box-shadow: none !important;
  cursor: not-allowed !important;
}

.el-button.is-disabled:hover {
  transform: none !important;
  box-shadow: none !important;
}

/* 🎨 加载状态 */
.el-button.is-loading {
  position: relative;
}

.el-button.is-loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: inherit;
  animation: loading-shimmer 1.5s infinite;
}

@keyframes loading-shimmer {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}

/* 🎨 波纹效果 */
.el-button {
  --ripple-color: rgba(255, 255, 255, 0.3);
}

.el-button--primary {
  --ripple-color: rgba(255, 255, 255, 0.4);
}

.el-button--default {
  --ripple-color: rgba(248, 113, 113, 0.3);
}

/* 🎨 按钮组样式 */
.el-button-group .el-button {
  border-radius: 0 !important;
}

.el-button-group .el-button:first-child {
  border-radius: 12px 0 0 12px !important;
}

.el-button-group .el-button:last-child {
  border-radius: 0 12px 12px 0 !important;
}

.el-button-group .el-button:only-child {
  border-radius: 12px !important;
}

/* 🎨 暗色主题适配 */
.dark .el-button--default {
  background: rgba(0, 0, 0, 0.4) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: var(--showmd-text-color-primary) !important;
}

.dark .el-button--default:hover {
  border-color: var(--neon-coral) !important;
  color: var(--neon-coral) !important;
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