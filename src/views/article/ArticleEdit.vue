<script lang="ts" setup>
import { defineProps, ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { confirm } from '@utils/messageBox';
import message from '@utils/message';
import PublishArticle from './ArticlePublish.vue';
import storage from '@utils/storage';
import { findById, saveArticle, ICover } from '@service/article';
import { listContentTheme, listCodeTheme } from '@service/theme';
import { findByArticleId } from '@service/column';
import Catalog from '@components/Editor/Catalog.vue';
import CatalogNew from '@components/Editor/CatalogNew.vue';
import TUIEditor from '@components/Editor/TUIEditor.vue';
import RTEditor from '@components/Editor/RTEditor.vue';

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
  columnId?: number;
}

type EditorType = 'markdown' | 'richtext';

const router = useRouter();
const store = useStore();

const props = defineProps<{
  id?: string | null;
}>();

const currentUser = ref();

const isShowEditor = ref(false);
const isShowPublish = ref(false);
const contentThemeList = ref([]);
const codeThemeList = ref([]);
const editorType = ref<EditorType>('markdown');
const wordCount = ref(0);

// 富文本编辑器缩放相关
const editorRef = ref();
const scale = ref(100);

// const storageKey = props.id ? `update-article-${props.id}` : 'create-article';
const storageKey = computed(() => (props.id ? `update-article-${editorType.value}-${props.id}` : `create-article-${editorType.value}`));

const article = ref<IArticle>({
  name: '',
  content: '',
  category: '',
  tags: '',
  summary: '',
  cover: [],
  contentTheme: 'Chinese-red',
  codeTheme: 'github',
  columnId: null,
});

const initPublishForm = reactive({
  category: '',
  tags: [],
  summary: '',
  cover: [],
  columnId: null,
});

const getCurrentUser = async () => {
  currentUser.value = await store.dispatch('getUserInfo');
};

const getArticle = async () => {
  if (props.id) {
    // 编辑文章,获取文章内容
    const data = await findById(+props.id);
    if (!data) {
      return message.error('文章不存在');
    }
    const column = await findByArticleId(+props.id);
    article.value = {
      ...data,
      content: decodeURIComponent(data.content),
      cover: data.cover ? [data.cover] : [],
      columnId: column?.id,
    };
    initPublishForm.category = data.category;
    initPublishForm.tags = data.tags.split(',');
    initPublishForm.cover = data.cover ? [data.cover] : [];
    initPublishForm.summary = data.summary;
    initPublishForm.columnId = column?.id;
    editorType.value = data?.editorType === 1 ? 'markdown' : 'richtext';
  } else {
    const type = sessionStorage.getItem('editor-type') ?? 'markdown';
    editorType.value = type as EditorType;
  }
  if (storage.getJson(storageKey.value)) {
    article.value = {
      ...article.value,
      ...storage.getJson(storageKey.value),
    };
  }
  editorType.value === 'markdown' && (await getTheme());
  isShowEditor.value = true;
};

const getTheme = async () => {
  contentThemeList.value = await listContentTheme();
  codeThemeList.value = await listCodeTheme();
};

async function init() {
  getCurrentUser();
  await getArticle();
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
    if (!props.id) {
      const text = editorRef.value.getText();
      console.log('text:', text);
      initPublishForm.summary = text?.replace(/\s+/g, ' ').substr(0, 100);
    }
    isShowPublish.value = true;
    // 点击其他区域隐藏
    document.addEventListener('click', hide);
  }
};

// 文章内容变化
const onChange = (value, textValue = '') => {
  if (editorType.value === 'markdown') {
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
  } else {
    wordCount.value = textValue.replace(/\s+/g, '')?.length;

    article.value.content = value.content;
    article.value.name = value.name;
    article.value.contentTheme = '';
    article.value.codeTheme = '';
  }
  storage.setJson(storageKey.value, article.value);
};

// 发布
const onPublish = async (art) => {
  art = {
    ...article.value,
    ...art,
    // userId: 1,
    content: encodeURIComponent(article.value.content),
    tags: art.tags?.join(','),
    coverMark: 'changed',
    editorType: editorType.value === 'markdown' ? 1 : 2, // 1 markdown, 2 richtext
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
    // message.success('文章发布成功');
    router.push('/published');
    storage.remove(storageKey.value);
  }
};

const changeEditorType = (type: EditorType) => {
  confirm('切换写作模式后，当前内容不会迁移。', `切换为${type === 'markdown' ? 'Markdown编辑器' : '富文本编辑器'}`, {
    callback(action) {
      if (action === 'confirm') {
        sessionStorage.setItem('editor-type', type);
        location.reload();
      }
    },
  });
};

