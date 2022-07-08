import { isJson } from './type';

export default {
  setJson(key, json) {
    sessionStorage.setItem(key, JSON.stringify(json));
  },
  getJson(key) {
    const value = sessionStorage.getItem(key);
    if (isJson(value)) {
      return JSON.parse(value);
    }
    return null;
  }
};