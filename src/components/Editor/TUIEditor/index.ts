import { upload, uploadAttachFile } from '@src/utils/upload';
import { addClass, querySelector, hidden, visible } from '../domUtil';
import {
  createCodeThemeBtn,
  createContentThemeBtn,
  createOnlyEditorBtn,
  createOnlyPreviewBtn,
  createFileBtn,
  customHTMLRenderer,
  codeblockZoom,
  codeblockCopy,
  imagePreview,
  setCodeTheme,
  setContentTheme,
} from './util';
import { attachFilePlugin } from './plugins';
import Constants from '@src/constants';
import { TUIEditorProps, Mode, Handler, EmitterType, Selection } from './types';

class TUIEditor {
  private tuiEditor: toastui.Editor; // 编辑器实例
  public previewEl: HTMLElement; // 预览区dom
  public editorEl: HTMLElement; // 编辑区dom
  private mode: Mode; // 编辑模式：双屏、仅编辑、仅预览
  private emitter: Map<string, Handler[]>; // 事件列表
  private selection: Selection; // 光标信息

  constructor(props: TUIEditorProps) {
    let el: HTMLElement;
    if (typeof props.el === 'string') {
      el = querySelector(props.el);
    } else {
      el = props.el;
    }
    if (props.viewer) {
      this.createPreview(el, props);
    } else {
      this.createEditor(el, props);
    }

    if (props.preview?.theme) {
      // 加载内容主题
      const { current, path } = props.preview.theme;
      setContentTheme(current, path ?? Constants.CONTENT_THEME_PATH);
    }
    if (props.preview.hljs) {
      // 加载代码块主题
      setCodeTheme(props.preview.hljs);
    }

    this.emitter = new Map();
    this.selection = null;
  }

  private createEditor(el: HTMLElement, props: TUIEditorProps) {
    const { width = '100%', height = '100%', editType = 'markdown', value = '', toolbarItems = [], preview } = props;
    this.tuiEditor = new toastui.Editor({
      el,
      height: typeof height === 'number' ? `${height}px` : height,
      initialEditType: editType,
      previewStyle: 'vertical',
      initialValue: value,
      language: 'zh-CN',
      hideModeSwitch: true,
      toolbarItems: [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'image', 'link'],
        ['code', 'codeblock'],
        [
          {
            name: 'file',
            el: createFileBtn(this.updateFile.bind(this)),
            tooltip: '附件',
          },
          {
            name: 'codeTheme',
            el: createCodeThemeBtn(preview?.hljs, (codeTheme: string) => this.emit('change', { codeTheme })),
            tooltip: '代码主题',
          },
          {
            name: 'contentTheme',
            el: createContentThemeBtn(preview?.theme, (contentTheme: string) => this.emit('change', { contentTheme })),
            tooltip: '内容主题',
          },
        ],
        editType === 'markdown'
          ? [
              {
                name: 'onlyEditor',
                el: createOnlyEditorBtn(this.toggleMode.bind(this)),
                tooltip: '仅编辑区',
              },
              {
                name: 'onlyPreview',
                el: createOnlyPreviewBtn(this.toggleMode.bind(this)),
                tooltip: '仅预览区',
              },
            ]
          : [],
        toolbarItems,
      ],
      plugins: [attachFilePlugin],
      customHTMLRenderer,
      events: {
        load: (editor: Editor) => {
          if (editType === 'wysiwyg') {
            // 预览区dom
            this.previewEl = editor.wwEditor.el;
            // 编辑区dom
            this.editorEl = editor.wwEditor.el;
          } else {
            // 预览区dom
            this.previewEl = editor.preview.el;
            // 编辑区dom
            this.editorEl = editor.mdEditor.el;

            codeblockZoom(this.previewEl);
            codeblockCopy(this.previewEl);
          }
          // 预览区设置class
          addClass(this.previewEl, 'showmd');
        },
        change: () => {
          if (editType === 'markdown') {
            codeblockZoom(this.previewEl); // 代码块缩放
            codeblockCopy(this.previewEl); // 代码块复制
          }
          this.emit('change', { content: this.getText() });
        },
        // 光标变化时触发
        caretChange: () => {
          if (!this.tuiEditor) return;
          const [[startLine, startColumn], [endLine, endColumn]] = this.tuiEditor.getSelection() as any;
          this.selection = { startLine, startColumn: startColumn - 1, endLine, endColumn: endColumn - 1 };
          this.selection.text = this.tuiEditor.getSelectedText([startLine, startColumn], [endLine, endColumn]);
          this.emit('caretChange', this.selection);
        },
      },
    });

