<script lang="ts" setup>
import { Baby, Plus } from 'lucide-vue-next';

interface Emits {
  (e: 'create'): void;
}

defineEmits<Emits>();
</script>

<template>
  <div class="empty-state">
    <div class="empty-icon">
      <Baby :size="64" />
    </div>
    <h3>还没有成长记录</h3>
    <p>点击上方按钮，开始记录宝宝的成长瞬间吧！</p>
    <button class="empty-add-btn" @click="$emit('create')">
      <Plus :size="18" />
      <span>添加第一条记录</span>
    </button>
  </div>
</template>

<style scoped>
/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 50%;
  color: #667eea;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--showmd-text-color-primary);
  margin: 0 0 8px;
}

.empty-state p {
  font-size: 14px;
  color: var(--showmd-text-color-weak);
  margin: 0 0 24px;
}

.empty-add-btn {
  display: inline-flex;
  align-items: center;
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
}

.empty-add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}
</style>