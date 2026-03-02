<template>
  <div class="baby-growth-detail">
    <div class="detail-header">
      <button class="back-btn" @click="goBack">
        <ArrowLeft :size="20" />
        返回
      </button>
      <div class="header-title">
        <h1>{{ isEdit ? '编辑成长记录' : '新建成长记录' }}</h1>
        <p class="subtitle">{{ isEdit ? '更新宝宝的成长记录' : '记录宝宝珍贵的成长瞬间' }}</p>
      </div>
    </div>

    <div class="detail-content">
      <form @submit.prevent="handleSubmit" class="growth-form">
        <div class="form-section">
          <div class="form-group">
            <div class="media-type-tabs">
              <button type="button" :class="['tab-btn', { active: form.mediaType === 1, disabled: hasMediaFiles }]"
                :disabled="hasMediaFiles" @click="!hasMediaFiles && (form.mediaType = 1)">
                <Image :size="18" />
                图片
              </button>
              <button type="button" :class="['tab-btn', { active: form.mediaType === 2, disabled: hasMediaFiles }]"
                :disabled="hasMediaFiles" @click="!hasMediaFiles && (form.mediaType = 2)">
                <Video :size="18" />
                视频
              </button>
            </div>
          </div>

          <div v-if="form.mediaType > 0" class="form-group">
            <label>{{ form.mediaType === 1 ? '上传图片' : '上传视频' }} *</label>
            <div class="media-upload">
              <input ref="fileInput" type="file" multiple :accept="form.mediaType === 1 ? 'image/*' : 'video/*'"
                @change="handleFileChange" style="display: none" />

              <div v-if="mediaFiles.length > 0" class="media-section">
                <!-- 媒体预览 -->
                <div class="media-preview">
                  <div v-for="(item, index) in mediaFiles" :key="index" class="media-item">
                    <div class="media-content">
                      <img v-if="form.mediaType === 1 && item.url" :src="item.url" :alt="item.file.name" />
                      <video v-else-if="form.mediaType === 2 && item.url" :src="item.url" controls></video>

                      <!-- 上传进度遮罩 -->
                      <div v-if="item.uploading" class="upload-overlay">
                        <div class="upload-progress">
                          <div class="progress-circle">
                            <svg class="progress-ring" width="60" height="60">
                              <circle class="progress-ring-circle" stroke="currentColor" stroke-width="4"
                                fill="transparent" r="26" cx="30" cy="30" :stroke-dasharray="163.36"
                                :stroke-dashoffset="163.36 - (163.36 * (item.progress || 0)) / 100" />
                            </svg>
                            <span class="progress-text">{{ Math.round(item.progress || 0) }}%</span>
                          </div>
                          <p class="upload-status">上传中...</p>
                        </div>
                      </div>

                      <!-- 上传完成标识 -->
                      <div v-if="item.uploaded" class="upload-success">
                        <div class="success-icon">✓</div>
                      </div>
                    </div>
                    <div class="media-info">
                      <span class="file-name">{{ item.file.name }}</span>
                      <span class="file-size">{{ formatFileSize(item.file.size) }}</span>
                      <span v-if="item.uploading" class="upload-status-text">
                        上传中 {{ Math.round(item.progress || 0) }}%
                      </span>
                      <span v-else-if="item.uploaded" class="upload-status-text success">上传完成</span>
                    </div>
                    <button type="button" @click="removeMedia(index)" class="remove-btn" :disabled="item.uploading">
                      <X :size="16" />
                    </button>
                  </div>
                </div>
                <div class="upload-area upload-area-compact" @click="handleUploadClick">
                  <div class="upload-content-compact">
                    <Upload :size="20" />
                    <span class="compact-text">继续添加{{ form.mediaType === 1 ? '图片' : '视频' }}</span>
                  </div>
                </div>
              </div>

              <!-- 完整版上传区域 - 仅在没有文件时显示 -->
              <div v-else class="upload-area" @click="handleUploadClick">
                <div class="upload-content-full">
                  <div class="upload-icon">
                    <Upload :size="48" />
                  </div>
                  <div class="upload-text">
                    <p class="upload-title">点击上传{{ form.mediaType === 1 ? '图片' : '视频' }} *</p>
                    <p class="upload-hint">支持 {{ form.mediaType === 1 ? 'JPG、PNG、GIF 等格式' : 'MP4、MOV、AVI 等格式' }}</p>
                    <p class="upload-required">{{ form.mediaType === 1 ? '图片' : '视频' }}是必须的，请至少上传一个文件</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="form-group">
            <label for="title">标题 *</label>
            <input id="title" v-model="form.title" type="text" placeholder="请输入记录标题" required class="form-input" />
          </div>

          <div class="form-group">
            <label for="eventTime">事件时间 *</label>
            <input id="eventTime" v-model="form.eventTime" type="datetime-local" required class="form-input" />
          </div>

          <div class="form-group">
            <label for="description">描述</label>
            <div class="description-input-wrapper">
              <textarea ref="descriptionInput" id="description" v-model="form.description" rows="6"
                placeholder="记录宝宝的成长点滴..." class="form-textarea"></textarea>
              <div class="emoji-toolbar">
                <el-dropdown trigger="click" placement="bottom-end" @command="handleEmojiChange">
                  <button type="button" class="emoji-btn">
                    <span class="emoji-icon">😊</span>
                    表情
                  </button>
                  <template #dropdown>
                    <div class="emoji-dropdown-panel">
                      <Emoji @change="handleEmojiChange" />
                    </div>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <div class="right-actions">
            <button type="button" @click="goBack" class="cancel-btn">
              取消
            </button>
            <button v-if="isEdit" type="button" @click="handleDelete" class="delete-btn" :disabled="deleting">
              <Trash2 v-if="!deleting" :size="16" />
              <Loader2 v-else :size="16" class="loading-icon" />
              {{ deleting ? '删除中...' : '删除记录' }}
            </button>
            <button type="submit" class="submit-btn" :disabled="loading || !canSubmit">
              <Loader2 v-if="loading" :size="16" class="loading-icon" />
              {{ loading ? '保存中...' : (isEdit ? '更新记录' : '创建记录') }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { confirm } from '@utils/messageBox'
import message from '@utils/message'
import { ArrowLeft, Image, Video, Upload, X, Loader2, Trash2 } from 'lucide-vue-next'
import { createRecord, updateRecord, findById, deleteById, IBabyGrowth } from '@service/babyGrowth'
import Emoji from '@components/Comment/Emoji/Emoji.vue'
import { formatEmoji } from '@components/Comment/utils'

interface MediaFile {
  file: File
  url: string
  uploading?: boolean
  progress?: number
  uploaded?: boolean
}

interface GrowthForm {
  title: string
  eventTime: string
  description: string
  mediaType: number
}

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const deleting = ref(false)
const fileInput = ref<HTMLInputElement>()
const descriptionInput = ref<HTMLTextAreaElement>()
const mediaFiles = ref<MediaFile[]>([])

const form = reactive<GrowthForm>({
  title: '',
  eventTime: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm 格式
  description: '',
  mediaType: 1 // 默认为图片
})

const isEdit = computed(() => !!route.params.id)
const hasMediaFiles = computed(() => mediaFiles.value.length > 0)
const canSubmit = computed(() => {
  // 基本表单验证
  if (!form.title.trim() || !form.eventTime) {
    return false
  }

  // 媒体文件验证
  if (mediaFiles.value.length === 0) {
    return false
  }

  // 检查是否有文件还在上传中
  const hasUploadingFiles = mediaFiles.value.some(file => file.uploading)
  if (hasUploadingFiles) {
    return false
  }

  return true
})

// 添加一个计算属性来调试进度更新
const uploadingFiles = computed(() => {
  return mediaFiles.value.filter(file => file.uploading)
})

// 监听上传文件的变化
watch(uploadingFiles, (newFiles) => {
  console.log('Uploading files changed:', newFiles.map(f => ({ name: f.file.name, progress: f.progress })))
}, { deep: true })

onMounted(() => {
  if (isEdit.value) {
    loadRecord()
  }
})

const loadRecord = async () => {
  try {
    loading.value = true
    const id = Number(route.params.id)
    const record = await findById(id)

    if (record) {
      form.title = record.title
      form.eventTime = new Date(record.eventTime).toISOString().slice(0, 16)
      form.description = record.description || ''
      form.mediaType = record.mediaType

      // 如果有媒体文件，这里可以显示现有的媒体文件
      // 但由于是编辑模式，通常不需要重新上传，除非用户要更换
    } else {
      message.error('记录不存在')
      router.push('/life/baby-growth')
    }
  } catch (error) {
    console.error('Failed to load record:', error)
    message.error('加载记录失败')
  } finally {
    loading.value = false
  }
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files) {
    // 清空之前的文件
    mediaFiles.value = []

    Array.from(files).forEach(file => {
      // 验证文件类型
      const isValidType = form.mediaType === 1
        ? file.type.startsWith('image/')
        : file.type.startsWith('video/')

      if (!isValidType) {
        message.error(`请选择正确的${form.mediaType === 1 ? '图片' : '视频'}文件`)
        return
      }

      // 创建媒体文件对象 - 使用reactive确保响应式
      const mediaFile = reactive<MediaFile>({
        file,
        url: '',
        uploading: true,
        progress: 0,
        uploaded: false
      })

      mediaFiles.value.push(mediaFile)

      // 读取文件预览
      const reader = new FileReader()
      reader.onload = (e) => {
        mediaFile.url = e.target?.result as string
      }
      reader.readAsDataURL(file)

      // 模拟上传进度
      simulateUploadProgress(mediaFile)
    })
  }
}

