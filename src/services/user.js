import request from '@/utils/request';
import { baseurl } from '../config';

export async function getCurrentUser() {
  return request(`${baseurl}/user/info`);
}

export async function updateUserInfo({
  name,
  sex,
  education_degree: educationDegree,
  certificate_card: certificateCard,
  email,
  address,
  phone_number: phoneNumber,
  birthday,
}) {
  return request(`${baseurl}/user/info`, {
    method: 'put',
    data: {
      name,
      sex,
      education_degree: educationDegree,
      certificate_card: certificateCard,
      email,
      address,
      phone_number: phoneNumber,
      birthday,
    },
  });
}

export async function updatePassword({ oldPassword, newPassword }) {
  return request(`${baseurl}/user/password`, {
    method: 'patch',
    data: {
      old_password: oldPassword,
      new_password: newPassword,
    },
  });
}
// todo-获取密码强度
export async function getPasswordLevel() {
  return 1;
}

export async function searchUser(searchWord) {
  return request(`${baseurl}/user/search?searchWord=${searchWord}`);
}

export async function searchVerifyer(searchWord) {
  return request(`${baseurl}/user/searchVerifyer?searchWord=${searchWord}`);
}

export async function searchManagers(searchWord) {
  return request(`${baseurl}/user/searchManagers?searchWord=${searchWord}`);
}
