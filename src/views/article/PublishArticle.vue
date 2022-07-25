<script lang='ts'>
import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
  name: 'PublishArticle',
  props: ['initValue'],
  emits: ['publish', 'close'],
  setup(props, { emit }) {
    // 分类
    const categoryList = [
      {
        key: 'front-dev',
        title: '前端',
      },
      {
        key: 'backend-dev',
        title: '后端',
      },
    ];
    // 标签
    const tagList = [
      {
        key: 'js',
        title: 'JavaScript',
      },
      {
        key: 'vue',
        title: 'Vue.js',
      },
      {
        key: 'react',
        title: 'React.js',
      },
      {
        key: 'css',
        title: 'CSS',
      },
      {
        key: 'node',
        title: 'Node.js',
      },
      {
        key: 'ts',
        title: 'TypeScript',
      },
    ];
    const ruleFormRef = ref();
    // 发布信息form
    const publishForm = reactive(props.initValue);
    // form规则
    const publishRules = reactive({
      category: [{ required: true, message: '请选择一个分类', trigger: 'blur' }],
      tags: [{ required: true, message: '请选择一个标签', trigger: 'blur' }],
    });

    // 是否预览已上传的文章封面图
    const isPreview = ref(false);
    // 已上传的文章封面图预览地址
    const previewUrl = ref();

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
        emit("publish", { ...publishForm });
      }
    };

    return {
      categoryList,
      tagList,
      ruleFormRef,
      publishForm,
      publishRules,
      isPreview,
      previewUrl,
      handlePreview,
      handleChange,
      handleRemove,
      submitForm,
    };
  },
});
</script>

<template>
  <div class='publish-article' @click.stop='() => {}'>
    <h1 class='font-bold text-lg w-full p-4 border-b'>发布文章</h1>
    <div class='form py-4 pr-20'>
      <el-form ref='ruleFormRef' :model='publishForm' :rules='publishRules' label-width='120px'>
        <el-form-item label='分类' prop='category'>
          <el-select v-model='publishForm.category' clearable placeholder='请选择分类'>
            <el-option v-for='category in categoryList' :key='category.key' :label='category.title' :value='category.key' />
          </el-select>
        </el-form-item>
        <el-form-item label='标签' prop='tags'>
          <el-select v-model='publishForm.tags' multiple :multiple-limit='3' clearable placeholder='请选择标签'>
            <el-option v-for='tag in tagList' :key='tag.key' :label='tag.title' :value='tag.key'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='封面'>
          <el-upload
            :class='{ isUpload: publishForm.cover?.length }'
            list-type='picture-card'
            :on-change='handleChange'
            :on-preview='handlePreview'
            :on-remove='handleRemove'
            :limit='1'
            action='#'
            :auto-upload='false'
            :file-list='publishForm.cover'
          >
            <div class='flex flex-col'>
              <i class='iconfont icon-plus text-center'></i>
              <span class='text-sm text-gray-400'>上传封面</span>
            </div>
          </el-upload>
          <el-dialog v-model='isPreview'>
            <img w-full :src='previewUrl' alt='Preview Image' />
          </el-dialog>
        </el-form-item>
        <el-form-item label='摘要' prop='summary'>
          <el-input v-model='publishForm.summary' :rows='5' resize='none' maxlength='100' show-word-limit type='textarea' placeholder='请输入文章摘要...' />
        </el-form-item>
        <el-form-item>
          <el-button @click='() => $emit("close")'>取消</el-button>
          <el-button type='primary' @click='submitForm(ruleFormRef)'>确定发布</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style>
.publish-article {
  @apply absolute top-14 right-0 z-10 bg-white rounded-sm;
  width: 600px;
  box-shadow: 1px 1px 10px -2px #ddd;
  border: 1px solid #ddd;
}

.publish-article .el-form-item__content > div {
  width: 100%;
}

.publish-article .isUpload .el-upload-list .el-upload {
  display: none;
}
</style>