<script lang='ts'>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'UserOprate',
  setup() {
    const router = useRouter();

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
    const oprate = ({ key }) => {
      if (key === 'newArticle') {
        router.push('/article/new');
      }
    };

    return {
      userOprateList,
      isShowUserOprate,
      showUserOprate,
      oprate,
    };
  },
});
</script>

<template>
  <img class='rounded-full w-8 h-8 ml-5 cursor-pointer' @click.stop='showUserOprate' />
  <List
    :data-list='userOprateList'
    v-show='isShowUserOprate'
    :on-click='oprate'
    class='user-oprate-list py-2 grid grid-rows-3 justify-items-center text-gray-600 text-sm absolute top-14 right-0 border rounded-sm bg-white'
    item-class='py-1 grid grid-cols-2 w-full items-center cursor-pointer hover:bg-gray-50'
  >
    <template #default='{ item }'>
      <i class='iconfont justify-self-center text-2xl' :class='`icon-${item.icon}`' />
      <a class='py-1 min-w-max'>{{ item.title }}</a>
    </template>
  </List>
</template>

<style scoped>
.user-oprate-list {
  min-width: 8.15rem;
  box-shadow: 0px 0px 6px -3px #666;
}
</style>