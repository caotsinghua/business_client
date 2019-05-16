import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  getDepartmentCustomers,
  getDepartmentCustomer,
  updateDepartmentCustomer,
  createDepartmentCustomer,
} from '@/services/customers';

import { getCusotomerActivities } from '@/services/sales';

export default {
  namespaced: 'customers',
  state: {
    total: 0,
    page: 1,
    pageSize: 10,
    data: [],
    currentCustomer: {},
  },
  effects: {
    *getCustomers(
      {
        payload: { page = 1, pageSize = 10 },
      },
      { call, put }
    ) {
      const response = yield call(getCustomers, { page, pageSize });
      if (response && response.success) {
        yield put({
          type: 'setCustomers',
          payload: response.result,
        });
      }
    },
    *getDepartmentCustomers(
      {
        payload: { page = 1, pageSize = 10 },
      },
      { call, put }
    ) {
      const response = yield call(getDepartmentCustomers, { page, pageSize });
      if (response && response.success) {
        yield put({
          type: 'setCustomers',
          payload: response.result,
        });
      }
    },
    *getDepartmentCustomer(
      {
        payload: { departmentCustomerId },
      },
      { call, put }
    ) {
      const response = yield call(getDepartmentCustomer, departmentCustomerId);
      if (response && response.success) {
        const { result } = response;
        yield put({
          type: 'setCustomer',
          payload: result,
        });
      }
    },
    *getCustomer(
      {
        payload: { customerId },
      },
      { call, put }
    ) {
      const response = yield call(getCustomer, customerId);
      const activitiesRes = yield call(getCusotomerActivities, customerId);
      if (response && activitiesRes) {
        const { result } = response;
        yield put({
          type: 'setCustomer',
          payload: {
            ...result,
            activities: activitiesRes.result,
          },
        });
      }
    },
    *updateCustomer({ payload }, { call, put }) {
      const response = yield call(updateCustomer, payload);
      if (response && response.success) {
        yield put({
          type: 'getCustomer',
          payload,
        });
        return response;
      }
      return null;
    },
    *updateDepartmentCustomer({ payload }, { call, put }) {
      const response = yield call(updateDepartmentCustomer, payload);
      if (response && response.success) {
        yield put({
          type: 'getDepartmentCustomer',
          payload,
        });
        return response;
      }
      return null;
    },
    *createDepartmentCustomer({ payload }, { call }) {
      const response = yield call(createDepartmentCustomer, payload);
      return response;
    },
    *createCustomer({ payload }, { call }) {
      const response = yield call(createCustomer, payload);
      return response;
    },
  },
  reducers: {
    setCustomers(state, { payload }) {
      return {
        ...state,
        ...payload,
        total: +payload.total,
        page: +payload.page,
        pageSize: +payload.pageSize,
      };
    },
    setCustomer(state, { payload }) {
      return {
        ...state,
        currentCustomer: payload,
      };
    },
  },
};
