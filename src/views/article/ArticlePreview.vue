<script lang='ts'>
import { defineComponent, ref } from 'vue';
import { findById } from '../../service/article';
import { ElMessage as message } from 'element-plus';

export default defineComponent({
  name: 'ArticlePreview',
  props: {
    id: String,
  },
  setup(props) {
    const article = ref(null);

    if (props.id) {
      // 编辑文章,获取文章内容
      findById(props.id).then((res) => {
        if (!res) {
          return message.error('文章不存在');
        }
        article.value = { ...res, content: decodeURIComponent(res.content) };
      });
    }

    return {
      article,
    };
  },
});
</script>

<template>
  <div class='container m-auto'>
    <PreviewEditor :data='article' />
  </div>
</template>

<style scope>
</style>
