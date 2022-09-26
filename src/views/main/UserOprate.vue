<script lang='ts'>
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'UserOprate',
  setup() {
    const router = useRouter();
    const store = useStore();

    // 用户操作选项
    const userOprateList = [
      {
        title: '写文章',
        icon: 'bianji',
        key: 'newArticle',
      },
      {
        title: '草稿箱',
        icon: 'draftbox',
        key: 'draft',
      },
      {
        title: '退出',
        icon: 'tuichu',
        key: 'logout',
      },
    ];

    // 是否展示用户操作
    const isShowUserOprate = ref(false);
    const user = computed(() => store.getters.getUser);

    // 显示用户操作栏
    const showUserOprate = () => {
      function hide() {
        isShowUserOprate.value = false;
        document.removeEventListener('click', hide);
      }
      isShowUserOprate.value = !isShowUserOprate.value;
      if (isShowUserOprate.value) {
        document.addEventListener('click', hide);
      }
    };

    // 操作
    const handleOprate = (key) => {
      if (key === 'newArticle') {
        const { href } = router.resolve('/article/new');
        window.open(href, '_blank');
      }
    };

    return {
      user,
      userOprateList,
      isShowUserOprate,
      showUserOprate,
      handleOprate,
    };
  },
});
</script>

<template>
  <el-dropdown @command='handleOprate' trigger='hover'>
    <el-avatar :size='30' class='ml-5 -mt-1 cursor-pointer' :src='user.avatar'>
      <img src='https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png' />
    </el-avatar>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for='item in userOprateList' :key='item.key' :command='item.key'>
          <i class='iconfont justify-self-center text-2xl' :class='`icon-${item.icon}`' />
          {{ item.title }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.user-oprate-list {
  min-width: 8.15rem;
  box-shadow: 0px 0px 6px -3px #666;
}
</style>