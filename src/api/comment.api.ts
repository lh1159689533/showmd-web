export default {
  namespace: 'comment',

  findList: 'get showmd/list/:type/:id',
  save: 'put showmd/save/:type',
  delete: 'delete showmd/delete/:type/:id',
  digg: 'post showmd/:type/digg',
  undigg: 'post showmd/:type/undigg'
};