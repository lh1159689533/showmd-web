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

// 0 移除文章, 1 添加文章, 2 移动文章, 3 排序文章
const COLUMN_OPERATE = {
  REMOVE: 0,
  ADD: 1,
  MOVE: 2,
  SORT: 3,
};

/**
 * 根据id查询专栏
 * @param id 专栏id
 */
async function findById(id: number) {
  const [err, res] = await http.request({ apiurl: 'column/findById', params: { id } });
  if (err && res.code !== 0) return null;
  const data: Column = res.data;
  return data;
}

/**
 * 根据文章id查询专栏
 * @param articleId 文章id
 */
async function findByArticleId(articleId: number) {
  const [err, res] = await http.request({ apiurl: 'column/findByArticleId', params: { articleId } });
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
async function findListByUserId(searchKey?: string) {
  const [err, res] = await http.request({ apiurl: 'column/findListByUserId', params: { searchKey } });
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
  const [err, res] = await http.request({ apiurl: 'column/articleOperate', data: { id, articleIds, action: COLUMN_OPERATE.ADD } });
  if (err && res.code !== 0) return false;
  return true;
}

/**
 * 专栏移动文章
 * @param id 专栏id
 * @param oid 原专栏id
 * @param articles 文章id集合
 */
async function moveArticle(id: number, oid: number, articleIds: number[]) {
  const [err, res] = await http.request({ apiurl: 'column/articleOperate', data: { id, oid, articleIds, action: COLUMN_OPERATE.MOVE } });
  if (err && res.code !== 0) return false;
  return true;
}

/**
 * 专栏下文章排序
 * @param id 专栏id
 * @param articles 文章id集合(有序)
 */
async function sortArticle(id: number, articleIds: number[]) {
  const [err, res] = await http.request({ apiurl: 'column/articleOperate', data: { id, articleIds, action: COLUMN_OPERATE.SORT } });
  if (err && res.code !== 0) return false;
  return true;
}

/**
 * 专栏移除文章
 * @param id 专栏id
 * @param articles 文章id集合
 */
async function removeArticle(id: number, articleIds: string[]) {
  const [err, res] = await http.request({ apiurl: 'column/articleOperate', data: { id, articleIds, action: COLUMN_OPERATE.REMOVE } });
  if (err && res.code !== 0) return false;
  return true;
}

export {
  findById,
  findByArticleId,
  saveColumn,
  findListByUserId,
  topColumn,
  deleteById,
  findArticleList,
  addArticle,
  moveArticle,
  sortArticle,
  removeArticle,
  findArticleListNotInColumn,
}