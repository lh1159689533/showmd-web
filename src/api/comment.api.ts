export default {
  namespace: 'comment',

  findList: 'get showmd/comment/list',
  save: 'put showmd/comment/save/:type',
  delete: 'delete showmd/comment/delete',
  digg: 'post showmd/comment/:type/digg',
  undigg: 'post showmd/comment/:type/undigg'
};