const simulateUploadProgress = (mediaFile: MediaFile) => {
  // 添加初始延迟，让用户看到0%状态
  setTimeout(() => {
    const interval = setInterval(() => {
      const currentProgress = mediaFile.progress || 0
      if (currentProgress < 100) {
        // 随机增加进度，但确保不会超过100
        const increment = Math.random() * 12 + 3 // 3-15之间的随机增量
        const newProgress = Math.min(100, currentProgress + increment)
        mediaFile.progress = Math.round(newProgress) // 确保是整数

        // 调试日志
        console.log(`Upload progress: ${mediaFile.progress}%`)
      } else {
        // 标记为上传完成
        mediaFile.uploading = false
        mediaFile.uploaded = true
        mediaFile.progress = 100
        clearInterval(interval)
        console.log('Upload completed!')
      }
    }, 300) // 稍微放慢更新频率，让用户更容易看到变化
  }, 100) // 100ms后开始更新进度
}

const handleUploadClick = () => {
  fileInput.value?.click()
}

const removeMedia = (index: number) => {
  mediaFiles.value.splice(index, 1)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleSubmit = async () => {
  try {
    loading.value = true

    // 验证图片和视频是必须的
    if (mediaFiles.value.length === 0) {
      message.error('请上传至少一张图片或一个视频')
      return
    }

    // 检查是否有文件还在上传中
    const hasUploadingFiles = mediaFiles.value.some(file => file.uploading)
    if (hasUploadingFiles) {
      message.error('请等待文件上传完成')
      return
    }

    // 准备提交的数据
    const recordData: Partial<IBabyGrowth> = {
      title: form.title,
      eventTime: form.eventTime,
      description: form.description,
      mediaType: form.mediaType
    }

    // 准备媒体文件
    const files = mediaFiles.value.map(item => item.file)

    let result: number | null = null

    if (isEdit.value) {
      const id = Number(route.params.id)
      result = await updateRecord(id, recordData, files.length > 0 ? files : undefined)
    } else {
      result = await createRecord(recordData, files.length > 0 ? files : undefined)
    }

    if (result !== null) {
      message.success(isEdit.value ? '更新成功' : '创建成功')
      router.push('/life/baby-growth')
    } else {
      message.error(isEdit.value ? '更新失败' : '创建失败')
    }
  } catch (error) {
    console.error('Failed to save record:', error)
    message.error('保存失败，请重试')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

// 删除记录
const handleDelete = async () => {
  try {
    await confirm(
      '确定要删除这条成长记录吗？删除后无法恢复。',
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )

    deleting.value = true
    const id = Number(route.params.id)
    const success = await deleteById(id)

    if (success) {
      message.success('删除成功')
      router.push('/life/baby-growth')
    } else {
      message.error('删除失败，请重试')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete record:', error)
      message.error('删除失败，请重试')
    }
  } finally {
    deleting.value = false
  }
}

// 表情相关方法
const handleEmojiChange = (emoji: any) => {
  // 使用统一的表情格式化函数
  const emojiText = formatEmoji(emoji)
  insertEmojiText(emojiText)
}

const insertEmojiText = (emojiText: string) => {
  const textarea = descriptionInput.value
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = form.description

    // 在光标位置插入表情文本
    form.description = text.slice(0, start) + emojiText + text.slice(end)

    // 设置新的光标位置
    nextTick(() => {
      const newPosition = start + emojiText.length
      textarea.setSelectionRange(newPosition, newPosition)
      textarea.focus()
    })
  } else {
    // 如果无法获取光标位置，就在末尾添加
    form.description += emojiText
  }
}
</script>

<style scoped>
.baby-growth-detail {
  min-height: 100vh;
  background: var(--showmd-bg-color, #f8fafc);
  padding: 24px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--glass-bg);
  border-radius: 8px;
  color: var(--showmd-text-color-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.back-btn:hover {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.header-title h1 {
  margin: 0 0 4px 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--showmd-text-color-primary);
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--showmd-text-color-weak);
}

.detail-content {
  max-width: 1000px;
  margin: 0 auto;
}

.growth-form {
  background: var(--glass-bg);
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.form-section:last-of-type {
  margin-bottom: 0;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--showmd-text-color-primary);
  font-size: 14px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 16px 20px;
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
  border-radius: 8px;
  font-size: 14px;
  background: var(--glass-bg);
  color: var(--showmd-text-color-primary);
  transition: all 0.3s ease;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.description-input-wrapper {
  position: relative;
}

.emoji-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.emoji-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
  border-radius: 6px;
  color: var(--showmd-text-color-secondary);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.emoji-btn:hover,
.emoji-btn.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  color: var(--showmd-text-color-primary);
  border-color: #667eea;
}

.emoji-icon {
  font-size: 16px;
}

.emoji-dropdown-panel {
  padding: 16px;
  background: var(--glass-bg);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
  min-width: 320px;
}

/* 覆盖 Element Plus dropdown 的默认样式 */
:deep(.el-dropdown-menu) {
  padding: 0 !important;
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

.media-type-tabs {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  background: var(--glass-bg);
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
  backdrop-filter: blur(10px);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--showmd-text-color-secondary);
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
  position: relative;
}

.tab-btn:hover {
  color: var(--showmd-text-color-primary);
  background: rgba(102, 126, 234, 0.1);
}

.tab-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.tab-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.tab-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tab-btn svg {
  transition: all 0.3s ease;
}

.media-upload {
  overflow: hidden;
}

.media-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  border: 2px dashed var(--glass-border, rgba(102, 126, 234, 0.3));
  border-radius: 8px;
  background: var(--glass-bg);
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area-compact {
  flex-direction: row;
  padding: 16px 20px;
  border: 1px dashed var(--glass-border, rgba(102, 126, 234, 0.2));
  background: var(--glass-bg);
  opacity: 0.8;
}

.upload-area:hover {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
}

.upload-area-compact:hover {
  opacity: 1;
  border-color: #667eea;
  transform: translateY(-1px);
}

.upload-content-full {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-content-compact {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--showmd-text-color-secondary);
}

.upload-content-compact svg {
  color: #667eea;
  opacity: 0.7;
}

.compact-text {
  font-size: 14px;
  font-weight: 500;
}

.upload-icon {
  margin-bottom: 16px;
  color: #667eea;
  opacity: 0.8;
}

.upload-text {
  text-align: center;
}

.upload-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--showmd-text-color-primary);
}

.upload-hint {
  margin: 0;
  font-size: 13px;
  color: var(--showmd-text-color-weak);
}

.upload-required {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #ef4444;
  font-weight: 500;
}

.media-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.media-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.media-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
}

