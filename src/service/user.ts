import http from '@src/http';

async function findUserById(id: number) {
  const [err, res] = await http.request({ apiurl: 'user/findUserById', segment: { id } });
  if (err && res.code !== 0) return [];
  return res.data;
}

async function listMenuByRoleId(roleId: number) {
  const [err, res] = await http.request({ apiurl: 'user/listMenuByRoleId', segment: { roleId } });
  if (err && res.code !== 0) return [];
  return res.data;
}

async function holiday() {
  const [err, res] = await http.request({ apiurl: 'user/holiday' });
  if (err && !res.data) return null;
  return res.data;
}

export {
  findUserById,
  listMenuByRoleId,
  holiday
};