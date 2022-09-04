import http, { ResponseData } from '@src/http';

interface User {
  id?: string;
  name?: string;
  avatar?: string;
}

interface Reply {
  id: number;
  content: string;
  user: User;
  replyToUser?: User;
  createTime: string;
  digg: number;
  isAuthor: boolean;
  isMyself: boolean;
}

export interface Comment extends ResponseData {
  id?: number;
  content?: string;
  user: User;
  createTime: string;
  digg: number;
  replys: Reply[];
  isAuthor: boolean;
  isMyself: boolean;
  articleId: number;
}

interface CommentData {
  content: string;
  articleId: number;
  userId: number;
}

interface ReplyData {
  content: string;
  commentId: number;
  parentId?: number;
  replyToUserId?: number
  userId: number;
}

interface CommentResponseData {
  list: Comment[];
  articleId: number;
  count: number;
}

interface DiggData {
  commentId: number;
  articleId?: number;
  userId: number;
  replyId?: number;
}

async function findCommentList(articleId) {
  const [err, res] = await http.request({ apiurl: 'comment/findList', params: { articleId } });
  if (err && res.code !== 0) return null;
  const data: CommentResponseData = res.data;
  return data;
}

async function saveComment(comment: CommentData | ReplyData, type: 'comment' | 'reply') {
  const [err, res] = await http.request({ apiurl: 'comment/save', data: { ...comment }, segment: { type } });
  if (err && res.code !== 0) return null;
  return res.data;
}

async function deleteById(id: number, type: 'comment' | 'reply') {
  const [err, res] = await http.request({ apiurl: 'comment/delete', segment: { id, type } });
  if (err && res.code !== 0) return false;
  return res.data;
}

async function digg(data: DiggData, type: 'comment' | 'reply') {
  const [err, res] = await http.request({ apiurl: 'comment/digg', data: { ...data }, segment: { type } });
  if (err && res.code !== 0) return false;
  return true;
}

async function undigg(data: DiggData, type: 'comment' | 'reply') {
  const [err, res] = await http.request({ apiurl: 'comment/undigg', data: { ...data }, segment: { type } });
  if (err && res.code !== 0) return false;
  return true;
}

function isAuthorOrMyself(list, currentUser, articleAuthor) {
  list.forEach(item => {
    if (item.user?.id === currentUser?.id) {
      item.isMyself = true;
    }
    if (item.user?.id === articleAuthor?.id) {
      item.isAuthor = true;
    }
    if (item.diggUsers?.split(',')?.includes(`${currentUser.id}`)) {
      item.isDigg = true;
    }
    if (item.replies?.length) {
      isAuthorOrMyself(item.replies, currentUser, articleAuthor);
    }
  });
}

export {
  findCommentList,
  saveComment,
  deleteById,
  isAuthorOrMyself,
  digg,
  undigg,
}