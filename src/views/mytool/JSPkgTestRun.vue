<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';

const sourceCode = ref(null);
const codeDisplay = ref(null);
const lineNumbers = ref(null);
const outputContent = ref(null);
const myeditor = ref();

// State
const rawCode = ref(`// JavaScript代码测试工具
console.log("Hello World!");

function calculateCircleArea(radius) {
    return Math.PI * radius * radius;
}

console.log("半径为5的圆面积: " + calculateCircleArea(5).toFixed(2));

// 取消下面一行的注释查看错误效果
// console.log(undefinedVariable);`);

const highlightedCode = ref('');
const showOutput = ref(false);
const executionStatus = ref('就绪');
const executionTime = ref('');
const outputLogs = ref([]);
const executionError = ref(false);
const errorTitle = ref('');
const errorMessage = ref('');
const cellCount = ref(1);

// 计算行数
const lineCount = computed(() => {
  return rawCode.value.split('\n').length;
});

// 同步滚动位置
const syncScroll = () => {
  const scrollTop = sourceCode.value.scrollTop;
  const scrollLeft = sourceCode.value.scrollLeft;

  if (codeDisplay.value) {
    codeDisplay.value.scrollTop = scrollTop;
    codeDisplay.value.scrollLeft = scrollLeft;
  }

  if (lineNumbers.value) {
    lineNumbers.value.scrollTop = scrollTop;
  }
};

// 将焦点切换到textarea
const focusTextarea = () => {
  sourceCode.value.focus();
};

// 处理键盘事件
const handleKeyDown = (event) => {
  // 支持Tab键缩进
  if (event.key === 'Tab') {
    event.preventDefault();
    const start = sourceCode.value.selectionStart;
    const end = sourceCode.value.selectionEnd;

    // 获取当前内容
    const text = sourceCode.value.value;

    // 插入4个空格
    sourceCode.value.value =
      text.substring(0, start) +
      '    ' +
      text.substring(end);

    // 更新光标位置
    sourceCode.value.selectionStart = sourceCode.value.selectionEnd = start + 4;

    // 更新代码显示
    syncScroll();
  }

  // Ctrl+Enter 运行代码
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    runCode();
  }
};

// 运行代码
const runCode = async () => {
  // 重置状态
  showOutput.value = true;
  outputLogs.value = [];
  executionError.value = false;
  executionStatus.value = '执行中...';
  executionTime.value = '';
  errorTitle.value = '';
  errorMessage.value = '';

  // 开始计时
  const startTime = performance.now();

  // 备份原始控制台方法
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info
  };

  // 重写控制台方法以捕获输出
  console.log = (...args) => {
    originalConsole.log(...args);
    outputLogs.value.push(args.join(' '));
  };

  console.info = (...args) => {
    originalConsole.info(...args);
    outputLogs.value.push(args.join(' '));
  };

  console.warn = (...args) => {
    originalConsole.warn(...args);
    outputLogs.value.push(`警告: ${args.join(' ')}`);
  };

  console.error = (...args) => {
    originalConsole.error(...args);
    outputLogs.value.push(`错误: ${args.join(' ')}`);
  };

  try {
    // 安全沙箱执行环境
    const safeEval = new Function(`
      const safeContext = {
          console: console,
          setTimeout: null,
          setInterval: null,
          clearTimeout: null,
          clearInterval: null,
          XMLHttpRequest: null,
          fetch: null,
          document: null,
          window: null,
          history: null,
          location: null,
          localStorage: null,
          sessionStorage: null
      };
      
      with(safeContext) {
          try {
              ${rawCode.value}
          } catch (e) {
              console.error(e.stack || e.message);
              throw e;
          }
      }
  `);

    // 执行代码
    await safeEval();

    // 计算执行时间
    const endTime = performance.now();
    executionTime.value = (endTime - startTime).toFixed(2);
    executionStatus.value = '执行成功';
    executionError.value = false;
  } catch (e) {
    // 模拟错误信息（根据截图）
    errorTitle.value = 'NameError';
    errorMessage.value = 'NameError: undefinedVariable is not defined';
    executionError.value = true;

    // 计算执行时间
    const endTime = performance.now();
    executionTime.value = (endTime - startTime).toFixed(2);
    executionStatus.value = '执行错误';
  } finally {
    // 恢复原始控制台方法
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.info = originalConsole.info;

    // 增加单元格计数
    cellCount.value++;

    // 滚动到输出底部
    nextTick(() => {
      if (outputContent.value) {
        outputContent.value.scrollTop = outputContent.value.scrollHeight;
      }
    });
  }
};

// 重置代码编辑器
const resetCode = () => {
  rawCode.value = `// JavaScript代码测试工具
console.log("Hello World!");

function calculateCircleArea(radius) {
    return Math.PI * radius * radius;
}

console.log("半径为5的圆面积: " + calculateCircleArea(5).toFixed(2));

// 取消下面一行的注释查看错误效果
// console.log(undefinedVariable);`;

  showOutput.value = false;
  executionStatus.value = '就绪';
  executionTime.value = '';
  outputLogs.value = [];
  executionError.value = false;
  errorTitle.value = '';
  errorMessage.value = '';
  cellCount.value = 1;

};

