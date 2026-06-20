import moment from 'moment';
/**
 * Convert date to timestamp
 * @param date
 * @returns
 */
export const dateToTimestamp = (date: Date | number) => {
  if (!date) return null;
  return moment.utc(date).valueOf();
};

