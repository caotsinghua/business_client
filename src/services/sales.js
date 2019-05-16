import request from '@/utils/request';
import { baseurl } from '../config';

export async function createModelAndGroup({
  name,
  description,
  income_min: incomeMin,
  income_max: incomeMax,
  points_min: pointsMin,
  points_max: pointsMax,
  debt_min: debtMin,
  debt_max: debtMax,
  deposit_min: depositMin,
  deposit_max: depositMax,
  loan_min: loanMin,
  loan_max: loanMax,
  danger_level: dangerLevel,
  creadit_level: creaditLevel,
  back_ability: backAbility,
  is_department: isDepartment,
}) {
  return request(`${baseurl}/groupModels`, {
    method: 'post',
    data: {
      name,
      description,
      income_min: incomeMin,
      income_max: incomeMax,
      points_min: pointsMin,
      points_max: pointsMax,
      debt_min: debtMin,
      debt_max: debtMax,
      deposit_min: depositMin,
      deposit_max: depositMax,
      loan_min: loanMin,
      loan_max: loanMax,
      danger_level: dangerLevel,
      creadit_level: creaditLevel,
      back_ability: backAbility,
      is_department: isDepartment,
    },
  });
}
export async function getGroups() {
  return request(`${baseurl}/groupModels`);
}

export async function getActivities({ page, pageSize }) {
  return request(`${baseurl}/activities?page=${page}&pageSize=${pageSize}`);
}

export async function getActivity(activityId) {
  return request(`${baseurl}/activities/${activityId}`);
}
export async function createActivity({
  start_time: startTime,
  end_time: endTime,
  groupId,
  description,
  other_data: otherData,
  target,
  name,
  file,
}) {
  return request(`${baseurl}/activities`, {
    method: 'post',
    data: {
      start_time: startTime,
      end_time: endTime,
      groupId,
      description,
      other_data: otherData,
      target,
      name,
      file,
    },
  });
}

export async function bindManager({ activityId, managerId }) {
  return request(`${baseurl}/activities/${activityId}/bindManager`, {
    method: 'patch',
    data: {
      managerId,
    },
  });
}

export async function bindVerifyer({ activityId, verifyerId }) {
  return request(`${baseurl}/activities/${activityId}/bindVerifyer`, {
    method: 'patch',
    data: {
      verifyerId,
    },
  });
}

export async function changeVerifyStatus({ activityId, status, nopass_reason: nopassReason }) {
  return request(`${baseurl}/activities/${activityId}/verifyStatus`, {
    method: 'patch',
    data: {
      status,
      nopass_reason: nopassReason,
    },
  });
}
export async function changeStatus({ activityId, status }) {
  return request(`${baseurl}/activities/${activityId}/status`, {
    method: 'patch',
    data: {
      status,
    },
  });
}

export async function updateActivity({
  activityId,
  name,
  start_time: startTime,
  end_time: endTime,
  description,
  target,
  other_data: otherData,
  file,
}) {
  return request(`${baseurl}/activities/${activityId}`, {
    method: 'put',
    data: {
      name,
      start_time: startTime,
      end_time: endTime,
      description,
      target,
      other_data: otherData,
      file,
    },
  });
}
// 获取客户参加过的活动
export async function getCusotomerActivities(customerId) {
  return request(`${baseurl}/activities/byCustomerId/${customerId}`);
}

export async function createContactRecord({ customerId, activityId, type }) {
  return request(`${baseurl}/activities/${activityId}/records`, {
    method: 'post',
    data: {
      customerId,
      type,
    },
  });
}
export async function createMailRecord({ customerId, activityId, to, subject, html }) {
  return request(`${baseurl}/activities/${activityId}/mailRecord`, {
    method: 'post',
    data: {
      customerId,
      to,
      subject,
      html,
    },
  });
}
export async function getCustomerActivityRecords({ activityId, customerId }) {
  return request(`${baseurl}/activities/${activityId}/recordsByCustomer?customerId=${customerId}`);
}
export async function createActivityCutomerPriority({ customerId, activityId, priority }) {
  return request(`${baseurl}/activities/${activityId}/customerPriority`, {
    method: 'post',
    data: {
      customerId,
      priority,
    },
  });
}

export async function updateRecord({ recordId, success }) {
  return request(`${baseurl}/records/${recordId}`, {
    method: 'put',
    data: {
      success,
    },
  });
}
