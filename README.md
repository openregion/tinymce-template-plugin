# tinymce-template-plugin
TinyMCE plugin used to insert custom templates.

The `template` plugin adds support for custom templates. It also adds a menu item `Insert template` under the `Insert` menu and a toolbar button.

Based on [TinyMCE 6.8.3 template plugin](https://github.com/tinymce/tinymce/tree/6.8.3/modules/tinymce/src/plugins/template/main/ts).

## Usage
Install package

```bash
npm install @openregion/tinymce-template-plugin
```

Import plugin

```js
import '@openregion/tinymce-template-plugin';
```

## Options
These settings affect the execution of the `template` plugin. Predefined templates for items such as created dates and modified dates can be set here.

### `templates`
This option lets you specify a predefined list of templates to be inserted by the user into the editable area. It is structured as an array with each item having a `title`, `description` and `content`/`url`.

If this option is a string then it will be requested as a URL that should produce a JSON output in the same format the option accepts.

Each item in the list can either be inline using a `content` property or a whole file using the `url` property.

**Type:** `String`, `Array` or `Function`

#### Example using an array
```javascript
tinymce.init({
  selector: 'textarea',  // change this value according to your HTML
  plugins: 'template',
  toolbar: 'template',
  templates: [
    { title: 'Some title 1', description: 'Some desc 1', content: 'My content' },
    { title: 'Some title 2', description: 'Some desc 2', url: 'development.html' }
  ]
});
```

#### Example using a URL
```javascript
tinymce.init({
  selector: 'textarea',  // change this value according to your HTML
  plugins: 'template',
  toolbar: 'template',
  templates: '/dir/templates.php'
});
```

##### Example JSON output of templates.php
```json
[
    { "title": "Some title 1", "description": "Some desc 1", "content": "My content" },
    { "title": "Some title 2", "description": "Some desc 2", "url": "development.html" }
]
```

#### Example using a custom callback function
```javascript
tinymce.init({
  selector: 'textarea',  // change this value according to your HTML
  plugins: 'template',
  toolbar: 'template',
  templates: (callback) => {
    const templates = [
      { 'title': 'Some title 1', 'description': 'Some desc 1', 'content': 'My content' },
      { 'title': 'Some title 2', 'description': 'Some desc 2', 'url': 'development.html' }
    ];
    callback(templates);
  }
});
```

### `template_cdate_classes`

When HTML elements in a template are assigned this class, the content of the element will be replaced with the 'creation' date (`creationdate`), formatted according to the `template_cdate_format` option. This option accepts a list of classes (separated by spaces).

A creation date is one that is set if no previous date existed within the element. Once set, the original date is stored inside the element in an HTML comment and is designed not to change even with a template change.

**Type:** `String`

**Default value:** `'cdate'`

#### Example: using `template_cdate_classes`

```javascript
tinymce.init({
  selector: 'textarea',  // change this value according to your HTML
  plugins: 'template',
  toolbar: 'template',
  template_cdate_classes: 'cdate creationdate'
});
```

### `template_cdate_format`

This option allows you to provide a date format that all 'creation' date templates will use.

**Type:** `String`

**Default value:** `'%Y-%m-%d'`

#### Example: using `template_cdate_format`

```javascript
tinymce.init({
  selector: 'textarea',  // change this value according to your HTML
  plugins: 'template',
  toolbar: 'template',
  template_cdate_format: '%m/%d/%Y : %H:%M',
  templates: [
    { title: 'Cdate', description: 'Cdate example', content: '<p class="cdate">This will be replaced with the creation date</p>' }
  ]
});
```

If the creation date is set as 9:00AM on January 15th 2000, then inserting this template will insert the following into the editor:

```html
<p class="cdate">01/15/2000 : 09:00</p>
```

For a list of available date and time formats, see: [Reference Date/Time formats](#reference-date-time-formats).

### `template_mdate_classes`

When HTML elements in a template are assigned this class, the content of the element will be replaced with the 'modified' date (`modifieddate`), formatted according to the `template_mdate_format` option. This option accepts a list of classes (separated by spaces).

A modified date is one that is updated with each edit.

**Type:** `String`

**Default value:** `'mdate'`

#### Example: using `template_mdate_classes`

```javascript
tinymce.init({
  selector: 'textarea',  // change this value according to your HTML
  plugins: 'template',
  toolbar: 'template',
  template_mdate_classes: 'mdate modifieddate'
});
```

### `template_mdate_format`

This option allows you to provide TinyMCE with a date/time format that all 'modified' date templates will use.

**Type:** `String`

**Default value:** `'%Y-%m-%d'`

#### Example: using `template_mdate_format`

```javascript
tinymce.init({
  selector: 'textarea',  // change this value according to your HTML
  plugins: 'template',
  toolbar: 'template',
  template_mdate_format: '%m/%d/%Y : %H:%M:%S',
  templates: [
    { title: 'Mdate', description: 'Mdate example', content: '<p class="mdate">This will be replaced with the date modified</p>' }
  ]
});
```

If the date modified is set as 9:00AM on January 15th 2000, then inserting this template will insert the following into the editor:

```html
<p class="mdate">01/15/2000 : 09:00</p>
```

For a list of available date and time formats, see: [Reference Date/Time formats](#reference-date-time-formats).

### `template_replace_values`

This is an object containing items that will be replaced with their respective string values when a template is inserted into the editor content.

**Type:** `Object`

#### Example: using `template_replace_values`

```javascript
tinymce.init({
  selector: 'textarea',  // change this value according to your HTML
  plugins: 'template',
  toolbar: 'template',
  template_replace_values: {
    username: 'Jack Black',
    staffid: '991234'
  }
});
```

This can then be used in a template or snippet that looks like this:

```html
<p>Name: {$username}, StaffID: {$staffid}</p>
```

And that will be changed to:

```html
<p>Name: Jack Black, StaffID: 991234</p>
```

### `template_preview_replace_values`

This is an object containing items that will be replaced with their respective string values in the template preview shown in the template dialog; **but will not be replaced when a template is inserted into the editor content**.

**Type:** `Object`

#### Example: using `template_preview_replace_values`

```javascript
tinymce.init({
  selector: 'textarea',  // change this value according to your HTML
  plugins: 'template',
  toolbar: 'template',
  template_preview_replace_values: {
    username: 'Jack Black',
    staffid: '991234'
  }
});
```

This can then be used in a template or snippet that looks like this:

```html
<p>Name: {$username}, StaffID: {$staffid}</p>
```

And the preview will look like:

```html
<p>Name: Jack Black, StaffID: 991234</p>
```

### `template_selected_content_classes`

When HTML elements in a template are assigned this class, the content of the element will be replaced with selected content from the editor. This option accepts a list of classes (separated by spaces).

**Type:** `String`

**Default value:** `'selcontent'`

#### Example: using `template_selected_content_classes`

```javascript
tinymce.init({
  selector: 'textarea',  // change this value according to your HTML
  plugins: 'template',
  toolbar: 'template',
  template_selected_content_classes: 'selcontent selectedcontent',
  templates: [
    {
      title: 'My Template',
      description: 'This is my template.',
      content: '<p>Hello, <span class="selcontent">this statement will be replaced.</span></p>'
    }
  ]
});
```

If the word `world` is selected in the editor and _My Template_ is applied, `world` will be updated to:

```html
<p>Hello, <span class="selcontent">world</span></p>
```

## Template Plugin Examples
### Example: using the `template` plugin
```javascript
tinymce.init({
  selector: 'textarea',  // change this value according to your HTML
  plugins: 'template',
  toolbar: 'template',
  template_cdate_classes: 'cdate creationdate',
  template_mdate_classes: 'mdate modifieddate',
  template_selected_content_classes: 'selcontent',
  template_cdate_format: '%m/%d/%Y : %H:%M:%S',
  template_mdate_format: '%m/%d/%Y : %H:%M:%S',
  template_replace_values: {
    username: 'Jack Black',
    staffid: '991234'
  },
  templates: [
    {
      title: 'Editor Details',
      url: 'editor_details.html',
      description: 'Adds Editor Name and Staff ID'
    },
    {
      title: 'Timestamp',
      url: 'time.html',
      description: 'Adds an editing timestamp.'
    }
  ]
});
```

### Example of an external template list
This is the contents your backend page should return if you specify a URL in the templates option. A simple array containing each template to present. This URL can be a backend page, for example a PHP file.

```json
[
  {"title": "Some title 1", "description": "Some desc 1", "content": "My content"},
  {"title": "Some title 2", "description": "Some desc 2", "url": "development.html"}
]
```

## Making Templates
A template is a file with a `div` containing the template data. All `html` outside the `div` will simply be presented to the user in the preview frame.

A template has more capabilities than a simple snippet, for example, a template can have dynamic content/smart content that gets updated by functions located in the `template_replace_values` key. These functions will continue to be executed each time a cleanup procedure is performed.

Each template needs to be inside a div with the `mceTmpl` class, like this example:

```html
<!-- This will not be inserted -->
<div class="mceTmpl">
  <table width="98%%"  border="0" cellspacing="0" cellpadding="0">
    <tr>
      <th scope="col">&nbsp;</th>
      <th scope="col">&nbsp;</th>
    </tr>
    <tr>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
  </table>
</div>
```

## Making Snippets

Snippets are `html` code chunks that can be inserted. Replace variables will only be executed upon insert, without being wrapped in a template `div` element. So if you define `somevar1` in `template_replace_values` array it will be replaced on insert. If you wish to preview the replacements before inserting, use `template_preview_replace_values`.

```html
This is a simple <strong>snippet</strong>. Will be replaced: {$somevar1}.
```

### Reference Date/Time formats

| Name | Summary                                                         |
|------|-----------------------------------------------------------------|
| %D   | mm/dd/yy (same as %m/%d/%y)                                     |
| %r   | 12-hour clock time hh:mm:ss with AM or PM (same as %I:%M:%S %p) |
| %y   | year as a decimal number without a century (range 00 to 99)     |
| %Y   | year as a decimal number including the century                  |
| %m   | month as a decimal number (range 01 to 12)                      |
| %B   | full localized month name (e.g. "January")                      |
| %b   | abbreviated localized month name (e.g. "Jan")                   |
| %d   | day of the month as a decimal number (range 01 to 31)           |
| %A   | full localized weekday name (e.g. "Monday")                     |
| %a   | abbreviated localized weekday name (e.g. "Mon")                 |
| %H   | hour as a decimal number using a 24-hour clock (range 00 to 23) |
| %I   | hour as a decimal number using a 12-hour clock (range 01 to 12) |
| %M   | minute as a decimal number (range 00-59)                        |
| %S   | second as a decimal number (range 00-59)                        |
| %p   | either "am" or "pm" according to the given time value           |
| %%   | a literal "%" character                                         |

## Toolbar buttons

The Toolbar plugin provides the following toolbar buttons:

| Toolbar button identifier | Description                        |
|---------------------------|------------------------------------|
| `template`                | Inserts templates into the editor. |

These toolbar buttons can be added to the editor using:

* The `toolbar` configuration option.
* The `quickbars_insert_toolbar` configuration option.
* Custom Context toolbars.

## Menu items

The Toolbar plugin provides the following menu items:

| Menu item identifier | Default Menu Location | Description                        |
|----------------------|-----------------------|------------------------------------|
| `template`           | Insert                | Inserts templates into the editor. |

These menu items can be added to the editor using:

* The `menu` configuration option.
* The `contextmenu` configuration option.
* Custom Menu toolbar buttons.

## Commands

The Template plugin provides the following TinyMCE command.

| Command           | Description                                                                     |
|-------------------|---------------------------------------------------------------------------------|
| mceInsertTemplate | Inserts a template the value should be the template HTML to process and insert. |
| mceTemplate       | Opens the Template dialog.                                                      |

_Example_

```javascript
tinymce.activeEditor.execCommand('mceInsertTemplate', false, '<p>This is my template text.</p>');
tinymce.activeEditor.execCommand('mceTemplate');
```
