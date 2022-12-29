<script lang='ts'>
import { defineComponent, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import storage from '@utils/storage';

export default defineComponent({
  name: 'Published',
  setup() {
    const router = useRouter();
    const article = reactive({ id: '', name: '' });

    onMounted(() => {
      const { id, name } = storage.getJson('publishedArticle');
      article.id = id;
      article.name = name;
      storage.remove('publishedArticle');
    });

    const toEdit = () => {
      router.push(`/article/edit/${article.id}`);
    };

    const toPreview = () => {
      router.push(`/article/preview/${article.id}`);
    };

    return {
      article,
      toEdit,
      toPreview,
    };
  },
});
</script>

<template>
  <div class='published px-10 py-8 flex flex-col items-center'>
    <span>发布成功！感谢你的分享。</span>
    <div class='mt-8'>
      <el-button type='primary' @click='toEdit'>返回编辑</el-button>
      <el-button @click='toPreview'>预览</el-button>
    </div>
  </div>
</template>

<style scoped>

</style>
