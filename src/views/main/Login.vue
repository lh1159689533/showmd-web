<script lang="ts" setup>
import { ref, defineEmits, computed } from 'vue';
import { useStore } from 'vuex';
import { encrypt } from '@utils/encrypt';
import { checkUserName, login, register } from '@service/user';
import message from '@src/utils/message';

defineEmits<{ (e: 'close'): void }>();

const store = useStore();

const ruleFormRef = ref();
const userForm = ref({ userName: '', password: '', checkPassword: '' });
const isLogin = ref(true);
const isLoading = ref(false);

// 输入框聚焦状态
const focusedField = ref('');

const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else if (!isLogin.value) {
    if (value.length < 6) {
      callback(new Error('密码至少6位，由数字字母组成'));
    } else if (!/^[a-zA-Z0-9]{6,}$/.test(value)) {
      callback(new Error('必须是数字字母'));
    } else if (userForm.value.checkPassword !== '') {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField('checkPassword', () => null);
    }
  }
  callback();
};

const validateCheckPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== userForm.value.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

const validateName = async (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入用户名'));
  } else if (!isLogin.value) {
    const isExist = await checkUserName(value);
    if (isExist) {
      callback(new Error('用户名已被占用'));
    }
  }
  callback();
};

// form规则
const publishRules = ref({
  userName: [{ validator: validateName, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  checkPassword: [{ validator: validateCheckPassword, trigger: 'blur' }],
});

const submitForm = async () => {
  const isValidte = await ruleFormRef.value?.validate();
  if (!isValidte) {
    return;
  }
  isLoading.value = true;
  const { userName, password } = userForm.value;
  let errMsg = '';
  if (isLogin.value) {
    errMsg = await login(userName, encrypt(password));
  } else {
    errMsg = await register(userName, encrypt(password));
  }
  isLoading.value = false;
  if (errMsg) {
    message.error(errMsg);
  } else {
    store.commit('hideLogin');
    store.dispatch('getUserInfo');
  }
};

const changeType = () => {
  ruleFormRef.value?.resetFields();
  isLogin.value = !isLogin.value;
};
</script>

<template>
  <el-dialog
    model-value="true"
    :width="720"
    class="modern-login-dialog"
    append-to-body
    :close-on-click-modal="false"
    destroy-on-close
    :before-close="() => $emit('close')"
    align-center
    :show-close="false"
  >
    <template #header>
      <!-- 自定义关闭按钮 -->
      <button class="modern-close-btn" @click="$emit('close')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </template>
    
    <div class="modern-login-content">
      <!-- 🎨 左侧装饰区域 -->
      <div class="login-decoration">
        <div class="decoration-bg"></div>
        <div class="decoration-content">
          <div class="brand-logo">
            <span class="logo-icon">✨</span>
            <span class="logo-text">ShowMD</span>
          </div>
          <h2 class="welcome-title">{{ isLogin ? '欢迎回来' : '加入我们' }}</h2>
          <p class="welcome-desc">{{ isLogin ? '登录以继续您的创作之旅' : '开启您的创作之旅' }}</p>
          
          <!-- 装饰图形 -->
          <div class="floating-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
          </div>
        </div>
      </div>

      <!-- 🎨 右侧表单区域 -->
      <div class="login-form-area">
        <div class="form-header">
          <h3 class="form-title">{{ isLogin ? '登录账号' : '注册账号' }}</h3>
          <p class="form-subtitle">{{ isLogin ? '使用您的账号登录' : '创建一个新账号' }}</p>
        </div>

        <el-form 
          ref="ruleFormRef" 
          :model="userForm" 
          :rules="publishRules" 
          label-width="0" 
          size="default" 
          class="modern-login-form"
        >
          <!-- 用户名输入框 -->
          <el-form-item label="" prop="userName">
            <div class="modern-input-wrapper" :class="{ focused: focusedField === 'userName' }">
              <span class="input-icon">👤</span>
              <el-input 
                v-model="userForm.userName" 
                placeholder="请输入用户名" 
                size="large"
                @focus="focusedField = 'userName'"
                @blur="focusedField = ''"
              />
            </div>
          </el-form-item>

          <!-- 密码输入框 -->
          <el-form-item label="" prop="password">
            <div class="modern-input-wrapper" :class="{ focused: focusedField === 'password' }">
              <span class="input-icon">🔐</span>
              <el-input 
                v-model="userForm.password" 
                placeholder="请输入密码" 
                size="large" 
                type="password" 
                autocomplete="off"
                @focus="focusedField = 'password'"
                @blur="focusedField = ''"
              />
            </div>
            <div v-if="isLogin" class="forgot-password">
              <span @click.prevent>忘记密码？</span>
            </div>
          </el-form-item>

          <!-- 确认密码输入框（注册时显示） -->
          <el-form-item v-if="!isLogin" label="" prop="checkPassword">
            <div class="modern-input-wrapper" :class="{ focused: focusedField === 'checkPassword' }">
              <span class="input-icon">🔒</span>
              <el-input 
                v-model="userForm.checkPassword" 
                placeholder="请再次输入密码" 
                size="large" 
                type="password" 
                autocomplete="off"
                @focus="focusedField = 'checkPassword'"
                @blur="focusedField = ''"
              />
            </div>
          </el-form-item>

          <!-- 提交按钮 -->
          <el-form-item>
            <button 
              type="button" 
              class="modern-submit-btn"
              :class="{ loading: isLoading }"
              @click="submitForm()"
              :disabled="isLoading"
            >
              <span class="btn-content">
                <span v-if="isLoading" class="loading-spinner"></span>
                <span>{{ isLogin ? '登录' : '注册' }}</span>
              </span>
              <div class="btn-glow"></div>
            </button>
          </el-form-item>

          <!-- 切换登录/注册 -->
          <div class="switch-mode">
            <span class="switch-text">{{ isLogin ? '还没有账号？' : '已有账号？' }}</span>
            <span @click="changeType" class="switch-link">{{ isLogin ? '立即注册' : '立即登录' }}</span>
          </div>
        </el-form>

        <!-- 社交登录（可选） -->
        <div class="social-login">
          <div class="divider">
            <span>或</span>
          </div>
          <div class="social-buttons">
            <button class="social-btn" title="微信登录">
              <span>💬</span>
            </button>
            <button class="social-btn" title="GitHub登录">
              <span>🐙</span>
            </button>
            <button class="social-btn" title="邮箱登录">
              <span>📧</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style>
/* 🎨 现代化登录弹窗全局样式 */
.modern-login-dialog {
  border-radius: 24px !important;
  overflow: hidden !important;
  background: transparent !important;
}

.modern-login-dialog .el-dialog {
  background: transparent !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
}

.modern-login-dialog .el-dialog__header {
  padding: 0 !important;
  margin: 0 !important;
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 100;
}

.modern-login-dialog .el-dialog__body {
  padding: 0 !important;
  overflow: hidden !important;
}
</style>

<style scoped>
/* 🎨 关闭按钮 */
.modern-close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-smooth);
}

