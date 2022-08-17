<script lang='ts'>
import { defineComponent, ref } from 'vue';
import dayjs from 'dayjs';
import { findById } from '../../service/article';
import { ElMessage as message } from 'element-plus';

export default defineComponent({
  name: 'ArticlePreview',
  props: {
    id: String,
  },
  setup(props) {
    const article = ref(null);
    const loading = ref(true);

    async function getArticle() {
      if (props.id) {
        // 编辑文章,获取文章内容
        const result = await findById(props.id);
        if (!result) {
          return message.error('文章不存在');
        }
        article.value = {
          ...result,
          content: decodeURIComponent(result.content),
          createTime: dayjs(result.createTime).format('YYYY年MM月DD日 HH:mm'),
          updateTime: dayjs(result.updateTime).format('YYYY年MM月DD日 HH:mm')
        };
        setTimeout(() => (loading.value = false), 1000);
      }
    }

    getArticle();

    return {
      article,
      loading,
    };
  },
});
</script>

<template>
  <div class='container m-auto mt-4'>
    <div v-show='loading' style='width: calc(100% - 260px);height:100vh;' class='bg-white p-6'>
      <el-skeleton animated>
        <template #template>
          <el-skeleton-item variant='h1' style='width: 300px; height: 30px;' />
          <div style='display:flex;align-items:center'>
            <el-skeleton-item variant='circle' style='width:45px; height:45px; margin-top:6px' />
            <div style='padding:0 0 0 8px;'>
              <el-skeleton-item variant='text' style='width:100px; height:12px' />
              <el-skeleton-item variant='text' style='display:block; width:180px; height:16px' />
            </div>
          </div>
          <el-skeleton-item variant='rect' style='width:80%; height:380px; margin-top:20px' />
        </template>
      </el-skeleton>
    </div>
    <PreviewEditor v-show='!loading' :data='article' />
  </div>
</template>

<style scope>
</style>
