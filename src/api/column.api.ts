export default {
  namespace: 'column',

  findById: 'get showmd/column/findById',
  save: 'post showmd/column/update',
  findListByUserId: 'get showmd/column/findListByUserId',
  topColumn: 'post showmd/column/topColumn',
  deleteById: 'delete showmd/column/delete/:id',
  findArticleList: 'get showmd/column/findArticleList',
  articleOperate: 'post showmd/column/articleOperate',
  listNotInColumn: 'get showmd/column/listNotInColumn',
};