<script lang="ts" setup>
import { ref, computed, watch, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import Edit from './Edit.vue';
import ManageArticle from './ManageArticle.vue';
import { findListByUserId, topColumn, deleteById } from '@service/column';
import message from '@src/utils/message';
import { confirm } from '@utils/messageBox';

const store = useStore();
const user = computed(() => store.getters.getUser);

const router = useRouter();
const route = useRoute();

const oprateList = [
  {
    key: 'manage',
    title: '管理',
    handle(item) {
      currentColumn.value = item.id;
      showEditArticleDrawer.value = true;
    },
  },
  {
    key: 'edit',
    title: '修改',
    handle(item) {
      currentColumn.value = item.id;
      handleShowEdit();
    },
  },
  {
    key: 'top',
    title: (column) => (column.isTop === 1 ? '取消置顶' : '置顶'),
    handle(item) {
      top(item.id, item.isTop ? 0 : 1);
    },
  },
  {
    key: 'del',
    title: '删除',
    handle(item) {
      confirm('确定要删除专栏吗？', {
        callback(action) {
          if (action === 'confirm') {
            del(item.id);
          }
        },
      });
    },
  },
];
const searchKeyword = ref('');
// 编辑专栏信息抽屉
const showEditDrawer = ref(false);
// 编辑专栏下文章抽屉
const showEditArticleDrawer = ref(false);
const currentColumn = ref();
const columnList = ref();

/**
 * 查询栏目列表
 * @param searchKeyword 关键词，用于搜索
 */
const findColumnList = (searchKeyword = '') => {
  if (!user.value?.id) return;
  findListByUserId(user.value?.id, searchKeyword)
    .then((data) => {
      columnList.value = data ?? [];
    })
    .catch((e) => {
      console.log('查询出错:', e);
    });
};

/**
 * 搜索栏目
 */
const handleSearch = async () => {
  findColumnList(searchKeyword.value);
};

/**
 * 清空搜索条件时触发
 */
const handlClear = async () => {
  findColumnList('');
};

/**
 * 显示编辑
 */
const handleShowEdit = () => {
  showEditDrawer.value = true;
};

/**
 * 新建/更新成功的回调
 */
const handleSuccess = () => {
  handleClose();
  findColumnList();
};

/**
 * 编辑关闭的回调
 */
const handleClose = () => {
  currentColumn.value = null;
  showEditDrawer.value = false;
  showEditArticleDrawer.value = false;
};

/**
 * 置顶专栏
 * @param id 专栏id
 * @param action 1 置顶, 0 取消置顶
 */
const top = async (id: number, action: 0 | 1) => {
  const actionDesc = action === 1 ? '置顶' : '取消置顶';
  if (await topColumn(id, action)) {
    message.success(`${actionDesc}成功`);
    findColumnList();
  } else {
    message.error(`${actionDesc}失败`);
  }
};

// 删除专栏
const del = async (id: number) => {
  if (await deleteById(id)) {
    message.success('删除成功');
    findColumnList();
  } else {
    message.error('删除失败');
  }
};

// 专栏详情
const toDetail = (id) => {
  const { href } = router.resolve(`/column/${id}`);
  window.open(href, '_blank');
};

watch(user, () => {
  findColumnList();
});

watchEffect(() => {
  // 其他地方跳转且需要打开操作抽屉
  if (route.query?.columnId) {
    const { columnId, action } = route.query;
    const oprate = oprateList.find((item) => item.key === action);
    oprate?.handle?.({ id: columnId });
  }
});

findColumnList();
</script>

<template>
  <div class="my-column-list">
    <div class="header flex justify-between mb-8">
      <div class="oprate">
        <el-button @click="handleShowEdit" type="primary">新建</el-button>
      </div>
      <div class="search flex gap-8 w-1/3">
        <el-input v-model="searchKeyword" @clear="handlClear" placeholder="请输入关键词" clearable />
        <el-button @click="handleSearch">搜索</el-button>
      </div>
    </div>
    <el-skeleton v-if="!columnList" :rows="3" animated class="p-6" />
    <List v-else-if="columnList?.length" :data-list="columnList">
      <template #default="{ item: column }">
        <div class="flex gap-8 border-t px-6 py-4 hover:bg-gray-50">
          <img
            :src="`${column.cover}?t=${new Date(column.updateTime).getTime()}`"
            class="w-36 h-24 cursor-pointer"
            @error="(e) => (e.target as HTMLImageElement).src = '/img/column-default-cover.webp'"
            @click="() => toDetail(column?.id)"
          />
          <div class="detail flex-1 flex flex-col gap-2">
            <div class="title flex items-center gap-2">
              <span class="attrs text-indigo-500 text-sm bg-indigo-100 px-1" style="border-radius: 1px">{{ column.isPrivate ? '私有' : '公开' }}</span>
              <span v-if="column.isTop === 1" class="text-indigo-500 text-sm bg-indigo-100 flex items-center px-1" style="border-radius: 1px">
                <i class="iconfont icon-top"></i>置顶
              </span>
              <span @click="() => toDetail(column?.id)" class="text-xl cursor-pointer hover:text-indigo-600 flex-1">{{ column.name }}</span>
            </div>
            <span class="desc text-gray-600 text-sm">{{ column.desc }}</span>
            <div class="footer flex text-sm">
              <div class="flex text-gray-500 delimiter flex-1">
                <span class="create-time">{{ column.createTime }}</span>
                <span class="article-num">文章数 {{ column.articleCnt }}</span>
                <span class="article-num">订阅数 {{ column.subscribeCnt }}</span>
              </div>
              <List :data-list="oprateList" class="oprate flex gap-4 text-gray-600" item-class="hover:text-indigo-500 cursor-pointer" @click="(oprate) => oprate.handle?.(column)">
                <template #default="{ item }">
                  <span :class="[item.key === 'del' ? 'hover:text-red-500' : 'hover:text-indigo-500']">
                    {{ typeof item.title === 'function' ? item.title(column) : item.title }}
                  </span>
                </template>
              </List>
            </div>
          </div>
        </div>
      </template>
    </List>
    <Empty v-else class="border-t">
      <div v-if="searchKeyword">暂无搜索结果</div>
      <div v-else>还没有专栏，<span @click="handleShowEdit" class="ml-2 text-indigo-500 cursor-pointer hover:underline">新建一个专栏吧</span></div>
    </Empty>
    <Edit :visible="showEditDrawer" :id="currentColumn" @close="handleClose" @confirm="handleSuccess" />
    <ManageArticle :visible="showEditArticleDrawer" :id="currentColumn" @close="handleClose" @callback="findColumnList" />
  </div>
</template>

<style scoped></style>
