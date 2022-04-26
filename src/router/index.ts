import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('@views/Home.vue') },
  { path: '/project', component: () => import('@views/project/Project.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router