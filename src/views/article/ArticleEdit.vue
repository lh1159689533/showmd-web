<script lang='ts'>
import { defineComponent, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import PublishArticle from './PublishArticle.vue';
import { findById, saveArticle } from './article';
import storage from '@utils/storage';
import { ElMessage as message } from "element-plus";

export default defineComponent({
  name: 'PageEdit',
  components: { PublishArticle },
  props: {
    id: String,
  },
  setup(props) {
    const articleName = ref('');
    const articleContent = ref('');
    const isShowEditor = ref(false);
    const isShowPublish = ref(false);
    const router = useRouter();

    const initPublishForm = reactive({
      name: '',
      content: '',
      category: '',
      tags: [],
      summary: '',
      cover: [],
    });

    if (props.id) {
      // 编辑文章,获取文章内容
      findById(props.id).then((res) => {
        if (!res) {
          return message.error('文章不存在');
        }
        articleName.value = res.name;
        articleContent.value = decodeURIComponent(res.content);
        isShowEditor.value = true;
        initPublishForm.category = res.category;
        initPublishForm.tags = res.tags?.split(',');
        initPublishForm.summary = res.summary;
        initPublishForm.cover = [res.cover];
      });
    } else {
      isShowEditor.value = true;
    }

    // 隐藏发布窗
    const hidePublish = () => {
      setTimeout(() => (isShowPublish.value = false), 100);
    };

    // 显示发布窗
    const showPublish = () => {
      function hide() {
        hidePublish();
        document.removeEventListener('click', hide);
      }
      if (isShowPublish.value) {
        hidePublish();
      } else {
        isShowPublish.value = true;
        // 点击其他区域隐藏
        document.addEventListener('click', hide);
      }
    };

    // 文章内容变化
    const onChange = (value) => {
      initPublishForm.summary = value
        .replace(/\s+/g, ' ')
        .replace(/[^a-zA-Z0-9\s]+/g, '')
        .substr(0, 100);
      initPublishForm.content = value;
    };

    // 发布
    const onPublish = async (article) => {
      article.name = articleName.value;
      article.userId = 1;
      article.content = encodeURIComponent(article.content);
      article.tags = article.tags?.join(',');
      const formData = new FormData();
      if (article.cover.length) {
        formData.append('cover', article.cover[0].raw);
      }
      formData.append('article', JSON.stringify(article));
      const result = await saveArticle(formData);
      if (result) {
        storage.setJson('publishedArticle', { ...article, id: result });
        message.success('文章发布成功');
        router.push('/published');
      }
    };

    return {
      articleName,
      articleContent,
      isShowPublish,
      showPublish,
      hidePublish,
      onChange,
      onPublish,
      initPublishForm,
      isShowEditor,
    };
  },
});
</script>

<template>
  <div id='myEditor' class='flex flex-col'>
    <div class='tool flex items-center p-3 px-8 bg-white'>
      <input v-model='articleName' placeholder='请输入文章标题...' class='flex-1 border-0 bg-transparent shadow-none font-bold text-2xl focus:outline-none' />
      <div class='rightGroups flex py-1 relative'>
        <el-button>草稿箱</el-button>
        <el-button type='primary' @click.stop='showPublish'>发布</el-button>
        <PublishArticle v-show='isShowPublish' :init-value='initPublishForm' @publish='onPublish' @close='hidePublish' />
      </div>
    </div>
    <Editor v-if='isShowEditor' :value='articleContent' @change='onChange' />
  </div>
</template>

<style scope>
</style>
