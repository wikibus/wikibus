(function () {
  const hr = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const register = function (editor) {
      editor.addCommand('InsertHorizontalRule', () => {
        editor.execCommand('mceInsertContent', false, '<hr />')
      })
    }
    const Commands = { register }

    const register$1 = function (editor) {
      editor.ui.registry.addButton('hr', {
        icon: 'horizontal-rule',
        tooltip: 'Horizontal line',
        onAction() {
          return editor.execCommand('InsertHorizontalRule')
        },
      })
      editor.ui.registry.addMenuItem('hr', {
        icon: 'horizontal-rule',
        text: 'Horizontal line',
        onAction() {
          return editor.execCommand('InsertHorizontalRule')
        },
      })
    }
    const Buttons = { register: register$1 }

    global.add('hr', (editor) => {
      Commands.register(editor)
      Buttons.register(editor)
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
