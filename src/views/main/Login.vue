<script lang="ts" setup>
import { ref, defineEmits } from 'vue';
import { useStore } from 'vuex';
import { encrypt } from '@utils/encrypt';
import { checkUserName, login, register } from '@service/user';
import message from '@src/utils/message';

defineEmits<{ (e: 'close'): void }>();

const store = useStore();

const ruleFormRef = ref();
const userForm = ref({ userName: '', password: '', checkPassword: '' });
const isLogin = ref(true);

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
  const { userName, password } = userForm.value;
  let errMsg = '';
  if (isLogin.value) {
    errMsg = await login(userName, encrypt(password));
  } else {
    errMsg = await register(userName, encrypt(password));
  }
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
    title="Lanis"
    :width="600"
    class="login-dialog"
    append-to-body
    :close-on-click-modal="false"
    destroy-on-close
    :before-close="() => $emit('close')"
    align-center
  >
    <template #header>
      <!-- <img src="/api/lanis-logo.webp" alt="" /> -->
      <div class="lanis-logo"></div>
    </template>
    <div class="flex justify-between gap-6">
      <el-form ref="ruleFormRef" :model="userForm" :rules="publishRules" label-width="0" size="default" class="flex-1">
        <el-form-item label="" prop="userName">
          <el-input v-model="userForm.userName" placeholder="用户名" size="large" />
        </el-form-item>
        <el-form-item label="" prop="password" style="margin: 30px 0">
          <el-input v-model="userForm.password" placeholder="密码" size="large" type="password" autocomplete="off">
            <template v-if="isLogin" #suffix>
              <el-button link>忘记密码</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="!isLogin" label="" prop="checkPassword" style="margin: 30px 0">
          <el-input v-model="userForm.checkPassword" placeholder="确认密码" size="large" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="w-full" @click="submitForm()" size="large">{{ isLogin ? '登录' : '注册' }}</el-button>
          <div class="flex justify-center mt-6 w-full">
            <span>{{ isLogin ? '没有' : '已有' }}账号，</span>
            <span @click="changeType" class="cursor-pointer text-indigo-500">去{{ isLogin ? '注册' : '登录' }}</span>
          </div>
        </el-form-item>
      </el-form>
      <div class="flex flex-col w-5/12">
        <img :src="`/api/${isLogin ? 'login' : 'register'}.webp`" alt="" />
        <p class="text-center mt-3">Lanis 个人博客网</p>
      </div>
    </div>
  </el-dialog>
</template>
<style>
.login-dialog {
  @apply rounded-lg !important;
}

.login-dialog .el-dialog__body {
  @apply pl-6 pt-8 pr-2 pb-6 border-t overflow-hidden !important;
}
</style>
