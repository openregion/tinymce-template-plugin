import type { Editor } from 'tinymce';
import * as Templates from '../core/Templates';
import { ExternalTemplate } from '../core/Types';
import * as Dialog from '../ui/Dialog';

const showDialog = (editor: Editor) => (templates: ExternalTemplate[]): void => {
  Dialog.open(editor, templates);
};

const register = (editor: Editor): void => {
  editor.addCommand(
    'mceInsertTemplate',
    (_ui: boolean, html: string) => Templates.insertTemplate(editor, _ui, html),
  );
  editor.addCommand('mceTemplate', Templates.createTemplateList(editor, showDialog(editor)));
};

export {
  register
};
