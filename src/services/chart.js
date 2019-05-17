import { baseurl } from '@/config';
import request from '@/utils/request';

export async function getChart() {
  return request(`${baseurl}/chart`);
}

export const a = 1;
