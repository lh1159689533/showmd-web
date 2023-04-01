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
  editorType?: number;
}

async function findById(id: number) {
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

// 查询热门文章列表
async function findTopArticleList(data?) {
  const [err, res] = await http.request({ apiurl: 'article/findTopList', data });
  if (err && res.code !== 0) return 0;
  return res.data;
}

// 查询用户的文章
async function findListByUserId(searchKey?: string) {
  const [err, res] = await http.request({ apiurl: 'article/findListByUserId', params: { searchKey } });
  if (err && res.code !== 0) return 0;
  return res.data;
}

// 获取专栏上一篇文章
async function findPrevColumnArticle(articleId: number) {
  const [err, res] = await http.request({ apiurl: 'article/prevColumnArticle', data: { articleId } });
  if (err && res.code !== 0) return 0;
  return res.data;
}

// 获取专栏下一篇文章
async function findNextColumnArticle(articleId: number) {
  const [err, res] = await http.request({ apiurl: 'article/nextColumnArticle', data: { articleId } });
  if (err && res.code !== 0) return 0;
  return res.data;
}

// 删除文章
async function deleteById(id: number) {
  const [err, res] = await http.request({ apiurl: 'article/deleteById', segment: { id } });
  if (err && res.code !== 0) return false;
  return true;
}

export {
  findById,
  saveArticle,
  findArticleList,
  findTopArticleList,
  findListByUserId,
  findPrevColumnArticle,
  findNextColumnArticle,
  deleteById
}