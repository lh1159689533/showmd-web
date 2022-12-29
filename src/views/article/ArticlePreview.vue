<script lang='ts'>
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
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
    const router = useRouter();

    const commentDom = ref(null);

    const article = ref(null);
    const loading = ref(true);
    const isShowToTop = ref(false); // 是否显示回到顶部按钮

    const commentData = computed(() => store.state.comment.commentData);
    const currentUser = computed(() => store.getters.getUser);

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

    // 跳转到评论
    const toComment = () => {
      commentDom.value?.scrollIntoView({ block: 'start' });
    };

    // 编辑
    const toEdit = () => {
      router.push(`/article/edit/${props.id}`);
    };

    // 置顶
    const toTop = () => {
      document.documentElement.scrollTop = 0;
    };

    init();

    return {
      article,
      loading,
      commentData,
      currentUser,
      commentDom,
      isShowToTop,
      toComment,
      toEdit,
      toTop
    };
  },
});
</script>

<template>
  <Header />
  <div class='container mt-16 relative z-100'>
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
    <ul class='action-box fixed -ml-24 top-40'>
      <li @click='toComment'>
        <el-badge :value='commentData?.count || ""' type='info' :max='999'>
          <div class='w-10 h-10 flex justify-center items-center bg-white rounded-full cursor-pointer'>
            <i class='iconfont icon-reply text-gray-600'></i>
          </div>
        </el-badge>
      </li>
      <li @click='toEdit' v-show='currentUser?.id === article?.user?.id && isShowToTop' class='edit mt-6'>
        <div class='w-10 h-10 flex justify-center items-center bg-white rounded-full cursor-pointer'>
          <i class='iconfont icon-bianji text-gray-600'></i>
        </div>
      </li>
    </ul>
    <MDPreview v-show='!loading' :data='article' :is-edit='currentUser?.id === article?.user?.id' @onToTop='(isShow: boolean) => isShowToTop = isShow' />
    <div
      ref='commentDom' class='comment px-10 py-2 bg-white border-t pb-16 rounded-md mb-12'
      style='width: calc(100% - 260px);'
    >
      <Comment :data='commentData' />
    </div>
    <div class='oprate flex flex-col fixed right-36 bottom-20'>
      <div
        id='toTop' v-show='isShowToTop' @click='toTop'
        class='w-8 h-8 bg-white flex justify-center items-center rounded-full cursor-pointer'
      >
        <i title='回到顶部' class='absolute w-4 h-4' />
      </div>
    </div>
  </div>
  <CanvasBG v-show='!loading' class='fixed w-screen h-screen top-0 left-0' />
</template>

<style>
.action-box .el-badge__content--info {
  background-color: #9ca3af !important;
}

.action-box .edit {
  animation: bounceIn 600ms;
}

#toTop>i {
  background-size: 100%;
  background-repeat: no-repeat;
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjUyMjcxMDM2MjcwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjU0ODciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+QGZvbnQtZmFjZSB7IGZvbnQtZmFtaWx5OiBmZWVkYmFjay1pY29uZm9udDsgc3JjOiB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTAzMTE1OF91Njl3OHloeGR1LndvZmYyP3Q9MTYzMDAzMzc1OTk0NCIpIGZvcm1hdCgid29mZjIiKSwgdXJsKCIvL2F0LmFsaWNkbi5jb20vdC9mb250XzEwMzExNThfdTY5dzh5aHhkdS53b2ZmP3Q9MTYzMDAzMzc1OTk0NCIpIGZvcm1hdCgid29mZiIpLCB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTAzMTE1OF91Njl3OHloeGR1LnR0Zj90PTE2MzAwMzM3NTk5NDQiKSBmb3JtYXQoInRydWV0eXBlIik7IH0KPC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTgzMiA2NEgxOTJjLTE3LjYgMC0zMiAxNC40LTMyIDMyczE0LjQgMzIgMzIgMzJoNjQwYzE3LjYgMCAzMi0xNC40IDMyLTMycy0xNC40LTMyLTMyLTMyek04NTIuNDg0IDUxOS40NjlMNTM4LjU5MiAyMDUuNTc3YTMwLjc5IDMwLjc5IDAgMCAwLTMuNjkzLTQuNDc2Yy02LjI0MS02LjI0MS0xNC41NTYtOS4yNTgtMjIuODk5LTkuMDktOC4zNDMtMC4xNjgtMTYuNjU4IDIuODQ5LTIyLjg5OSA5LjA5YTMwLjc3OCAzMC43NzggMCAwIDAtMy42OTMgNC40NzZMMTcxLjQxOSA1MTkuNTY2QzE2NC40NDkgNTI1LjQ0OCAxNjAgNTM0LjIyOCAxNjAgNTQ0YzAgMC4wNTggMC4wMDQgMC4xMTUgMC4wMDQgMC4xNzItMC4xMjQgOC4yODUgMi44OTkgMTYuNTI5IDkuMDk2IDIyLjcyNyA2LjIwMiA2LjIwMiAxNC40NTMgOS4yMjQgMjIuNzQzIDkuMDk2IDAuMDY2IDAgMC4xMzEgMC4wMDUgMC4xOTcgMC4wMDVIMzUydjMyMGMwIDM1LjIgMjguOCA2NCA2NCA2NGgxOTJjMzUuMiAwIDY0LTI4LjggNjQtNjRWNTc2aDE2MGMwLjA1OCAwIDAuMTE1LTAuMDA0IDAuMTcyLTAuMDA0IDguMjg1IDAuMTI0IDE2LjUyOS0yLjg5OSAyMi43MjctOS4wOTYgNi4xOTgtNi4xOTggOS4yMi0xNC40NDIgOS4wOTYtMjIuNzI3IDAtMC4wNTggMC4wMDQtMC4xMTUgMC4wMDQtMC4xNzIgMC4wMDEtOS44MjYtNC40ODktMTguNjUtMTEuNTE1LTI0LjUzMnoiIHAtaWQ9IjU0ODgiPjwvcGF0aD48L3N2Zz4=);
}

#toTop {
  box-shadow: 0px 1px 8px -5px #555;
  animation: bounceInUp 600ms;
}

#toTop:hover {
  box-shadow: 0px 1px 8px -2px #555;
}
</style>
