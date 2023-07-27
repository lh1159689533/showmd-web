<script lang="ts" setup>
import { defineEmits, ref } from 'vue';
import { useStore } from 'vuex';

interface IEmits {
  (e: 'change', activeCategory?: string, activeSubCategory?: string ): void;
}

const emit = defineEmits<IEmits>();

const store = useStore();

const categoryAllList = ref([]); // 全部分类
const categoryList = ref([]); // 分类
const subCategoryList = ref([]); // 子分类
const activeCategory = ref(null); // 当前选择分类
const hoverKey = ref(''); // 当前hover分类
const activeSubCategory = ref(null); // 当前选择子分类
const isShowSubCategory = ref(false); // 是否显示子分类
const hideSubCategoryTimer = ref(null);

async function init() {
  // categoryAllList.value = await listCategory();
  categoryAllList.value = await store.dispatch('listCategory');
  categoryList.value = categoryAllList.value
    .filter((c) => c.parent === '0')
    .map((item) => {
      return {
        ...item,
        children: [{ key: 'all', title: '全部', parent: item.key }].concat(...categoryAllList.value.filter(({ parent }) => parent === item.key)),
      };
    });
  activeCategory.value = categoryList.value[0];
}

/**
 * 子分类随分类变化
 */
const changSubCategoryList = (category) => {
  const subCategorys = category?.children;
  if (category.key !== 'all' && subCategorys?.length) {
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
const handleChangeCategory = (category) => {
  activeCategory.value = category;
  activeSubCategory.value = activeCategory.value.children?.[0] ?? null;
  emit('change', activeCategory.value, activeSubCategory.value);
  changSubCategoryList(activeCategory.value);
};

/**
 * 子分类改变
 */
const handleChangeSubCategory = (subCategory) => {
  activeSubCategory.value = subCategory;
  activeCategory.value = categoryList.value.find((c) => c.key === subCategory.parent);
  emit('change', activeCategory.value, activeSubCategory.value);
  changSubCategoryList(activeCategory.value);
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
</script>

<template>
  <div class="h-full z-1000 relative" @mouseleave="hideSubCategory" @mouseenter="cancleHideSubCategoryTimer">
    <List :data-list="categoryList" class="category-list container h-full flex items-center text-sm">
      <template #default="{ item }">
        <span
          @click="() => handleChangeCategory(item)" @mouseenter="() => hoverCategory(item)"
          :class="[item.key === activeCategory.key ? 'text-indigo-500' : '']"
          class="pr-6 cursor-pointer hover:text-indigo-500"
        >
          {{ item.title }}
        </span>
      </template>
    </List>
  </div>
  <div
    v-show="isShowSubCategory && subCategoryList" @mouseenter="cancleHideSubCategoryTimer"
    @mouseleave="hideSubCategory"
    class="sub-category animate__animated animate__faster animate__fadeInDown z-900"
  >
    <List
      :data-list="subCategoryList" :class="$attrs['item-class']" style="font-size: 0.85rem"
      class="sub-category-list container flex flex-wrap items-center py-2" item-class="mr-4"
    >
      <template #default="{ item }">
        <span
          @click="() => handleChangeSubCategory(item)" :class="[
            item.key === activeSubCategory?.key && item.parent === activeSubCategory?.parent ? 'bg-indigo-500 text-white hover:text-white' : 'unactive-item hover:text-indigo-500',
          ]" class="cursor-pointer px-2 py-1 rounded-full inline-block"
        >
          {{ item.title }}
        </span>
      </template>
    </List>
  </div>
</template>

<style scoped>
.category-list {
  color: var(--showmd-text-color-primary);
}

.sub-category {
  box-shadow: #666 0px 8px 8px -12px;
  background-color: var(--showmd-bg-color-primary);
}

.sub-category-list {
  background-color: var(--showmd-bg-color-primary);
  color: var(--showmd-text-color-primary);
}

.unactive-item {
  background-color: var(--showmd-bg-color-weak);
}
</style>