.media-content {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.media-content img,
.media-content video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

.upload-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}

.progress-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-circle {
  stroke: #667eea;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
}

.progress-text {
  position: absolute;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.upload-status {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
}

.upload-success {
  position: absolute;
  top: 8px;
  right: 8px;
}

.success-icon {
  width: 24px;
  height: 24px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.media-info {
  padding: 16px;
  background: var(--glass-bg);
}

.file-name {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--showmd-text-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.file-size {
  display: block;
  font-size: 12px;
  color: var(--showmd-text-color-weak);
}

.upload-status-text {
  display: block;
  font-size: 12px;
  margin-top: 4px;
  color: #667eea;
  font-weight: 500;
}

.upload-status-text.success {
  color: #10b981;
}

.remove-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.8);
  transform: scale(1.1);
}

.remove-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.left-actions {
  display: flex;
  gap: 16px;
}

.right-actions {
  display: flex;
  gap: 16px;
}

.delete-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: var(--glass-bg);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.delete-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
  border-color: #ef4444;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.2);
}

.delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.cancel-btn {
  padding: 14px 28px;
  background: var(--glass-bg);
  color: var(--showmd-text-color-secondary);
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.cancel-btn:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  color: var(--showmd-text-color-primary);
  transform: translateY(-2px);
}

