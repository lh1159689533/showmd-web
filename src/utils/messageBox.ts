import { ElMessageBox as messageBox } from 'element-plus';

const CONFIRM_DEFAULT_OPTIONS = {
  cancelButtonText: '取消',
  confirmButtonText: '确定'
};

export function confirm(message: string, ...args) {
  if (typeof args[0] === 'string') {
    messageBox.confirm(message, args[0], { ...CONFIRM_DEFAULT_OPTIONS, ...(args?.[1] ?? {}) });
  } else {
    messageBox.confirm(message, { ...CONFIRM_DEFAULT_OPTIONS, ...(args[0] ?? {}) });
  }
}