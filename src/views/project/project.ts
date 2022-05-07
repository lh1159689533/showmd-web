import http from '@src/http';

function newProject() {
  http.request({ apiurl: 'project/new' });
}

/**
 * 上传项目，项目id不为空时覆盖
 * @param projectName 项目名
 * @param projectId 项目id
 * @param formData 上传的文件数据
 */
function uploadProject(projectName: string, projectId: string, formData: FormData): Promise<[Error, any]> {
  return http.request({ apiurl: 'project/upload', data: formData, params: { projectName, projectId } });
}

/**
 * 查询所有项目
 */
async function findList() {
  const [err, data]: any = await http.request({ apiurl: 'project/findList' });
  if (err) return [];
  return data;
}

/**
 * 查询项目下所有文档
 */
async function findPageList(projectId: string) {
  const [err, res]: any = await http.request({ apiurl: 'page/findList', params: { projectId } });
  if (err && res.code !== 0) return [];
  return res.data;
}

export {
  newProject,
  uploadProject,
  findList,
  findPageList
};