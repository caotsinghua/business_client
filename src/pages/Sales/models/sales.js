import {
  createModelAndGroup,
  createActivity,
  getActivities,
  getActivity,
  bindManager,
  bindVerifyer,
  changeStatus,
  changeVerifyStatus,
  getGroups,
  updateActivity,
} from '@/services/sales';

export default {
  namespaced: 'sales',
  state: {
    list: [],
    total: 0,
    page: 1,
    pageSize: 10,
    group: {},
    currentActivity: {},
    groups: [],
  },
  effects: {
    *getActivities(
      {
        payload: { page, pageSize },
      },
      { call, put }
    ) {
      const response = yield call(getActivities, { page, pageSize });
      if (response) {
        const { result } = response;
        yield put({
          type: 'setSalesList',
          payload: result,
        });
      }
    },
    *getActivity(
      {
        payload: { activityId },
      },
      { call, put }
    ) {
      const response = yield call(getActivity, activityId);
      if (response) {
        yield put({
          type: 'setActivity',
          payload: response.result,
        });
      }
    },
    *createActivity({ payload }, { call, put }) {
      const response = yield call(createActivity, payload);
      if (response) {
        yield put({
          type: 'setActivity',
          payload: response.result,
        });
      }
    },
    *createModelAndGroup({ payload }, { call, put }) {
      const response = yield call(createModelAndGroup, payload);
      if (response) {
        yield put({
          type: 'setGroup',
          payload: response.result.group,
        });
      }
      return response;
    },
    *bindManager(
      {
        payload: { activityId, managerId },
      },
      { call, put }
    ) {
      const response = yield call(bindManager, { activityId, managerId });
      yield put({
        type: 'global/sendNotice',
        payload: {
          toId: managerId,
          title: '您有新的活动需要处理',
          content: `营销活动${activityId}需要您接管`,
        },
      });
      yield put({
        type: 'getActivities',
        payload: {
          page: 1,
          pageSize: 10,
        },
      });
      return response;
    },
    *bindVerifyer({ payload }, { call, put }) {
      const response = yield call(bindVerifyer, payload);
      yield put({
        type: 'global/sendNotice',
        payload: {
          toId: payload.verifyerId,
          title: '你收到了新的审批申请',
          content: `营销活动${payload.activityId}需要审批`,
        },
      });
      yield put({
        type: 'getActivities',
        payload: {
          page: 1,
          pageSize: 10,
        },
      });
      return response;
    },
    *changeStatus({ payload }, { call, put }) {
      const response = yield call(changeStatus, payload);
      if (response) {
        yield put.resolve({
          type: 'getActivity',
          payload,
        });
      }
      return response;
    },
    *changeVerifyStatus(
      {
        payload: { activity, status, nopass_reason: nopassReason },
      },
      { call, put }
    ) {
      const response = yield call(changeVerifyStatus, {
        activityId: activity.id,
        status,
        nopass_reason: nopassReason,
      });
      yield put({
        type: 'global/sendNotice',
        payload: {
          toId: activity.creater.id,
          title: '审核结果出来了',
          content: `活动:${activity.name} 审批${status === 'pass' ? '通过了' : '不通过'}`,
        },
      });
      yield put({
        type: 'getActivities',
        payload: {
          page: 1,
          pageSize: 10,
        },
      });
      return response;
    },
    *getGroups(_, { call, put }) {
      const response = yield call(getGroups);
      if (response) {
        yield put({
          type: 'setGroups',
          payload: response.result,
        });
      }
    },
    *updateActivity({ payload }, { call, put }) {
      const response = yield call(updateActivity, payload);
      if (response) {
        yield put({
          type: 'getActivity',
          payload,
        });
      }
      return response;
    },
  },
  reducers: {
    setSalesList(state, { payload }) {
      return {
        ...state,
        list: payload.list,
        page: +payload.page,
        pageSize: +payload.pageSize,
        total: +payload.total,
      };
    },
    setActivity(state, { payload }) {
      return {
        ...state,
        currentActivity: payload,
      };
    },
    setGroup(state, { payload }) {
      return {
        ...state,
        group: payload,
      };
    },
    setGroups(state, { payload }) {
      return {
        ...state,
        groups: payload,
      };
    },
  },
};
