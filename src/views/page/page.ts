import http from '@src/http';

async function findContentById(pageId: string) {
  const [err, res]: any = await http.request({ apiurl: 'page/findContent', params: { pageId } });
  if (err && res.code !== 0) return [];
  return res.data;
}

export {
  findContentById
}