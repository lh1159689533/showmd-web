<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

import { findList, IBabyGrowth } from '@service/babyGrowth';
import { formatDate } from '@src/utils/type';
import { parse } from '@src/components/Comment/utils';

// 导入子组件
import BabyGrowthSidebar from './components/BabyGrowthSidebar.vue';
import BabyGrowthSearchBar from './components/BabyGrowthSearchBar.vue';
import BabyGrowthCard from './components/BabyGrowthCard.vue';
import BabyGrowthTimeline from './components/BabyGrowthTimeline.vue';
import BabyGrowthModal from './components/BabyGrowthModal.vue';
import BabyGrowthEmpty from './components/BabyGrowthEmpty.vue';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const router = useRouter();
const records = ref<IBabyGrowth[]>([]);
const loading = ref(false);
const viewMode = ref<'grid' | 'timeline'>('grid'); // 视图模式：网格流式布局 | 时间线

// 弹窗相关
const showModal = ref(false);
const currentRecord = ref<IBabyGrowth | null>(null);
const cardRect = ref({
  width: 0,
  height: 0,
  top: 0,
  left: 0
});
const finalRect = ref({
  width: 1200, // 增加宽度以适应左右布局
  height: 700,
  top: 0,
  left: 0
});

// 获取记录列表
async function fetchRecords(keyword?: string) {
  loading.value = true;
  const result = await findList(keyword);
  if (result) {
    records.value = result.map((item) => ({
      ...item,
      fromNow: dayjs(item.eventTime).fromNow(),
      formattedTime: formatDate(item.eventTime),
      description: parse(item.description)
    }));
  }
  loading.value = false;
}

// 跳转到新建页面
function goToCreate() {
  router.push('/life/baby-growth/new');
}

// 跳转到详情/编辑页面
function goToDetail(id: number) {
  router.push(`/life/baby-growth/${id}`);
}

// 切换视图模式
function toggleViewMode() {
  viewMode.value = viewMode.value === 'grid' ? 'timeline' : 'grid';
}

// 搜索处理
function handleSearch(keyword: string) {
  fetchRecords(keyword);
}

// 弹窗查看记录
async function viewRecord(record: IBabyGrowth, event?: MouseEvent) {
  if (event) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    // 记录卡片的位置和尺寸
    cardRect.value = {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left
    };

    // 计算弹窗最终位置（居中）
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = viewportWidth <= 768;

    let modalWidth: number, modalHeight: number;

    if (isMobile) {
      // 移动端：几乎全屏，留少量边距
      modalWidth = viewportWidth - 32;
      modalHeight = viewportHeight - 80;
    } else {
      // 桌面端：更大的弹窗以适应左右布局
      modalWidth = Math.min(1200, viewportWidth - 80);
      modalHeight = Math.min(700, viewportHeight - 80);
    }

    finalRect.value = {
      width: modalWidth,
      height: modalHeight,
      top: (viewportHeight - modalHeight) / 2,
      left: (viewportWidth - modalWidth) / 2
    };
  }

  currentRecord.value = record;
  showModal.value = true;
}

// 关闭弹窗
function closeModal() {
  showModal.value = false;
  currentRecord.value = null;
}

onMounted(() => {
  fetchRecords();
});
</script>

<template>
  <div class="baby-growth-page">
    <!-- 左侧边栏 -->
    <BabyGrowthSidebar :view-mode="viewMode" @toggle-view="toggleViewMode" @create-record="goToCreate" />

    <!-- 右侧主内容区 -->
    <div class="main-content">
      <!-- 搜索栏 -->
      <BabyGrowthSearchBar :record-count="records.length" :loading="loading" @search="handleSearch" />

      <!-- 内容区域 -->
      <div class="content-container" v-loading="loading">
        <!-- 空状态 -->
        <BabyGrowthEmpty v-if="!loading && records.length === 0" @create="goToCreate" />

        <!-- 记录列表 -->
        <div v-else-if="viewMode === 'grid'" class="grid-layout">
          <BabyGrowthCard v-for="record in records" :key="record.id" :record="record" @view="viewRecord"
            @edit="goToDetail" />
        </div>

        <!-- 时间线布局 -->
        <BabyGrowthTimeline v-else :records="records" @view="viewRecord" @edit="goToDetail" />
      </div>
    </div>
  </div>

  <!-- 弹窗查看 -->
  <BabyGrowthModal :show="showModal" :record="currentRecord" :card-rect="cardRect" :final-rect="finalRect"
    @close="closeModal" />
</template>

<style scoped>
/* 页面容器 */
.baby-growth-page {
  display: flex;
  min-height: 100vh;
  gap: 24px;
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
}

/* 右侧主内容区 */
.main-content {
  flex: 1;
  min-width: 0;
}

/* 网格流式布局 */
.grid-layout {
  columns: 4;
  column-gap: 20px;
  column-fill: balance;
}

@media (max-width: 1300px) {
  .grid-layout {
    columns: 3;
  }
}

@media (max-width: 900px) {
  .baby-growth-page {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .grid-layout {
    columns: 2;
  }
}

@media (max-width: 600px) {
  .grid-layout {
    columns: 1;
  }
}
</style>
