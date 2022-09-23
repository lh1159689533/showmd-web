<script lang='ts'>
import { defineComponent, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage as message } from 'element-plus';
import PublishArticle from './ArticlePublish.vue';
import storage from '@utils/storage';
import { findById, saveArticle, ICover } from '@service/article';
import { listContentTheme, listCodeTheme } from '@service/theme';

interface IArticle {
  id?: number;
  name?: string;
  content?: string;
  category?: string;
  tags?: string;
  summary?: string;
  cover?: ICover[];
  contentTheme?: string;
  codeTheme?: string;
}

export default defineComponent({
  name: 'ArticleEdit',
  components: { PublishArticle },
  props: {
    id: String,
  },
  setup(props) {
    const router = useRouter();

    const isShowEditor = ref(false);
    const isShowPublish = ref(false);
    const contentThemeList = ref([]);
    const codeThemeList = ref([]);

    const storageKey = props.id ? `update-article-${props.id}` : 'create-article';

    const article = ref<IArticle>({
      name: '',
      content: '',
      category: '',
      tags: '',
      summary: '',
      cover: [],
      contentTheme: 'Chinese-red',
      codeTheme: 'github',
    });

    const initPublishForm = reactive({
      category: '',
      tags: [],
      summary: '',
      cover: [],
    });

    async function init() {
      contentThemeList.value = await listContentTheme();
      codeThemeList.value = await listCodeTheme();
      if (props.id) {
        // 编辑文章,获取文章内容
        const data = await findById(props.id);
        if (!data) {
          return message.error('文章不存在');
        }
        article.value = {
          ...data,
          content: decodeURIComponent(data.content),
          cover: data.cover ? [data.cover] : [],
        };
        initPublishForm.category = data.category;
        initPublishForm.tags = data.tags.split(',');
        initPublishForm.cover = data.cover ? [data.cover] : [];
        initPublishForm.summary = data.summary;
        isShowEditor.value = true;
      } else {
        isShowEditor.value = true;
      }
      if (storage.getJson(storageKey)) {
        article.value = {
          ...article.value,
          ...storage.getJson(storageKey)
        };
      }
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
      if (value.content) {
        article.value.summary = value.content
          .replace(/\s+/g, ' ')
          .replace(/[^a-zA-Z0-9\s]+/g, '')
          .substr(0, 100);
        article.value.content = value.content;
      } else if (value.contentTheme) {
        article.value.contentTheme = value.contentTheme;
      } else if (value.codeTheme) {
        article.value.codeTheme = value.codeTheme;
      }
      storage.setJson(storageKey, article.value);
    };

    // 发布
    const onPublish = async (art) => {
      console.log('art:', art);
      art = {
        ...article.value,
        ...art,
        userId: 1,
        content: encodeURIComponent(article.value.content),
        tags: art.tags?.join(','),
        coverMark: 'changed',
      };
      const formData = new FormData();
      if (art.cover?.length) {
        const coverFile = art.cover[0].raw ?? art.cover[0];
        if (coverFile instanceof File) {
          formData.append('cover', coverFile);
        } else {
          art.coverMark = 'noChange';
        }
      } else {
        art.coverMark = 'deleted';
      }
      formData.append('article', JSON.stringify(art));
      const result = await saveArticle(formData);
      if (result) {
        storage.setJson('publishedArticle', { ...art, id: result });
        message.success('文章发布成功');
        router.push('/published');
        storage.remove(storageKey);
      }
    };

    init();

    return {
      article,
      isShowPublish,
      showPublish,
      hidePublish,
      onChange,
      onPublish,
      isShowEditor,
      contentThemeList,
      codeThemeList,
      initPublishForm,
    };
  },
});
</script>

<template>
  <div class='flex flex-col'>
    <div class='tool flex items-center p-3 px-8 bg-white'>
      <input v-model='article.name' placeholder='请输入文章标题...' class='flex-1 border-0 bg-transparent shadow-none font-bold text-2xl focus:outline-none' />
      <div class='rightGroups flex py-1 relative'>
        <el-button>草稿箱</el-button>
        <el-button type='primary' @click.stop='showPublish'>{{ id ? '更新' : '发布' }}</el-button>
        <PublishArticle v-show='isShowPublish' :init-value='initPublishForm' @publish='onPublish' @close='hidePublish' />
      </div>
    </div>
    <MDEditorIR v-if='isShowEditor' :data='article' :content-theme-list='contentThemeList' :code-theme-list='codeThemeList' @change='onChange' />
  </div>
</template>

<style scope>
</style>
