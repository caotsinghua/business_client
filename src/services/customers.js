import { baseurl } from '@/config';
import request from '@/utils/request';

const url = `${baseurl}/customers`;

export async function getCustomers({ page, pageSize }) {
  return request(`${url}?page=${page}&pageSize=${pageSize}`);
}
export async function getCustomer(customerId) {
  return request(`${url}/${customerId}`);
}
export async function getDepartmentCustomer(departmentCustomerId) {
  return request(`${url}/departmentCustomers/${departmentCustomerId}`);
}
export async function getDepartmentCustomers({ page, pageSize }) {
  return request(`${url}/departmentCustomers?page=${page}&pageSize=${pageSize}`);
}
export async function createCustomer({
  work,
  job,
  title,
  certificate_type: certificateType,
  certificate_number: certificateNumber,
  name,
  sex,
  education_degree: educationDegree,
  marry_status: marryStatus,
  household,
  work_time: workTime,
  birthday,
  description,
  email,
  address,
  phone_number: phoneNumber,
}) {
  return request(`${url}`, {
    method: 'post',
    data: {
      work,
      job,
      title,
      certificate_type: certificateType,
      certificate_number: certificateNumber,
      name,
      sex,
      education_degree: educationDegree,
      marry_status: marryStatus,
      household,
      work_time: workTime,
      birthday,
      description,
      email,
      address,
      phone_number: phoneNumber,
    },
  });
}

export async function updateCustomer({
  customerId,
  work,
  job,
  title,
  certificate_type: certificateType,
  certificate_number: certificateNumber,
  name,
  sex,
  education_degree: educationDegree,
  marry_status: marryStatus,
  household,
  work_time: workTime,
  birthday,
  description,
  email,
  address,
  phone_number: phoneNumber,
  managerId,
}) {
  return request(`${url}/${customerId}`, {
    method: 'put',
    data: {
      work,
      job,
      title,
      certificate_type: certificateType,
      certificate_number: certificateNumber,
      name,
      sex,
      education_degree: educationDegree,
      marry_status: marryStatus,
      household,
      work_time: workTime,
      birthday,
      description,
      email,
      address,
      phone_number: phoneNumber,
      managerId,
    },
  });
}

export async function createDepartmentCustomer({
  name,
  type,
  contact_person: contactPerson,
  phone_number: phoneNumber,
  owner,
  description,
}) {
  return request(`${url}/departmentCustomers`, {
    method: 'post',
    data: {
      name,
      type,
      contact_person: contactPerson,
      phone_number: phoneNumber,
      owner,
      description,
    },
  });
}

export async function updateDepartmentCustomer({
  departmentCustomerId,
  name,
  type,
  contact_person: contactPerson,
  phone_number: phoneNumber,
  owner,
  description,
  managerId,
}) {
  return request(`${url}/departmentCustomers/${departmentCustomerId}`, {
    method: 'put',
    data: {
      name,
      type,
      contact_person: contactPerson,
      phone_number: phoneNumber,
      owner,
      description,
      managerId,
    },
  });
}
