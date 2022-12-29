<script lang='ts'>
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { Search } from '@element-plus/icons-vue';
import UserOprate from './UserOprate.vue';
import { listMenuByRoleId } from '@service/user';

export default defineComponent({
  name: 'Header',
  components: { UserOprate },
  emits: ['onShow'],
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

    const isShowHeader = computed(() => store.getters.isShowHeader);

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

    const handleNoticeClick = (e) => {
      if (e.target.dataset?.link) {
        router.push(e.target.dataset?.link);
      }
    };

    // 滚动事件，滚动高度大于500时隐藏header头
    function onScroll() {
      const { scrollTop } = document.documentElement;
      if (scrollTop > 500 && isShowHeader.value) {
        store.commit('hide')
        headerCls.value = 'animate__animated animate__slideOutUp animate__faster';
      }
      if (scrollTop < currentScrollTop.value && !isShowHeader.value) {
        store.commit('show')
        headerCls.value = 'animate__animated animate__slideInDown animate__faster';
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
      handleNoticeClick
    };
  },
});
</script>

<template>
  <div class='h-12 w-full bg-white border-b fixed top-0 z-2000' :class='headerCls'>
    <header class='container h-full flex items-center'>
      <div class='logo mr-8 text-2xl font-bold text-indigo-500 cursor-pointer' style='font-family: OleoScriptSwashCaps'>Lanis</div>
      <List
        :data-list='menuList' @click='changeNav' class='flex text-black mr-16 h-full flex-1'
        item-class='nav-list text-gray-800 min-w-max hover:text-black'
      >
        <template #default='{ item }'>
          <span :class='[item.key === activeKey ? "text-indigo-500 font-bold" : ""]'>{{ item.title }}</span>
        </template>
      </List>
      <div class='flex items-center h-10 relative w-80'>
        <el-input
          :prefix-icon='Search' placeholder='Search projects'
          class='text-gray-400 bg-white caret-gray-400 w-full text-sm hover:border-gray-400'
        />
      </div>
      <div class='flex ml-16 items-center h-full'>
        <UserOprate />
        <div @click='handleNoticeClick' class='notice-list flex gap-4 text-sm text-gray-600'>
          <el-badge is-dot class='cursor-pointer hover:text-indigo-500'>消息</el-badge>
          <span class='cursor-pointer hover:text-indigo-500'>足迹</span>
          <span data-link='/creator' class='cursor-pointer hover:text-indigo-500'>创作中心</span>
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
