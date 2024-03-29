import { ElMessageBox as messageBox } from 'element-plus';
import 'element-plus/theme-chalk/el-message-box.css';

const CONFIRM_DEFAULT_OPTIONS = {
  cancelButtonText: '取消',
  confirmButtonText: '确定',
  closeOnClickModal: false
};

export function confirm(message: any, ...args) {
  if (typeof args[0] === 'string') {
    messageBox.confirm(message, args[0], { ...CONFIRM_DEFAULT_OPTIONS, ...(args?.[1] ?? {}) });
  } else {
    messageBox.confirm(message, { ...CONFIRM_DEFAULT_OPTIONS, ...(args[0] ?? {}) });
  }
}