import { getStatistic } from '@/services/statistic';

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
        yield put({
          type: 'setStatistic',
          payload: response.result,
        });
      }
    },
  },
  reducers: {
    setStatistic(state, { payload }) {
      return {
        ...state,
        customers: payload.customers,
        statistic: payload.statistic,
      };
    },
  },
};
