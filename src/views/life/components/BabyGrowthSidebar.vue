<script lang="ts" setup>
import { Baby, Grid, List as ListIcon, Plus } from 'lucide-vue-next';

interface Props {
  viewMode: 'grid' | 'timeline';
}

interface Emits {
  (e: 'toggle-view'): void;
  (e: 'create-record'): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
  <div class="sidebar">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <div class="title-icon">
            <Baby :size="32" />
          </div>
          <div class="title-text">
            <h1>宝宝成长记录</h1>
            <p class="subtitle">记录每一个珍贵的成长瞬间</p>
          </div>
        </div>
        <div class="header-actions">
          <button 
            class="view-toggle-btn" 
            @click="$emit('toggle-view')" 
            :title="viewMode === 'grid' ? '切换到时间线' : '切换到网格'"
          >
            <Grid v-if="viewMode === 'timeline'" :size="18" />
            <ListIcon v-else :size="18" />
          </button>
          <button class="add-btn" @click="$emit('create-record')">
            <Plus :size="20" />
            <span>添加记录</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 左侧边栏 */
.sidebar {
  width: 320px;
  flex-shrink: 0;
}

/* 页面头部 */
.page-header {
  margin-bottom: 24px;
  position: fixed;
  width: 320px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 8px;
}

.title-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.title-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 8px;
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.title-text h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--showmd-text-color-primary);
  margin: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 14px;
  color: var(--showmd-text-color-weak);
  margin: 4px 0 0;
}

.header-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.view-toggle-btn {
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--glass-bg);
  border-radius: 8px;
  color: var(--showmd-text-color-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-toggle-btn:hover {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  transform: translateY(-2px);
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  width: 100%;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

/* 暗色主题适配 */
.dark .header-content {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
}

.dark .view-toggle-btn {
  background: rgba(24, 24, 27, 0.8);
}
</style>