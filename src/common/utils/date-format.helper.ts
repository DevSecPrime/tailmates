import moment from "moment";

/**
 *Convert date to timestamp
 * @param date
 * @returns
 */
export const dateToTimeStamp = (date: Date | number) => {
  return moment.utc(date).valueOf();
};

/**
 * set date format
 * @param date
 * @param formate
 * @returns
 */
export const dateFormat = (date: Date, formate = "DD/MM/YYYY") => {
  return moment.utc(date).format(formate);
};
