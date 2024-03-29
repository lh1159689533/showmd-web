<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Login from '@src/views/main/Login.vue';

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
const isShow = ref(false);
const isShowLogin = computed(() => store.getters.isShowLogin);
const currentUser = computed(() => store.getters.getUser);

// 显示用户操作栏
const show = () => {
  isShow.value = true;
};

const hide = () => {
  isShow.value = false;
};

// 操作
const handleOprate = ({ key }) => {
  if (key === 'newArticle') {
    const { href } = router.resolve('/article/new');
    window.open(href, '_blank');
  }
  hide();
};
</script>

<template>
  <div v-if="currentUser?.id" class="user" @mouseenter="show" @mouseleave="hide">
    <Avatar :src="currentUser.avatar" :style="[isShow ? 'transform:scale(1.5) translate(0,8px)' : '']" />
    <div class="oprate-box show-ani absolute bg-white" :style="[isShow ? 'display:block' : 'display:none']">
      <div class="pt-3 pb-2 flex justify-center items-center border-b">
        <span>{{ currentUser.name }}</span>
      </div>
      <List :data-list="userOprateList" @click="handleOprate" class="oprate-list text-sm text-gray-600 my-3" item-class="cursor-pointer hover:bg-gray-200">
        <template #default="{ item }">
          <div class="px-4 flex items-center" style="padding-top: 6px; padding-bottom: 6px">
            <i class="iconfont justify-self-center text-xl mr-2" :class="`icon-${item.icon}`" />
            <span>{{ item.title }}</span>
          </div>
        </template>
      </List>
    </div>
  </div>
  <div v-else @click="() => store.commit('showLogin')" class="flex items-center justify-center w-9 h-9 mr-8 rounded-full cursor-pointer bg-gray-200 text-sm text-gray-600">
    登录
  </div>
  <Login v-if="isShowLogin" @close="() => store.commit('hideLogin')" />
</template>

<style scoped>
.user {
  @apply mr-8 relative h-full flex items-center justify-center;
}

.user img {
  @apply w-7 h-7 rounded-full cursor-pointer;
  transition: all 300ms;
}

.user .oprate-box {
  top: 100%;
  z-index: -1;
  box-shadow: 0px 0px 10px -6px #666;
  border-radius: 3px;
  width: 160px;
}

.user .oprate-box .oprate-list {
  width: 100%;
}

.show-ani {
  animation: show 300ms forwards;
}

@keyframes show {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
