/* eslint-disable */
import axios from 'axios';
import { Base64 } from 'js-base64';

const CHUNK_SIZE = 5 * 1024 * 1024; // 切片大小
const MAX_CONCURRENCY = 5; // 最大并发

interface FileChunk {
  index: number;
  chunk: File;
}

async function sliceUpload(file: File, onProgress?) {
  if (file?.size <= CHUNK_SIZE) {
    return upload(file);
  }
  return new Promise(async (resolve) => {
    const fileChunkList: FileChunk[] = getFileChunkList(file);
    const pool = [];
    let doneNum = 0;

    const uploadId = Base64.encode(file.name).replace(/[\/\\]/g, '');

    for (let i = 0; i < fileChunkList.length; i++) {
      const fileChunk = fileChunkList[i];
      const formData = new FormData();
      formData.append('chunk', fileChunk.chunk);

      const task = axios({
        method: 'post',
        url: `/api/showmd/file/sliceUpload?uploadId=${uploadId}&chunkNum=${fileChunk.index}`,
        data: formData
      });
      // const task = http.request({ apiurl: 'article/sliceUpload', data: formData });

      task.then(async () => {
        const index = pool.findIndex(p => p === task);
        pool.splice(index);
        doneNum++;
        onProgress?.(doneNum / fileChunkList.length);

        if (doneNum === fileChunkList.length) {
          const res = await axios({
            method: 'post',
            url: `/api/showmd/file/sliceUpload?uploadId=${uploadId}`,
            data: {
              merge: fileChunkList.reduce((acc, item) => (`${acc}${item.index},`), ''),
              fileType: file.type
            }
          });
          resolve(res);
        }
      }).catch(() => {

      });

      pool.push(task);

      if (pool.length >= MAX_CONCURRENCY) {
        await Promise.race(pool);
      }
    }
  });
}

async function upload(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return await axios({
    method: 'post',
    url: '/api/showmd/file/upload',
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

export {
  sliceUpload
};