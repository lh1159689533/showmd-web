<script lang="ts" setup>
import { Image as ImageIcon, Video, Edit, Eye } from 'lucide-vue-next';
import { IBabyGrowth, getMediaUrl } from '@service/babyGrowth';
import Avatar from '@src/components/Avatar.vue';

interface Props {
  record: IBabyGrowth;
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

function handleView(event: MouseEvent) {
  emit('view', props.record, event);
}

function handleEdit(event: MouseEvent) {
  event.stopPropagation();
  emit('edit', props.record.id!);
}
</script>

<template>
  <div class="grid-card" @click="handleView">
    <!-- 媒体预览 -->
    <div class="card-media">
      <img v-if="record.mediaType === MEDIA_TYPE.IMAGE" :src="getMediaUrl(record.id!)" :alt="record.title"
        class="media-image" loading="lazy" />
      <video v-else :src="getMediaUrl(record.id!)" class="media-video" preload="metadata" />
      <div class="media-overlay">
        <Eye :size="20" />
      </div>
      <!-- 媒体类型标识 -->
      <div class="media-type-badge">
        <ImageIcon v-if="record.mediaType === MEDIA_TYPE.IMAGE" :size="12" />
        <Video v-else :size="12" />
      </div>
      <!-- 多图片提示 -->
      <div v-if="record.mediaType === MEDIA_TYPE.IMAGE && (record.mediaUrls?.length || 0) > 1"
        class="multi-image-badge">
        <ImageIcon :size="10" />
        <span>{{ record.mediaUrls?.length || 3 }}</span>
      </div>
    </div>

    <!-- 卡片内容 -->
    <div class="card-content">
      <h3 class="card-title">{{ record.title }}</h3>
      <p class="card-description" v-if="record.description">
        <span v-html="record.description"></span>
      </p>
      <div class="card-meta">
        <div class="author-info">
          <div class="author-avatar">
            <Avatar :src="record?.user?.avatar" :name="record?.user?.name" size="small"
              class="user-avatar avatar-active" />
          </div>
          <h4 class="author-name">
            {{ record?.user?.name }}
          </h4>
        </div>
        <div class="meta-ago">{{ record.fromNow }}</div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="card-actions">
      <button class="action-btn edit-btn" @click="handleEdit" title="编辑">
        <Edit :size="14" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.grid-card {
  position: relative;
  width: 100%;
  margin-bottom: 16px;
  background: var(--glass-bg);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  break-inside: avoid;
}

.grid-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.grid-card .card-media {
  position: relative;
  width: 100%;
  aspect-ratio: auto;
  overflow: hidden;
}

.grid-card .media-image,
.grid-card .media-video {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.grid-card .media-overlay {
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

.grid-card:hover .media-overlay {
  opacity: 1;
}

.media-type-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  color: white;
}

/* 多图片提示标识 */
.multi-image-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  color: white;
  font-size: 10px;
  font-weight: 600;
}

.grid-card .card-content {
  padding: 6px 8px;
}

.grid-card .card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--showmd-text-color-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.grid-card .card-description {
  font-size: 13px;
  color: var(--showmd-text-color-secondary);
  margin: 0 0 8px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.grid-card .card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.card-meta .author-info {
  display: flex;
  align-items: center;
  padding: 0;
  gap: 6px;
}

.card-meta .author-info .author-avatar {
  width: 24px;
  height: 24px;
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
  font-size: 12px;
  font-weight: 500;
  color: var(--showmd-text-color-secondary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.meta-ago {
  padding: 2px 6px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  color: #667eea;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.meta-ago:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateY(-1px);
}

.grid-card .card-actions {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: all 0.3s ease;
}

.grid-card:hover .card-actions {
  opacity: 1;
}

.grid-card .action-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}

.grid-card .edit-btn {
  background: rgba(102, 126, 234, 0.8);
  color: white;
}

.grid-card .edit-btn:hover {
  background: #667eea;
  transform: scale(1.1);
}

/* 卡片悬停效果增强 */
.grid-card:hover .card-title {
  color: var(--showmd-text-color-primary);
}

.grid-card:hover .card-description {
  color: var(--showmd-text-color-primary);
}

.grid-card:hover .author-name {
  color: var(--showmd-text-color-primary);
}

/* 暗色主题适配 */
.dark .grid-card {
  background: rgba(24, 24, 27, 0.8);
}

.dark .author-avatar {
  background: rgba(0, 0, 0, 0.3);
}

.dark .meta-ago {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
  border-color: rgba(102, 126, 234, 0.3);
}
</style>