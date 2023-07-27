<script lang="ts" setup>
import { ref } from 'vue';
import { imageProcess, imageDownload } from '@service/user';
import { download } from '@src/utils/download';

interface IProcessForm {
  format: string;
  trim: '0' | '1';
  width?: number;
  height?: number;
}

const mimeType = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

const inputRef = ref<HTMLInputElement>();
const file = ref();
const processForm = ref<IProcessForm>({ format: '', trim: '0', width: null, height: null });
const imageMetadata = ref({ url: '', type: '' });
const processImage = ref();

// 获取图片预览地址
const getImageUrl = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
  });
};

const getImage = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = (e) => {
      const { width, height } = e.target as any;
      resolve({
        width,
        height,
      });
    };
    img.src = url;
  });
};

const upload = () => {
  const inputFile = inputRef.value;
  if (!inputFile) return;
  inputFile?.click?.();
  const onChange = async () => {
    const { files } = inputFile;
    if (!files) return;
    file.value = files[0];
    const url = await getImageUrl(file.value);
    const { width, height } = await getImage(url);
    imageMetadata.value = { url, type: file.value.type };
    processForm.value = {
      ...processForm.value,
      width,
      height,
      format: mimeType[file.value.type]
    };
    inputFile?.removeEventListener('change', onChange);
  };
  inputFile?.addEventListener('change', onChange);
};

const getFormData = () => {
  const formData = new FormData();
  formData.append('file', file.value);
  const { width, height, format, trim } = processForm.value;
  if (width && height) {
    formData.append('resize', `${width},${height}`);
  }
  if (format) {
    formData.append('format', format);
  }
  if (trim) {
    formData.append('trim', trim);
  }
  return formData;
};

const process = async () => {
  processImage.value = await imageProcess(getFormData());
};

const downloadImg = async () => {
  const resp: any = await imageDownload(getFormData());
  download(resp.headers['content-disposition'], resp.data);
};
</script>

<template>
  <div class="image-process flex flex-col items-center h-full">
    <!-- <header class="bg-white border-b px-6 py-4 w-full h-16 flex justify-between">
      <span class="font-bold text-lg">图片处理</span>
      <el-button v-show="imageMetadata?.url" type="primary" link @click="reset">重新上传</el-button>
    </header> -->
    <div v-show="!imageMetadata?.url" class="w-4/5 mt-8 rounded p-6">
      <div
        @click="upload"
        class="upload-box border border-dashed h-64 rounded cursor-pointer flex flex-col items-center justify-around gap-4 py-52"
      >
        <i class="iconfont icon-upload text-6xl text-gray-400"></i>
        <span class="desc">拖拽图片到此或点击上传</span>
        <el-button type="primary">上传图片</el-button>
      </div>
      <input ref="inputRef" type="file" :webkitdirectory="false" accept="image/*" class="hidden" />
    </div>
    <div v-show="imageMetadata?.url" class="process flex gap-10 w-full flex-1" style="height: calc(100% - 64px);">
      <div class="img-box flex justify-center gap-10 flex-1 my-16 px-10">
        <div class="source-img rounded p-3 w-1/2" style="box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);">
          <div class="pb-2"><span class="">原图</span></div>
          <div style="height: calc(100% - 32px);" class="flex justify-center items-center">
            <img :src="imageMetadata?.url" alt="Preview Image" class="max-h-full w-auto h-auto" />
          </div>
        </div>
        <div class="process-img rounded p-3 w-1/2" style="box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);">
          <div class="pb-2"><span class="">效果图</span></div>
          <div style="height: calc(100% - 32px);" class="flex justify-center items-center">
            <img
              :src="processImage ? `data:${imageMetadata.type};base64,${processImage}` : imageMetadata?.url"
              alt="Preview Image" class="max-h-full w-auto h-auto"
            />
          </div>
        </div>
      </div>
      <div class="attr-box w-1/4 py-4 flex flex-col">
        <div class="header px-6 pb-4 border-b">
          <span>属性</span>
        </div>
        <div class="content flex-1 p-8">
          <el-form ref="ruleFormRef" :model="processForm" label-width="60px">
            <el-form-item label="格式" prop="format">
              <el-select v-model="processForm.format" clearable placeholder="请选择">
                <el-option key="jpg" label="jpg" value="jpg" />
                <el-option key="png" label="png" value="png" />
                <el-option key="webp" label="webp" value="webp" />
              </el-select>
            </el-form-item>
            <el-form-item label="去空白" prop="trim">
              <el-select v-model="processForm.trim" placeholder="请选择">
                <el-option key="yes" label="是" value="1"></el-option>
                <el-option key="no" label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="宽" prop="width">
              <el-input-number v-model="processForm.width" :min="1" controls-position="right" />
            </el-form-item>
            <el-form-item label="高" prop="height">
              <el-input-number v-model="processForm.height" :min="1" controls-position="right" />
            </el-form-item>
          </el-form>
        </div>
        <div class="footer pl-10 py-6 flex">
          <el-button type="primary" @click="process">预览</el-button>
          <el-button @click="downloadImg">下载</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-process .upload-box {
  background-color: var(--showmd-bg-color-weak);
  border-color: var(--showmd-border-color);
}

.image-process .upload-box:hover {
  border-color: var(--showmd-border-color-hover);
}

.image-process .upload-box .desc {
  color: var(--showmd-text-color-weak);
}

.image-process .img-box :is(.source-img, .process-img) {
  background-color: var(--showmd-bg-color-primary);
}

.image-process .attr-box {
  box-shadow: 5px 8px 8px 0px #000;
  background-color: var(--showmd-bg-color-primary);
}

.image-process .attr-box .header {
  border-color: var(--showmd-border-color);
}
</style>
