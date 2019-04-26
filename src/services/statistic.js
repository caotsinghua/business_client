import request from '@/utils/request';
import { baseurl } from '../config';

export async function getStatistic(activityId) {
  return request(`${baseurl}/statistic/${activityId}`);
}

export async function setTarget({
  activityId,
  target_money: targetMoney,
  target_customers_count: targetCustomersCount,
}) {
  return request(`${baseurl}/statistic/setTarget/${activityId}`, {
    method: 'post',
    data: {
      target_money: targetMoney,
      target_customers_count: targetCustomersCount,
    },
  });
}

export async function contactCustomer({ activityId, customerId }) {
  console.log({ activityId, customerId });
  return request(`${baseurl}/statistic/contactCustomer`, {
    method: 'post',
    data: {
      activityId,
      customerId,
    },
  });
}

export async function joinActivity({ activityId, customerId, money }) {
  return request(`${baseurl}/statistic/joinActivity`, {
    method: 'post',
    data: {
      activityId,
      customerId,
      money,
    },
  });
}
