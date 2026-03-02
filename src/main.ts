import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import { store } from './store'
import Components from '@plugins/Components';

// Element Plus 图标
// import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

import 'virtual:windi.css';
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'animate.css';
import './theme/index.css';

// 🎨 导入波纹效果
import { rippleDirective, initAutoRipple } from '@utils/ripple';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const app = createApp(App);

app.use(router);
app.use(store);

// use自定义全局组件
app.use(Components);

// 注册 Element Plus 图标
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component);
// }

// 🎨 注册波纹指令
app.directive('ripple', rippleDirective);

app.mount('#app');

// 🎨 初始化自动波纹效果
initAutoRipple();
