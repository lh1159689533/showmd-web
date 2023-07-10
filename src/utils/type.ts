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