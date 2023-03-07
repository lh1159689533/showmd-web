import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@views/main/Main.vue'),
    children: [
      {
        path: '',
        alias: '/home',
        component: () => import('@views/Home.vue'),
      },
      {
        path: '/blog',
        component: () => import('@views/study/Study.vue'),
      },
      {
        path: '/published',
        component: () => import('@views/article/Published.vue')
      },
      {
        path: '/column/:id',
        component: () => import('@views/creator/manage/column/ColumnDetail.vue'),
        props: true
      },
      {
        path: '/article/preview/:id',
        component: () => import('@views/article/ArticlePreview.vue'),
        props: true
      },
      {
        path: '/404',
        component: () => import('@components/404.vue'),
        props: true
      },
    ]
  },
  {
    path: '/article/new',
    component: () => import('@views/article/ArticleEdit.vue')
  },
  {
    path: '/article/edit/:id',
    component: () => import('@views/article/ArticleEdit.vue'),
    props: true
  },
  {
    path: '/creator',
    component: () => import('@views/creator/Creator.vue'),
    children: [
      {
        path: '',
        alias: '/creator/home',
        component: () => import('@views/creator/Home.vue'),
      },
      {
        path: '/creator/manage/article',
        component: () => import('@views/creator/manage/Article.vue'),
      },
      {
        path: '/creator/manage/column',
        component: () => import('@views/creator/manage/column/Column.vue'),
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {  //如果未匹配到路由
    next('/404');
  } else {
    next();
  }
});

export default router