import http from '@src/http';

async function listContentTheme() {
  const [err, res] = await http.request({ apiurl: 'theme/listContentTheme' });
  if (err && res.code !== 0) return [];
  return res.data;
}

async function listCodeTheme() {
  const [err, res] = await http.request({ apiurl: 'theme/listCodeTheme' });
  if (err && res.code !== 0) return [];
  return res.data;
}

export {
  listContentTheme,
  listCodeTheme,
};