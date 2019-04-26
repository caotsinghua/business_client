import {
  getBanks,
  createBank,
  getBank,
  searchBank,
  updateBank,
  getBankJobStaffs,
  addStaffToJob,
  deleteStaffJob,
} from '@/services/banks';

export default {
  namespaced: 'banks',
  state: {
    banks: [],
    currentBank: {},
    staffs: [],
  },
  effects: {
    *getBanks(_, { call, put }) {
      const response = yield call(getBanks);
      if (response) {
        yield put({
          type: 'setBanks',
          payload: response,
        });
      }
    },
    *getBank({ payload }, { call, put }) {
      const { bankId } = payload;
      const response = yield call(getBank, bankId);
      if (response) {
        yield put({
          type: 'setBank',
          payload: response,
        });
      }
      return response;
    },
    *createBank({ payload }, { call, put }) {
      const response = yield call(createBank, payload);
      if (response) {
        yield put({
          type: 'getBanks',
        });
      }
      return response;
    },
    *updateBank({ payload }, { call, put }) {
      const response = yield call(updateBank, payload);
      if (response) {
        yield put({
          type: 'getBank',
          payload: {
            bankId: payload.bankId,
          },
        });
      }
      return response;
    },
    *searchBankByName({ payload }, { call }) {
      return yield call(searchBank, payload.searchWord);
    },
    *getBankJobStaffs({ payload }, { call, put }) {
      const response = yield call(getBankJobStaffs, payload);
      if (response) {
        yield put({
          type: 'setStaffs',
          payload: response,
        });
      }
    },
    *addStaffToJob({ payload }, { call, put }) {
      const response = yield call(addStaffToJob, payload);
      return response;
    },
    *deleteStaffJob({ payload }, { call, put }) {
      const response = yield call(deleteStaffJob, payload.userId);
      return response;
    },
  },
  reducers: {
    setBanks(state, { payload }) {
      return {
        banks: payload.result,
      };
    },
    setBank(state, { payload }) {
      const { result: bank } = payload;
      return {
        ...state,
        currentBank: bank,
      };
    },
    setStaffs(state, { payload }) {
      const { result: staffs } = payload;
      return {
        ...state,
        staffs,
      };
    },
  },
};
