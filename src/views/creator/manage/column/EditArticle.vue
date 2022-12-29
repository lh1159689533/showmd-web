<!-- 管理专栏文章 -->
<script lang="ts" setup>
import { ref, defineProps, defineEmits, watchEffect } from 'vue';
import message from '@utils/message';
import { confirm } from '@utils/messageBox';
import { findArticleList, removeArticle } from '@service/column';
import AddArticle from './AddArticle.vue';
import MoveArticle from './MoveArticle.vue';

interface IColumn {
  id: number;
  name: string;
  articles: any[];
}

const props = defineProps<{
  visible: boolean
  id?: number
}>();
const emit = defineEmits<{ (e: 'close'): void, (e: 'callback'): void }>();

const tableRef = ref();
const column = ref<IColumn>();
const selectionArticle = ref([]);
// 添加文章dialog
const showDialog = ref(false);
// 移动文章至其他专栏dialog
const showMoveDialog = ref(false);

watchEffect(async () => {
  if (props.id && props.visible) {
    column.value = await findArticleList(props.id);
  }
});

const refresh = async () => {
  column.value = await findArticleList(props.id);
  emit('callback'); // 刷新专栏列表
};

const selectionChange = (selection) => {
  selectionArticle.value = selection;
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
        const isSucc = await removeArticle(props.id, articles.map(c => c.id));
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
  selectionArticle.value = null;
};
</script>

<template>
  <el-drawer
    :model-value='visible' :title='column?.name' direction='rtl' :close-on-click-modal='false'
    :before-close='onBeforeClose' destroy-on-close :size='600'
  >
    <div style='display: flex; align-items: center; padding-left: 14px; margin-bottom: 10px;'>
      <el-checkbox
        @change='tableRef?.toggleAllSelection?.()'
        :indeterminate='selectionArticle?.length > 0 && selectionArticle?.length < column?.articles?.length'
        :model-value='selectionArticle?.length === column?.articles?.length'
      />
      <span style='font-size: 14px; margin: 0 10px; flex: 1'>全选</span>
      <div>
        <el-button type='primary' @click='showArticleList'>添加文章</el-button>
        <el-button @click='() => showMoveDialog = true' :disabled='selectionArticle?.length === 0'>移动文章</el-button>
        <el-button @click='() => remove(selectionArticle)' :disabled='selectionArticle?.length === 0'>取消收录</el-button>
      </div>
    </div>
    <el-table
      ref='tableRef' :data='column?.articles' style='width: 100%' @selection-change='selectionChange'
      :show-header='false' empty-text='暂无收录文章'
    >
      <el-table-column type='selection' width='55' />
      <el-table-column property='name' />
      <el-table-column property='updateTime' />
      <el-table-column width='120'>
        <template #default='{ row }'>
          <el-button link size='small' type='danger' @click='() => remove([row])'>移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
  <AddArticle v-if='showDialog' :id='id' @close='showDialog = false' @callback='addSuccess' />
  <MoveArticle
    v-if='showMoveDialog' :id='id' :article-ids='selectionArticle.map(item => item.id)'
    @close='showMoveDialog = false' @callback='addSuccess'
  />
</template>

<style>

</style>