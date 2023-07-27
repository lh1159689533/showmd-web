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
  <div class="column-list-box p-4">
    <div class="menu h-8 relative">
      <List
        :data-list="menuList" @click="handleMenuChange" class="column-list flex h-full mr-16 flex-1"
        item-class="h-full cursor-pointer flex items-center justify-center mr-6 relative text-sm"
      >
        <template #default="{ item }">
          <span :class="[item.key === activeKey ? 'menu-item__active' : '']" class="menu-item h-full00">{{ item.title
          }}</span>
        </template>
      </List>
      <span
        :style="{ transform: `translateX(${menuList.findIndex((item) => item.key === activeKey) * 80}px)` }"
        class="active-tag"
      ></span>
    </div>
    <div class="content-box py-6 pl-2">
      <MyColumn v-show="activeKey === 'myColumn'" />
      <SubColumn v-show="activeKey === 'subColumn'" />
    </div>
  </div>
</template>

<style>
.column-list-box .menu-item__active {
  color: var(--showmd-text-color-hover);
  @apply font-bold;
}

.column-list-box .active-tag {
  content: '';
  position: absolute;
  height: 2px;
  width: 30px;
  bottom: 0;
  left: 10px;
  transition: transform 200ms;
  background-color: var(--showmd-text-color-hover);
}

.column-list-box .column-list li {
  color: var(--showmd-text-color-primary);
}

.column-list-box .column-list li>span:hover {
  color: var(--showmd-text-color-hover);
}
</style>
