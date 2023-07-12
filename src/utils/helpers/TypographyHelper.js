import moment from 'moment';

export const FormattedDateTime = (date) => {
  return moment(date).calendar();
};

export const Truncate = (str, n) => {
  return str?.length > n ? str.substr(0, n - 1) + '...' : str;
};
