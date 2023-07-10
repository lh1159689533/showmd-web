<script lang="ts" setup>
import { ref } from 'vue';
import MyColumn from './MyColumn.vue';
import SubColumn from './SubColumn.vue';

const menuList = [
  {
    key: 'myColumn',
    title: '我的专栏',
  },
  {
    key: 'subColumn',
    title: '订阅专栏',
  },
];
const activeKey = ref(menuList[0].key);

const handleMenuChange = ({ key }) => {
  activeKey.value = key;
};
</script>

<template>
  <div class="column p-4">
    <div class="menu h-8 relative">
      <List
        :data-list="menuList"
        @click="handleMenuChange"
        class="flex h-full text-black mr-16 flex-1"
        item-class="h-full cursor-pointer flex items-center justify-center mr-6 relative text-sm text-gray-800"
      >
        <template #default="{ item }">
          <span :class="[item.key === activeKey ? 'menu-item__active' : '']" class="menu-item h-full hover:text-indigo-500">{{ item.title }}</span>
        </template>
      </List>
      <span :style="{ transform: `translateX(${menuList.findIndex((item) => item.key === activeKey) * 80}px)` }" class="active-tag"></span>
    </div>
    <div class="content-box py-6 pl-2">
      <MyColumn v-show="activeKey === 'myColumn'" />
      <SubColumn v-show="activeKey === 'subColumn'" />
    </div>
  </div>
</template>

<style scoped>
.menu-item__active {
  @apply text-indigo-500 font-bold;
}

.active-tag {
  content: '';
  position: absolute;
  height: 2px;
  width: 30px;
  bottom: 0;
  left: 10px;
  transition: transform 200ms;
  @apply bg-indigo-500;
}
</style>
