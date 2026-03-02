<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Login from '@src/views/main/Login.vue';

const router = useRouter();
const store = useStore();

// 用户操作选项
const userOprateList = [
  {
    title: '写文章',
    icon: 'bianji',
    key: 'newArticle',
  },
  {
    title: '草稿箱',
    icon: 'draftbox',
    key: 'draft',
  },
  {
    title: '退出',
    icon: 'tuichu',
    key: 'logout',
  },
];

// 是否展示用户操作
const isShow = ref(false);
const isShowLogin = computed(() => store.getters.isShowLogin);
const currentUser = computed(() => store.getters.getUser);

// 显示用户操作栏
const show = () => {
  isShow.value = true;
};

const hide = () => {
  isShow.value = false;
};

// 操作
const handleOprate = ({ key }) => {
  if (key === 'newArticle') {
    const { href } = router.resolve('/article/new');
    window.open(href, '_blank');
  }
  hide();
};

// 获取菜单项描述
const getItemDescription = (key) => {
  const descriptions = {
    newArticle: '创作新内容',
    draft: '管理草稿',
    logout: '安全退出'
  };
  return descriptions[key] || '';
};
</script>

<template>
  <!-- 已登录用户操作区域 -->
  <div v-if="currentUser?.id" class="modern-user-oprate" @mouseenter="show" @mouseleave="hide">
    <!-- 用户头像 -->
    <Avatar 
      :src="currentUser.avatar" 
      :name="currentUser.name"
      size="medium"
      :show-ring="isShow"
      :class="{ 'avatar-active': isShow }"
      class="user-avatar"
    />
    
    <!-- 下拉操作菜单 -->
    <div class="modern-oprate-dropdown" :class="{ 'is-visible': isShow }">
      <!-- 用户信息头部 -->
      <div class="dropdown-header">
        <div class="user-info">
          <Avatar 
            :src="currentUser.avatar" 
            :name="currentUser.name"
            size="small"
            class="header-avatar"
          />
          <div class="user-details">
            <div class="user-name">{{ currentUser.name }}</div>
            <div class="user-status">在线</div>
          </div>
        </div>
        <div class="header-decoration"></div>
      </div>

      <!-- 操作选项列表 -->
      <div class="dropdown-content">
        <List
          :data-list="userOprateList" 
          @click="handleOprate" 
          class="oprate-menu"
          item-class="menu-item-wrapper"
        >
          <template #default="{ item }">
            <div class="modern-menu-item" :class="`item-${item.key}`">
              <div class="item-icon">
                <i class="iconfont" :class="`icon-${item.icon}`"></i>
              </div>
              <div class="item-content">
                <span class="item-title">{{ item.title }}</span>
                <span class="item-desc">{{ getItemDescription(item.key) }}</span>
              </div>
              <div class="item-arrow">
                <i class="iconfont icon-arrow-right"></i>
              </div>
            </div>
          </template>
        </List>
      </div>

      <!-- 底部装饰 -->
      <div class="dropdown-footer">
        <div class="footer-pattern"></div>
      </div>
    </div>
  </div>

  <!-- 未登录状态 -->
  <div
    v-else 
    @click="() => store.commit('showLogin')"
    class="modern-login-btn"
  >
    <div class="login-content">
      <i class="iconfont icon-user"></i>
      <span>登录</span>
    </div>
    <div class="login-glow"></div>
  </div>

  <!-- 登录弹窗 -->
  <Login v-if="isShowLogin" @close="() => store.commit('hideLogin')" />
</template>

<style scoped>
/* 🎨 现代化用户操作组件样式 */

/* ========================================
   👤 用户操作区域
   ======================================== */
.modern-user-oprate {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 2rem;
}

.user-avatar {
  cursor: pointer;
  transition: var(--transition-smooth, all 0.3s ease);
  z-index: 10;
  position: relative;
}

.user-avatar.avatar-active {
  transform: scale(1.1) translateY(2px);
}

/* ========================================
   📋 下拉菜单容器
   ======================================== */
.modern-oprate-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 280px;
  background: var(--glass-bg, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
  border-radius: 20px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px) scale(0.95);
  transition: var(--transition-smooth, all 0.3s ease);
  z-index: 1000;
  overflow: hidden;
}

