import request from '@/utils/request';
import { baseurl } from '@/config';

export async function getNotices() {
  return request(`${baseurl}/notices`);
}

export async function readOneNotice(noticeId) {
  return request(`${baseurl}/notices/readOne/${noticeId}`, {
    method: 'post',
  });
}

export async function sendNotice({ toId, title, content }) {
  return request(`${baseurl}/notices`, {
    method: 'post',
    data: {
      toId,
      title,
      content,
    },
  });
}

export async function readAllNotices() {
  return request(`${baseurl}/notices/readAll`, {
    method: 'post',
  });
}
