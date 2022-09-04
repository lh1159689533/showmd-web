import { saveComment, deleteById, findCommentList, isAuthorOrMyself, digg, undigg } from '@service/comment';

interface DiggData {
  commentId: number;
  articleId: number;
  replyId: number;
  type: 'comment' | 'reply';
}

const state = {
  commentData: {
    list: [],
    count: 0,
    articleId: 0
  },
  articleAuthor: null, // 文章作者信息
};

const getters = {
};

const mutations = {
  addComment(state, comment) {
    const { list, count } = state.commentData;
    list.unshift(comment);
    state.commentData = {
      ...state.commentData,
      list,
      count: count + 1,
    };
  },

  addReply(state, { reply, commentId }) {
    const { list, count } = state.commentData;
    const comment = list.find(c => c.id === commentId);
    if (comment) {
      comment.replies.push(reply);
    }
    state.commentData = {
      ...state.commentData,
      list,
      count: count + 1,
    };
  },

  delComment(state, id) {
    const { list, count } = state.commentData;
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list.splice(index, 1);
    }
    state.commentData = {
      ...state.commentData,
      list,
      count: count - 1,
    };
  },

  delReply(state, { id, commentId }) {
    const { list, count } = state.commentData;
    const comment = list.find(c => c.id === commentId);
    if (comment?.replies?.length) {
      const replies = comment.replies.filter(item => item.id !== id && item.parentId !== id);
      comment.replies = replies;
    }
    state.commentData = {
      ...state.commentData,
      list,
      count: count + 1,
    };
  },

  setArticleAuthor(state, author) {
    state.articleAuthor = author;
  },

  initCommentData(state, commentData) {
    state.commentData = commentData;
  },

  digg(state, payload) {
    const { commentId, replyId, userId, type } = payload;
    const { list } = state.commentData;
    const comment = list.find(item => item.id === commentId);
    if (!comment) return;
    if (type === 'comment') {
      comment.digg += 1;
      comment.diggUsers = (comment.diggUsers ?? '').concat(`${userId},`);
      comment.isDigg = true;
    } else {
      const reply = comment.replies?.find(item => item.id === replyId);
      if (!reply) return;
      reply.digg += 1;
      reply.diggUsers = (reply.diggUsers ?? '').concat(`${userId},`);
      reply.isDigg = true;
    }
  },

  undigg(state, payload) {
    const { commentId, replyId, userId, type } = payload;
    const { list } = state.commentData;
    const comment = list.find(item => item.id === commentId);
    if (!comment) return;
    if (type === 'comment') {
      comment.digg -= 1;
      comment.diggUsers = comment.diggUsers.replace(`${userId},`, '');
      comment.isDigg = false;
    } else {
      const reply = comment.replies?.find(item => item.id === replyId);
      if (!reply) return;
      reply.digg -= 1;
      reply.diggUsers = reply.diggUsers.replace(`${userId},`, '');
      reply.isDigg = false;
    }
  }
};

const actions = {
  async addComment({ commit, state, rootState }, { data, type = 'comment' }: { data: any, type: 'comment' | 'reply' }) {
    const result = await saveComment({ ...data, userId: rootState.user.user.id }, type);

    if (!result) return false;

    const currentUser = rootState.user.user;
    const articleAuthor = state.articleAuthor;
    isAuthorOrMyself([result], currentUser, articleAuthor);
    if (type === 'comment') {
      commit('addComment', result);
    } else {
      commit('addReply', {
        reply: result,
        commentId: data.commentId
      });
    }

    return true;
  },

  async delComment({ commit }, { id, type = 'comment', commentId }: { id: number, type: 'comment' | 'reply', commentId: number }) {
    const isDel = await deleteById(id, type);
    if (!isDel) return false;

    if (type === 'comment') {
      commit('delComment', id);
    } else {
      commit('delReply', { id, commentId });
    }

    return true;
  },

  async listComment({ commit, state, rootState }, articleId) {
    const commentData = await findCommentList(articleId);
    const currentUser = rootState.user.user;
    if (commentData) {
      isAuthorOrMyself(commentData.list, currentUser, state.articleAuthor);
      commit('initCommentData', commentData);
    }
  },

  async diggComment({ commit, rootState }, { commentId, articleId, replyId, type }: DiggData) {
    const userId = rootState.user.user.id;
    const isSucc = await digg({
      commentId,
      articleId,
      replyId,
      userId,
    }, type);

    if (!isSucc) return false;

    commit('digg', { commentId, userId, articleId, replyId, type });

    return true;
  },

  async undiggComment({ commit, rootState }, { commentId, articleId, replyId, type }: DiggData) {
    const userId = rootState.user.user.id;
    const isSucc = await undigg({
      commentId,
      articleId,
      replyId,
      userId,
    }, type);

    if (!isSucc) return false;

    commit('undigg', { commentId, userId, articleId, replyId, type });

    return true;
  }
};

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
};