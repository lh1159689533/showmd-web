import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@src/views/main/Main.vue'),
    children: [
      {
        path: '',
        component: () => import('@views/Home.vue'),
        alias: '/home'
      },
      {
        path: '/study',
        component: () => import('@views/study/Study.vue'),
      },
      {
        path: '/published',
        component: () => import('@views/article/Published.vue')
      }
    ]
  },
  { path: '/article/new', component: () => import('@views/article/ArticleEdit.vue') },
  { path: '/article/edit/:id', component: () => import('@views/article/ArticleEdit.vue'), props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router