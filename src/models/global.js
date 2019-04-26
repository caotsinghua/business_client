import { getNotices, readAllNotices, readOneNotice, sendNotice } from '@/services/notices';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
  },

  effects: {
    *getNotices(_, { call, put }) {
      const response = yield call(getNotices);
      yield put({
        type: 'saveNotices',
        payload: response.result,
      });
    },
    *readAllNotices(_, { call, put }) {
      yield call(readAllNotices);
      yield put({
        type: 'saveNotices',
        payload: [],
      });
    },
    *readOneNotice(
      {
        payload: { noticeId },
      },
      { put, call }
    ) {
      yield call(readOneNotice, noticeId);
      yield put({
        type: 'deleteOneNotice',
        payload: noticeId,
      });
    },
    *sendNotice({ payload }, { call }) {
      yield call(sendNotice, payload);
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    deleteOneNotice(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(notice => notice.id !== payload),
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
