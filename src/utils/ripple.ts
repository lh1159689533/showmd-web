/**
 * 🎨 波纹效果工具函数
 * 为按钮和其他交互元素添加现代化的波纹点击效果
 */

interface RippleOptions {
  color?: string;
  duration?: number;
  opacity?: number;
}

export function createRipple(
  element: HTMLElement, 
  event: MouseEvent, 
  options: RippleOptions = {}
): void {
  const {
    color = 'rgba(255, 255, 255, 0.4)',
    duration = 600,
    opacity = 0.4
  } = options;

  // 获取元素位置和尺寸
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  // 创建波纹元素
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background-color: ${color};
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    opacity: ${opacity};
    pointer-events: none;
    transform: scale(0);
    animation: ripple-animation ${duration}ms ease-out;
    z-index: 1000;
  `;

  // 确保父元素有相对定位
  const computedStyle = getComputedStyle(element);
  if (computedStyle.position === 'static') {
    element.style.position = 'relative';
  }

  // 确保父元素有 overflow: hidden
  element.style.overflow = 'hidden';

  // 添加波纹动画样式
  if (!document.querySelector('#ripple-keyframes')) {
    const style = document.createElement('style');
    style.id = 'ripple-keyframes';
    style.textContent = `
      @keyframes ripple-animation {
        0% {
          transform: scale(0);
          opacity: ${opacity};
        }
        50% {
          opacity: ${opacity * 0.5};
        }
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // 添加到元素中
  element.appendChild(ripple);

  // 动画结束后移除
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple);
    }
  }, duration);
}

/**
 * Vue 3 指令：v-ripple
 */
export const rippleDirective = {
  mounted(el: HTMLElement, binding: any) {
    const options = binding.value || {};
    
    const handleClick = (event: MouseEvent) => {
      // 如果元素被禁用，不显示波纹
      if (el.hasAttribute('disabled') || el.classList.contains('is-disabled')) {
        return;
      }
      
      createRipple(el, event, options);
    };

    el.addEventListener('click', handleClick);
    
    // 存储事件处理器以便后续清理
    (el as any)._rippleHandler = handleClick;
  },

  unmounted(el: HTMLElement) {
    if ((el as any)._rippleHandler) {
      el.removeEventListener('click', (el as any)._rippleHandler);
      delete (el as any)._rippleHandler;
    }
  }
};

/**
 * 自动为 Element Plus 按钮添加波纹效果
 */
export function initAutoRipple(): void {
  // 监听 DOM 变化，自动为新添加的按钮添加波纹效果
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          
          // 为按钮添加波纹效果
          const buttons = element.querySelectorAll('.el-button:not([data-ripple])');
          buttons.forEach((button) => {
            const btn = button as HTMLElement;
            btn.setAttribute('data-ripple', 'true');
            
            // 根据按钮类型设置不同的波纹颜色
            let rippleColor = 'rgba(255, 255, 255, 0.4)';
            if (btn.classList.contains('el-button--default')) {
              rippleColor = 'rgba(139, 92, 246, 0.3)';
            }
            
            btn.addEventListener('click', (event: MouseEvent) => {
              if (!btn.hasAttribute('disabled') && !btn.classList.contains('is-disabled')) {
                createRipple(btn, event, { color: rippleColor });
              }
            });
          });
        }
      });
    });
  });

  // 开始观察
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // 为已存在的按钮添加波纹效果
  document.querySelectorAll('.el-button:not([data-ripple])').forEach((button) => {
    const btn = button as HTMLElement;
    btn.setAttribute('data-ripple', 'true');
    
    let rippleColor = 'rgba(255, 255, 255, 0.4)';
    if (btn.classList.contains('el-button--default')) {
      rippleColor = 'rgba(139, 92, 246, 0.3)';
    }
    
    btn.addEventListener('click', (event: MouseEvent) => {
      if (!btn.hasAttribute('disabled') && !btn.classList.contains('is-disabled')) {
        createRipple(btn, event, { color: rippleColor });
      }
    });
  });
}