import { ElNotification as notify } from 'element-plus';
import 'element-plus/theme-chalk/el-notification.css';

interface Props {
  message: string;
  title?: string;
  duration?: number;
  offset?: number;
  showClose?: boolean;
}

const duration = 2000;
const offset = 70;

/**
 * 使用ElNotification实现全局消息提示
 */
export default {
  success(message: string | Props) {
    notify.success(this.parseProps(message));
  },
  error(message: string) {
    notify.error(this.parseProps(message));
  },
  warn(message: string) {
    notify.warning(this.parseProps(message));
  },
  info(message: string) {
    notify.info(this.parseProps(message));
  },
  parseProps(props: string | Props) {
    if (typeof props === 'string') {
      return {
        message: props,
        duration,
        showClose: false,
        offset
      };
    }
    return {
      duration,
      showClose: false,
      offset,
      ...props,
    };
  }
};