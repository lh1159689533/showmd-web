export default {
  namespace: 'column',

  findById: 'get showmd/column/findById',
  findByArticleId: 'get showmd/column/findByArticleId',
  save: 'post showmd/column/update',
  findListByUserId: 'get showmd/column/list',
  topColumn: 'post showmd/column/topColumn',
  deleteById: 'delete showmd/column/delete/:id',
  findArticleList: 'get showmd/column/findArticleList',
  articleOperate: 'post showmd/column/operate',
  listNotInColumn: 'get showmd/column/listNotInColumn',
};