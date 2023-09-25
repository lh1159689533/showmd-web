/**
 * 根据className在一组节点集合中查找节点
 * @param nodeList 节点集合
 * @param className className
 */
function findNodeByClassName(nodeList: Element[], className: string): Element {
  return nodeList?.length ? nodeList.find((node) => node.classList.value.indexOf(className) !== -1) : null;
}

/**
 * 根据属性值在一组节点集合中查找节点
 * @param nodeList 节点集合
 * @param attributeName 属性名
 * @param attributeValue 属性值
 */
function findNodeByAttribute(nodeList: Element[], attributeName: string, attributeValue: string | number): Element {
  return nodeList?.find((node) => node.getAttribute(attributeName) === attributeValue);
}

/**
 * 节点添加样式
 * @param node 目标节点
 * @param className className
 */
function addClass(ele: Element | string, ...className: string[]): void {
  getElement(ele)?.classList?.add?.(...className);
}

/**
 * 节点移除样式
 * @param node 目标节点
 * @param className className
 */
function removeClass(ele: Element | string, className: string): void {
  getElement(ele)?.classList?.remove?.(className);
}

/**
 * 节点是否有样式className
 * @param node 目标节点
 * @param className className
 */
function hasClass(node: Element, className: string): boolean {
  return node?.classList?.contains(className);
}

/**
 * 根据ID在文档流中获取节点
 * @param id ID
 */
function getElementById(id: string): HTMLElement {
  return document.getElementById(id);
}

/**
 * 在目标节点中查找子节点(只查找符合条件之一)
 * @param node 目标节点
 * @param selector css选择器
 */
function querySelector(selector: string, node: Element | Document = document): HTMLElement {
  return node?.querySelector(selector);
}

/**
 * 在目标节点中查找一个子节点(查找符合条件所以)
 * @param node 目标节点
 * @param selector css选择器
 */
function querySelectorAll(selector: string, node: Element | Document = document): HTMLElement[] {
  return toArray<HTMLElement>(node?.querySelectorAll(selector));
}

/**
 * 获取目标节点计算属性(宽高等大小属性)
 * @param ele 目标节点
 * @param attr 属性
 */
function getComputedStyleOf(ele: Element, attr: string): number {
  if (!ele || !attr) return 0;
  const computedStyle = window.getComputedStyle(ele);
  const attrValue = computedStyle[attr];
  if (attrValue && attrValue.endsWith('px')) {
    return Number(attrValue.replace('px', '')) ?? 0;
  }
  return 0;
}

/**
 * 获取目标节点DOMRect
 * @param ele 目标节点
 */
function getBoundingClientRect(ele: Element | string): DOMRect {
  if (!ele) return null;
  return getElement(ele).getBoundingClientRect();
}

/**
 * 类数组转化为数组
 * @param arrayLike 类数组
 */
function toArray<T>(arrayLike): T[] {
  return arrayLike?.length ? [].slice.call(arrayLike) : [];
}

/**
 * 如果是字符串，则通过querySelector获取元素返回，否则直接返回
 * @param ele 如果是string，则取值同document.querySelector
 */
const getElement = (ele: Element | string): HTMLElement => {
  if (typeof ele === 'string') {
    ele = querySelector(ele, document.body);
  }
  return ele as HTMLElement;
};

/**
 * 创建dom元素
 * @param ele 元素标签名/元素
 * @param props 属性，如果key='text'说明是文本子节点，调用innerText插入；如果value是函数，说明是事件监听
 * @param children 子元素
 */
function createElement<K extends keyof HTMLElementTagNameMap>(
  ele: K | Node,
  props: { [key: string]: string | ((e?: any) => void) } = {},
  ...children: Node[]
): HTMLElement {
  let dom: HTMLElement = null;
  if (typeof ele === 'string') {
    dom = document.createElement(ele);
  } else {
    dom = ele as HTMLElement;
  }
  for (const key in props) {
    const prop = props[key];
    if (key === 'text') {
      // 文本子节点
      dom.innerText = prop as string;
    } else if (typeof prop === 'string') {
      // 属性
      dom.setAttribute(key, prop);
    } else {
      // 绑定函数
      dom[key] = prop;
    }
  }
  if (children?.length) {
    children.forEach((child) => {
      dom.appendChild(child);
    });
  }
  return dom;
}

/**
 * 添加link css
 * @param id 元素ID
 * @param url css文件路径
 */
const addStyle = (id: string, url: string) => {
  if (!getElementById(id)) {
    const styleElement = document.createElement('link');
    styleElement.id = id;
    styleElement.rel = 'stylesheet';
    styleElement.type = 'text/css';
    styleElement.href = url;
    document.getElementsByTagName('head')[0].appendChild(styleElement);
  }
};

/**
 * 隐藏元素
 * @param ele
 */
const hidden = (ele: HTMLElement | string) => {
  const el = getElement(ele);
  el && (el.style.display = 'none');
};

/**
 * 显示元素
 * @param ele
 */
const visible = (ele: HTMLElement | string) => {
  const el = getElement(ele);
  el && (el.style.display = 'block');
};

/**
 * 是否隐藏的元素
 * @param ele
 */
const isHidden = (ele: HTMLElement | string) => {
  const el = getElement(ele);
  return !el || el.style.display === 'none' || el.style.visibility === 'hidden';
};

const addEventListener = (
  eventName: string,
  cb: (e: Event) => void,
  target: Element | Document | string = document,
  once = false
) => {
  let dom: Element | Document;
  if (typeof target === 'string') {
    dom = getElement(target);
  } else {
    dom = target;
  }
  function listener(e: Event) {
    cb(e);
    if (once) {
      dom.removeEventListener(eventName, listener);
    }
  }
  dom.addEventListener(eventName, listener);

  if (!once) {
    return function() {
      dom.removeEventListener(eventName, listener);
    }
  }
  return null;
};

const removeChild = (ele: Element | string, parent: Element = document.body) => {
  const dom = getElement(ele);
  if (dom && parent) {
    parent.removeChild(dom);
  }
};

const appendChild = (ele: Element | string, parent: Element = document.body) => {
  const dom = getElement(ele);
  if (dom && parent) {
    parent.appendChild(dom);
  }
};

export {
  findNodeByClassName,
  findNodeByAttribute,
  addClass,
  removeClass,
  hasClass,
  getElementById,
  querySelector,
  querySelectorAll,
  getComputedStyleOf,
  getBoundingClientRect,
  createElement,
  addStyle,
  hidden,
  visible,
  isHidden,
  toArray,
  addEventListener,
  removeChild,
  appendChild,
};
