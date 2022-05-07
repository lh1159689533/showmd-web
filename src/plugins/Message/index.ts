/**
 * 全局消息提示组件
 */
import { App, createVNode, render } from 'vue';
import Message from './Message.vue';

interface MessageProps {
  content: string;
  type?: string;
  duration?: number;
}

const typeKeys = ['info', 'warn', 'error', 'success'];

let timer: NodeJS.Timeout = null;

const message = (content, duration, type) => {
  const message_div = document.querySelector('#showmd-messages');
  const message_container = document.createElement('div');
  message_container.setAttribute('class', 'text-right');

  function close() {
    vnode.el?.setAttribute('class', `${vnode.el?.className} bounceOutRight`);
    setTimeout(() => message_div.removeChild(message_container), 300);
  }

  function setTimer() {
    return setTimeout(() => {
      close();
    }, duration);
  }

  const vnode = createVNode(Message, { content, type, isShow: true, close: duration === 0 ? close : null });
  render(vnode, message_container);
  message_div.appendChild(message_container);

  if (duration !== 0) {
    timer = setTimer();

    vnode.el?.addEventListener('mouseenter', () => {
      clearTimeout(timer);
      timer = null;
    });
    vnode.el?.addEventListener('mouseleave', () => {
      timer = setTimer();
    });
  }
};

const api = {};
typeKeys.map(key => {
  api[key] = (props: string | MessageProps) => {
    let content: string;
    let duration: number = 3000;
    if (typeof props === 'string') {
      content = props;
    } else {
      content = props?.content;
      duration = props?.duration ?? 3000;
    }
    message(content, duration, key);
  };
});

export default {
  install(app: App) {
    app.config.globalProperties.$message = api;
  }
};