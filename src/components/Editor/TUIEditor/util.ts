import {
  createElement,
  querySelector,
  querySelectorAll,
  getElementById,
  getBoundingClientRect,
  findNodeByClassName,
  toArray,
  hidden,
  visible,
  addClass,
  removeClass,
  hasClass,
  addStyle,
  addEventListener,
  removeChild,
  appendChild,
  css,
} from '../domUtil';
import Constants from '@src/constants';
import gsap from 'gsap';
import Prism from 'prismjs';
import { TUIEditorProps } from './types';

interface IPopupItem {
  label: string;
  value: string;
  path?: string;
}

const createTooltip = (content: string, className = '') => {
  const useTooltip = (top: number, left: number) =>
    createElement(
      'div',
      { class: `toastui-editor-tooltip ${className}`, style: `top: ${top}px; left: ${left}px` },
      createElement('div', { class: 'toastui-editor-tooltip-body' }, createElement('span', { text: content }))
    );

  return createElement('span', {
    text: content,
    style: 'max-width:16ch;display:inline-block',
    class: 'truncate',
    onmouseover: (e: MouseEvent) => {
      const tooltip = useTooltip(e.clientY, e.clientX);
      appendChild(tooltip);
    },
    onmouseleave: () => {
      removeChild('toastui-editor-tooltip');
    },
  });
};

/**
 * 创建主题下拉列表
 * @param menus 列表项
 * @param className 列表css类名
 * @param pos 显示的位置
 * @param cb 点击列表子项的回调
 */
const createPopup = (
  menus: IPopupItem[],
  className: string,
  pos: { top: number; left: number },
  cb: (item: IPopupItem) => void,
  defaultActive?: string
) => {
  return createElement(
    'div',
    { class: `toastui-editor-popup ${className}`, style: `top: ${pos.top}px; left: ${pos.left}px` },
    createElement(
      'div',
      { class: 'toastui-editor-popup-body' },
      createElement(
        'ul',
        {},
        ...menus.map((menu) =>
          createElement('li', {
            'data-type': menu.value,
            text: menu.label,
            class: `${menu.value === defaultActive ? 'active' : ''}`,
            onclick: (e: Event) => {
              const target = e.target as HTMLElement;
              removeClass(findNodeByClassName(toArray(target.parentElement.childNodes), 'active'), 'active');
              addClass(target, 'active');
              cb(menu);
            },
          })
        )
      )
    )
  );
};

/**
 * 设置代码主题
 * @param codeTheme 代码主题名称
 * @param cdn 代码主题cdn前缀
 */
const setCodeTheme = (codeTheme: string, cdn = Constants.CDN) => {
  if (!Constants.CODE_THEME.includes(codeTheme)) {
    return;
  }
  const codeStyle = getElementById('tuiEditorCodeThemeStyle') as HTMLLinkElement;
  const href = `${cdn}/prism-${codeTheme}.css`;
  if (!codeStyle) {
    addStyle('tuiEditorCodeThemeStyle', href);
  } else if (codeStyle.href !== href) {
    codeStyle.remove();
    addStyle('tuiEditorCodeThemeStyle', href);
  }
};

/**
 * 设置内容主题
 * @param contentTheme 内容主题名称
 * @param path 内容主题http路径
 */
const setContentTheme = (contentTheme: string, path: string) => {
  if (!contentTheme || !path) {
    return;
  }
  const contentStyle = getElementById('tuiEditorContentThemeStyle') as HTMLLinkElement;
  const cssPath = `${path}/${contentTheme}.css`;
  if (!contentStyle) {
    addStyle('tuiEditorContentThemeStyle', cssPath);
  } else if (contentStyle.getAttribute('href') !== cssPath) {
    contentStyle.remove();
    addStyle('tuiEditorContentThemeStyle', cssPath);
  }
};

/**
 * 自定义toolbar--代码主题
 */
