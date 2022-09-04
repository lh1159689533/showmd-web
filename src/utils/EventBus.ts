/**
 * 事件总线
 */
class EventBus {
  private events;

  constructor() {
    this.events = {};
  }

  /**
   * 触发事件
   * @param eventName 事件名
   * @param params 参数
   */
  emit(eventName: string, ...params) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (fn) {
        fn(...params);
      });
    }
  }

  /**
   * 监听事件
   * @param eventName 事件名
   * @param fn 回调函数
   */
  on(eventName: string, fn: (args?) => void) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  }

  /**
   * 关闭监听
   * @param eventName 事件名
   * @param fn 回调函数
   */
  off(eventName: string, fn: (args?) => void) {
    if (this.events[eventName]) {
      for (let i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  }
}

export default new EventBus();