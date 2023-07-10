export default {
  namespace: 'user',

  login: 'post showmd/user/login',
  register: 'post showmd/user/register',
  checkUserName: 'get showmd/user/check',
  findUserById: 'get showmd/user/:id',
  findUserInfo: 'get showmd/user/info',
  listMenu: 'get showmd/list/menu',

  holiday: 'get showmd/holiday',
  process: 'post showmd/image/process',
  download: 'post showmd/image/download',
};