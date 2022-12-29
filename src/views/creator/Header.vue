<script lang='ts' setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import UserOprate from '@views/main/UserOprate.vue';

const router = useRouter();
const store = useStore();

// 选中的顶部导航菜单key
const headerCls = ref('');

async function init() {
  store.dispatch('getUserById', 1);
}

const handleNoticeClick = (e) => {
  if (e.target.dataset?.link) {
    router.push(e.target.dataset?.link);
  }
};

const toHomePage = () => {
  router.push('/');
};

init();
</script>
  
<template>
  <div class='h-12 w-full bg-white border-b fixed top-0 z-2000' :class='headerCls'>
    <header class='container h-full flex items-center'>
      <div @click='toHomePage' class='logo mr-4 text-2xl font-bold text-indigo-500 cursor-pointer' style='font-family: OleoScriptSwashCaps'>Lanis</div>
      <span class='flex-1 mt-1'>创作中心</span>
      <div class='flex ml-16 items-center h-full'>
        <UserOprate />
        <div @click='handleNoticeClick' class='notice-list flex gap-4 text-sm text-gray-600'>
          <el-badge is-dot class='cursor-pointer hover:text-indigo-500'>消息</el-badge>
          <span class='cursor-pointer hover:text-indigo-500'>足迹</span>
        </div>
      </div>
    </header>
  </div>
</template>
  
<style>

</style>
  