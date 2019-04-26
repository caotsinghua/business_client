import { register } from '@/services/api';
// import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(register, payload);
      console.log("注册完成")
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      reloadAuthorized();
      console.log("触发注册更新",{payload})
      return {
        status: payload&&payload.success,
      };
    },
  },
};
