<script lang='ts'>
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { Search } from '@element-plus/icons-vue';
import UserOprate from './UserOprate.vue';
import { listMenuByRoleId } from '@service/user';

export default defineComponent({
  name: 'Header',
  components: { UserOprate },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    // 顶部导航菜单
    const menuList = ref([]);

    // 选中的顶部导航菜单key
    const activeKey = ref('');
    const headerCls = ref('');
    const currentScrollTop = ref(0);

    async function init() {
      const user = await store.dispatch('getUserById', 1);
      const menus = await listMenuByRoleId(user?.roleId);
      menuList.value = menus.map(m => ({
        ...m,
        key: m.title
      }));

      // 根据路由适配导航菜单
      const menu = menuList.value.find((nav) => nav.path === route.path);
      activeKey.value = menu?.key ?? '';
    }

    // 导航变化
    const changeNav = (nav) => {
      activeKey.value = nav.key;
      router.push(nav.path);
    };

    // 滚动事件，滚动高度大于500时隐藏header头
    function onScroll() {
      const { scrollTop } = document.documentElement;
      if (scrollTop > 500) {
        headerCls.value = 'animate__animated animate__fadeOutUp animate__faster';
      }
      if (scrollTop < currentScrollTop.value) {
        headerCls.value = 'animate__animated animate__fadeInDown animate__faster';
      }
      currentScrollTop.value = scrollTop;
    }

    onMounted(() => {
      document.addEventListener('scroll', onScroll);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('scroll', onScroll);
    });

    init();

    return {
      menuList,
      activeKey,
      changeNav,
      Search,
      headerCls,
    };
  },
});
</script>

<template>
  <div class='h-14 bg-white border-b sticky top-0 z-2000' :class='headerCls'>
    <header class='container h-full flex items-center'>
      <div class='logo mr-8 text-2xl font-bold text-indigo-500 cursor-pointer'>Lanis</div>
      <List :data-list='menuList' @click='changeNav' class='flex text-black mr-16 h-full flex-1' item-class='nav-list text-gray-800 min-w-max hover:text-black'>
        <template #default='{ item }'>
          <span :class='[item.key === activeKey ? "text-indigo-500 font-bold" : ""]'>{{ item.title }}</span>
        </template>
      </List>
      <div class='flex items-center h-10 relative w-80'>
        <el-input :prefix-icon='Search' placeholder='Search projects' class='text-gray-400 bg-white caret-gray-400 w-full text-sm hover:border-gray-400' />
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
