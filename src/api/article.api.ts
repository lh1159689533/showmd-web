export default {
  namespace: 'article',

  findList: 'post showmd/article/list',
  findTopList: 'post showmd/article/toplist',
  findById: 'get showmd/article/findById',
  save: 'post showmd/article/update',
  upload: 'post showmd/file/upload',
  sliceUpload: 'post showmd/file/sliceUpload',
  findListByUserId: 'get showmd/article/findListByUserId',
  nextColumnArticle: 'post showmd/article/next',
  prevColumnArticle: 'post showmd/article/prev',
};