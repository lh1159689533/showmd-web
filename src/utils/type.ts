import dayjs from "dayjs";

export const isJsonString = (str: string): boolean => {
  try {
    if (typeof JSON.parse(str) === 'object') {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export const isJson = (obj: any): boolean => ['[object Object]', '[object Array]'].includes(Object.prototype.toString.call(obj));

export const isArray = (ary) => Array.isArray(ary);

export const formatDate = (date) => {
  if (dayjs().isSame(date, 'day')) {
    return dayjs(date).fromNow();
  } else if (dayjs().isSame(date, 'year')) {
    return dayjs(date).format('MM-DD');
  } else {
    return dayjs(date).format('YYYY-MM-DD');
  }
};