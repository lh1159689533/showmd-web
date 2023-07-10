import { isJsonString, isArray } from './type';

export default {
  setJson(key: string, json) {
    localStorage.setItem(key, JSON.stringify(json));
  },
  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  },
  /**
   * 同一个key中添加值
   * @param key 键
   * @param json 值
   */
  addJson(key: string, json) {
    const value = this.getJson(key);
    if (isArray(value)) {
      value.push(json);
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  getJson(key: string) {
    const value = localStorage.getItem(key);
    if (isJsonString(value)) {
      return JSON.parse(value);
    }
    return null;
  },
  getItem(key: string) {
    return localStorage.getItem(key);
  },
  remove(key: string) {
    localStorage.removeItem(key);
  }
};