.modern-oprate-dropdown.is-visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

/* ========================================
   📄 下拉菜单头部
   ======================================== */
.dropdown-header {
  position: relative;
  padding: 1.5rem;
  background: linear-gradient(135deg, 
    var(--coral-50, #fef2f2) 0%, 
    var(--rose-50, #fff1f2) 100%);
  border-bottom: 1px solid var(--coral-100, #fee2e2);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-avatar {
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--showmd-text-color-primary);
  margin-bottom: 0.125rem;
  background: var(--gradient-primary, linear-gradient(135deg, #f87171 0%, #ef4444 100%));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-status {
  font-size: 0.8125rem;
  color: var(--showmd-text-color-weak);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.user-status::before {
  content: '';
  width: 6px;
  height: 6px;
  background: var(--vibrant-green, #10b981);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.header-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, var(--coral-200, #fecaca) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0.6;
}

/* ========================================
   📋 菜单内容区域
   ======================================== */
.dropdown-content {
  padding: 0.75rem 0;
}

.oprate-menu {
  width: 100%;
}

.menu-item-wrapper {
  margin-bottom: 0 !important;
}

.modern-menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: var(--transition-smooth, all 0.3s ease);
  position: relative;
  overflow: hidden;
}

.modern-menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(248, 113, 113, 0.1), 
    transparent);
  transition: left 0.5s ease;
}

.modern-menu-item:hover {
  background: linear-gradient(135deg, 
    var(--coral-50, #fef2f2) 0%, 
    var(--rose-50, #fff1f2) 100%);
  transform: translateX(4px);
}

.modern-menu-item:hover::before {
  left: 100%;
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, 
    var(--coral-100, #fee2e2) 0%, 
    var(--orange-100, #ffedd5) 100%);
  border: 1px solid var(--coral-200, #fecaca);
  border-radius: 12px;
  color: var(--vibrant-coral, #f87171);
  font-size: 1.125rem;
  transition: var(--transition-smooth, all 0.3s ease);
  flex-shrink: 0;
}

.modern-menu-item:hover .item-icon {
  background: var(--gradient-primary, linear-gradient(135deg, #f87171 0%, #ef4444 100%));
  color: white;
  transform: scale(1.1);
  box-shadow: var(--shadow-float, 0 4px 12px rgba(248, 113, 113, 0.3));
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  display: block;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--showmd-text-color-primary);
  margin-bottom: 0.125rem;
}

.item-desc {
  display: block;
  font-size: 0.8125rem;
  color: var(--showmd-text-color-weak);
  line-height: 1.2;
}

.item-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  color: var(--showmd-text-color-weak);
  font-size: 0.875rem;
  transition: var(--transition-smooth, all 0.3s ease);
  opacity: 0;
  transform: translateX(-8px);
}

.modern-menu-item:hover .item-arrow {
  opacity: 1;
  transform: translateX(0);
  color: var(--vibrant-coral, #f87171);
}

/* 🎯 特殊菜单项样式 */
.item-logout .item-icon {
  background: linear-gradient(135deg, 
    var(--red-light-1, #fee2e2) 0%, 
    var(--red-light-2, #fecaca) 100%);
  border-color: var(--red-light-3, #fca5a5);
  color: var(--red-light-6, #dc2626);
}

.item-logout:hover .item-icon {
  background: linear-gradient(135deg, 
    var(--red-light-6, #dc2626) 0%, 
    var(--red-light-7, #b91c1c) 100%);
  color: white;
}

.item-logout:hover .item-arrow {
  color: var(--red-light-6, #dc2626);
}

/* ========================================
   🎨 底部装饰
   ======================================== */
.dropdown-footer {
  position: relative;
  height: 0.5rem;
  background: linear-gradient(135deg, 
    var(--coral-100, #fee2e2) 0%, 
    var(--rose-100, #ffe4e6) 100%);
}

.footer-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 4px,
    rgba(248, 113, 113, 0.1) 4px,
    rgba(248, 113, 113, 0.1) 8px
  );
}

/* ========================================
   🔐 登录按钮样式
   ======================================== */
.modern-login-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 2.5rem;
  margin-right: 2rem;
  background: var(--gradient-primary, linear-gradient(135deg, #f87171 0%, #ef4444 100%));
  border-radius: 20px;
  cursor: pointer;
  transition: var(--transition-smooth, all 0.3s ease);
  overflow: hidden;
  box-shadow: var(--shadow-float, 0 4px 12px rgba(248, 113, 113, 0.3));
}

.modern-login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.2), 
    transparent);
  transition: left 0.5s ease;
}

.modern-login-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow, 0 8px 25px rgba(248, 113, 113, 0.4));
  filter: brightness(1.05);
}

.modern-login-btn:hover::before {
  left: 100%;
}

.modern-login-btn:active {
  transform: translateY(0);
  box-shadow: var(--shadow-press, 0 2px 8px rgba(248, 113, 113, 0.3));
}

.login-content {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  z-index: 1;
}

.login-content i {
  font-size: 1rem;
}

.login-glow {
  position: absolute;
  inset: -2px;
  background: var(--gradient-primary, linear-gradient(135deg, #f87171 0%, #ef4444 100%));
  border-radius: 22px;
  opacity: 0;
  filter: blur(8px);
  transition: opacity 0.3s ease;
  z-index: -1;
}

.modern-login-btn:hover .login-glow {
  opacity: 0.6;
}

/* ========================================
   🌙 暗色主题适配
   ======================================== */
.dark .modern-oprate-dropdown {
  background: rgba(0, 0, 0, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 8px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.dark .dropdown-header {
  background: linear-gradient(135deg, 
    rgba(248, 113, 113, 0.1) 0%, 
    rgba(239, 68, 68, 0.1) 100%);
  border-color: rgba(248, 113, 113, 0.2);
}

.dark .modern-menu-item:hover {
  background: linear-gradient(135deg, 
    rgba(248, 113, 113, 0.1) 0%, 
    rgba(239, 68, 68, 0.1) 100%);
}

.dark .item-icon {
  background: linear-gradient(135deg, 
    rgba(248, 113, 113, 0.15) 0%, 
    rgba(251, 146, 60, 0.15) 100%);
  border-color: rgba(248, 113, 113, 0.3);
}

.dark .item-logout .item-icon {
  background: linear-gradient(135deg, 
    rgba(239, 68, 68, 0.15) 0%, 
    rgba(220, 38, 38, 0.15) 100%);
  border-color: rgba(239, 68, 68, 0.3);
}

.dark .dropdown-footer {
  background: linear-gradient(135deg, 
    rgba(248, 113, 113, 0.1) 0%, 
    rgba(239, 68, 68, 0.1) 100%);
}

.dark .header-decoration {
  background: radial-gradient(circle, rgba(248, 113, 113, 0.2) 0%, transparent 70%);
}

/* ========================================
   📱 响应式适配
   ======================================== */
@media (max-width: 768px) {
  .modern-user-oprate {
    margin-right: 1rem;
  }

  .modern-oprate-dropdown {
    width: 260px;
    right: -1rem;
  }

  .dropdown-header {
    padding: 1.25rem;
  }

  .modern-menu-item {
    padding: 0.875rem 1.25rem;
  }

  .item-icon {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 1rem;
  }

  .item-title {
    font-size: 0.875rem;
  }

  .item-desc {
    font-size: 0.75rem;
  }

  .modern-login-btn {
    width: 4.5rem;
    height: 2.25rem;
    margin-right: 1rem;
  }

  .login-content {
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .modern-oprate-dropdown {
    width: 240px;
    right: -1.5rem;
  }

  .modern-menu-item {
    gap: 0.75rem;
  }

  .item-desc {
    display: none;
  }

  .modern-login-btn {
    width: 4rem;
    height: 2rem;
  }

  .login-content span {
    display: none;
  }
}

/* ========================================
   ✨ 进入动画
   ======================================== */
@keyframes dropdownSlideIn {
  0% {
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modern-oprate-dropdown.is-visible {
  animation: dropdownSlideIn 0.3s ease-out;
}
</style>
