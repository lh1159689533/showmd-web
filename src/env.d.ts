/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

type PreviewStyle = 'tab' | 'vertical';
type EditorType = 'markdown' | 'wysiwyg';
type Editor = any;

interface EventMap {
  load?: (param: Editor) => void;
  change?: (editorType: EditorType) => void;
  caretChange?: (editorType: EditorType) => void;
  focus?: (editorType: EditorType) => void;
  blur?: (editorType: EditorType) => void;
  keydown?: (editorType: EditorType, ev: KeyboardEvent) => void;
  keyup?: (editorType: EditorType, ev: KeyboardEvent) => void;
  beforePreviewRender?: (html: string) => string;
  beforeConvertWysiwygToMarkdown?: (markdownText: string) => string;
}

type HookCallback = (url: string, text?: string) => void;

type HookMap = {
  addImageBlobHook?: (blob: Blob | File, callback: HookCallback) => void;
};

interface ToolbarItemState {
  active: boolean;
  disabled?: boolean;
}

interface ToolbarStateMap {
  taskList: ToolbarItemState;
  orderedList: ToolbarItemState;
  bulletList: ToolbarItemState;
  table: ToolbarItemState;
  strong: ToolbarItemState;
  emph: ToolbarItemState;
  strike: ToolbarItemState;
  heading: ToolbarItemState;
  thematicBreak: ToolbarItemState;
  blockQuote: ToolbarItemState;
  code: ToolbarItemState;
  codeBlock: ToolbarItemState;
  indent: ToolbarItemState;
  outdent: ToolbarItemState;
}
type ToolbarStateKeys = keyof ToolbarStateMap;

interface PopupOptions {
  body: HTMLElement;
  className?: string;
  style?: Record<string, any>;
}

type ExecCommand = (command: string, payload?: Record<string, any>) => void;

interface ToolbarCustomOptions {
  name: string;
  tooltip?: string;
  el?: HTMLElement;
  popup?: PopupOptions;
  hidden?: boolean;
  state?: ToolbarStateKeys;
  onMounted?: (execCommand: ExecCommand) => void;
  onUpdated?: (toolbarState: ToolbarItemState) => void;
}

interface ToolbarButtonOptions {
  name: string;
  tooltip?: string;
  className?: string;
  command?: string;
  text?: string;
  style?: Record<string, any>;
  popup?: PopupOptions;
  state?: ToolbarStateKeys;
}

type ToolbarItemOptions = ToolbarCustomOptions | ToolbarButtonOptions;

type AutolinkParser = (content: string) => {
  url: string;
  text: string;
  range: [number, number];
}[];

type ExtendedAutolinks = boolean | AutolinkParser;

type LinkAttributeNames = 'rel' | 'target' | 'hreflang' | 'type';

// @TODO change option and type name from singular to plural
type LinkAttributes = Partial<Record<LinkAttributeNames, string>>;

type WwNodeType =
  | 'text'
  | 'paragraph'
  | 'heading'
  | 'codeBlock'
  | 'bulletList'
  | 'orderedList'
  | 'listItem'
  | 'table'
  | 'tableHead'
  | 'tableBody'
  | 'tableRow'
  | 'tableHeadCell'
  | 'tableBodyCell'
  | 'blockQuote'
  | 'thematicBreak'
  | 'image'
  | 'hardBreak'
  | 'lineBreak'
  | 'customBlock'
  | 'frontMatter'
  | 'widget'
  | 'html'
  | 'htmlComment';

type BlockNodeType =
  | 'document'
  | 'list'
  | 'blockQuote'
  | 'item'
  | 'heading'
  | 'thematicBreak'
  | 'paragraph'
  | 'codeBlock'
  | 'htmlBlock'
  | 'table'
  | 'tableHead'
  | 'tableBody'
  | 'tableRow'
  | 'tableCell'
  | 'tableDelimRow'
  | 'tableDelimCell'
  | 'refDef'
  | 'customBlock'
  | 'frontMatter';

type InlineNodeType =
  | 'code'
  | 'text'
  | 'emph'
  | 'strong'
  | 'strike'
  | 'link'
  | 'image'
  | 'htmlInline'
  | 'linebreak'
  | 'softbreak'
  | 'customInline';

type MdNodeType = BlockNodeType | InlineNodeType;

type ToMdConvertor = (nodeInfo: any, context: any) => any;

type ToMdConvertorMap = Partial<Record<WwNodeType | MdNodeType, ToMdConvertor>>;

type Sanitizer = (content: string) => string;

interface WidgetRule {
  rule: RegExp;
  toDOM: (text: string) => HTMLElement;
}

type Pos = [number, number];
type Sourcepos = [Pos, Pos];
type SelectionPos = Sourcepos | [from: number, to: number];
type EditorPos = Pos | number;

interface EditorOptions {
  el: HTMLElement;
  height?: string;
  minHeight?: string;
  initialValue?: string;
  previewStyle?: PreviewStyle;
  initialEditType?: EditorType;
  events?: EventMap;
  hooks?: HookMap;
  language?: string;
  useCommandShortcut?: boolean;
  usageStatistics?: boolean;
  toolbarItems?: (string | ToolbarItemOptions)[][];
  hideModeSwitch?: boolean;
  plugins?: any[];
  extendedAutolinks?: ExtendedAutolinks;
  placeholder?: string;
  linkAttributes?: LinkAttributes;
  customHTMLRenderer?: any;
  customMarkdownRenderer?: ToMdConvertorMap;
  referenceDefinition?: boolean;
  customHTMLSanitizer?: Sanitizer;
  previewHighlight?: boolean;
  frontMatter?: boolean;
  widgetRules?: WidgetRule[];
  theme?: string;
  autofocus?: boolean;
  viewer?: boolean;
}

declare namespace toastui {
  class Editor {
    constructor(option: EditorOptions);
    getHTML: () => string;
    getMarkdown: () => string;
    removeHook: (hook: string) => any;
    addHook: (hook: string, callback: Function) => any;
    setHeight: (height: string) => any;
    getHeight: () => any;
    on: (event: string, callback: Function) => any;
    focus: () => void;
    getEditorElements: () => { mdPreview: HTMLElement; mdEditor: HTMLElement; wwEditor: HTMLElement };
    insertText(text: string): void;
    exec(name: string, payload?: Record<string, any>): void;
    getSelection(): SelectionPos;
    getSelectedText(start?: EditorPos, end?: EditorPos): string;
    setScrollTop(value: number): void;
    getScrollTop(): number;
    setWidth(width: number | string): void;
    static plugin: any;
    public static factory(options: EditorOptions): Editor | Viewer;
  }
}
