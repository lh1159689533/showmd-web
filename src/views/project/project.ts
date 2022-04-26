import http from '@src/http';

function newProject() {
  http.request({ apiurl: 'project/upload' });
}

export {
  newProject
};