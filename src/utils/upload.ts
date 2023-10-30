import http from '@src/http';
import SparkMD5 from 'spark-md5';

const CHUNK_SIZE = 5 * 1024 * 1024; // 切片大小
const MAX_CONCURRENCY = 5; // 最大并发

interface FileChunk {
  index: number;
  chunk: File;
}

/**
 * 文件大小超过CHUNK_SIZE时切片上传，CHUNK_SIZE默认5M
 * @param fileChunkList 文件分片列表
 * @param uploadId 上传id，标识同一文件
 * @param onProgress 进度回调
 */
async function sliceUploadFile(fileChunkList: FileChunk[], uploadId: string, onProgress?): Promise<any> {
  const pool = [];
  let doneNum = 0;

  for (let i = 0; i < fileChunkList.length; i++) {
    const fileChunk = fileChunkList[i];
    const formData = new FormData();
    formData.append('chunk', fileChunk.chunk);

    const task = http.request({
      apiurl: 'article/sliceUpload',
      data: formData,
      params: {
        uploadId,
        chunkNum: fileChunk.index
      }
    });

    task.then(() => {
      const index = pool.findIndex(p => p === task);
      pool.splice(index);
      doneNum++;
      onProgress?.(doneNum / fileChunkList.length * 100);
    }).catch(() => { });

    pool.push(task);

    if (pool.length >= MAX_CONCURRENCY) {
      await Promise.race(pool);
    }
  }

  return Promise.all(pool);
}

/**
 * 分片文件上传完毕，合并分片文件
 * @param fileChunkList 文件分片列表
 * @param uploadId 上传id，标识同一文件
 * @param fileType 文件类型
 */
async function mergeFile(fileChunkList: FileChunk[], uploadId: string, fileType: string, fileName: string) {
  return await http.request({
    apiurl: 'article/sliceUpload',
    data: {
      merge: fileChunkList.reduce((acc, item) => (`${acc}${item.index},`), ''),
      fileType,
      fileName
    },
    params: {
      uploadId
    }
  });
}

/**
 * 文件上传
 * @param file File
 */
async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return await http.request({
    apiurl: 'article/upload',
    data: formData
  });
}

// 获取切片
function getFileChunkList(file: File): FileChunk[] {
  const size = Math.ceil(file.size / CHUNK_SIZE);
  const fileChunkList = [];
  let current = 0;
  for (let index = 1; index <= size; index++) {
    fileChunkList.push({
      index,
      chunk: file.slice(current, index * CHUNK_SIZE)
    });
    current = index * CHUNK_SIZE;
  }

  return fileChunkList;
}

/**
 * 获取文件md5
 * @param chunks 文件切片
 */
function getMd5(chunks: File[]): Promise<string> {
  return new Promise(resolve => {
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    let currentChunk = 0;
    const chunkCount = chunks.length;
    fileReader.onload = function (e) {
      spark.append(e.target.result);
      currentChunk++;
      if (currentChunk < chunkCount) {
        loadNext();
      } else {
        resolve(spark.end());
      }
    };

    function loadNext() {
      fileReader.readAsArrayBuffer(chunks[currentChunk]);
    }

    loadNext();
  });
}

async function upload(file: File, onProgress?) {
  if (file?.size <= CHUNK_SIZE) {
    return await uploadFile(file);
  }
  const fileChunkList: FileChunk[] = getFileChunkList(file);
  // const uploadId = Base64.encode(file.name).replace(/[\/\\]/g, '');
  const uploadId = await getMd5(fileChunkList.map(item => item.chunk));
  await sliceUploadFile(fileChunkList, uploadId, onProgress);
  return await mergeFile(fileChunkList, uploadId, file.type, file.name);
}

/**
 * markdown附件上传
 * @param file File
 */
async function uploadAttachFile(file: File) {
  const formData = new FormData();
  formData.append('attachfile', file);

  return await http.request({
    apiurl: 'article/attachfileUpload',
    data: formData
  });
}

export {
  upload,
  uploadAttachFile
};