const createCodeThemeBtn = (defaultTheme: string, cb?: (codeTheme: string) => void) => {
  const button = createElement('button', {
    class: 'tui-editor-toolbar-code-theme toastui-editor-toolbar-icons',
    onclick: (e) => {
      e.stopPropagation();
      hidden('.tui-editor-content-theme'); // 隐藏代码主题弹窗(如果已打开的话)
      removeClass('.tui-editor-toolbar-content-theme', 'active'); // 移除代码主题按钮active class
      // 以下创建并显示主题下拉(如果已创建过则直接显示)
      let node = querySelector('.tui-editor-code-theme');
      if (!node) {
        node = createPopup(
          Constants.CODE_THEME.map((item) => ({ label: item, value: item })),
          'tui-editor-code-theme',
          { top: 39, left: e.clientX },
          ({ value }) => {
            setCodeTheme(value);
            cb?.(value);
          },
          defaultTheme
        );
        querySelector('.toastui-editor-toolbar').appendChild(node);
      }
      // 内容主题按钮选中样式添加/移除
      if (hasClass(e.target, 'active')) {
        removeClass(e.target, 'active');
        hidden(node);
      } else {
        addClass(e.target, 'active');
        visible(node);
        const activeItem = findNodeByClassName(querySelectorAll('ul > li', node), 'active');
        activeItem?.scrollIntoView({ block: 'center' });
      }

      addEventListener(
        'click',
        () => {
          hidden(node);
          removeClass('.tui-editor-toolbar-code-theme', 'active');
        },
        document,
        true
      );
    },
  });

  return button;
};

/**
 * 自定义toolbar--内容主题
 * @param defaultPath 默认的主题路径
 * @param contentThemeList 内容主题列表
 */
const createContentThemeBtn = (
  { path, list, current }: TUIEditorProps['preview']['theme'],
  cb?: (codeTheme: string) => void
) => {
  const defaultPath = path ?? Constants.CONTENT_THEME_PATH;
  const contentThemeList = list ?? Constants.CONTENT_THEME;
  const defaultTheme = current;

  const button = createElement('button', {
    class: 'tui-editor-toolbar-content-theme toastui-editor-toolbar-icons',
    onclick: (e) => {
      e.stopPropagation();
      hidden('.tui-editor-code-theme'); // 隐藏代码主题弹窗(如果已打开的话)
      removeClass('.tui-editor-toolbar-code-theme', 'active'); // 移除代码主题按钮active class
      // 以下创建并显示主题下拉(如果已创建过则直接显示)
      let node = querySelector('.tui-editor-content-theme');
      if (!node) {
        // 如果不存在则创建
        node = createPopup(
          contentThemeList,
          'tui-editor-content-theme',
          { top: 39, left: e.clientX },
          ({ value, path }) => {
            setContentTheme(value, path ?? defaultPath);
            cb?.(value);
          },
          defaultTheme
        );
        querySelector('.toastui-editor-toolbar').appendChild(node);
      }
      // 内容主题按钮选中样式添加/移除
      if (hasClass(e.target, 'active')) {
        removeClass(e.target, 'active');
        hidden(node);
      } else {
        addClass(e.target, 'active');
        visible(node);
        const activeItem = findNodeByClassName(querySelectorAll('ul > li', node), 'active');
        activeItem?.scrollIntoView({ block: 'center' });
      }

      addEventListener(
        'click',
        () => {
          hidden(node);
          removeClass('.tui-editor-toolbar-content-theme', 'active');
        },
        document,
        true
      );
    },
  });

  return button;
};

/**
 * 自定义toolbar--仅编辑区
 * @param toggleMode 切换模式的回调
 */
const createOnlyEditorBtn = (toggleMode) => {
  const button = createElement('button', {
    class: 'tui-editor-toolbar-only-editor toastui-editor-toolbar-icons',
    onclick: (e) => {
      e.stopPropagation();
      toggleMode('editor');
      removeClass(querySelector('.tui-editor-toolbar-only-preview'), 'active');
      const target = e.target as Element;
      if (hasClass(target, 'active')) {
        removeClass(target, 'active');
      } else {
        addClass(target, 'active');
      }
    },
  });

  return button;
};

/**
 * 自定义toolbar--仅预览区
 * @param toggleMode 切换模式的回调
 */
const createOnlyPreviewBtn = (toggleMode) => {
  const button = createElement('button', {
    class: 'tui-editor-toolbar-only-preview toastui-editor-toolbar-icons',
    style: ``,
    onclick: (e: Event) => {
      e.stopPropagation();
      toggleMode('preview');
      removeClass(querySelector('.tui-editor-toolbar-only-editor'), 'active');
      const target = e.target as HTMLButtonElement;
      if (hasClass(target, 'active')) {
        removeClass(target, 'active');
      } else {
        addClass(target, 'active');
      }
    },
  });

  return button;
};

