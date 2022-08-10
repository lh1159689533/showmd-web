import http from '@src/http';

async function listCategory() {
  const [err, res] = await http.request({ apiurl: 'category/listCategory' });
  if (err && res.code !== 0) return [];
  return res.data.map(({ value, label, parentValue }) => ({ key: value, title: label, parent: parentValue }));
}

export {
  listCategory,
};