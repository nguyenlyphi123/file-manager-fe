import moment from 'moment';

export const FormattedDateTime = (date) => {
  return moment(date).calendar();
};

export const FormattedDate = (date) => {
  return moment(date).startOf('minute').fromNow();
};

export const Truncate = (str, n) => {
  return str?.length > n ? str.substr(0, n - 1) + '...' : str;
};

export const convertBytesToReadableSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  let sizeIndex = 0;
  let size = bytes;

  while (size >= 1024 && sizeIndex < sizes.length - 1) {
    size /= 1024;
    sizeIndex++;
  }

  return `${size.toFixed(2)} ${sizes[sizeIndex]}`;
};

export const validateEmail = (email) => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};
