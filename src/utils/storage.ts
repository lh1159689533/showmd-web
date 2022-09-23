import { isJson } from './type';

export default {
  setJson(key: string, json) {
    localStorage.setItem(key, JSON.stringify(json));
  },
  getJson(key: string) {
    const value = localStorage.getItem(key);
    if (isJson(value)) {
      return JSON.parse(value);
    }
    return null;
  },
  remove(key: string) {
    localStorage.removeItem(key);
  }
};