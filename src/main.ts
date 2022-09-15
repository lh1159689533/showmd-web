import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import { store } from './store'
import Components from '@plugins/Components';
import './index.css';
import 'element-plus/theme-chalk/index.css';
import 'animate.css';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const app = createApp(App);

app.use(router);
app.use(store);

// use自定义全局组件
app.use(Components);

app.mount('#app');
