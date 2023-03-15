<script lang="ts" setup>
import { ref, reactive, defineProps, defineEmits, watchEffect } from 'vue';
import message from '@utils/message';
import { findById, saveColumn } from '@service/column';

interface IColumnForm {
  id?: number;
  name?: string;
  desc?: string;
  type?: string;
  cover?: any[];
}

const props = defineProps<{
  visible: boolean;
  id?: number;
}>();
const emit = defineEmits<{ (e: 'close'): void; (e: 'confirm'): void }>();

const columnForm = reactive<IColumnForm>({});
// form规则
const publishRules = reactive({
  name: [{ required: true, message: '请输入专栏名称', trigger: 'blur' }],
  desc: [{ required: true, message: '请输入专栏简介', trigger: 'blur' }],
});
// 是否预览已上传的文章封面图
const isPreview = ref(false);
// 已上传的文章封面图预览地址
const previewUrl = ref();
const ruleFormRef = ref();

watchEffect(async () => {
  if (props.id && props.visible) {
    const column = await findById(props.id);
    const { id, name, desc, isPrivate, cover } = column;
    columnForm.id = id;
    columnForm.name = name;
    columnForm.desc = desc;
    columnForm.type = isPrivate ? '私有' : '公开';
    columnForm.cover = cover ? [cover] : [];
  } else {
    columnForm.id = null;
    columnForm.name = '';
    columnForm.desc = '';
    columnForm.type = '公开';
    columnForm.cover = [];
  }
});

// 隐藏预览
const handlePreview = ({ url }) => {
  isPreview.value = !isPreview.value;
  previewUrl.value = url;
};

// 上传文章封面
const handleChange = (file) => {
  columnForm.cover = [file];
};

// 删除文章封面
const handleRemove = () => {
  columnForm.cover = [];
};

const submitForm = async (formEl) => {
  const isValidte = await formEl.validate();
  if (isValidte) {
    const { type, cover } = columnForm;
    const column = {
      ...columnForm,
      cover: cover?.[0],
      isPrivate: type === '私有',
      userId: 1,
      coverMark: 'changed',
    };
    const formData = new FormData();
    if (column.cover) {
      const coverFile = column.cover.raw ?? column.cover;
      if (coverFile instanceof File) {
        formData.append('cover', coverFile);
      } else {
        column.coverMark = 'noChange';
      }
    } else {
      column.coverMark = 'deleted';
    }
    formData.append('column', JSON.stringify(column));
    const result = await saveColumn(formData);
    if (result) {
      emit('confirm');
      message.success(column.id ? '更新成功' : '新建成功');
    } else {
      message.error(column.id ? '更新失败' : '新建失败');
    }
  }
};
</script>

<template>
  <el-drawer
    :model-value="visible"
    :title="columnForm?.id ? '修改专栏' : '新建专栏'"
    direction="rtl"
    :close-on-click-modal="false"
    :before-close="() => $emit('close')"
    destroy-on-close
    :size="600"
  >
    <el-form ref="ruleFormRef" :model="columnForm" :rules="publishRules" label-width="120px">
      <el-form-item label="专栏名称" prop="name">
        <el-input v-model="columnForm.name" placeholder="请输入专栏名称" />
      </el-form-item>
      <el-form-item label="专栏简介" prop="desc">
        <el-input v-model="columnForm.desc" :rows="5" resize="none" maxlength="100" show-word-limit type="textarea" placeholder="请输入专栏简介..." />
      </el-form-item>
      <el-form-item label="专栏封面">
        <el-upload
          :class="{ isUpload: columnForm.cover?.length }"
          list-type="picture-card"
          :on-change="handleChange"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :limit="1"
          action="#"
          :auto-upload="false"
          :file-list="columnForm.cover"
        >
          <div class="flex flex-col">
            <i class="iconfont icon-plus text-center"></i>
            <span class="text-sm text-gray-400">上传封面</span>
          </div>
        </el-upload>
        <el-dialog v-model="isPreview">
          <img w-full :src="previewUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="是否公开" prop="type">
        <el-radio-group v-model="columnForm.type" @change="(val) => (columnForm.type = val)" size="small">
          <el-radio-button label="公开" />
          <el-radio-button label="私有" />
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
      <el-button @click="() => $emit('close')">取消</el-button>
    </template>
  </el-drawer>
</template>

<style>
.isUpload .el-upload-list .el-upload {
  display: none;
}
</style>