// 初始化
onMounted(() => {
  // 初始化代码显示
  // updateCode();
  editor.create(myeditor.value, {
    value: rawCode.value,
    language: 'javascript',
    tabSize: 2,
    scrollBeyondLastLine: false,
    scrollbar: {
      vertical: 'hidden',
      horizontal: 'hidden'
    },
    minimap: {
      enabled: false
    }
  });
});
</script>
<template>
  <div id="app">
    <div class="editor-header">
      <div class="control-buttons">
        <button class="control-btn" @click="runCode">
          <i class="fas fa-play"></i> 运行代码
        </button>
        <button class="control-btn warn" @click="resetCode">
          <i class="fas fa-redo"></i> 重置
        </button>
      </div>
    </div>

    <div class="cell-container">
      <div ref="myeditor" class="code-editor">
      </div>

      <div class="output-container" :style="{ display: showOutput ? 'block' : 'none' }">
        <div class="output-header">
          <span>输出</span>
          <div class="execution-status" :class="{
            'error-status': executionError,
            'success-status': !executionError
          }">
            {{ executionStatus }}
          </div>
        </div>
        <div class="output-content" ref="outputContent">
          <div v-if="executionError" class="error-trace">
            <div class="error-header">{{ errorTitle }}</div>
            <div class="traceback-header">Traceback (most recent call last)</div>
            <div class="code-cell-ref">
              <span>Cell In[{{ cellCount }}],</span>
              <a class="cell-link" href="#">line 30</a>
            </div>

            <div class="code-fragment">
              <div class="code-line">
                <span class="line-number">27</span>
                <span>dlcutils.params.text(name='wedatat00', defaultValue='aa')</span>
              </div>
              <div class="code-line">
                <span class="line-number">29</span>
                <span>dlcutils.params.text(name='zz', defaultValue='1')</span>
              </div>
              <div class="code-line highlighted">
                <span class="line-number">30</span>
                <span>console.log("Hello World!");</span>
              </div>
            </div>

            <div class="error-message">{{ errorMessage }}</div>
          </div>

          <div v-else>
            <div v-for="(log, index) in outputLogs" :key="index" class="stdout-line">
              {{ log }}
            </div>
          </div>
        </div>
      </div>

      <div class="info-panel">
        <i class="fas fa-info-circle"></i>
        提示：按 Ctrl+Enter 运行代码，Shift+Enter 运行并新建单元格
      </div>
    </div>
  </div>
</template>
<style>
.editor-header {
  padding: 15px 25px;
  background-color: #f7f7f7;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title i {
  color: #4ec9b0;
}

.control-buttons {
  display: flex;
  gap: 15px;
}

.control-btn {
  background: #007acc;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(0, 122, 204, 0.3);
}

.control-btn:hover {
  background: #3d8fd1;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 122, 204, 0.4);
}

.control-btn.warn {
  background: #ca5100;
}

.control-btn.warn:hover {
  background: #e65100;
}

.cell-container {
  position: relative;
  padding: 25px;
}

.code-editor {
  position: relative;
  width: 100%;
  height: 200px;
  border: 1px solid #dcdcdc;
  box-sizing: content-box;
  padding: 20px 0;
}

.code-display {
  position: absolute;
  top: 0;
  left: 50px;
  width: calc(100% - 50px);
  height: 100%;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.7;
  padding: 20px;
  overflow: auto;
  outline: none;
  cursor: text;
  white-space: pre;
  z-index: 1;
}

textarea {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 10;
  cursor: text;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  padding: 20px;
  overflow: hidden;
}

.code-input {
  height: 200px;
  position: relative;
  background-color: #1e1e1e;
  border: 1px solid #404040;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 5px;
}

.code-toolbar {
  background-color: #1e1e1e;
  padding: 8px 15px;
  border: 1px solid #404040;
  border-top: none;
  border-radius: 0 0 4px 4px;
  display: flex;
  justify-content: space-between;
  color: #858585;
  font-size: 13px;
}

.execution-count {
  font-weight: 500;
}

.output-container {
  display: none;
  margin-top: 30px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.output-header {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #e0e0e0;
  color: #5f5f5f;
  font-weight: 500;
}

.execution-status {
  margin-left: auto;
  font-size: 14px;
  color: #007acc;
}

.output-content {
  min-height: 150px;
  max-height: 400px;
  overflow: auto;
  background: white;
  padding: 20px;
  font-family: monospace;
  font-size: 14px;
}

.error-status {
  color: #ff6161;
}

.success-status {
  color: #4ec9b0;
}

.error-trace {
  margin-bottom: 20px;
}

.error-header {
  color: #ff6161;
  font-weight: 700;
  margin-bottom: 10px;
  font-size: 16px;
}

.traceback-header {
  color: #d4d4d4;
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 15px;
}

.code-cell-ref {
  margin-bottom: 15px;
}

.cell-link {
  color: #3794ff;
  text-decoration: none;
  margin-right: 8px;
  font-weight: 600;
}

.code-fragment {
  padding: 10px 0;
  margin-left: 25px;
  position: relative;
}

.code-line {
  padding-left: 40px;
  position: relative;
  white-space: pre;
  font-family: monospace;
}

.line-number {
  position: absolute;
  left: 0;
  width: 35px;
  text-align: right;
  color: #858585;
  font-weight: 500;
}

.highlighted {
  background-color: rgba(180, 66, 0, 0.3);
  display: block;
  padding: 5px 10px;
  border-radius: 3px;
  margin: 0 -10px;
}

.stdout-line {
  color: #5f5f5f;
  padding: 5px 0;
  line-height: 1.6;
  font-size: 14px;
  font-family: monospace;
}

.status-bar {
  padding: 15px 25px;
  background-color: #007acc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: white;
}

.execution-time {
  font-weight: 500;
}

.info-panel {
  background-color: rgba(0, 122, 204, 0.1);
  border-left: 4px solid #007acc;
  padding: 15px;
  margin-top: 20px;
  border-radius: 4px;
  font-size: 14px;
}

.hljs {
  background: transparent !important;
  padding: 0 !important;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1e1e1e;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #3d3d3d;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #505050;
}

@media (max-width: 768px) {
  #app {
    width: 95%;
  }

  .editor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .control-buttons {
    width: 100%;
    justify-content: space-between;
  }
}
</style>