.submit-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* 暗色主题适配 */
.dark .growth-form {
  background: rgba(24, 24, 27, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .form-input,
.dark .form-textarea {
  background: rgba(24, 24, 27, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .radio-item {
  background: rgba(24, 24, 27, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .media-type-tabs {
  background: rgba(24, 24, 27, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .upload-area {
  background: rgba(24, 24, 27, 0.6);
  border-color: rgba(102, 126, 234, 0.3);
}

.dark .upload-area-compact {
  background: rgba(24, 24, 27, 0.4);
  border-color: rgba(102, 126, 234, 0.2);
}

.dark .media-item {
  background: rgba(24, 24, 27, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .emoji-btn {
  background: rgba(24, 24, 27, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .emoji-dropdown-panel {
  background: rgba(24, 24, 27, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .delete-btn {
  background: rgba(24, 24, 27, 0.6);
  border-color: rgba(239, 68, 68, 0.3);
}

/* 暗色主题下的 dropdown 样式 */
.dark :deep(.el-dropdown-menu) {
  background: transparent !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .baby-growth-detail {
    padding: 16px;
  }

  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .growth-form {
    padding: 24px 20px;
  }

  .media-type-tabs {
    flex-direction: column;
    gap: 8px;
  }

  .tab-btn {
    justify-content: flex-start;
  }

  .media-preview {
    grid-template-columns: 1fr;
  }

  .upload-area-compact {
    padding: 12px 16px;
  }

  .compact-text {
    font-size: 13px;
  }

  .form-actions {
    flex-direction: column;
    gap: 16px;
  }

  .left-actions,
  .right-actions {
    width: 100%;
  }

  .right-actions {
    flex-direction: column;
  }

  .delete-btn,
  .cancel-btn,
  .submit-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .header-title h1 {
    font-size: 24px;
  }

  .form-input,
  .form-textarea {
    padding: 14px 16px;
  }

  .upload-area {
    padding: 32px 16px;
  }
}
</style>