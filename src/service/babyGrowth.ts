import http, { ResponseData } from '@src/http';

export interface IBabyGrowth extends ResponseData {
  id?: number;
  title: string;
  description?: string;
  eventTime: string;
  mediaType: number;
  mediaUrls?: string[]; // 支持多张图片
  userId?: number;
  user?: {
    id: number;
    name: string;
    avatar?: string;
  };
  createTime?: string;
  updateTime?: string;
}

export interface IBabyGrowthPage {
  total: number;
  pageNo: number;
  pageSize: number;
  list: IBabyGrowth[];
}

/**
 * 创建成长记录
 * @param record 记录数据
 * @param mediaFiles 媒体文件数组
 */
async function createRecord(record: Partial<IBabyGrowth>, mediaFiles?: File[]): Promise<number | null> {
  const formData = new FormData();
  formData.append('record', JSON.stringify(record));
  
  if (mediaFiles && mediaFiles.length > 0) {
    mediaFiles.forEach((file, index) => {
      formData.append(`media_${index}`, file);
    });
    formData.append('mediaCount', mediaFiles.length.toString());
  }

  const [err, res] = await http.request({
    apiurl: 'babyGrowth/create',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  if (err || res.code !== 0) return null;
  return res.data;
}

/**
 * 更新成长记录
 * @param id 记录ID
 * @param record 记录数据
 * @param mediaFiles 媒体文件数组（可选）
 */
async function updateRecord(id: number, record: Partial<IBabyGrowth>, mediaFiles?: File[]): Promise<number | null> {
  const formData = new FormData();
  formData.append('record', JSON.stringify(record));
  
  if (mediaFiles && mediaFiles.length > 0) {
    mediaFiles.forEach((file, index) => {
      formData.append(`media_${index}`, file);
    });
    formData.append('mediaCount', mediaFiles.length.toString());
  }

  const [err, res] = await http.request({
    apiurl: 'babyGrowth/update',
    segment: { id },
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  if (err || res.code !== 0) return null;
  return res.data;
}

/**
 * 查询成长记录列表
 * @param searchKeyword 搜索关键字
 */
async function findList(searchKeyword?: string): Promise<IBabyGrowth[] | null> {
  const [err, res] = await http.request({
    apiurl: 'babyGrowth/list',
    params: searchKeyword ? { searchKeyword } : undefined,
  });

  if (err || res.code !== 0) return null;
  return res.data;
}

/**
 * 分页查询成长记录
 * @param pageNo 页码
 * @param pageSize 每页数量
 */
async function findByPage(pageNo = 1, pageSize = 10): Promise<IBabyGrowthPage | null> {
  const [err, res] = await http.request({
    apiurl: 'babyGrowth/page',
    params: { pageNo, pageSize },
  });

  if (err || res.code !== 0) return null;
  return res.data;
}

/**
 * 查询成长记录详情
 * @param id 记录ID
 */
async function findById(id: number): Promise<IBabyGrowth | null> {
  const [err, res] = await http.request({
    apiurl: 'babyGrowth/detail',
    segment: { id },
  });

  if (err || res.code !== 0) return null;
  return res.data;
}

/**
 * 删除成长记录
 * @param id 记录ID
 */
async function deleteById(id: number): Promise<boolean> {
  const [err, res] = await http.request({
    apiurl: 'babyGrowth/delete',
    segment: { id },
  });

  if (err || res.code !== 0) return false;
  return true;
}

/**
 * 获取媒体文件URL
 * @param id 记录ID
 */
function getMediaUrl(id: number): string {
  return `/api/showmd/baby-growth/media/${id}`;
}

/**
 * 获取多张图片URL
 * @param id 记录ID
 * @param index 图片索引
 */
function getMediaUrls(id: number, count = 1): string[] {
  const urls: string[] = [];
  for (let i = 0; i < count; i++) {
    urls.push(`/api/showmd/baby-growth/media/${id}/${i}`);
  }
  return urls;
}

export {
  createRecord,
  updateRecord,
  findList,
  findByPage,
  findById,
  deleteById,
  getMediaUrl,
  getMediaUrls,
};
