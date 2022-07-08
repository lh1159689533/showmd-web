import http from '@src/http';

async function findById(id: string) {
  const [err, res]: any = await http.request({ apiurl: 'article/findById', params: { id } });
  if (err && res.code !== 0) return null;
  return res.data;
}

// 新建文章
async function saveArticle(article) {
  const [err, res]: any = await http.request({ apiurl: 'article/save', data: article });
  if (err && res.code !== 0) return 0;
  return res.data;
}

// 查询文章列表
async function findArticleList() {
  const [err, res]: any = await http.request({ apiurl: 'article/findList' });
  if (err && res.code !== 0) return 0;
  return res.data;
}

export {
  findById,
  saveArticle,
  findArticleList
}