/**
 * 自定义toolbar--目录
 * @param cb 切换目录显隐的回调
 */
const createCatalogBtn = (cb?: () => void) => {
  const button = createElement('button', {
    class: 'tui-editor-toolbar-catalog toastui-editor-toolbar-icons',
    onclick: (e: Event) => {
      e.stopPropagation();
      const target = e.target as HTMLButtonElement;
      if (hasClass(target, 'active')) {
        removeClass(target, 'active');
      } else {
        addClass(target, 'active');
      }
      cb?.();
    },
  });

  return button;
};

/**
 * 自定义toolbar--附件
 * @param cb 回调
 */
const createFileBtn = (cb?: (file: File) => void) => {
  const button = createElement('button', {
    class: 'tui-editor-toolbar-file toastui-editor-toolbar-icons',
    onclick: (e: Event) => {
      e.stopPropagation();
      // .pdf,.xlsx,.docx,.doc,.csv,.json,.txt
      const input = createElement('input', { type: 'file', style: 'display: none', accept: '.html' });
      appendChild(input);
      input.click();
      input.onchange = function(e) {
        const target = e.target as HTMLInputElement;
        cb?.(target.files[0]);
        removeChild(input);
      }
    },
  });

  return button;
};

/**
 * 自定义渲染
 * https://github.com/nhn/tui.editor/blob/master/docs/en/custom-html-renderer.md
 */
const customHTMLRenderer = {
  /**
   * 自定义代码块渲染
   * @param node 节点数据
   */
  codeBlock(node) {
    const { fenceLength, info } = node;
    const infoWords = info ? info.split(/\s+/) : [];
    const preClasses = [];
    const codeAttrs: Record<string, any> = {};

    if (fenceLength > 3) {
      codeAttrs['data-backticks'] = fenceLength;
    }

    let content = node.literal;

    if (infoWords.length && infoWords[0].length) {
      const [lang] = infoWords;

      preClasses.push(`lang-${lang}`);
      codeAttrs['data-language'] = lang;

      const registeredLang = Prism.languages[lang];

      if (registeredLang) {
        content = Prism.highlight(node.literal, registeredLang, lang);
      }
    }

    return [
      { type: 'openTag', tagName: 'div', classNames: ['code-block'] },
      {
        type: 'html',
        content: `<div class='code-block-menus'><i></i><i title='最小化' class='code-suofang-checkbox'></i><i title='全屏' class='code-fullscreen-checkbox'></i></div>`,
      },
      { type: 'openTag', tagName: 'div', classNames: ['code-content'] },
      { type: 'openTag', tagName: 'pre', classNames: preClasses },
      {
        type: 'html',
        content: `<div class="code-block-copy"><span class="copy-value">${encodeURIComponent(
          node.literal
        )}</span><span aria-label="复制" class="copy-btn"><svg viewBox="0 0 32 32"><path d="M27.429 0h-19.143c-0.157 0-0.286 0.129-0.286 0.286v2c0 0.157 0.129 0.286 0.286 0.286h17.714v24.571c0 0.157 0.129 0.286 0.286 0.286h2c0.157 0 0.286-0.129 0.286-0.286v-26c0-0.632-0.511-1.143-1.143-1.143zM22.857 4.571h-18.286c-0.632 0-1.143 0.511-1.143 1.143v18.954c0 0.304 0.121 0.593 0.336 0.807l6.189 6.189c0.079 0.079 0.168 0.143 0.264 0.196v0.068h0.15c0.125 0.046 0.257 0.071 0.393 0.071h12.096c0.632 0 1.143-0.511 1.143-1.143v-25.143c0-0.632-0.511-1.143-1.143-1.143zM10.214 28.293l-3.075-3.079h3.075v3.079zM21.429 29.429h-8.929v-5.071c0-0.789-0.639-1.429-1.429-1.429h-5.071v-15.786h15.429v22.286z"></path></svg></span></div>`,
      },
      { type: 'openTag', tagName: 'code', attributes: codeAttrs },
      { type: 'html', content },
      { type: 'closeTag', tagName: 'code' },
      { type: 'closeTag', tagName: 'pre' },
      { type: 'closeTag', tagName: 'div' },
      { type: 'closeTag', tagName: 'div' },
    ];
  },
  /**
   * 自定义链接渲染，新增浏览器标签页打开
   */
  link(_, context) {
    const { origin, entering } = context;
    const result = origin();
    if (entering) {
      result.attributes.target = '_blank';
    }
    return result;
  },
};

