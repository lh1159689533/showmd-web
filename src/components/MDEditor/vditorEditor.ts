/**
 * 根据className在一组节点集合中查找节点
 * @param nodeList 节点集合
 * @param className className
 */
function getNodeByClassName(nodeList: Element[], className: string): Element {
  return nodeList?.length ? nodeList.find((node) => node.classList.value.indexOf(className) !== -1) : null;
}

/**
 * 根据属性值在一组节点集合中查找节点
 * @param nodeList 节点集合
 * @param attributeName 属性名
 * @param attributeValue 属性值
 */
function getNodeByAttribute(nodeList: Element[], attributeName: string, attributeValue: string | number): Element {
  return nodeList?.find((node) => node.getAttribute(attributeName) === attributeValue);
}

/**
 * 节点添加样式
 * @param node 目标节点
 * @param className className
 */
function addClass(node: Element, ...className: string[]): void {
  node?.classList?.add?.(...className);
}

/**
 * 节点移除样式
 * @param node 目标节点
 * @param className className
 */
function removeClass(node: Element, className: string): void {
  node?.classList?.remove?.(className);
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
function querySelector(node: Element | Document = document, selector: string): HTMLElement {
  return node?.querySelector(selector);
}

/**
 * 在目标节点中查找一个子节点(查找符合条件所以)
 * @param node 目标节点
 * @param selector css选择器
 */
function querySelectorAll(node: Element | Document = document, selector: string): HTMLElement[] {
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
function getBoundingClientRect(ele: Element): DOMRect {
  if (!ele) return null;
  return ele.getBoundingClientRect();
}

/**
 * 类数组转化为数组
 * @param arrayLike 类数组
 */
function toArray<T>(arrayLike): T[] {
  return arrayLike?.length ? [].slice.call(arrayLike) : [];
}

export {
  getNodeByClassName,
  getNodeByAttribute,
  addClass,
  removeClass,
  getElementById,
  querySelector,
  querySelectorAll,
  getComputedStyleOf,
  getBoundingClientRect,
};
