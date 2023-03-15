<!-- 管理专栏文章 -->
<script lang="ts" setup>
import { ref, defineProps, defineEmits, watchEffect, computed } from 'vue';
import Draggable from 'vuedraggable';
import message from '@utils/message';
import { confirm } from '@utils/messageBox';
import { findArticleList, removeArticle, sortArticle } from '@service/column';
import AddArticle from './AddArticle.vue';
import MoveArticle from './MoveArticle.vue';

interface IColumn {
  id: number;
  name: string;
  articles: any[];
}

const props = defineProps<{
  visible: boolean;
  id?: number;
}>();
const emit = defineEmits<{ (e: 'close'): void; (e: 'callback'): void }>();

const column = ref<IColumn>({ id: 0, name: '', articles: [] });
// 添加文章dialog
const showDialog = ref(false);
// 移动文章至其他专栏dialog
const showMoveDialog = ref(false);

const drag = ref(false);

const dragOptions = {
  animation: 200,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost',
};

// 选择的文章列表
const selectionArticles = computed(() => column.value?.articles.filter((item) => item.isSel));

watchEffect(async () => {
  if (props.id && props.visible) {
    column.value = await findArticleList(props.id);
  }
});

const refresh = async () => {
  column.value = await findArticleList(props.id);
  emit('callback'); // 刷新专栏列表
};

const selectionChange = (articleId, isSel) => {
  const { articles = [] } = column.value;
  const current = articles.find((item) => item.id === articleId);
  if (current) {
    current.isSel = isSel;
  }
};

const toggleAllSelection = () => {
  const { articles = [] } = column.value;
  if (selectionArticles.value.length === articles?.length) {
    column.value = {
      ...column.value,
      articles: articles.map((item) => ({ ...item, isSel: false })),
    };
  } else {
    column.value = {
      ...column.value,
      articles: articles.map((item) => ({ ...item, isSel: true })),
    };
  }
};

const addSuccess = async () => {
  showDialog.value = false;
  showMoveDialog.value = false;
  refresh();
};

const remove = (articles) => {
  confirm('确定将该文章从此专栏取消收录吗？取消收录后将无法在此专栏访问相关文章。', {
    async callback(action) {
      if (action === 'confirm') {
        const isSucc = await removeArticle(
          props.id,
          articles.map((c) => c.id)
        );
        if (isSucc) {
          message.success('取消收录成功');
          refresh();
        } else {
          message.error('取消收录失败');
        }
      }
    },
  });
};

const showArticleList = async () => {
  showDialog.value = true;
};

const onBeforeClose = () => {
  emit('close');
};

const onSortEnd = () => {
  drag.value = false;
  const sortIds = column.value.articles.map((item) => item.id);
  sortIds.length && sortArticle(column.value.id, sortIds);
};
</script>

<template>
  <el-drawer :model-value="visible" :title="column?.name" direction="rtl" :close-on-click-modal="false" :before-close="onBeforeClose" destroy-on-close :size="600">
    <div class="flex items-center justify-between pl-3 mb-2">
      <el-checkbox
        @change="toggleAllSelection"
        :indeterminate="selectionArticles.length > 0 && selectionArticles.length < column?.articles?.length"
        :model-value="selectionArticles.length > 0 && selectionArticles.length === column?.articles?.length"
      />
      <span class="text-sm mx-2 flex-1">全选</span>
      <div>
        <el-button type="primary" @click="showArticleList">添加文章</el-button>
        <el-button @click="() => (showMoveDialog = true)" :disabled="selectionArticles?.length === 0">移动文章</el-button>
        <el-button @click="() => remove(selectionArticles)" :disabled="selectionArticles?.length === 0">取消收录</el-button>
      </div>
    </div>
    <Draggable
      v-if="column?.articles?.length"
      v-model="column.articles"
      item-key="id"
      :component-data="{
        type: 'transition-group',
        name: !drag ? 'flip-list' : null,
      }"
      @start="drag = true"
      @end="onSortEnd"
      v-bind="dragOptions"
    >
      <template #item="{ element: article }">
        <div class="article-list-item flex gap-8 items-center cursor-move text-sm text-gray-800 px-3 py-2 border-b hover:bg-gray-50">
          <el-checkbox :model-value="article?.isSel" @change="(isSel) => selectionChange(article?.id, isSel)" />
          <div class="title text-sm text-gray-500 flex-1">
            {{ article.name }}
          </div>
          <el-button link size="small" type="danger" @click="() => remove([article])">移除</el-button>
        </div>
      </template>
    </Draggable>
    <div v-else class="text-sm text-gray-500 text-center pt-4">暂无收录文章</div>
  </el-drawer>
  <AddArticle v-if="showDialog" :id="id" @close="showDialog = false" @callback="addSuccess" />
  <MoveArticle v-if="showMoveDialog" :column-id="id" :article-ids="selectionArticles.map((item) => item.id)" @close="showMoveDialog = false" @callback="addSuccess" />
</template>

<style>
.flip-list-move {
  transition: transform 0.5s;
}

.ghost {
  opacity: 0.5;
  @apply bg-indigo-100;
}
</style>
