import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('@views/Home.vue') },
  { path: '/project', component: () => import('@views/project/Project.vue') },
  { path: '/project/detail/:id', component: () => import('@views/project/ProjectDetail.vue'), props: true },
  { path: '/page/edit/:id', component: () => import('@views/page/PageEdit.vue'), props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router