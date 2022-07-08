<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import UserOprate from './UserOprate.vue';

export default defineComponent({
  name: 'Header',
  components: { UserOprate },
  setup() {
    // 顶部导航菜单
    const navList = [
      {
        title: '首页',
        key: 'home',
        path: '',
      },
      {
        title: '技术客栈',
        key: 'study',
        path: '/study',
      },
      {
        title: '资源之家',
        key: 'source',
        path: '/source',
      },
      {
        title: '写意人生',
        key: 'life',
        path: '/life',
      },
    ];

    // 选中的顶部导航菜单key
    const activeKey = ref(navList[0].key);
    const router = useRouter();
    const route = useRoute();

    onMounted(() => {
      // 根据路由适配导航菜单
      const nav = navList.find((nav) => nav.path === route.path);
      activeKey.value = nav?.key;
    });

    // 导航变化
    const changeNav = (nav) => {
      activeKey.value = nav.key;
      router.push(nav.path);
    };

    return {
      navList,
      activeKey,
      changeNav,
    };
  },
});
</script>

<template>
  <div class='h-14 bg-white border-b sticky top-0 z-50'>
    <header class='container mx-auto h-full flex items-center'>
      <div class='logo mr-8 text-2xl font-bold text-indigo-500 cursor-pointer'>Lanis</div>
      <List
        :dataList='navList'
        :onClick='changeNav'
        class='flex text-black mr-16 h-full flex-1'
        itemClass='nav-list text-gray-800 min-w-max hover:text-black'
      >
        <template #default='{ item }'>
          <span :class='[item.key === activeKey ? "text-indigo-500 font-bold" : ""]'>{{item.title}}</span>
        </template>
      </List>
      <div class='flex items-center h-10 relative w-80'>
        <Input
          type='search'
          placeholder='Search projects'
          class='text-gray-400 bg-white caret-gray-400 w-full text-sm hover:border-gray-400'
        />
      </div>
      <div class='notice flex ml-16 items-center h-full'>
        <span class='message relative cursor-pointer'>
          <i class='iconfont icon-notice text-gray-400 w-6 h-6 text-4xl hover:text-gray-500' />
          <span class='num rounded-full bg-red-500 text-white px-1 text-xs inline-block text-center absolute right-0 top-0'>8</span>
        </span>
        <div class='user h-full flex items-center relative'>
          <UserOprate />
        </div>
      </div>
    </header>
  </div>
</template>

<style>
.nav-list {
  @apply h-full cursor-pointer flex items-center mr-8 relative text-sm;
}

.nav-list:hover::after {
  content: '';
  position: absolute;
  height: 2px;
  width: 100%;
  bottom: 0;
  left: -2px;
  @apply bg-indigo-500;
}

.input-icon {
  @apply text-gray-400;
}
</style>
