import type { Editor } from 'tinymce';
import * as Options from '../api/Options';
import * as DateTimeHelper from './DateTimeHelper';
import * as Templates from './Templates';
import { hasAnyClasses } from './Utils';

const { Tools } = tinymce.util;

const setup = (editor: Editor): void => {
  editor.on('PreProcess', (o) => {
    const dom = editor.dom, dateFormat = Options.getMdateFormat(editor);

    Tools.each(dom.select('div', o.node), (e) => {
      if (dom.hasClass(e, 'mceTmpl')) {
        Tools.each(dom.select('*', e), (e) => {
          if (hasAnyClasses(dom, e, Options.getModificationDateClasses(editor))) {
            e.innerHTML = DateTimeHelper.getDateTime(editor, dateFormat);
          }
        });

        Templates.replaceVals(editor, e);
      }
    });
  });
};

export {
  setup
};
