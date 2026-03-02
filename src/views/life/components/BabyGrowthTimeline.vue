<script lang="ts" setup>
import { Calendar, Image as ImageIcon, Video, Edit, Eye } from 'lucide-vue-next';
import { IBabyGrowth, getMediaUrl } from '@service/babyGrowth';
import Avatar from '@src/components/Avatar.vue';

interface Props {
  records: IBabyGrowth[];
}

interface Emits {
  (e: 'view', record: IBabyGrowth, event: MouseEvent): void;
  (e: 'edit', id: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 媒体类型常量
const MEDIA_TYPE = {
  IMAGE: 1,
  VIDEO: 2,
};

function handleView(record: IBabyGrowth, event: MouseEvent) {
  emit('view', record, event);
}

function handleEdit(event: MouseEvent, id: number) {
  event.stopPropagation();
  emit('edit', id);
}
</script>

<template>
  <div class="timeline-layout">
    <div class="timeline">
      <div 
        v-for="record in records" 
        :key="record.id" 
        class="timeline-item" 
        @click="handleView(record, $event)"
      >
        <!-- 时间线节点 -->
        <div class="timeline-node">
          <div class="node-dot">
            <ImageIcon v-if="record.mediaType === MEDIA_TYPE.IMAGE" :size="12" />
            <Video v-else :size="12" />
          </div>
        </div>

        <!-- 时间标签 -->
        <div class="timeline-time">
          <Calendar :size="14" />
          <span class="time-text">{{ record.formattedTime }}</span>
          <span class="time-ago">{{ record.fromNow }}</span>
        </div>

        <!-- 时间线卡片 -->
        <div class="timeline-card">
          <!-- 媒体预览 -->
          <div class="card-media">
            <img 
              v-if="record.mediaType === MEDIA_TYPE.IMAGE" 
              :src="getMediaUrl(record.id!)" 
              :alt="record.title"
              class="media-image" 
              loading="lazy" 
            />
            <video 
              v-else 
              :src="getMediaUrl(record.id!)" 
              class="media-video" 
              preload="metadata" 
            />
            <div class="media-overlay">
              <Eye :size="20" />
            </div>
            <!-- 多图片提示 -->
            <div 
              v-if="record.mediaType === MEDIA_TYPE.IMAGE && (record.mediaUrls?.length || 0) > 1"
              class="multi-image-badge timeline-multi-badge"
            >
              <ImageIcon :size="10" />
              <span>{{ record.mediaUrls?.length || 3 }}</span>
            </div>
          </div>

          <!-- 卡片内容 -->
          <div class="card-content">
            <h3 class="card-title">{{ record.title }}</h3>
            <p class="card-description" v-if="record.description">
              {{ record.description }}
            </p>
            <div class="card-meta">
              <div class="author-info">
                <div class="author-avatar">
                  <Avatar 
                    :src="record?.user?.avatar" 
                    :name="record?.user?.name" 
                    size="small"
                    class="user-avatar avatar-active" 
                  />
                </div>
                <h4 class="author-name">
                  {{ record?.user?.name }}
                </h4>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="card-actions">
            <button class="action-btn edit-btn" @click="handleEdit($event, record.id!)" title="编辑">
              <Edit :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 时间线布局 */
.timeline-layout {
  max-width: 900px;
  margin: 0 auto;
}

.timeline {
  position: relative;
  padding-left: 32px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #667eea, #764ba2, #f093fb);
  border-radius: 1px;
}

.timeline-item {
  position: relative;
  margin-bottom: 32px;
  cursor: pointer;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

/* 时间线节点 */
.timeline-node {
  position: absolute;
  left: -32px;
  top: 24px;
  z-index: 2;
}

.node-dot {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.timeline-item:hover .node-dot {
  transform: scale(1.2);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* 时间标签 */
.timeline-time {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 13px;
  color: var(--showmd-text-color-weak);
}

.time-text {
  font-weight: 500;
  color: var(--showmd-text-color-secondary);
}

.time-ago {
  padding: 2px 8px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  font-size: 12px;
  color: #667eea;
}

/* 时间线卡片 */
.timeline-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.timeline-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.timeline-card .card-media {
  position: relative;
  width: 160px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.timeline-card .media-image,
.timeline-card .media-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.timeline-card .media-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  opacity: 0;
  transition: all 0.3s ease;
}

.timeline-card:hover .media-overlay {
  opacity: 1;
}

.timeline-multi-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  color: white;
  font-size: 11px;
  font-weight: 600;
}

.timeline-card .card-content {
  flex: 1;
  min-width: 0;
}

.timeline-card .card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--showmd-text-color-primary);
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timeline-card .card-description {
  font-size: 14px;
  color: var(--showmd-text-color-secondary);
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.6;
}

.timeline-card .card-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--glass-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.author-avatar:hover {
  border-color: rgba(102, 126, 234, 0.3);
  transform: scale(1.05);
}

.author-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--showmd-text-color-secondary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.timeline-card .card-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transition: all 0.3s ease;
}

.timeline-card:hover .card-actions {
  opacity: 1;
}

.timeline-card .action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.timeline-card .edit-btn {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.timeline-card .edit-btn:hover {
  background: #667eea;
  color: white;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .timeline-card {
    flex-direction: column;
    gap: 12px;
  }

  .timeline-card .card-media {
    width: 100%;
    height: 200px;
  }

  .timeline-card .card-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>