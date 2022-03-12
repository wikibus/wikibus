(function () {
  const code = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const setContent = function (editor, html) {
      editor.focus()
      editor.undoManager.transact(() => {
        editor.setContent(html)
      })
      editor.selection.setCursorLocation()
      editor.nodeChanged()
    }
    const getContent = function (editor) {
      return editor.getContent({ source_view: true })
    }
    const Content = {
      setContent,
      getContent,
    }

    const open = function (editor) {
      const editorContent = Content.getContent(editor)
      editor.windowManager.open({
        title: 'Source Code',
        size: 'large',
        body: {
          type: 'panel',
          items: [{
            type: 'textarea',
            name: 'code',
            flex: true,
          }],
        },
        buttons: [
          {
            type: 'cancel',
            name: 'cancel',
            text: 'Cancel',
          },
          {
            type: 'submit',
            name: 'save',
            text: 'Save',
            primary: true,
          },
        ],
        initialData: { code: editorContent },
        onSubmit(api) {
          Content.setContent(editor, api.getData().code)
          api.close()
        },
      })
    }
    const Dialog = { open }

    const register = function (editor) {
      editor.addCommand('mceCodeEditor', () => {
        Dialog.open(editor)
      })
    }
    const Commands = { register }

    const register$1 = function (editor) {
      editor.ui.registry.addButton('code', {
        icon: 'sourcecode',
        tooltip: 'Source code',
        onAction() {
          return Dialog.open(editor)
        },
      })
      editor.ui.registry.addMenuItem('code', {
        icon: 'sourcecode',
        text: 'Source code',
        onAction() {
          return Dialog.open(editor)
        },
      })
    }
    const Buttons = { register: register$1 }

    global.add('code', (editor) => {
      Commands.register(editor)
      Buttons.register(editor)
      return {}
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
