<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Edit from './Edit.vue';
import ManageArticle from './ManageArticle.vue';
import { findListByUserId, topColumn, deleteById } from '@service/column';
import message from '@src/utils/message';
import { confirm } from '@utils/messageBox';

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
  // if (!user.value?.id) return;
  findListByUserId(searchKeyword)
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
  const [err, res] = await deleteById(id);
  if (!err && res.code === 0) {
    message.success('删除成功');
    findColumnList();
  } else {
    message.error(err?.message || res.message || '删除失败');
  }
};

// 专栏详情
const toDetail = (id) => {
  const { href } = router.resolve(`/column/${id}`);
  window.open(href, '_blank');
};

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
        <div class="my-column-item flex gap-8 px-6 py-4 border-t">
          <img
            :src="`${column.cover}?t=${new Date(column.updateTime).getTime()}`" class="w-36 h-24 cursor-pointer"
            @error="(e) => (e.target as HTMLImageElement).src = '/img/column-default-cover.webp'"
            @click="() => toDetail(column?.id)"
          />
          <div class="detail flex-1 flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <span class="attrs text-sm px-1">{{ column.isPrivate ? '私有' : '公开' }}</span>
              <span v-if="column.isTop === 1" class="attrs flex items-center px-1 text-sm">
                <i class="iconfont icon-top"></i>置顶
              </span>
              <span
                @click="() => toDetail(column?.id)"
                class="title text-xl cursor-pointer flex-1"
              >
                {{ column.name }}</span>
            </div>
            <span class="desc text-sm">{{ column.desc }}</span>
            <div class="footer flex text-sm">
              <div class="cnt flex delimiter flex-1">
                <span class="create-time">{{ column.createTime }}</span>
                <span class="article-num">文章数 {{ column.articleCnt }}</span>
                <span class="article-num">订阅数 {{ column.subscribeCnt }}</span>
              </div>
              <List
                :data-list="oprateList" class="oprate flex gap-4"
                item-class="cursor-pointer" @click="(oprate) => oprate.handle?.(column)"
              >
                <template #default="{ item }">
                  <span :class="[item.key === 'del' ? 'del' : '']">
                    {{ typeof item.title === 'function' ? item.title(column) : item.title }}
                  </span>
                </template>
              </List>
            </div>
          </div>
        </div>
      </template>
    </List>
    <Empty v-else class="border-t my-column-empty">
      <div v-if="searchKeyword">暂无搜索结果</div>
      <div v-else>
        还没有专栏，<span @click="handleShowEdit" class="add-column ml-2 cursor-pointer hover:underline">新建一个专栏吧</span>
      </div>
    </Empty>
    <Edit :visible="showEditDrawer" :id="currentColumn" @close="handleClose" @confirm="handleSuccess" />
    <ManageArticle :visible="showEditArticleDrawer" :id="currentColumn" @close="handleClose" @callback="findColumnList" />
  </div>
</template>

<style>
.my-column-list .my-column-item {
  background-color: var(--showmd-bg-color-primary);
  border-color: var(--showmd-border-color);
}

.my-column-list .my-column-item:hover {
  background-color: var(--showmd-bg-color-hover);
}

.my-column-list .my-column-item .detail span.attrs {
  border-radius: 1px;
  background-color: var(--showmd-bg-color-weak);
  color: var(--showmd-text-color-hover);
}

.my-column-list .my-column-item .title {
  color: var(--showmd-text-color-primary);
}

.my-column-list .my-column-item .title:hover {
  color: var(--showmd-text-color-hover);
}

.my-column-list .my-column-item :is(.desc, .cnt, .oprate) {
  color: var(--showmd-text-color-weak);
}

.my-column-list .my-column-item .oprate > li > span:hover {
  color: var(--showmd-text-color-hover);
}

.my-column-list .my-column-item .oprate > li > span.del:hover {
  color: var(--showmd-text-color-danger);
}

.my-column-list .my-column-empty {
  color: var(--showmd-text-color-primary);
}

.my-column-list .my-column-empty .add-column {
  color: var(--showmd-text-color-hover);
}
</style>
