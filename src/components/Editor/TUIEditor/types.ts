// 编辑器构造函数参数
export interface TUIEditorProps {
  el: HTMLElement | string;
  width?: number | string;
  height?: number | string;
  editType?: 'markdown' | 'wysiwyg';
  value: string;
  previewStyle?: 'tab' | 'vertical';
  viewer?: boolean;
  preview?: {
    theme: {
      current: string;
      path?: string;
      list?: { label: string; value: string; path?: string }[];
    };
    hljs: string;
  };
  toolbarItems?: {
    name: string;
    el?: HTMLElement;
    tooltip?: string;
  }[];
}

// 编辑器模式：双屏、仅预览、仅编辑
export type Mode = 'all' | 'preview' | 'editor';

// 监听事件回调
export type Handler = (...args: any[]) => any;

// 监听事件类型：change 内容变化事件、caretChange 光标变化事件
export type EmitterType = 'change' | 'caretChange' | 'error';

// 选择编辑区内容的坐标
export interface Selection {
  startLine: number; // 开始行
  startColumn: number; // 开始列
  endLine: number; // 结束行
  endColumn: number; // 结束列
  text?: string; // 选中的文本
}

interface TagToken {
  tagName: string;
  outerNewLine?: boolean;
  innerNewLine?: boolean;
}

interface OpenTagToken extends TagToken {
  type: 'openTag';
  classNames?: string[];
  attributes?: Record<string, any>;
  selfClose?: boolean;
}

interface CloseTagToken extends TagToken {
  type: 'closeTag';
}

interface TextToken {
  type: 'text';
  content: string;
}

interface RawHTMLToken {
  type: 'html';
  content: string;
  outerNewLine?: boolean;
}

export type HTMLToken = OpenTagToken | CloseTagToken | TextToken | RawHTMLToken;

// 编辑器附件
export interface FileInfo {
  name?: string; // 名称
  size?: string; // 大小
  type?: string; // 类型
  path?: string; // 下载/预览地址
  mode?: 'r' | 'rw'; // 读写模式：r 只读、rw 读写
}
