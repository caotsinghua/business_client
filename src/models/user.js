import { getCurrentUser, updateUserInfo, updatePassword, searchUser } from '@/services/user';

export default {
  namespace: 'user',

  state: {
    currentUser: {
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    },
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const { result: user } = yield call(getCurrentUser);
      yield put({
        type: 'saveCurrentUser',
        payload: user,
      });
    },
    *updateUser({ payload }, { call, put }) {
      yield call(updateUserInfo, payload);
      yield put({ type: 'fetchCurrent' });
    },
    *updateUserPassword({ payload }, { call }) {
      const response = yield call(updatePassword, payload);
      return response;
    },
    *searchUserByName({ payload: {searchWord} }, { call }) {
      return yield call(searchUser, searchWord);
    },
  },

  reducers: {
    saveCurrentUser(state, { payload }) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          ...payload,
        },
      };
    },
  },
};
