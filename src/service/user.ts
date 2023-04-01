import http from '@src/http';

async function login(userName: string, password: string) {
  const [err, res] = await http.request({ apiurl: 'user/login', data: { userName, password } });
  if (err || res.code !== 0) return res.message ?? '登录失败';
  return '';
}

async function register(userName: string, password: string) {
  const [err, res] = await http.request({ apiurl: 'user/register', data: { userName, password } });
  if (err || res.code !== 0) return res.message ?? '登录失败';
  return '';
}

async function checkUserName(userName: string) {
  const [err, res] = await http.request({ apiurl: 'user/checkUserName', params: { userName } });
  if (err || res.code !== 0) return true;
  return false;
}

async function findUserById(id: number) {
  const [err, res] = await http.request({ apiurl: 'user/findUserById', segment: { id } });
  if (err && res.code !== 0) return null;
  return res.data;
}

/**
 * 查询当前登录用户信息
 */
async function findUserInfo() {
  const [err, res] = await http.request({ apiurl: 'user/findUserInfo' });
  if (err && res.code !== 0) return null;
  return res.data;
}

async function listMenu() {
  const [err, res] = await http.request({ apiurl: 'user/listMenu' });
  if (err && res.code !== 0) return [];
  return res.data;
}

async function holiday() {
  const [err, res] = await http.request({ apiurl: 'user/holiday' });
  if (err && !res.data) return null;
  return res.data;
}

export {
  login,
  register,
  checkUserName,
  findUserById,
  listMenu,
  holiday,
  findUserInfo
};