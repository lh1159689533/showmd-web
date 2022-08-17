<script lang="ts">
import { defineComponent, ref } from 'vue';

import { listCategory } from '@service/category';

export default defineComponent({
  name: 'Category',
  emits: ['change'],
  setup(_, { emit }) {
    const categoryAllList = ref([]); // 全部分类
    const categoryList = ref([]); // 分类
    const subCategoryList = ref([]); // 子分类
    const activeKey = ref(''); // 当前选择分类
    const hoverKey = ref(''); // 当前hover分类
    const subActiveKey = ref(''); // 当前选择子分类
    const isShowSubCategory = ref(false); // 是否显示子分类
    const hideSubCategoryTimer = ref(null);

    async function init() {
      categoryAllList.value = await listCategory();
      categoryList.value = categoryAllList.value
        .filter((c) => c.parent === '0')
        .map((item) => {
          return {
            ...item,
            children: [{ key: 'all', title: '全部', parent: item.key }].concat(...categoryAllList.value.filter(({ parent }) => parent === item.key)),
          };
        });
      activeKey.value = categoryList.value[0]?.key;
    }

    /**
     * 子分类随分类变化
     */
    const changSubCategoryList = (category) => {
      const subCategorys = category?.children;
      if (category.key !== 'all' && subCategorys?.length) {
        const activeSubCategory = subCategorys.find((c) => c.key === subActiveKey.value) ?? subCategorys[0];
        activeSubCategory.active = true;
        subCategorys.filter((c) => c.key !== activeSubCategory.key).forEach((c) => (c.active = false));
        subCategoryList.value = subCategorys;
      } else {
        subCategoryList.value = null;
      }
    };

    /**
     * 鼠标hover分类时显示子分类
     */
    const hoverCategory = (category) => {
      showSubCategory();
      if (hoverKey.value === category.key) return;
      hoverKey.value = category.key;
      changSubCategoryList(category);
    };

    /**
     * 分类改变
     */
    const handleChangeCategory = ({ key }) => {
      activeKey.value = key;
      const activeCategory = categoryList.value.find(c => c.key === key);
      subActiveKey.value = activeCategory.children?.[0]?.key ?? '';
      emit('change', activeKey.value, subActiveKey.value);
      changSubCategoryList(activeCategory);
    };

    /**
     * 子分类改变
     */
    const handleChangeSubCategory = ({ key, parent }) => {
      subActiveKey.value = key;
      activeKey.value = parent;
      emit('change', activeKey.value, subActiveKey.value);
      changSubCategoryList(categoryList.value.find(c => c.key === parent));
    };

    /**
     * 隐藏子分类
     */
    const hideSubCategory = () => {
      hideSubCategoryTimer.value = setTimeout(() => (isShowSubCategory.value = false), 0);
    };

    /**
     * 显示子分类
     */
    const showSubCategory = () => {
      isShowSubCategory.value = true;
    };

    /**
     * 取消隐藏子分类定时器
     */
    const cancleHideSubCategoryTimer = () => {
      if (hideSubCategoryTimer.value) {
        clearTimeout(hideSubCategoryTimer.value);
        hideSubCategoryTimer.value = null;
      }
    };

    init();

    return {
      categoryList,
      activeKey,
      subActiveKey,
      subCategoryList,
      isShowSubCategory,
      hideSubCategoryTimer,
      changSubCategoryList,
      hideSubCategory,
      showSubCategory,
      cancleHideSubCategoryTimer,
      handleChangeCategory,
      handleChangeSubCategory,
      hoverCategory,
    };
  },
});
</script>

<template>
  <div class='h-full z-1000 bg-white relative' @mouseleave='hideSubCategory' @mouseenter='cancleHideSubCategoryTimer'>
    <List :data-list='categoryList' class='category-list h-full flex items-center text-sm text-gray-800'>
      <template #default='{ item }'>
        <span
          @click='() => handleChangeCategory(item)'
          @mouseenter='() => hoverCategory(item)'
          :class='[item.key === activeKey ? "text-indigo-500" : ""]'
          class='pr-6 cursor-pointer hover:text-indigo-500'
        >{{ item.title }}</span>
      </template>
    </List>
  </div>
  <div
    v-show='isShowSubCategory && subCategoryList'
    @mouseenter='cancleHideSubCategoryTimer'
    @mouseleave='hideSubCategory'
    class='sub-category bg-white animate__animated animate__faster animate__fadeInDown z-900'
  >
    <List
      :data-list='subCategoryList'
      :class='$attrs["item-class"]'
      style='font-size: 0.85rem'
      class='sub-category-list flex flex-wrap bg-white items-center text-gray-800 py-2'
      item-class='mr-4'
    >
      <template #default='{ item }'>
        <span
          @click='() => handleChangeSubCategory(item)'
          :class='[item.active ? "bg-indigo-500 text-white hover:text-white" : "bg-gray-100"]'
          class='cursor-pointer hover:text-indigo-500 px-2 py-1 rounded-full inline-block'
        >{{ item.title }}</span>
      </template>
    </List>
  </div>
</template>

<style scoped>
.category-list,
.sub-category-list {
  max-width: 1380px;
  margin: 0 auto;
}
.sub-category {
  box-shadow: #666 0px 8px 8px -12px;
  background-color: white;
}
</style>