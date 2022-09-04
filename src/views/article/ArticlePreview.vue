<script lang='ts'>
import { computed, defineComponent, ref } from 'vue';
import dayjs from 'dayjs';
import { useStore } from 'vuex';
import { ElMessage as message } from 'element-plus';
import Header from '@src/views/main/Header.vue';
import { findById } from '@service/article';

export default defineComponent({
  name: 'ArticlePreview',
  components: { Header },
  props: {
    id: String,
  },
  setup(props) {
    const store = useStore();

    const article = ref(null);
    const loading = ref(true);

    const commentData = computed(() => store.state.comment.commentData);
    const currentUser = computed(() => store.state.user.user);

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
          updateTime: dayjs(result.updateTime).format('YYYY年MM月DD日 HH:mm'),
        };

        if (result.user) {
          store.commit('setArticleAuthor', result.user);
        }

        setTimeout(() => (loading.value = false), 1000);
      }
    }

    async function init() {
      if (props.id) {
        await getArticle();
        store.dispatch('listComment', props.id);
      }
    }

    init();

    return {
      article,
      loading,
      commentData,
      currentUser,
    };
  },
});
</script>

<template>
  <Header />
  <div class='container m-auto mt-4 relative z-100'>
    <div v-if='loading' style='width: calc(100% - 260px);height:100vh;' class='bg-white p-6'>
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
    <MDPreview v-show='!loading' :data='article' :is-edit='currentUser?.id === article?.user?.id' />
    <div class='comment px-10 py-2 bg-white border-t pb-16' style='width: calc(100% - 260px);'>
      <Comment :data='commentData' />
    </div>
  </div>
  <CanvasBG v-show='!loading' class='fixed w-screen h-screen top-0 left-0' />
</template>

<style scope>
</style>
