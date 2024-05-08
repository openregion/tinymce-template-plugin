import type { Editor, Ui } from 'tinymce';

const onSetupEditable = (editor: Editor) => (api: Ui.Toolbar.ToolbarButtonInstanceApi | Ui.Menu.MenuItemInstanceApi): VoidFunction => {
  const nodeChanged = () => {
    api.setEnabled(editor.selection.isEditable());
  };

  editor.on('NodeChange', nodeChanged);
  nodeChanged();

  return () => {
    editor.off('NodeChange', nodeChanged);
  };
};

const register = (editor: Editor): void => {
  const onAction = () => editor.execCommand('mceTemplate');

  editor.ui.registry.addButton('template', {
    icon: 'template',
    tooltip: 'Insert template',
    onSetup: onSetupEditable(editor),
    onAction
  });

  editor.ui.registry.addMenuItem('template', {
    icon: 'template',
    text: 'Insert template...',
    onSetup: onSetupEditable(editor),
    onAction
  });
};

export {
  register
};
