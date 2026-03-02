<script lang="ts" setup>
import { ref } from 'vue';

interface Props {
  recordCount: number;
  loading?: boolean;
}

interface Emits {
  (e: 'search', keyword: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const searchKeyword = ref('');

function handleSearch() {
  emit('search', searchKeyword.value);
}

function handleKeyup(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleSearch();
  }
}
</script>

<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <input 
        v-model="searchKeyword" 
        type="text" 
        placeholder="搜索标题或描述..." 
        class="search-input"
        @keyup="handleKeyup"
      />
      <button class="search-btn" @click="handleSearch">搜索</button>
    </div>
    <div class="record-count">
      <span class="count-number">{{ recordCount }}</span>
      <span class="count-label">条记录</span>
    </div>
  </div>
</template>

<style scoped>
/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 16px 20px;
  background: var(--glass-bg);
  border-radius: 8px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  max-width: 400px;
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  background: var(--showmd-bg-color-secondary);
  border-radius: 8px;
  font-size: 14px;
  color: var(--showmd-text-color-primary);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: translateY(-1px);
}

.record-count {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.count-number {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.count-label {
  font-size: 14px;
  color: var(--showmd-text-color-weak);
}

/* 暗色主题 */
.dark .search-bar {
  background: rgba(24, 24, 27, 0.9);
}

.dark .search-input {
  background: rgba(0, 0, 0, 0.3);
}
</style>