import request from '@/utils/request';
import { baseurl } from '../config';

export async function findVerify(verifyId) {
  return request(`${baseurl}/verifies/${verifyId}`);
}

export const a = 1;
