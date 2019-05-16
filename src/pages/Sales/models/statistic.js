import { getStatistic, getRecords } from '@/services/statistic';
import { createMailRecord } from '@/services/sales';

export default {
  namespaced: 'statistic',
  state: {
    customers: [],
    statistic: {},
  },
  effects: {
    *getStatistic(
      {
        payload: { activityId },
      },
      { call, put }
    ) {
      const response = yield call(getStatistic, activityId);

      if (response) {
        const { customers } = response.result;
        const customersWithRecords = yield Promise.all(
          customers.map(async customer => {
            const records = await getRecords(customer);
            return {
              ...customer,
              records: records.result,
            };
          })
        );
        yield put({
          type: 'setStatistic',
          payload: {
            ...response.result,
            customersWithRecords,
          },
        });
      }
    },
    *createMailRecord({ payload }, { call }) {
      const response = yield call(createMailRecord, payload);
      return response;
    },
  },
  reducers: {
    setStatistic(state, { payload }) {
      return {
        ...state,
        customers: payload.customers,
        statistic: payload.statistic,
        customersWithRecords: payload.customersWithRecords,
      };
    },
  },
};