/**
 * 富文本编辑器缩放
 * @param type 缩放的比例值或缩放类型(- 缩小, + 放大)
 */
const editorScale = (type: number | string) => {
  let currScale = 0;
  if (typeof type === 'number') {
    currScale = type;
  } else {
    currScale = type === '+' ? scale.value + 5 : scale.value - 5;
  }
  if (currScale <= 150 && currScale >= 50) {
    scale.value = currScale;
    editorRef.value.scaleEditor(scale.value / 100);
  }
};

onMounted(() => {
  document.documentElement.classList.remove(document.documentElement.classList.item(0));
});

init();
</script>

<template>
  <div v-if="editorType === 'markdown'" class="h-screen">
    <div class="tool flex items-center p-3 px-8 bg-white">
      <input
        v-model="article.name" placeholder="请输入文章标题..."
        class="flex-1 border-0 bg-transparent shadow-none font-bold text-2xl focus:outline-none"
      />
      <div class="rightGroups flex py-1 relative items-center">
        <!-- <el-button>草稿箱</el-button> -->
        <el-button type="primary" @click.stop="showPublish">{{ id ? '更新' : '发布' }}</el-button>
        <el-tooltip v-if="!props.id" content="切换为富文本编辑器" effect="light">
          <i
            @click="() => changeEditorType('richtext')"
            class="iconfont icon-qiehuan ml-4 text-xl cursor-pointer hover:text-indigo-600"
          />
        </el-tooltip>
        <Avatar :src="currentUser?.avatar" class="w-7 h-7 rounded-full cursor-pointer ml-6" />
      </div>
    </div>
    <TUIEditor
      ref="editorRef" v-if="isShowEditor"
      :data="{ content: article?.content, contentTheme: article?.contentTheme, codeTheme: article?.codeTheme }"
      :content-theme-list="contentThemeList" :code-theme-list="codeThemeList" @change="onChange"
    >
      <template #default="{ catalogList }">
        <CatalogNew v-if="catalogList?.length" :data="catalogList" :threshold="110" />
      </template>
    </TUIEditor>
  </div>
  <div v-if="editorType === 'richtext'" class="h-screen">
    <div style="height: calc(100vh - 58px)">
      <RTEditor
        ref="editorRef" v-if="isShowEditor" :data="{ name: article.name, content: article?.content }"
        @on-change="onChange"
      >
        <template #default="{ catalogList }">
          <Catalog v-if="catalogList?.length" :data="catalogList" :threshold="60" />
        </template>
      </RTEditor>
    </div>
    <div class="relative h-14 bg-white border-t px-6">
      <div class="flex py-1 items-center justify-between container h-full">
        <div class="left">
          <span class="text-sm">共 {{ wordCount }} 字</span>
        </div>
        <div class="right flex">
          <!-- <el-button>草稿箱</el-button> -->
          <div class="scale-editor flex items-center gap-2 text-sm mr-6">
            <i
              @click="() => editorScale('-')" class="iconfont icon-jianhao text-sm"
              :class="[scale === 50 ? 'cursor-not-allowed' : 'cursor-pointer']"
            ></i>
            <el-dropdown trigger="click" @command="(command) => editorScale(command)">
              <span class="text-xs text-gray-500 w-8 text-center">{{ scale }}%</span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="item in [50, 75, 100, 125, 150]" :key="item" :command="item"
                    :class="[scale === item ? 'scale-active' : '']"
                  >
                    {{ item }}%
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <i
              @click="() => editorScale('+')" class="iconfont icon-jiahao text-sm"
              :class="[scale === 150 ? 'cursor-not-allowed' : 'cursor-pointer']"
            ></i>
          </div>
          <el-button type="primary" @click.stop="showPublish">{{ id ? '更新' : '发布' }}</el-button>
          <el-tooltip content="切换为Markdown编辑器" effect="light" placement="top">
            <i
              @click="() => changeEditorType('markdown')"
              class="iconfont icon-qiehuan ml-4 text-xl cursor-pointer hover:text-indigo-600"
            />
          </el-tooltip>
          <Avatar :src="currentUser?.avatar" class="w-7 h-7 rounded-full cursor-pointer ml-6" />
        </div>
      </div>
    </div>
  </div>
  <PublishArticle
    v-show="isShowPublish" :init-value="initPublishForm"
    :placement="editorType === 'markdown' ? 'top-right' : 'bottom-right'" @publish="onPublish" @close="hidePublish"
  />
</template>

<style scope>
.scale-active {
  color: var(--el-color-primary) !important;
  background-color: var(--el-color-primary-light-9) !important;
}
</style>
