import { getChart } from '@/services/chart';

export default {
  namespace: 'chart',

  state: {
    visitData: [],
    salesData: [],
    loading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getChart);
      if(response){
        yield put({
        type: 'save',
        payload: response.result,
      });
      }
    },
    *fetchSalesData(_, { call, put }) {
      const response = yield call(getChart);
      if(response){
        yield put({
        type: 'save',
        payload: response.result.salesData,
      });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        visitData: [],
        salesData: [],
      };
    },
  },
};