.modern-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

/* 🎨 登录内容布局 */
.modern-login-content {
  display: flex;
  min-height: 520px;
  background: var(--showmd-bg-color-primary);
  border-radius: 24px;
  overflow: hidden;
}

/* 🎨 左侧装饰区域 */
.login-decoration {
  width: 45%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.decoration-bg {
  position: absolute;
  inset: 0;
  background: var(--gradient-primary);
}

.decoration-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.1) 0%, transparent 100%);
}

.decoration-content {
  position: relative;
  z-index: 10;
  padding: 40px;
  color: white;
  text-align: center;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
}

.logo-icon {
  font-size: 32px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.welcome-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.welcome-desc {
  font-size: 15px;
  opacity: 0.9;
  margin: 0;
}

/* 浮动装饰形状 */
.floating-shapes {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: floatShape 8s ease-in-out infinite;
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: 10%;
  left: -20px;
  animation-delay: 0s;
}

.shape-2 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  right: -10px;
  animation-delay: 2s;
}

.shape-3 {
  width: 40px;
  height: 40px;
  bottom: 10%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes floatShape {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* 🎨 右侧表单区域 */
.login-form-area {
  flex: 1;
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
}

.form-header {
  margin-bottom: 32px;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--showmd-text-color-primary);
  margin: 0 0 8px 0;
}

.form-subtitle {
  font-size: 14px;
  color: var(--showmd-text-color-weak);
  margin: 0;
}

/* 🎨 现代化输入框 */
.modern-login-form {
  flex: 1;
}

.modern-login-form :deep(.el-form-item) {
  margin-bottom: 24px;
}

.modern-input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  background: var(--glass-bg);
  border: 2px solid var(--glass-border);
  border-radius: 14px;
  padding: 0 16px;
  transition: var(--transition-smooth);
}

.modern-input-wrapper.focused {
  border-color: var(--vibrant-green);
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.modern-input-wrapper:hover:not(.focused) {
  border-color: var(--showmd-border-color-hover);
}

.input-icon {
  font-size: 18px;
  margin-right: 12px;
}

.modern-input-wrapper :deep(.el-input__wrapper) {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.modern-input-wrapper :deep(.el-input__inner) {
  height: 48px !important;
  font-size: 15px !important;
}

.forgot-password {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.forgot-password span {
  font-size: 13px;
  color: var(--vibrant-green);
  cursor: pointer;
  transition: var(--transition-smooth);
}

.forgot-password span:hover {
  text-decoration: underline;
}

/* 🎨 提交按钮 */
.modern-submit-btn {
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 14px;
  background: var(--gradient-primary);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--transition-smooth);
}

.modern-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.modern-submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.modern-submit-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.modern-submit-btn:hover:not(:disabled) .btn-glow {
  left: 100%;
}

/* 🎨 切换模式 */
.switch-mode {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
}

.switch-text {
  color: var(--showmd-text-color-weak);
}

.switch-link {
  color: var(--vibrant-green);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.switch-link:hover {
  text-decoration: underline;
}

/* 🎨 社交登录 */
.social-login {
  margin-top: auto;
  padding-top: 24px;
}

.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--showmd-border-color);
}

.divider span {
  font-size: 13px;
  color: var(--showmd-text-color-weak);
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.social-btn {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  cursor: pointer;
  font-size: 20px;
  transition: var(--transition-bounce);
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-btn:hover {
  transform: translateY(-3px);
  border-color: var(--vibrant-green);
  box-shadow: var(--shadow-float);
}

/* 🎨 暗色主题适配 */
.dark .modern-login-content {
  background: rgba(24, 24, 27, 0.95);
}

.dark .modern-input-wrapper {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .modern-input-wrapper.focused {
  border-color: var(--neon-purple);
  box-shadow: 0 0 0 4px rgba(157, 78, 221, 0.1);
}

.dark .social-btn {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .social-btn:hover {
  border-color: var(--neon-purple);
}

/* 🎨 响应式 */
@media (max-width: 640px) {
  .login-decoration {
    display: none;
  }
  
  .login-form-area {
    padding: 32px 24px;
  }
}
</style>