/**
 * 代码块支持全屏、全屏后的关闭、最小化、退出全屏
 * @param previewEl 编辑器预览区dom
 */
const codeblockZoom = (previewEl: HTMLElement) => {
  // 全屏及全屏后的操作
  const fullscreenDom = querySelectorAll('.code-fullscreen-checkbox:not(.has-listener)', previewEl);
  fullscreenDom.forEach((dom) => {
    addClass(dom, 'has-listener');
    dom.addEventListener('click', function (e) {
      const target = e.target as HTMLInputElement;
      const codeBlock = target.closest('.code-block');
      const { top, left, width, height } = getBoundingClientRect(codeBlock);
      const pre = querySelector('.code-content pre', codeBlock);
      const container = createElement(
        'div',
        {
          class: 'showmd',
          style: `position: fixed; top: ${top}px; left: ${left}px; z-index: 10000; width: ${width}px; height: ${height}px; background-color: #fff`,
        },
        createElement(
          'div',
          {
            class: 'code-block',
            style: 'height: 100%; margin: 0; border-radius: 0;',
          },
          createElement(
            'div',
            { class: 'code-block-menus' },
            createElement('i', {
              style: 'width: 10px; height: 10px; background-color: #F87171; border-radius: 50%; cursor: pointer;',
              title: '关闭',
              onclick() {
                gsap.to(container, {
                  scale: 2,
                  opacity: 0,
                  transformOrigin: '50vw 50vh',
                  onStart() {
                    removeClass(document.body, 'overflow-hidden');
                  },
                  onComplete() {
                    removeChild(container);
                  },
                });
              },
            }),
            createElement('i', {
              style: 'width: 10px; height: 10px; background-color: #FBBF24; border-radius: 50%; cursor: pointer;',
              title: '最小化',
              onclick() {
                gsap.to(container, {
                  width: `${width}px`,
                  height: 0,
                  top: `${top}px`,
                  left: `${left}px`,
                  overflow: 'hidden',
                  onStart() {
                    removeClass(document.body, 'overflow-hidden');
                  },
                  onComplete() {
                    removeChild(container);
                  },
                });
              },
            }),
            createElement('i', {
              style: 'width: 10px; height: 10px; background-color: #34D399; border-radius: 50%; cursor: pointer;',
              title: '退出全屏',
              onclick() {
                gsap.to(container, {
                  width: `${width}px`,
                  height: `${height}px`,
                  top: `${top}px`,
                  left: `${left}px`,
                  transformOrigin: '50vw 50vh',
                  onStart() {
                    removeClass(document.body, 'overflow-hidden');
                  },
                  onComplete() {
                    removeChild(container);
                  },
                });
              },
            })
          ),
          createElement(
            'div',
            { style: 'position: relative; overflow: auto; max-height: calc(100% - 20px)' },
            createElement(
              pre.cloneNode(false),
              null,
              createElement(
                querySelector('.code-block-copy', pre).cloneNode(false),
                null,
                createElement(querySelector('.code-block-copy .copy-btn', pre).cloneNode(true), {
                  onclick: function () {
                    this.setAttribute('aria-label', '已复制');
                    copy(querySelector('.code-block-copy .copy-value', pre)?.innerHTML);
                  },
                  onmouseover: function () {
                    this.setAttribute('aria-label', '复制');
                  },
                })
              ),
              createElement(querySelector('code', pre).cloneNode(true))
            )
          )
        )
      );
      document.body.appendChild(container);
      gsap.to(container, {
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        transformOrigin: '50vw 50vh',
        onComplete() {
          addClass(document.body, 'overflow-hidden');
        },
      });
    });
  });

  // 收起/展开代码
  const suofangDom = querySelectorAll('.code-suofang-checkbox:not(.has-listener)', previewEl);
  suofangDom.forEach((dom) => {
    addClass(dom, 'has-listener');
    addEventListener(
      'click',
      function (e) {
        const target = e.target as HTMLInputElement;
        const codeBlock = target.closest('.code-block');
        const { height } = getBoundingClientRect(codeBlock);
        const originHeight = codeBlock.getAttribute('origin-height');
        gsap.to(codeBlock, {
          height: originHeight ?? 20,
          onComplete() {
            codeBlock.setAttribute('origin-height', `${height}px`);
          },
        });
      },
      dom
    );
  });
};

