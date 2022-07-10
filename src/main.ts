import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import Components from '@plugins/Components'
import 'animate.css'
import './index.css'

const app = createApp(App)

app.use(router)

// use自定义全局组件
app.use(Components)

app.mount('#app')
