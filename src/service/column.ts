import http, { ResponseData } from '@src/http';

export interface ICover {
  url?: string;
}

export interface Column extends ResponseData {
  id?: number;
  name?: string;
  desc?: string;
  cover?: ICover;
  isTop?: boolean;
  isPrivate?: boolean;
  createTime?: Date;
  articleCnt?: number;
  subscribeCnt?: number;
}

async function findById(id: number) {
  const [err, res] = await http.request({ apiurl: 'column/findById', params: { id } });
  if (err && res.code !== 0) return null;
  const data: Column = res.data;
  return data;
}

// 新建文章
async function saveColumn(article) {
  const [err, res] = await http.request({ apiurl: 'column/save', data: article });
  if (err && res.code !== 0) return 0;
  return res.data;
}

// 查询用户发布的专栏
async function findListByUserId(userId: number, searchKey?: string) {
  const [err, res] = await http.request({ apiurl: 'column/findListByUserId', params: { userId, searchKey } });
  if (err && res.code !== 0) return null;
  return res.data;
}

async function topColumn(id: number, action: 0 | 1): Promise<boolean> {
  const [err, res] = await http.request({ apiurl: 'column/topColumn', data: { id, action } });
  if (err && res.code !== 0) return false;
  return true;
}

async function deleteById(id: number) {
  const [err, res] = await http.request({ apiurl: 'column/deleteById', segment: { id } });
  if (err && res.code !== 0) return false;
  return true;
}

async function findArticleList(id: number) {
  const [err, res] = await http.request({ apiurl: 'column/findArticleList', params: { id } });
  if (err && res.code !== 0) return null;
  return res.data;
}

/**
 * 查询未被专栏收录的文章列表
 */
async function findArticleListNotInColumn(searchKey = '') {
  const [err, res] = await http.request({ apiurl: 'column/listNotInColumn', params: { searchKey } });
  if (err && res.code !== 0) return null;
  return res.data;
}

/**
 * 专栏添加文章
 * @param id 专栏id
 * @param articles 文章id集合
 */
async function addArticle(id: number, articleIds: number[]) {
  // action 0 移除文章, 1 添加文章
  const [err, res] = await http.request({ apiurl: 'column/articleOperate', data: { id, articleIds, action: 1 } });
  if (err && res.code !== 0) return false;
  return true;
}

/**
 * 专栏移除文章
 * @param id 专栏id
 * @param articles 文章id集合
 */
async function removeArticle(id: number, articleIds: string[]) {
  // action 0 移除文章, 1 添加文章
  const [err, res] = await http.request({ apiurl: 'column/articleOperate', data: { id, articleIds, action: 0 } });
  if (err && res.code !== 0) return false;
  return true;
}

export {
  findById,
  saveColumn,
  findListByUserId,
  topColumn,
  deleteById,
  findArticleList,
  addArticle,
  removeArticle,
  findArticleListNotInColumn,
}