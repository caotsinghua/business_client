import request from '@/utils/request';
import { baseurl } from '@/config';
// 获取当前用户所在的银行及其下属支行
export async function getBanks() {
  return request(`${baseurl}/banks`);
}
export async function getUserBanks() {
  return request(`${baseurl}/banks/userBanks`);
}
export async function getBank(bankId) {
  return request(`${baseurl}/banks/${bankId}`);
}
export async function updateBank({
  bankId,
  name,
  address,
  phone_number: phoneNumber,
  description,
  leaderId,
  parentBankId,
}) {
  return request(`${baseurl}/banks/${bankId}`, {
    method: 'put',
    data: {
      name,
      address,
      phone_number: phoneNumber,
      description,
      leaderId,
      parentBankId,
    },
  });
}
// 管理员创建银行
export async function createBank({ name, address, phone_number: phoneNumber, description }) {
  return request(`${baseurl}/banks`, {
    method: 'post',
    data: {
      name,
      address,
      phone_number: phoneNumber,
      description,
    },
  });
}
// 以现在用户所在的银行为parent，创建支行
export async function createSubBank({ name, address, phone_number: phoneNumber, description }) {
  return request(`${baseurl}/banks/userBanks`, {
    method: 'post',
    data: {
      name,
      address,
      phone_number: phoneNumber,
      description,
    },
  });
}

export async function searchBank(searchWord) {
  return request(`${baseurl}/banks/search?searchWord=${searchWord}`);
}

export async function getBankJobStaffs({ bankId, jobId }) {
  return request(`${baseurl}/banks/staffsWithJob?bankId=${bankId}&jobId=${jobId}`);
}

export async function addStaffToJob({ userId, jobId }) {
  return request(`${baseurl}/banks/staffToJob`, {
    method: 'post',
    data: {
      userId,
      jobId,
    },
  });
}
export async function deleteStaffJob(userId) {
  return request(`${baseurl}/banks/staffFromJob/${userId}`, {
    method: 'delete',
  });
}
