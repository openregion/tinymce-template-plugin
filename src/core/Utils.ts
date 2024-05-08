import type { Editor, DOMUtils } from 'tinymce';
import * as Arr from '../api/Arr';
import * as Obj from '../api/Obj';

const HtmlSerializer = tinymce.html.Serializer;

const entitiesAttr: Record<string, string> = {
  '"': '&quot;',
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '\'': '&#039;'
};

const htmlEscape = (html: string): string =>
  html.replace(/["'<>&]/g, (match) => Obj.get(entitiesAttr, match).getOr(match));

const hasAnyClasses = (dom: DOMUtils, n: Element, classes: string): boolean =>
  Arr.exists(classes.split(/\s+/), (c) => dom.hasClass(n, c));

const parseAndSerialize = (editor: Editor, html: string): string =>
  HtmlSerializer({ validate: true }, editor.schema).serialize(
    editor.parser.parse(html, { insert: true })
  );

export {
  hasAnyClasses,
  htmlEscape,
  parseAndSerialize
};
