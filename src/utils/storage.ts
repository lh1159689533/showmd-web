import { isJson } from './type';

export default {
  setJson(key: string, json) {
    localStorage.setItem(key, JSON.stringify(json));
  },
  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  },
  getJson(key: string) {
    const value = localStorage.getItem(key);
    if (isJson(value)) {
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