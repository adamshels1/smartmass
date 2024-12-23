import moment from 'moment/moment';

export const isDateToday = (date: string) => {
  const specificDate = moment(date);
  return moment().isSame(specificDate, 'day');
};
