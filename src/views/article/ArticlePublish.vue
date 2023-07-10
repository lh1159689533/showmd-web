<script lang="ts" setup>
import { defineProps, defineEmits, reactive, ref, watchEffect } from 'vue';
import { listCategory } from '@service/category';

interface IPublishForm {
  category?: string;
  tags?: string[];
  summary?: string;
  cover?: File[];
  columnId?: number;
}

const props = defineProps<{ initValue: IPublishForm; placement?: 'top-right' | 'bottom-right' }>();
const emit = defineEmits<{ (e: 'publish', value: IPublishForm): void; (e: 'close'): void }>();

const cloumnList = ref([]);
const categoryAllList = ref([]);
const categoryList = ref([]);
const subCategoryList = ref([]);
const ruleFormRef = ref();
// 是否预览已上传的文章封面图
const isPreview = ref(false);
// 已上传的文章封面图预览地址
const previewUrl = ref();
// 发布信息form
const publishForm = reactive<IPublishForm>(props.initValue);
// form规则
const publishRules = reactive({
  category: [{ required: true, message: '请选择一个分类', trigger: 'blur' }],
  tags: [{ required: true, message: '请选择一个标签', trigger: 'blur' }],
});

async function init() {
  categoryAllList.value = await listCategory();
  categoryList.value = categoryAllList.value.filter((c) => c.parent === '0' && c.key !== 'all');
  subCategoryList.value = categoryAllList.value.filter((c) => c.parent !== '0');
}

// 隐藏预览
const handlePreview = ({ url }) => {
  isPreview.value = !isPreview.value;
  previewUrl.value = url;
};

// 上传文章封面
const handleChange = (file) => {
  publishForm.cover = [file];
};

// 删除文章封面
const handleRemove = () => {
  publishForm.cover = [];
};

const submitForm = async (formEl) => {
  const value = await formEl.validate();
  if (value) {
    emit('publish', { ...publishForm });
  }
};

const onCategoryChang = (category) => {
  subCategoryList.value = categoryAllList.value.filter((c) => c.parent === category);
};

init();

watchEffect(() => {
  if (publishForm.category) {
    onCategoryChang(publishForm.category);
  }
});

// watchEffect(() => {
//   // if (props.userId) {
//   findListByUserId()
//     .then((data) => {
//       cloumnList.value = data ?? [];
//     })
//     .catch((e) => {
//       console.log('查询出错:', e);
//     });
//   // }
// });
</script>

<template>
  <div class="publish-article" :class="placement ?? 'top-right'" @click.stop="() => {}">
    <h3 class="w-full p-4 border-b">发布文章</h3>
    <div class="form py-4 pr-20">
      <el-form ref="ruleFormRef" :model="publishForm" :rules="publishRules" label-width="120px">
        <el-form-item label="分类" prop="category">
          <el-select v-model="publishForm.category" @change="onCategoryChang" clearable placeholder="请选择分类">
            <el-option v-for="category in categoryList" :key="category.key" :label="category.title" :value="category.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select v-model="publishForm.tags" multiple :multiple-limit="3" clearable placeholder="请选择标签">
            <el-option v-for="tag in subCategoryList" :key="tag.key" :label="tag.title" :value="tag.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专栏" prop="column">
          <el-select v-model="publishForm.columnId" placeholder="请选择专栏">
            <el-option v-for="column in cloumnList" :key="column.id" :label="column.name" :value="column.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面">
          <el-upload
            :class="{ isUpload: publishForm.cover?.length }"
            list-type="picture-card"
            :on-change="handleChange"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :limit="1"
            action="#"
            :auto-upload="false"
            :file-list="publishForm.cover"
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
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="publishForm.summary" :rows="5" resize="none" maxlength="100" show-word-limit type="textarea" placeholder="请输入文章摘要..." />
        </el-form-item>
        <el-form-item>
          <el-button @click="() => $emit('close')">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">确定发布</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style>
.publish-article {
  @apply absolute bg-white rounded-sm;
  width: 600px;
  box-shadow: 1px 1px 10px -2px #ddd;
  border: 1px solid #ddd;
  z-index: 2001;
}

.top-right {
  @apply top-14 right-0;
}

.bottom-right {
  @apply bottom-14 right-0;
}

.publish-article .el-form-item__content > div {
  width: 100%;
}

.publish-article .isUpload .el-upload-list .el-upload {
  display: none;
}
</style>
