import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';

import 'highlight.js/styles/github.css';

import emojiConf from './Emoji/emoji.config';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('html', html);
hljs.registerLanguage('css', css);

interface IEmoji {
  title: string;
  key?: string;
  path: string;
}

interface IEmojiExpand extends IEmoji {
  width: string;
  height: string;
}

type CodeLanguage = 'javascript' | 'html' | 'css';

const emojiMap = new Map<string, IEmojiExpand>();
const emojiKeys: string[] = [];

emojiConf
  .reduce((acc, item) => {
    return [...acc, ...item.list.map(em => ({ ...em, width: item.width, height: item.height }))];
  }, [])
  .map((em) => {
    emojiMap.set(`[${em.key ?? em.title}]`, em);
    emojiKeys.push(em.key ?? em.title);
  });

const regExpEmoji = new RegExp(`(\\[(${emojiKeys.join('|')})\\])`, 'g');
const regExpCode = new RegExp(`\\[code=([^\\[\\]]*?)\\]([^\\[\\]]*?)\\[\\/code\\]`, 'g'); // /\[code=[^\[\]]*?\][^\[\]]*?\[\/code\]/g

const parseEmoji = (text: string): string => {
  return text.replace(regExpEmoji, (item: string) => {
    const emoji: IEmojiExpand = emojiMap.get(item);
    return `<img src='${emoji.path}' alt='${emoji.title}' class='textarea-emoji' style='width:${emoji.width};height:${emoji.height};padding:4px' />`;
  });
};

const formatEmoji = (emoji: IEmoji): string => {
  return `[${emoji.key ?? emoji.title}]`;
};

const parseCode = (text: string): string => {
  return text?.replace(regExpCode, (_, language, code) => {
    if (!code) return '';
    return `<pre style='overflow-x:auto;padding:0.5em;color:#383a42;background:#fafafa;'><code class='${language}'>${hljs.highlight(code.trim(), { language }).value}</code></pre>`;
  });
};

const formatCode = (language: CodeLanguage = 'javascript'): string => {
  return `[code=${language}]<br><br>[/code]`;
};

const parse = (text: string,): string => {
  let value = text;
  if (regExpEmoji.test(text)) {
    value = parseEmoji(text);
  }
  if (regExpCode.test(text)) {
    value = parseCode(value);
  }
  return value;
};

export {
  parse,
  formatEmoji,
  formatCode,
};