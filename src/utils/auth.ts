// 需要用户登录的页面
const apis = [
  '/article/new',
  '/article/edit',
  '/creator'
];

export default function(path) {
  return apis.some(item => path.startsWith(item));
}