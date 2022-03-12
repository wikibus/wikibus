(function () {
  const print = (function () {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager')

    const register = function (editor) {
      editor.addCommand('mcePrint', () => {
        editor.getWin().print()
      })
    }
    const Commands = { register }

    const register$1 = function (editor) {
      editor.ui.registry.addButton('print', {
        icon: 'print',
        tooltip: 'Print',
        onAction() {
          return editor.execCommand('mcePrint')
        },
      })
      editor.ui.registry.addMenuItem('print', {
        text: 'Print...',
        icon: 'print',
        onAction() {
          return editor.execCommand('mcePrint')
        },
      })
    }
    const Buttons = { register: register$1 }

    global.add('print', (editor) => {
      Commands.register(editor)
      Buttons.register(editor)
      editor.addShortcut('Meta+P', '', 'mcePrint')
    })
    function Plugin() {
    }

    return Plugin
  }())
})()
