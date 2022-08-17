import http, { ResponseData } from '@src/http';

export interface ICover {
  name?: string;
  url?: string;
}

interface IUser {
  id?: string;
  name?: string;
  avatar?: string;
}

export interface IArticle extends ResponseData {
  id?: number;
  name?: string;
  content?: string;
  category: string;
  tags: string;
  summary?: string;
  cover?: ICover;
  contentTheme?: string;
  codeTheme?: string;
  user?: IUser;
  createTime?: Date;
  updateTime?: Date;
}

async function findById(id: string) {
  const [err, res] = await http.request({ apiurl: 'article/findById', params: { id } });
  if (err && res.code !== 0) return null;
  const data: IArticle = res.data;
  return data;
}

// 新建文章
async function saveArticle(article) {
  const [err, res] = await http.request({ apiurl: 'article/save', data: article });
  if (err && res.code !== 0) return 0;
  return res.data;
}

// 查询文章列表
async function findArticleList(data?) {
  const [err, res] = await http.request({ apiurl: 'article/findList', data });
  if (err && res.code !== 0) return 0;
  return res.data;
}

// 查询文章列表
async function uploadImg(formData) {
  const [err, res] = await http.request({ apiurl: 'article/uploadImg', data: formData });
  if (err && res.code !== 0) return 0;
  return res.data;
}

export {
  findById,
  saveArticle,
  findArticleList,
  uploadImg
}