    this.editorEl.parentElement.style.width = typeof width === 'number' ? `${width}px` : width;

    this.updateImageHook();
  }

  private createPreview(el: HTMLElement, props: TUIEditorProps) {
    const { height = '100%', value = '' } = props;
    toastui.Editor.factory({
      el,
      viewer: true,
      initialValue: value,
      language: 'zh-CN',
      height: typeof height === 'number' ? `${height}px` : height,
      customHTMLRenderer,
      plugins: [attachFilePlugin],
      events: {
        load: (editor: Editor) => {
          this.previewEl = editor.preview.previewContent;

          // 预览区设置class
          addClass(this.previewEl, 'showmd');
          codeblockZoom(this.previewEl);
          codeblockCopy(this.previewEl);
          imagePreview(this.previewEl);
        },
      },
    });
  }

  //图片上传
  private updateImageHook() {
    this.tuiEditor.removeHook('addImageBlobHook');

    this.tuiEditor.addHook('addImageBlobHook', async (blob: any, callback: (url: string, text?: string) => void) => {
      //上传图片
      const [err, res] = await upload(blob);
      if (!err && res.code === 0) {
        //更改编辑器内容
        callback(
          `/api/${res?.data?.path}`,
          blob.name
            .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '')
            .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '')
            .replace('/\\s/g', '')
        );
        this.tuiEditor.insertText('\n\n');
      } else {
        this.emit('error', new Error(res.message));
      }
    });
  }

  /**
   * 附件上传
   * @param file 附件
   * @todo 实现上传附件的逻辑
   * @todo 实现预览的逻辑
   * @todo 实现下载的逻辑
   */
  private async updateFile(file: File) {
    const [err, res] = await uploadAttachFile(file);
    if (!err && res.code === 0) {
      this.tuiEditor.insertText(
        `\n$$file\ntype: html\nname: ${res.data.name}\nsize: ${res.data.size}\npath: ${res.data.path}\nmode: r\n$$\n`
      );
    } else {
      this.emit('error', new Error(res.message));
    }
  }

  /**
   * 切换编辑模式
   * @param mode 编辑器模式：预览、编辑、预览&编辑
   */
  public toggleMode(mode: Mode) {
    if (this.mode === mode) {
      this.mode = 'all';
      this.previewEl.style.width = '50%';
      this.editorEl.style.width = '50%';
      visible(this.editorEl);
      visible(this.previewEl);
    } else if (mode === 'preview') {
      this.mode = 'preview';
      this.previewEl.style.width = '100%';
      hidden(this.editorEl);
      visible(this.previewEl);
    } else if (mode === 'editor') {
      this.mode = 'editor';
      this.editorEl.style.width = '100%';
      hidden(this.previewEl);
      visible(this.editorEl);
    }
  }

  /**
   * 同步滚动切换
   * @param checked true/false
   */
  public toggleScrollSync(checked: boolean) {
    this.tuiEditor.exec('toggleScrollSync', { active: checked });
  }

  /**
   * 获取编辑器markdown内容
   */
  public getText() {
    return this.tuiEditor.getMarkdown();
  }

  /**
   * 监听事件
   * @param type 事件类型
   * @param handler 回调
   */
  public on(type: EmitterType, handler: Handler) {
    if (!this.emitter) return;

    if (this.emitter.get(type)) {
      this.emitter.set(type, [...this.emitter.get(type), handler]);
    } else {
      this.emitter.set(type, [handler]);
    }
  }

  /**
   * 触发事件
   * @param type 事件类型
   * @param args 回调函数的参数
   */
  public emit(type: EmitterType, ...args: any[]) {
    if (!this.emitter) return;

    if (this.emitter.get(type)) {
      this.emitter.get(type).forEach((handler) => {
        handler(...args);
      });
    }
  }

  /**
   * 获取选中的文本信息，包含开始/结束行列、选中的内容等
   */
  public getSelection() {
    return this.selection;
  }

  /**
   * 回到顶部
   */
  public scrollTop() {
    this.tuiEditor.setScrollTop(0);
    this.previewEl.scrollTop = 0;
  }

  /**
   * 设置编辑器宽度
   * @param width 宽度
   */
  public setWidth(width: number | string) {
    this.editorEl.parentElement.style.width = typeof width === 'number' ? `${width}px` : width;
  }
}

export default TUIEditor;
