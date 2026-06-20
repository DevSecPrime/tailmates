import { BASE_URL } from '../constants/app.constant';

/**
 * Get storage path
 * @param value string
 * @returns string
 */
export const storagePath = (value = '') => {
  // eslint-disable-next-line prefer-template
  return BASE_URL + `/storage/${value}`;
};
