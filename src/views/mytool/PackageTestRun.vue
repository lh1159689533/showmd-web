<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import message from '@utils/message';
import { isJson, isJsonString } from '@src/utils/type';
import storage from '@src/utils/storage';

import 'highlight.js/styles/github.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);

const inputDom = ref();
const history = ref([]); // 输入历史记录
const result = ref([]); // 输入语句执行结果
const current = ref(-1); // 当前历史记录坐标
const loading = ref('unload');
const loadedScriptList = ref<HTMLScriptElement[]>([]);
const inputPlaceholder = ref('输入包CDN地址，加载完成后，即可使用');

const storagePkgKey = 'storage-pkg';

const setValue = (value: string) => {
  inputDom.value.value = value;
};

/**
 * 回车时执行输入的语句，根据执行结果类型高亮显示，目前仅支持json和js
 * @example
 *  add(1,2) ---> new Function(`return _.add(1,2)`)，结果显示lodash add函数的执行结果
 *  add ---> new Function(`return _.add`)，结果显示lodash add函数的函数体
 */
const runCode = (value: string) => {
  const inputText = value.replace(/[\n\r\t]{0,}/, '');
  if (!inputText) return;

  history.value.unshift(inputText);
  current.value = -1;
  try {
    const fn = new Function(`return ${inputText}`);
    let fnResult = fn();
    let language = 'javascript';
    if ((typeof fnResult === 'string' && isJsonString(fnResult)) || isJson(fnResult)) {
      fnResult = JSON.stringify(fnResult, null, 2);
      language = 'json';
    } else {
      fnResult = fnResult
        ?.toString()
        .split('\n')
        .map((item) => item.replace(/[^\S\n\r\t]{10}/g, ''))
        .join('\n');
    }
    const formatValue = hljs.highlight(fnResult, { language }).value;
    value = `<pre style='overflow-x:auto;'><code class="${language}">${formatValue}</code></pre>`;
  } catch (e) {
    value = `<span class="text-red-500">无法执行: ${inputText}</span>`;
  }
  result.value.push({ text: inputText, value });
  setValue('');
  setTimeout(() => inputDom.value.scrollIntoView?.({ block: 'center' }), 0);
};

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    script.src = src;
    document.getElementsByTagName('head')[0].appendChild(script);
    loadedScriptList.value.push(script);
  });
};

const handleEnter = async (e: Event) => {
  e.preventDefault();
  const value = (e.target as HTMLInputElement).value;
  if (!value) return;
  if (value.startsWith('http')) {
    loading.value = 'loading';
    const res = await loadScript(value);
    if (res) {
      message.success('加载成功');
      inputPlaceholder.value = '输入已加载包中的函数，回车即可运行；ps：输入: show pkg，可查看已加载的包';
      setValue('');
      storage.addJson(storagePkgKey, value);
      loading.value = 'success';
    } else {
      message.error('加载失败');
      loading.value = 'error';
    }
  } else if (value.trim() === 'show pkg') {
    setValue('');
    result.value.push({ text: value.trim(), value: loadedScriptList.value.map((script) => script.src)?.join('<br>') });
  } else {
    runCode(value);
  }
};

/**
 * handleUp、handleDown上下切换历史记录
 */
const handleUp = (e: KeyboardEvent) => {
  e.preventDefault();
  if (!history.value.length) return;
  if (current.value < history.value.length - 1) {
    current.value++;
    setValue(history.value[current.value]);
  }
};

const handleDown = (e: KeyboardEvent) => {
  e.preventDefault();
  if (!history.value.length || current.value === -1) return;
  current.value--;
  if (current.value < 0) {
    inputDom.value.innerText = '';
    return;
  }
  setValue(history.value[current.value]);
};

/**
 * 清空执行结果集
 */
const handleClear = (e: KeyboardEvent) => {
  e.preventDefault();
  result.value = [];
};

const unloadScript = () => {
  if (loadedScriptList.value?.length) {
    loadedScriptList.value.forEach((script) => document.getElementsByTagName('head')[0].removeChild(script));
  }
};

onMounted(() => {
  setTimeout(() => inputDom.value.focus(), 0);
});

onUnmounted(() => {
  unloadScript();
});
</script>

<template>
  <div @click="() => inputDom.focus()" class="pkg-test flex flex-col h-full p-2 overflow-y-auto">
    <div v-show="result.length > 0" class="result-box w-full px-2 py-2">
      <div v-for="item in result" :key="item" class="pkg-test-result border-b py-1">
        <p><i class="iconfont icon-left text-xs mr-1"></i>{{ item.text }}</p>
        <p class="px-1" v-html="item.value"></p>
      </div>
    </div>
    <div class="w-full items-start p-2 relative">
      <div class="input-box flex items-center w-full border-b">
        <i class="iconfont icon-left text-sm"></i>
        <input
          ref="inputDom"
          contenteditable
          class="flex-1 py-2 px-1 outline-none overflow-hidden"
          :placeholder="inputPlaceholder"
          @keydown.enter="handleEnter"
          @keydown.up="handleUp"
          @keydown.down="handleDown"
          @keydown.meta.k="handleClear"
        />
      </div>
      <span
        :class="{
          'loading-span': loading === 'loading',
          'loaded bg-green-500': loading === 'success',
          'loaded bg-red-500': loading === 'error',
        }"
        class="w-0 bg-indigo-500 relative inline-block"
        style="height: 1px; top: -16px"
      ></span>
    </div>
  </div>
</template>

<style scoped>
.pkg-test .result-box .pkg-test-result {
  border-color: var(--showmd-border-color);
  color: var(--showmd-text-color-primary);
}
.pkg-test .pkg-test-result i {
  color: var(--showmd-text-color-weak);
}

.pkg-test .input-box {
  border-color: var(--showmd-border-color);
}

.pkg-test .input-box i {
  color: var(--showmd-border-color-hover);
}

.pkg-test .input-box input {
  caret-color: var(--showmd-border-color-hover);
  background-color: var(--showmd-bg-color-primary);
}

.loading-span {
  animation: loading-ani 10s ease-out forwards;
}
.loaded {
  animation: none;
  width: 100%;
}
@keyframes loading-ani {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
</style>
