export default {
  namespace: 'babyGrowth',

  create: 'post showmd/baby-growth/create', // 支持多文件上传：media_0, media_1, ..., media_8
  update: 'put showmd/baby-growth/update/:id', // 支持多文件上传：media_0, media_1, ..., media_8
  list: 'get showmd/baby-growth/list',
  page: 'get showmd/baby-growth/page',
  detail: 'get showmd/baby-growth/detail/:id',
  delete: 'delete showmd/baby-growth/delete/:id',
};