/**
 * 代码块添加复制功能
 * @param previewEl 编辑器预览区dom
 */
const codeblockCopy = (previewEl: HTMLElement) => {
  const copyDoms = querySelectorAll('.code-block-copy:not(.has-listener)', previewEl);
  copyDoms.forEach((dom) => {
    addClass(dom, 'has-listener');
    const copyValue = querySelector('.copy-value', dom);
    const copyBtn = querySelector('.copy-btn', dom);
    addEventListener(
      'click',
      (e: Event) => {
        e.stopPropagation();
        copyBtn.setAttribute('aria-label', '已复制');
        copy(copyValue.innerHTML);
      },
      copyBtn
    );
    addEventListener(
      'mouseover',
      (e: Event) => {
        e.stopPropagation();
        copyBtn.setAttribute('aria-label', '复制');
      },
      copyBtn
    );
  });
};

/**
 * 内容添加到剪贴板
 * @param copytext 内容
 */
const copy = (copytext: string) => {
  const textarea = document.createElement('textarea');
  document.body.appendChild(textarea);
  textarea.value = decodeURIComponent(copytext);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};

/**
 * 预览图片(图片点击放大)
 */
function imagePreview(previewEl: HTMLElement) {
  const imgList = querySelectorAll('img:not(.has-listener)', previewEl);
  imgList.map((img) => {
    addClass(img, 'has-listener');

    function onPreview() {
      const { width, height, top, left } = getBoundingClientRect(img) ?? {};
      const scrollTop = document.documentElement.scrollTop;
      const { innerWidth, innerHeight } = window;
      const duration = 300;
      const scale = Math.min(innerWidth / width, innerHeight / height, 2) - 0.5;

      // 遮罩层
      const imgWrapper = createElement('div', {
        style: `position:fixed;left:0;top:0;bottom:0;right:0;background-color:rgba(0,0,0,.8);z-index:2001;cursor:zoom-out;
            opacity:0;transition:opacity ${duration}ms cubic-bezier(.2,0,.2,1);`,
      });

      // 预览的img元素
      const imgPreview = createElement(img.cloneNode(true), {
        style: `position:absolute;left:${left}px;top:${
          top + scrollTop
        }px;width:${width}px;height:${height}px;z-index:2001;
          cursor:zoom-out;transform:scale(1) translate(0,0);transition:transform ${duration}ms cubic-bezier(.2,0,.2,1);`,
      });

      appendChild(imgWrapper);
      appendChild(imgPreview);

      setTimeout(() => {
        css(img, { visibility: 'hidden' });
        css(imgWrapper, { opacity: '1' });
        css(imgPreview, {
          transform: `scale(${scale}) translate(${((innerWidth - width) / 2 - left) / scale}px, ${
            ((innerHeight - height) / 2 - top) / scale
          }px)`,
        });
      }, 0);

      // 关闭
      function close() {
        css(imgWrapper, { opacity: '0' });
        css(imgPreview, { transform: 'scale(1) translate(0,0)' });
        imgPreview.removeEventListener('click', close);
        imgPreview.removeEventListener('click', close);
        document.removeEventListener('scroll', close);
        setTimeout(() => {
          css(img, { visibility: 'visible' });
          removeChild(imgWrapper);
          removeChild(imgPreview);
        }, duration);
      }
      addEventListener('click', close, imgWrapper);
      addEventListener('click', close, imgPreview);
      addEventListener('scroll', close);
    }
    // 遍历img添加click事件
    addEventListener('click', onPreview, img);
  });
}

export {
  createCodeThemeBtn,
  createContentThemeBtn,
  createOnlyEditorBtn,
  createOnlyPreviewBtn,
  createCatalogBtn,
  createFileBtn,
  customHTMLRenderer,
  codeblockZoom,
  codeblockCopy,
  imagePreview,
  setCodeTheme,
  setContentTheme,
  createTooltip,
};
